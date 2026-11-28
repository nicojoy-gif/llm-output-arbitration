export function formatPercent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

export function formatRatioAsPercent(ratio: number) {
  return formatPercent(ratio * 100);
}

export function formatScore(score: number) {
  return Number.isInteger(score) ? score.toString() : score.toFixed(1);
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatTimestamp(timestamp: string) {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? timestamp : dateFormatter.format(date);
}

export type ParsedRawResponse =
  | { kind: "empty" }
  | { kind: "json"; value: unknown; formatted: string }
  | { kind: "invalid"; raw: string; error: string };

export function parseRawResponse(raw: string | null): ParsedRawResponse {
  if (raw === null || raw.trim() === "") return { kind: "empty" };
  try {
    const value: unknown = JSON.parse(raw);
    return { kind: "json", value, formatted: JSON.stringify(value, null, 2) };
  } catch (error) {
    return {
      kind: "invalid",
      raw,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}
