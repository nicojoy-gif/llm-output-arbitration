import type { Metadata } from "next";

import { HistoryView } from "@/components/history/history-view";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Evaluation History" };

export default function HistoryPage() {
  return (
    <>
      <PageHeader
        title="Evaluation History"
        description="Every arbitration decision logged by the backend. Select a run to inspect the full candidate comparison."
      />
      <HistoryView />
    </>
  );
}
