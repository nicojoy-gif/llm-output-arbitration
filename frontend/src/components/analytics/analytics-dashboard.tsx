"use client";

import { Activity, AlertTriangle, FileCheck2, Gauge, Target, Trophy } from "lucide-react";

import { ModelComparisonTable } from "@/components/analytics/model-comparison-table";
import {
  ChartLegend,
  GroupedPerformanceChart,
  MetricComparisonChart,
} from "@/components/analytics/performance-chart";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getModelDefinition } from "@/constants/models";
import { useStatistics } from "@/hooks/use-arbitration-queries";
import { formatPercent } from "@/lib/format";
import type { ModelPerformance } from "@/types/arbitration";

function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <div className="px-5 pb-5 pt-4">{children}</div>
    </Card>
  );
}

function ModelSummary({ model }: { model: ModelPerformance }) {
  const definition = getModelDefinition(model.model_name);
  return (
    <section aria-label={`${definition.name} summary`} className="space-y-3">
      <div className="flex items-baseline gap-2">
        <h2 className="text-sm font-semibold">{definition.name}</h2>
        <span className="font-mono text-xs text-muted-foreground">{model.model_name}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total attempts" value={model.attempts} icon={Activity} />
        <StatCard label="Total wins" value={model.wins} icon={Trophy} tone="success" />
        <StatCard label="Win rate" value={formatPercent(model.win_rate, 1)} icon={Gauge} tone="primary" />
        <StatCard label="Average score" value={model.average_score.toFixed(1)} icon={Target} />
        <StatCard label="Schema success" value={formatPercent(model.schema_success_rate, 1)} icon={FileCheck2} />
      </div>
    </section>
  );
}

export function AnalyticsDashboard() {
  const statistics = useStatistics();

  if (statistics.isPending) return <LoadingState label="Loading model statistics…" rows={6} />;

  if (statistics.isError) {
    return (
      <ErrorState
        error={statistics.error}
        onRetry={() => void statistics.refetch()}
        title="Model analytics unavailable"
      />
    );
  }

  const data = statistics.data.models;

  if (data.length === 0) {
    return (
      <EmptyState
        title="No historical data yet"
        description="Run evaluations to start building model performance history."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div
        role="note"
        className="flex gap-3 rounded-lg border border-warning/30 bg-warning-soft p-4 text-sm"
      >
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
        <div className="space-y-1">
          <p className="font-medium">Read these numbers with care</p>
          <p className="text-muted-foreground">
            Win rate is influenced by tie-breaking: when eligible candidates score equally, the first
            one in evaluation order wins. It is not an independent measure of model accuracy.
            Historical runs may also include different prompts or generation settings, so this is an
            observational log, not a controlled benchmark.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {data.map((model) => (
          <ModelSummary key={model.model_name} model={model} />
        ))}
      </div>

      <ChartCard title="Average scores by metric" description="Grouped comparison on a 0–100 scale">
        <div className="space-y-3">
          <ChartLegend data={data} />
          <GroupedPerformanceChart data={data} height={300} />
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Win rate" description="Share of runs in which the model was selected">
          <MetricComparisonChart data={data} metric="win_rate" />
        </ChartCard>
        <ChartCard title="Schema success rate" description="Share of responses that passed JSON schema validation">
          <MetricComparisonChart data={data} metric="schema_success_rate" />
        </ChartCard>
      </div>

      <ChartCard title="Detailed comparison">
        <div className="-mx-5 -mb-5 border-t">
          <ModelComparisonTable data={data} />
        </div>
      </ChartCard>
    </div>
  );
}
