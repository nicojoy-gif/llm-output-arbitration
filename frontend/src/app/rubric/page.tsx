import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, Equal, Gavel, ShieldCheck, XCircle } from "lucide-react";

import { PipelineDiagram } from "@/components/rubric/pipeline-diagram";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SCORING_WEIGHTS } from "@/constants/scoring";

export const metadata: Metadata = { title: "Evaluation Rubric" };

const CRITERIA_DETAILS: Record<keyof typeof SCORING_WEIGHTS, string> = {
  schema: "Response parses as JSON matching {answer: string, citation: string | null}.",
  factual: "Normalised answer exactly matches the trusted reference answer.",
  evidence: "Citation is a known source ID and that source text contains the answer.",
  agreement: "Proportion of schema-valid answers that match this one (requires ≥ 2 valid answers).",
};

const ELIGIBILITY_RULES = [
  { icon: ShieldCheck, text: "A candidate must pass schema validation." },
  { icon: ShieldCheck, text: "A candidate must match the trusted reference answer." },
  { icon: Gavel, text: "The highest-scoring eligible candidate wins." },
  { icon: Equal, text: "Equal scores select the first eligible tied candidate." },
  { icon: XCircle, text: "If no candidate is eligible, the system returns no winner." },
];

const LIMITATIONS = [
  {
    title: "Reference answers are required",
    text: "Factual verification only works for questions with a predefined trusted answer.",
  },
  {
    title: "Citation checks are basic",
    text: "Evidence verification uses case-insensitive substring matching, not semantic entailment.",
  },
  {
    title: "Agreement is not correctness",
    text: "Two models can agree on the same wrong answer; agreement only contributes 10 points.",
  },
  {
    title: "Structure is not truth",
    text: "Valid JSON proves the format was followed, not that the content is correct.",
  },
];

export default function RubricPage() {
  const criteria = Object.entries(SCORING_WEIGHTS) as [keyof typeof SCORING_WEIGHTS, (typeof SCORING_WEIGHTS)[keyof typeof SCORING_WEIGHTS]][];

  return (
    <>
      <PageHeader
        title="Evaluation Rubric"
        description="How the arbitration engine validates, verifies, scores and selects an answer from multiple local model responses."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Arbitration pipeline</CardTitle>
            <CardDescription>Every candidate passes through the same stages before a decision is made</CardDescription>
          </CardHeader>
          <div className="px-5 pb-5 pt-4">
            <PipelineDiagram />
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Scoring weights</CardTitle>
              <CardDescription>Maximum total of 100 points per candidate</CardDescription>
            </CardHeader>
            <div className="mt-4 border-t">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Criterion</TableHead>
                    <TableHead className="w-40">Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criteria.map(([key, criterion]) => (
                    <TableRow key={key}>
                      <TableCell className="whitespace-normal">
                        <p className="font-medium">{criterion.label}</p>
                        <p className="text-xs text-muted-foreground">{CRITERIA_DETAILS[key]}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={criterion.points} className="h-1.5 w-20" aria-label={`${criterion.label} weight ${criterion.points}%`} />
                          <span className="font-mono text-sm tabular-nums">{criterion.points}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Eligibility and selection</CardTitle>
              <CardDescription>Mandatory checks gate the decision before scores are compared</CardDescription>
            </CardHeader>
            <ul className="space-y-3 px-5 pb-5 pt-4">
              {ELIGIBILITY_RULES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3 text-sm">
                  <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <div className="mx-5 mb-5 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
              <p className="mb-1 flex items-center gap-1.5 font-medium text-foreground">
                <CheckCircle2 className="size-3.5 text-success" aria-hidden /> Why gate on correctness?
              </p>
              A response that fails the reference check can still score up to 50 points from schema,
              evidence and agreement. Gating ensures a well-formatted but wrong answer can never be
              selected.
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current limitations</CardTitle>
            <CardDescription>Known constraints of the verification approach</CardDescription>
          </CardHeader>
          <ul className="grid gap-3 px-5 pb-5 pt-4 sm:grid-cols-2">
            {LIMITATIONS.map((item) => (
              <li key={item.title} className="flex gap-3 rounded-md border p-3">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
