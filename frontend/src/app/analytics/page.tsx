import type { Metadata } from "next";

import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Model Analytics" };

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Model Analytics"
        description="Historical performance of Llama 3.2 and Qwen 2.5 Coder across logged arbitration runs."
      />
      <AnalyticsDashboard />
    </>
  );
}
