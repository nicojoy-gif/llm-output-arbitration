export const SCORING_WEIGHTS = {
  schema: { label: "Schema validity", points: 20 },
  factual: { label: "Factual correctness", points: 50 },
  evidence: { label: "Citation evidence", points: 20 },
  agreement: { label: "Model agreement", points: 10 },
} as const;

export const MAX_SCORE = 100;
