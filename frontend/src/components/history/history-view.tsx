"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PlayCircle, RotateCw } from "lucide-react";

import { EvaluationDetailsDrawer } from "@/components/history/evaluation-details-drawer";
import { HistoryFilters } from "@/components/history/history-filters";
import { HistoryTable } from "@/components/history/history-table";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHistory } from "@/hooks/use-arbitration-queries";
import { DEFAULT_FILTERS, filterHistory } from "@/lib/history-filters";
import type { ArbitrationRecord } from "@/types/arbitration";

export function HistoryView() {
  const history = useHistory();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<ArbitrationRecord | null>(null);

  const records = useMemo(() => history.data ?? [], [history.data]);
  const questions = useMemo(() => Array.from(new Set(records.map((r) => r.question))).sort(), [records]);
  const filtered = useMemo(() => filterHistory(records, filters), [records, filters]);

  if (history.isPending) return <LoadingState label="Loading evaluation history…" rows={6} />;

  if (history.isError) {
    return (
      <ErrorState
        error={history.error}
        onRetry={() => void history.refetch()}
        title="Evaluation history unavailable"
      />
    );
  }

  if (records.length === 0) {
    return (
      <EmptyState
        title="No arbitration runs logged"
        description="Run an evaluation to create the first record."
        action={
          <Button asChild size="sm">
            <Link href="/evaluate">
              <PlayCircle /> Run evaluation
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <HistoryFilters filters={filters} onChange={setFilters} questions={questions} />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span aria-live="polite">
          Showing {filtered.length} of {records.length} runs
        </span>
        <Button variant="ghost" size="sm" onClick={() => void history.refetch()} disabled={history.isFetching}>
          <RotateCw className={history.isFetching ? "animate-spin" : undefined} /> Refresh
        </Button>
      </div>
      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState className="m-4" title="No matching runs" description="Adjust or reset the filters." />
        ) : (
          <HistoryTable records={filtered} onSelect={setSelected} />
        )}
      </Card>
      <EvaluationDetailsDrawer record={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
