"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getModelDefinition } from "@/constants/models";
import type { ModelPerformance } from "@/types/arbitration";

export type PerformanceMetric = "average_score" | "win_rate" | "schema_success_rate";

const METRIC_LABELS: Record<PerformanceMetric, string> = {
  average_score: "Average score",
  win_rate: "Win rate",
  schema_success_rate: "Schema success",
};

const SERIES_COLORS = ["var(--chart-1)", "var(--chart-2)"];

interface TooltipEntry {
  name?: string | number;
  value?: number | string;
  color?: string;
}

function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: readonly TooltipEntry[];
  label?: string | number;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((entry) => (
        <p key={String(entry.name)} className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-sm" style={{ background: entry.color }} />
          {entry.name}:{" "}
          <span className="font-mono text-foreground">
            {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
            {unit}
          </span>
        </p>
      ))}
    </div>
  );
}

function axisTick() {
  return { fontSize: 11, fill: "var(--muted-foreground)" };
}

export function GroupedPerformanceChart({
  data,
  metrics = ["average_score", "win_rate", "schema_success_rate"],
  height = 280,
}: {
  data: ModelPerformance[];
  metrics?: PerformanceMetric[];
  height?: number;
}) {
  const rows = metrics.map((metric) => {
    const row: Record<string, string | number> = { metric: METRIC_LABELS[metric] };
    for (const model of data) {
      row[getModelDefinition(model.model_name).name] = model[metric];
    }
    return row;
  });

  return (
    <div style={{ height }} className="w-full" role="img" aria-label="Grouped bar chart comparing model metrics">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 20, right: 8, left: -16, bottom: 0 }} barGap={6}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="metric" tickLine={false} axisLine={false} tick={axisTick()} />
          <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={axisTick()} />
          <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.5 }} content={<ChartTooltip unit="" />} />
          {data.map((model, index) => {
            const name = getModelDefinition(model.model_name).name;
            return (
              <Bar key={model.model_name} dataKey={name} name={name} fill={SERIES_COLORS[index % SERIES_COLORS.length]} radius={[4, 4, 0, 0]} maxBarSize={44}>
                <LabelList dataKey={name} position="top" fontSize={10} fill="var(--muted-foreground)" formatter={(v: unknown) => (typeof v === "number" ? v.toFixed(0) : "")} />
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MetricComparisonChart({
  data,
  metric,
  unit = "%",
  height = 200,
}: {
  data: ModelPerformance[];
  metric: PerformanceMetric;
  unit?: string;
  height?: number;
}) {
  const rows = data.map((model, index) => ({
    name: getModelDefinition(model.model_name).name,
    value: model[metric],
    fill: SERIES_COLORS[index % SERIES_COLORS.length],
  }));

  return (
    <div style={{ height }} className="w-full" role="img" aria-label={`${METRIC_LABELS[metric]} by model`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
          <CartesianGrid horizontal={false} stroke="var(--border)" />
          <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={axisTick()} />
          <YAxis type="category" dataKey="name" width={110} tickLine={false} axisLine={false} tick={axisTick()} />
          <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.5 }} content={<ChartTooltip unit={unit} />} />
          <Bar dataKey="value" name={METRIC_LABELS[metric]} radius={[0, 4, 4, 0]} maxBarSize={28}>
            <LabelList dataKey="value" position="right" fontSize={11} fill="var(--foreground)" formatter={(v: unknown) => (typeof v === "number" ? `${v.toFixed(1)}${unit}` : "")} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartLegend({ data }: { data: ModelPerformance[] }) {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {data.map((model, index) => (
        <span key={model.model_name} className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: SERIES_COLORS[index % SERIES_COLORS.length] }} />
          {getModelDefinition(model.model_name).name}
        </span>
      ))}
    </div>
  );
}
