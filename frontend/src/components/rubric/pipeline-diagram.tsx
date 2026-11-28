import { Fragment } from "react";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  FileJson,
  Gavel,
  Link2,
  MessageSquareText,
  Scale,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface PipelineStage {
  title: string;
  description: string;
  icon: LucideIcon;
  tag?: string;
  tone?: "default" | "mandatory" | "decision";
}

export const PIPELINE_STAGES: readonly PipelineStage[] = [
  { title: "Prompt", description: "Question and trusted sources sent to each model", icon: MessageSquareText },
  { title: "Local inference", description: "Llama 3.2 and Qwen 2.5 Coder answer via Ollama", icon: Bot },
  { title: "Schema validation", description: "Pydantic parses {answer, citation} JSON", icon: FileJson, tag: "Mandatory", tone: "mandatory" },
  { title: "Factual check", description: "Answer compared with the reference answer", icon: ShieldCheck, tag: "Mandatory", tone: "mandatory" },
  { title: "Evidence check", description: "Cited source must contain the answer", icon: Link2 },
  { title: "Agreement", description: "Share of valid answers that match", icon: Users },
  { title: "Weighted score", description: "Criteria combined into a 0–100 score", icon: Scale },
  { title: "Arbitration", description: "Highest-scoring eligible candidate wins", icon: Gavel, tone: "decision" },
];

function StageNode({ stage, index }: { stage: PipelineStage; index: number }) {
  const Icon = stage.icon;
  return (
    <li
      className={cn(
        "relative flex h-full list-none flex-col gap-2 rounded-lg border bg-card p-4",
        stage.tone === "mandatory" && "border-primary/40",
        stage.tone === "decision" && "border-success/50 bg-success-soft/40",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground",
            stage.tone === "mandatory" && "bg-accent text-primary",
            stage.tone === "decision" && "bg-success-soft text-success",
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold">{stage.title}</p>
        <p className="text-xs text-muted-foreground">{stage.description}</p>
      </div>
      {stage.tag && (
        <span className="mt-auto w-fit rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
          {stage.tag}
        </span>
      )}
    </li>
  );
}

function Connector() {
  return (
    <li aria-hidden className="flex list-none items-center justify-center text-muted-foreground/60">
      <ArrowDown className="size-4 md:hidden" />
      <ArrowRight className="hidden size-4 md:block" />
    </li>
  );
}

export function PipelineDiagram({ stages = PIPELINE_STAGES }: { stages?: readonly PipelineStage[] }) {
  const rows: PipelineStage[][] = [];
  for (let i = 0; i < stages.length; i += 4) rows.push(stages.slice(i, i + 4));

  return (
    <div aria-label="Arbitration pipeline" role="group" className="space-y-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex}>
          <ol
            start={rowIndex * 4 + 1}
            className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch"
          >
            {row.map((stage, i) => (
              <Fragment key={stage.title}>
                <StageNode stage={stage} index={rowIndex * 4 + i} />
                {i < row.length - 1 && <Connector />}
              </Fragment>
            ))}
          </ol>
          {rowIndex < rows.length - 1 && (
            <div aria-hidden className="flex justify-center py-2 text-muted-foreground/60">
              <ArrowDown className="size-4" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
