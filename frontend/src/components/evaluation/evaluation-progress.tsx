"use client";

import { Loader2 } from "lucide-react";

import { ParticipatingModels } from "@/components/evaluation/participating-models";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useElapsedSeconds } from "@/hooks/use-elapsed-time";

export function EvaluationProgress({
  question,
  startedAt,
}: {
  question: string;
  startedAt: number | null;
}) {
  const elapsed = useElapsedSeconds(startedAt);

  return (
    <div className="space-y-6" aria-busy="true">
      <Card className="border-primary/30">
        <div className="space-y-4 p-5" role="status" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Loader2 className="mt-0.5 size-5 shrink-0 animate-spin text-primary" aria-hidden />
              <div className="space-y-1">
                <p className="text-sm font-semibold">Arbitration in progress</p>
                <p className="text-sm text-muted-foreground">
                  The backend is running local inference with Ollama, then validating, verifying and
                  scoring each response. Small models on local hardware can take a while, especially
                  on a cold start.
                </p>
              </div>
            </div>
            <span className="rounded-md border bg-muted/50 px-2 py-1 font-mono text-xs tabular-nums text-muted-foreground">
              {elapsed}s elapsed
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Question: <span className="text-foreground">{question}</span>
          </p>
          <ParticipatingModels running />
          <p className="text-xs text-muted-foreground">
            The backend returns a single response when arbitration finishes, so individual stages are
            not reported live.
          </p>
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2" aria-hidden>
        {[0, 1].map((key) => (
          <Card key={key} className="space-y-4 p-5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}
