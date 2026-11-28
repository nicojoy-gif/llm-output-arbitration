import type { ArbitrationRecord } from "@/types/arbitration";

export const ALL = "all";

export interface HistoryFilters {
  search: string;
  model: string;
  status: string;
  question: string;
}

export const DEFAULT_FILTERS: HistoryFilters = {
  search: "",
  model: ALL,
  status: ALL,
  question: ALL,
};

export function filterHistory(records: ArbitrationRecord[], filters: HistoryFilters) {
  const search = filters.search.trim().toLowerCase();

  return records.filter((record) => {
    const winner = record.winner?.model_name ?? null;

    if (filters.status !== ALL && record.status !== filters.status) return false;
    if (filters.question !== ALL && record.question !== filters.question) return false;
    if (filters.model !== ALL && winner !== filters.model) return false;

    if (search) {
      const haystack = [record.question, winner ?? "", record.winner?.validated_answer ?? ""]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

export function hasActiveFilters(filters: HistoryFilters) {
  return (
    filters.search.trim() !== "" ||
    filters.model !== ALL ||
    filters.status !== ALL ||
    filters.question !== ALL
  );
}
