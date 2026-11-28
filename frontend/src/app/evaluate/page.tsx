import type { Metadata } from "next";

import { EvaluationWorkspace } from "@/components/evaluation/evaluation-workspace";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Run Evaluation" };

export default function EvaluatePage() {
  return (
    <>
      <PageHeader
        title="Run Evaluation"
        description="Send a benchmark question to both local models, verify each response and let the arbitration engine select the strongest eligible answer."
      />
      <EvaluationWorkspace />
    </>
  );
}
