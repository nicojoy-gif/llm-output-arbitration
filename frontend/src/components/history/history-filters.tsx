"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MODELS } from "@/constants/models";
import { ALL, DEFAULT_FILTERS, hasActiveFilters, type HistoryFilters as Filters } from "@/lib/history-filters";

export function HistoryFilters({
  filters,
  onChange,
  questions,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  questions: string[];
}) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="search"
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
          placeholder="Search question, model or answer…"
          aria-label="Search history"
          className="pl-9"
        />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex">
        <Select value={filters.model} onValueChange={(model) => update({ model })}>
          <SelectTrigger aria-label="Filter by winning model" className="lg:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All winning models</SelectItem>
            {MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={(status) => update({ status })}>
          <SelectTrigger aria-label="Filter by status" className="lg:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.question} onValueChange={(question) => update({ question })}>
          <SelectTrigger aria-label="Filter by question" className="lg:w-60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All questions</SelectItem>
            {questions.map((question) => (
              <SelectItem key={question} value={question}>
                {question}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasActiveFilters(filters) && (
        <Button variant="ghost" size="sm" onClick={() => onChange(DEFAULT_FILTERS)}>
          <X /> Reset
        </Button>
      )}
    </div>
  );
}
