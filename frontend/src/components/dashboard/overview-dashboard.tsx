"use client";

import Link from "next/link";
import { Activity, CheckCircle2, Percent, PlayCircle, XCircle } from "lucide-react";

import { ChartLegend, GroupedPerformanceChart } from "@/components/analytics/performance-chart";
import { ModelCard } from "@/components/dashboard/model-card";
import { RecentRuns } from "@/components/dashboard/recent-runs";
import { PageHeader, SectionHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MODELS } from "@/constants/models";
import { useStatistics } from "@/hooks/use-arbitration-queries";
import { formatPercent } from "@/lib/format";

export function OverviewDashboard() {
  const statistics = useStatistics();
  const stats = statistics.data;
  const loading = statistics.isPending;
  const hint = statistics.isError ? "Statistics unavailable" : undefined;

  return (
    <>
      <PageHeader
        title="Overview"
        description="Arbitration activity and model performance across logged evaluation runs."
        actions={
          <Button asChild>
            <Link href="/evaluate">
              <PlayCircle /> Start evaluation
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total arbitration runs" value={stats?.total_runs ?? null} icon={Activity} tone="primary" loading={loading} hint={hint} />
        <StatCard label="Successful arbitrations" value={stats?.successful_runs ?? null} icon={CheckCircle2} tone="success" loading={loading} hint={hint} />
        <StatCard label="Failed arbitrations" value={stats?.failed_runs ?? null} icon={XCircle} tone="danger" loading={loading} hint={hint} />
        <StatCard
          label="Overall success rate"
          value={stats && stats.total_runs > 0 ? formatPercent(stats.success_rate, 1) : null}
          icon={Percent}
          loading={loading}
          hint={hint}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Model performance comparison</CardTitle>
            <CardDescription>Historical averages; win rate is affected by tie-breaking</CardDescription>
          </CardHeader>
          <div className="space-y-3 px-5 pb-5 pt-4">
            {statistics.isPending ? (
              <LoadingState label="Loading statistics…" rows={4} />
            ) : statistics.isError ? (
              <ErrorState error={statistics.error} onRetry={() => void statistics.refetch()} />
            ) : statistics.data.models.length === 0 ? (
              <EmptyState title="No statistics yet" description="Run evaluations to build model performance history." />
            ) : (
              <>
                <ChartLegend data={statistics.data.models} />
                <GroupedPerformanceChart data={statistics.data.models} height={260} />
              </>
            )}
          </div>
        </Card>

        <section className="lg:col-span-2" aria-label="Active models">
          <SectionHeader title="Active models" description="Participating in every arbitration run" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {MODELS.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                loading={loading}
                performance={stats?.models.find((entry) => entry.model_name === model.id) ?? null}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6">
        <RecentRuns />
      </div>
    </>
  );
}
