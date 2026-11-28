import { Progress } from "@/components/ui/progress";
import { getScoreBreakdown } from "@/lib/arbitration";
import { formatScore } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/arbitration";

export function ScoreBreakdown({ candidate }: { candidate: Candidate }) {
  const criteria = getScoreBreakdown(candidate);

  return (
    <div className="space-y-3">
      {criteria.map((criterion) => {
        const percent = (criterion.earned / criterion.max) * 100;
        const full = criterion.earned === criterion.max;
        const none = criterion.earned === 0;
        return (
          <div key={criterion.key} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {criterion.label}
                <span className="ml-1 text-muted-foreground/70">· {criterion.max} pts</span>
              </span>
              <span className="font-mono font-medium tabular-nums">
                {formatScore(criterion.earned)}/{criterion.max}
              </span>
            </div>
            <Progress
              value={percent}
              aria-label={`${criterion.label}: ${formatScore(criterion.earned)} of ${criterion.max} points`}
              className="h-1.5"
              indicatorClassName={cn(full ? "bg-success" : none ? "bg-danger" : "bg-warning")}
            />
          </div>
        );
      })}
    </div>
  );
}
