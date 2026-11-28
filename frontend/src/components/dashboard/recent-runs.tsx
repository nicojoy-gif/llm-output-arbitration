"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ArbitrationStatusBadge, TieBadge } from "@/components/evaluation/arbitration-status";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getModelDefinition } from "@/constants/models";
import { useHistory } from "@/hooks/use-arbitration-queries";
import { getArbitrationDecision } from "@/lib/arbitration";
import { formatScore, formatTimestamp } from "@/lib/format";

export function RecentRuns({ limit = 5 }: { limit?: number }) {
  const history = useHistory();

  return (
    <Card>
      <CardHeader className="flex-row items-start">
        <div className="space-y-1">
          <CardTitle>Recent arbitration runs</CardTitle>
          <CardDescription>Latest decisions logged by the backend</CardDescription>
        </div>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/history">
              View all <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <div className="px-5 pb-5 pt-4">
        {history.isPending ? (
          <LoadingState label="Loading history…" rows={3} />
        ) : history.isError ? (
          <ErrorState
            error={history.error}
            onRetry={() => void history.refetch()}
          />
        ) : history.data.length === 0 ? (
          <EmptyState title="No runs yet" description="Run an evaluation to create the first arbitration record." />
        ) : (
          <ul className="divide-y rounded-md border">
            {history.data.slice(0, limit).map((record, index) => {
              const decision = getArbitrationDecision(record);
              return (
                <li key={`${record.timestamp}-${index}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2.5 text-sm">
                  <span className="min-w-0 flex-1 truncate font-medium">{record.question}</span>
                  <span className="text-xs text-muted-foreground">
                    {decision.winner
                      ? `${getModelDefinition(decision.winner.model_name).name} · ${formatScore(decision.winner.score)}`
                      : "No winner"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ArbitrationStatusBadge status={record.status} />
                    {decision.tie && <TieBadge />}
                  </span>
                  <span className="w-full text-xs text-muted-foreground sm:w-auto">{formatTimestamp(record.timestamp)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
