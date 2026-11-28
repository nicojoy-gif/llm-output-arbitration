import { SCORING_WEIGHTS } from "@/constants/scoring";
import type {
  ArbitrationDecision,
  ArbitrationRecord,
  ArbitrationResponse,
  Candidate,
  ScoreCriterion,
} from "@/types/arbitration";

export function isEligible(candidate: Candidate) {
  return candidate.schema_valid && candidate.factual_correct;
}

export function getScoreBreakdown(candidate: Candidate): ScoreCriterion[] {
  return [
    {
      key: "schema",
      label: SCORING_WEIGHTS.schema.label,
      earned: candidate.schema_valid ? SCORING_WEIGHTS.schema.points : 0,
      max: SCORING_WEIGHTS.schema.points,
    },
    {
      key: "factual",
      label: SCORING_WEIGHTS.factual.label,
      earned: candidate.factual_correct ? SCORING_WEIGHTS.factual.points : 0,
      max: SCORING_WEIGHTS.factual.points,
    },
    {
      key: "evidence",
      label: SCORING_WEIGHTS.evidence.label,
      earned: candidate.evidence_valid ? SCORING_WEIGHTS.evidence.points : 0,
      max: SCORING_WEIGHTS.evidence.points,
    },
    {
      key: "agreement",
      label: SCORING_WEIGHTS.agreement.label,
      earned: Math.round(candidate.agreement_ratio * SCORING_WEIGHTS.agreement.points * 100) / 100,
      max: SCORING_WEIGHTS.agreement.points,
    },
  ];
}

export function isSameCandidate(a: Candidate | null, b: Candidate | null) {
  return a !== null && b !== null && a.model_name === b.model_name;
}

export function getArbitrationDecision(
  result: ArbitrationResponse & Partial<Pick<ArbitrationRecord, "tie" | "selection_reason">>,
): ArbitrationDecision {
  const eligible = result.candidates.filter(isEligible);
  const winner = result.winner;

  if (!winner) {
    return {
      winner: null,
      eligible,
      tie: false,
      tiedCandidates: [],
      reason: result.selection_reason ?? "No candidate passed the mandatory checks.",
    };
  }

  const tiedCandidates = eligible.filter((candidate) => candidate.score === winner.score);
  const tie = result.tie ?? tiedCandidates.length > 1;

  return {
    winner,
    eligible,
    tie,
    tiedCandidates,
    reason:
      result.selection_reason ??
      (tie
        ? "Equal highest scores. First eligible tied candidate selected."
        : "Highest score among eligible candidates."),
  };
}
