import type {
  ArbitrationRecord,
  ArbitrationStatistics,
  ArbitrationResponse,
  Candidate,
  ModelPerformance,
  Question,
} from "@/types/arbitration";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function toNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function normalizeCandidate(value: unknown): Candidate | null {
  if (!isRecord(value) || typeof value.model_name !== "string") return null;

  return {
    model_name: value.model_name,
    answer: toStringOrNull(value.answer),
    temperature: toNumber(value.temperature),
    schema_valid: value.schema_valid === true,
    validated_answer: toStringOrNull(value.validated_answer),
    factual_correct: value.factual_correct === true,
    citation: toStringOrNull(value.citation),
    evidence_valid: value.evidence_valid === true,
    agreement_ratio: Math.min(1, Math.max(0, toNumber(value.agreement_ratio))),
    score: toNumber(value.score),
  };
}

export function normalizeArbitrationResponse(value: unknown): ArbitrationResponse {
  if (!isRecord(value) || !Array.isArray(value.candidates)) {
    throw new Error("The backend response does not match the expected arbitration format.");
  }

  const candidates = value.candidates
    .map(normalizeCandidate)
    .filter((candidate): candidate is Candidate => candidate !== null);

  const winner = value.winner === null ? null : normalizeCandidate(value.winner);

  return {
    question: typeof value.question === "string" ? value.question : "Unknown question",
    candidates,
    winner,
    status: winner !== null && value.status !== "failed" ? "success" : "failed",
  };
}

export function normalizeHistory(value: unknown): ArbitrationRecord[] {
  if (!Array.isArray(value)) {
    throw new Error("The /history response is not a list of arbitration records.");
  }

  return value.flatMap((entry): ArbitrationRecord[] => {
    if (!isRecord(entry)) return [];
    try {
      const base = normalizeArbitrationResponse(entry);
      return [
        {
          ...base,
          timestamp: typeof entry.timestamp === "string" ? entry.timestamp : "",
          tie: typeof entry.tie === "boolean" ? entry.tie : undefined,
          selection_reason:
            typeof entry.selection_reason === "string" ? entry.selection_reason : undefined,
        },
      ];
    } catch {
      return [];
    }
  });
}

function normalizeModelMetrics(modelName: string, value: unknown): ModelPerformance | null {
  if (!isRecord(value)) return null;
  return {
    model_name: modelName,
    attempts: toNumber(value.attempts),
    wins: toNumber(value.wins),
    total_score: toNumber(value.total_score),
    valid_responses: toNumber(value.valid_responses),
    win_rate: toNumber(value.win_rate),
    average_score: toNumber(value.average_score),
    schema_success_rate: toNumber(value.schema_success_rate),
  };
}

export function normalizeStatistics(value: unknown): ArbitrationStatistics {
  if (!isRecord(value) || !isRecord(value.models)) {
    throw new Error("The /statistics response does not match the expected format.");
  }

  return {
    total_runs: toNumber(value.total_runs),
    successful_runs: toNumber(value.successful_runs),
    failed_runs: toNumber(value.failed_runs),
    success_rate: toNumber(value.success_rate),
    models: Object.entries(value.models)
      .map(([model, metrics]) => normalizeModelMetrics(model, metrics))
      .filter((entry): entry is ModelPerformance => entry !== null),
  };
}

export function normalizeQuestions(value: unknown): Question[] {
  if (!Array.isArray(value)) throw new Error("The /questions response is not a list.");

  return value.flatMap((entry): Question[] =>
    isRecord(entry) && typeof entry.id === "number" && typeof entry.question === "string"
      ? [{ id: entry.id, question: entry.question }]
      : [],
  );
}
