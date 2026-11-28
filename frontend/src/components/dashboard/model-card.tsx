import { Bot } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { ModelDefinition } from "@/constants/models";
import { formatPercent } from "@/lib/format";
import type { ModelPerformance } from "@/types/arbitration";

function Metric({
  label,
  value,
  percent,
  loading,
}: {
  label: string;
  value: string | null;
  percent: number | null;
  loading: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        {loading ? (
          <Skeleton className="h-3.5 w-10" />
        ) : (
          <span className="font-mono font-medium tabular-nums">{value ?? "—"}</span>
        )}
      </div>
      <Progress value={percent ?? 0} className="h-1.5" aria-label={`${label}: ${value ?? "no data"}`} />
    </div>
  );
}

export function ModelCard({
  model,
  performance,
  loading = false,
}: {
  model: ModelDefinition;
  performance: ModelPerformance | null;
  loading?: boolean;
}) {
  return (
    <Card className="gap-4 p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
          <Bot className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{model.name}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">{model.id}</p>
        </div>
        <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
          {model.parameterSize} params
        </span>
      </div>
      <div className="space-y-3">
        <Metric
          label="Average score"
          value={performance ? `${performance.average_score.toFixed(1)}/100` : null}
          percent={performance?.average_score ?? null}
          loading={loading}
        />
        <Metric
          label="Win rate"
          value={performance ? formatPercent(performance.win_rate, 1) : null}
          percent={performance?.win_rate ?? null}
          loading={loading}
        />
        <Metric
          label="Schema success rate"
          value={performance ? formatPercent(performance.schema_success_rate, 1) : null}
          percent={performance?.schema_success_rate ?? null}
          loading={loading}
        />
      </div>
      {!loading && !performance && (
        <p className="text-xs text-muted-foreground">No historical data available for this model yet.</p>
      )}
      {performance && (
        <p className="text-xs text-muted-foreground">
          Based on {performance.attempts} logged attempt{performance.attempts === 1 ? "" : "s"}
        </p>
      )}
    </Card>
  );
}
