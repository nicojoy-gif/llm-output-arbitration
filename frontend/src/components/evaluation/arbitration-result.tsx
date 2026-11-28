import { CandidateCard } from "@/components/evaluation/candidate-card";
import { WinnerCard } from "@/components/evaluation/winner-card";
import { SectionHeader } from "@/components/shared/page-header";
import { getArbitrationDecision, isSameCandidate } from "@/lib/arbitration";
import type { ArbitrationRecord, ArbitrationResponse } from "@/types/arbitration";

export function ArbitrationResult({
  result,
}: {
  result: ArbitrationResponse & Partial<Pick<ArbitrationRecord, "tie" | "selection_reason">>;
}) {
  const decision = getArbitrationDecision(result);

  return (
    <div className="space-y-6">
      <WinnerCard question={result.question} status={result.status} decision={decision} />

      <section aria-label="Candidate comparison">
        <SectionHeader
          title="Candidate comparison"
          description={`${result.candidates.length} model responses evaluated against the same rubric`}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {result.candidates.map((candidate) => (
            <CandidateCard
              key={candidate.model_name}
              candidate={candidate}
              isWinner={isSameCandidate(candidate, decision.winner)}
              isTied={decision.tie && decision.tiedCandidates.some((c) => isSameCandidate(c, candidate))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
