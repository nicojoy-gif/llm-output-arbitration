"use client";

import { useRef, useState } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { Play, RotateCcw, Scale } from "lucide-react";
import { toast } from "sonner";

import { ArbitrationResult } from "@/components/evaluation/arbitration-result";
import { EvaluationProgress } from "@/components/evaluation/evaluation-progress";
import { ParticipatingModels } from "@/components/evaluation/participating-models";
import { QuestionSelector } from "@/components/evaluation/question-selector";
import { SectionHeader } from "@/components/shared/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ARBITRATE_MUTATION_KEY,
  useQuestions,
  useRunArbitration,
} from "@/hooks/use-arbitration-queries";
import { useConnectionState } from "@/components/layout/backend-status";
import { ApiError } from "@/services/api-client";

export function EvaluationWorkspace() {
  const questionsQuery = useQuestions();
  const questions = questionsQuery.data ?? [];
  const [pickedId, setPickedId] = useState<number | null>(null);
  const arbitration = useRunArbitration();
  const connection = useConnectionState();

  const selectedId = questions.some((q) => q.id === pickedId) ? pickedId : (questions[0]?.id ?? null);
  const runningQuestion =
    questions.find((q) => q.id === arbitration.variables)?.question ??
    questions.find((q) => q.id === selectedId)?.question ??
    "";
  const activeRuns = useIsMutating({ mutationKey: ARBITRATE_MUTATION_KEY });
  const isRunning = arbitration.isPending;
  const isBlocked = isRunning || activeRuns > 0;

  const resultsRef = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);

  function run() {
    if (selectedId === null || isBlocked || submitting.current) return;
    submitting.current = true;
    if (window.matchMedia("(max-width: 1279px)").matches) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    arbitration.mutate(selectedId, {
      onSettled: () => {
        submitting.current = false;
      },
      onSuccess: (result) => {
        if (result.status === "success") {
          toast.success("Arbitration complete", {
            description: `Winner: ${result.winner?.model_name ?? "—"}`,
          });
        } else {
          toast.warning("Arbitration complete — no acceptable answer", {
            description: "No candidate passed the mandatory checks.",
          });
        }
      },
      onError: (error) => {
        toast.error("Arbitration failed", {
          description:
            error instanceof ApiError && error.isBackendDown
              ? "The backend is not reachable."
              : error.message,
        });
      },
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div className="space-y-6 xl:sticky xl:top-20 xl:self-start">
        <Card className="p-5">
          <SectionHeader title="Benchmark question" description="Each question has a trusted reference answer held by the backend." />
          {questionsQuery.isPending ? (
            <LoadingState label="Loading questions…" rows={4} />
          ) : questionsQuery.isError ? (
            <ErrorState
              error={questionsQuery.error}
              title="Could not load questions"
              onRetry={() => void questionsQuery.refetch()}
            />
          ) : questions.length === 0 ? (
            <EmptyState title="No questions available" description="The backend returned an empty question bank." />
          ) : (
            <QuestionSelector
              questions={questions}
              value={selectedId}
              onChange={setPickedId}
              disabled={isBlocked}
            />
          )}
        </Card>

        <Card className="p-5">
          <SectionHeader title="Participating models" description="Local inference via Ollama · temperature 0.1" />
          <ParticipatingModels stacked />
        </Card>

        <div className="space-y-2">
          <Button
            size="lg"
            className="w-full"
            onClick={run}
            disabled={selectedId === null || isBlocked}
            aria-describedby="run-hint"
          >
            <Play />
            {isRunning ? "Running arbitration…" : "Run Arbitration"}
          </Button>
          <p id="run-hint" className="text-center text-xs text-muted-foreground">
            {isBlocked && !isRunning
              ? "Another arbitration started earlier is still running on the backend."
              : connection === "offline"
              ? "Backend appears offline. The request will fail until FastAPI is running."
              : "Each run is logged by the backend for history and analytics."}
          </p>
        </div>
      </div>

      <div ref={resultsRef} className="min-w-0 scroll-mt-20">
        {isRunning ? (
          <EvaluationProgress question={runningQuestion} startedAt={arbitration.submittedAt || null} />
        ) : arbitration.isError ? (
          <ErrorState
            error={arbitration.error}
            title="Arbitration request failed"
            onRetry={run}
          />
        ) : arbitration.isSuccess ? (
          <div className="space-y-4">
            <ArbitrationResult result={arbitration.data} />
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => arbitration.reset()}>
                <RotateCcw /> Clear result
              </Button>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Scale}
            className="min-h-80 bg-card"
            title="No evaluation yet"
            description="Select a benchmark question and run arbitration. Both models answer the same prompt, each response is validated and scored, and the strongest eligible answer is selected."
          />
        )}
      </div>
    </div>
  );
}
