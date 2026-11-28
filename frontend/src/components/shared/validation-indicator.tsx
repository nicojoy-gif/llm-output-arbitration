import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export function ValidationIndicator({
  label,
  passed,
  passedText = "Passed",
  failedText = "Failed",
  className,
}: {
  label: string;
  passed: boolean;
  passedText?: string;
  failedText?: string;
  className?: string;
}) {
  const Icon = passed ? CheckCircle2 : XCircle;

  return (
    <div className={cn("flex items-center justify-between gap-3 text-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 font-medium",
          passed ? "text-success" : "text-danger",
        )}
      >
        <Icon className="size-4" aria-hidden />
        {passed ? passedText : failedText}
      </span>
    </div>
  );
}
