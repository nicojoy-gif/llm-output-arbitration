import { AlertOctagon, Info, Trophy } from "lucide-react";

import { ArbitrationStatusBadge, TieBadge } from "@/components/evaluation/arbitration-status";
import { Card } from "@/components/ui/card";
import { getModelDefinition } from "@/constants/models";
import { MAX_SCORE } from "@/constants/scoring";
import { formatScore } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ArbitrationDecision, ArbitrationStatus } from "@/types/arbitration";

function Detail({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0 space-y-1", className)}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

export function WinnerCard({
  question,
  status,
  decision,
}: {
  question: string;
  status: ArbitrationStatus;
  decision: ArbitrationDecision;
}) {
  const { winner, tie, tiedCandidates, reason } = decision;

  if (!winner) {
    return (
      <Card className="border-danger/40">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
            <AlertOctagon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold">No acceptable answer found.</h2>
              <ArbitrationStatusBadge status={status} />
            </div>
            <p className="text-sm text-muted-foreground">
              The system rejected every available response because none met the mandatory
              eligibility requirements: a candidate must pass schema validation and match the
              trusted reference answer. No answer is returned rather than an unverified one.
            </p>
            <p className="text-xs text-muted-foreground">
              Question: <span className="text-foreground">{question}</span>
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const model = getModelDefinition(winner.model_name);

  return (
    <Card className="border-success/50">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-success-soft text-success">
            <Trophy className="size-4" aria-hidden />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Arbitration result</h2>
            <p className="text-xs text-muted-foreground">{question}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <ArbitrationStatusBadge status={status} />
          {tie && <TieBadge />}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-5 px-5 py-5 md:grid-cols-4">
        <Detail label="Selected answer" className="col-span-2 md:col-span-1">
          <span className="text-lg font-semibold">{winner.validated_answer ?? "—"}</span>
        </Detail>
        <Detail label="Winning model">
          <span className="block">{model.name}</span>
          <span className="block truncate font-mono text-xs font-normal text-muted-foreground">
            {winner.model_name}
          </span>
        </Detail>
        <Detail label="Citation">
          <span className={cn("font-mono", winner.citation === null && "italic text-muted-foreground")}>
            {winner.citation ?? "None"}
          </span>
        </Detail>
        <Detail label="Final score">
          <span className="text-lg font-semibold tabular-nums">
            {formatScore(winner.score)}
            <span className="text-sm font-normal text-muted-foreground">/{MAX_SCORE}</span>
          </span>
        </Detail>
      </dl>

      <div
        className={cn(
          "mx-5 mb-5 flex gap-2.5 rounded-md border p-3 text-sm",
          tie ? "border-warning/30 bg-warning-soft" : "bg-muted/40",
        )}
      >
        <Info className={cn("mt-0.5 size-4 shrink-0", tie ? "text-warning" : "text-muted-foreground")} aria-hidden />
        <div className="space-y-1">
          <p className="font-medium">{reason}</p>
          {tie ? (
            <p className="text-muted-foreground">
              {tiedCandidates.length > 1
                ? `${tiedCandidates.length} eligible candidates scored ${formatScore(winner.score)}. `
                : ""}
              The engine selects the first eligible tied candidate in evaluation order. This is a
              deterministic tie-break, not evidence that {model.name} is more accurate.
            </p>
          ) : (
            <p className="text-muted-foreground">
              {model.name} passed the mandatory checks and achieved the highest weighted score among
              eligible candidates for this run.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
