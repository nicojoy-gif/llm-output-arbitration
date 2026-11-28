import { Equal, Thermometer, Trophy } from "lucide-react";

import { ScoreBreakdown } from "@/components/evaluation/score-breakdown";
import { JsonViewer } from "@/components/shared/json-viewer";
import { ValidationIndicator } from "@/components/shared/validation-indicator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getModelDefinition } from "@/constants/models";
import { MAX_SCORE } from "@/constants/scoring";
import { isEligible } from "@/lib/arbitration";
import { formatRatioAsPercent, formatScore } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/arbitration";

function Field({ label, value, mono = false }: { label: string; value: string | null; mono?: boolean }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "truncate text-sm font-medium",
          mono && "font-mono",
          value === null && "font-normal italic text-muted-foreground",
        )}
        title={value ?? undefined}
      >
        {value ?? "None"}
      </dd>
    </div>
  );
}

export function CandidateCard({
  candidate,
  isWinner,
  isTied,
}: {
  candidate: Candidate;
  isWinner: boolean;
  isTied: boolean;
}) {
  const model = getModelDefinition(candidate.model_name);
  const eligible = isEligible(candidate);

  return (
    <Card
      className={cn(
        "overflow-hidden",
        isWinner && "border-success/60 ring-1 ring-success/30",
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{model.name}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">{candidate.model_name}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {isWinner && (
            <Badge variant="success">
              <Trophy aria-hidden /> Winner
            </Badge>
          )}
          {isTied && (
            <Badge variant="warning">
              <Equal aria-hidden /> Tied
            </Badge>
          )}
          {!eligible && <Badge variant="danger">Ineligible</Badge>}
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total score</p>
            <p className="text-3xl font-semibold tabular-nums tracking-tight">
              {formatScore(candidate.score)}
              <span className="text-base font-normal text-muted-foreground">/{MAX_SCORE}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Agreement</p>
            <p className="text-lg font-semibold tabular-nums">
              {formatRatioAsPercent(candidate.agreement_ratio)}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 rounded-md border bg-muted/30 p-3 sm:grid-cols-3">
          <Field label="Extracted answer" value={candidate.validated_answer} />
          <Field label="Citation" value={candidate.citation} mono />
          <div className="space-y-1">
            <dt className="text-xs text-muted-foreground">Temperature</dt>
            <dd className="flex items-center gap-1 font-mono text-sm font-medium">
              <Thermometer className="size-3.5 text-muted-foreground" aria-hidden />
              {candidate.temperature}
            </dd>
          </div>
        </dl>

        <div className="space-y-2">
          <ValidationIndicator label="Schema validation" passed={candidate.schema_valid} passedText="Valid" failedText="Invalid" />
          <ValidationIndicator label="Factual correctness" passed={candidate.factual_correct} passedText="Correct" failedText="Incorrect" />
          <ValidationIndicator label="Evidence verification" passed={candidate.evidence_valid} passedText="Supported" failedText="Unsupported" />
        </div>

        <div className="space-y-3 border-t pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Score breakdown
          </p>
          <ScoreBreakdown candidate={candidate} />
        </div>

        <JsonViewer raw={candidate.answer} />
      </div>
    </Card>
  );
}
