export type ArbitrationStatus = "success" | "failed";

export interface Candidate {
  model_name: string;
  answer: string | null;
  temperature: number;
  schema_valid: boolean;
  validated_answer: string | null;
  factual_correct: boolean;
  citation: string | null;
  evidence_valid: boolean;
  agreement_ratio: number;
  score: number;
}

export interface ArbitrationRequest {
  question_id: number;
}

export interface ArbitrationResponse {
  question: string;
  candidates: Candidate[];
  winner: Candidate | null;
  status: ArbitrationStatus;
}

export interface HealthResponse {
  message: string;
  status: string;
}

export interface Question {
  id: number;
  question: string;
}

export interface ModelMetrics {
  attempts: number;
  wins: number;
  total_score: number;
  valid_responses: number;
  win_rate: number;
  average_score: number;
  schema_success_rate: number;
}

export interface StatisticsResponse {
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  success_rate: number;
  models: Record<string, ModelMetrics>;
}

export interface ArbitrationRecord extends ArbitrationResponse {
  timestamp: string;
  tie?: boolean;
  selection_reason?: string;
}

export type HistoryResponse = ArbitrationRecord[];

export interface ModelPerformance extends ModelMetrics {
  model_name: string;
}

export interface ArbitrationStatistics extends Omit<StatisticsResponse, "models"> {
  models: ModelPerformance[];
}

export interface ScoreCriterion {
  key: "schema" | "factual" | "evidence" | "agreement";
  label: string;
  earned: number;
  max: number;
}

export interface ArbitrationDecision {
  winner: Candidate | null;
  eligible: Candidate[];
  tie: boolean;
  tiedCandidates: Candidate[];
  reason: string;
}
