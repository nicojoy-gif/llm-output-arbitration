"use client";

import { useBackendHealth } from "@/hooks/use-arbitration-queries";
import { cn } from "@/lib/utils";

type ConnectionState = "checking" | "online" | "offline";

export function useConnectionState(): ConnectionState {
  const health = useBackendHealth();
  if (health.isPending) return "checking";
  return health.isSuccess && health.data.status === "healthy" ? "online" : "offline";
}

const LABELS: Record<ConnectionState, string> = {
  checking: "Checking backend",
  online: "Backend connected",
  offline: "Backend offline",
};

const DOT: Record<ConnectionState, string> = {
  checking: "bg-warning",
  online: "bg-success",
  offline: "bg-danger",
};

export function StatusDot({ state, className }: { state: ConnectionState; className?: string }) {
  return (
    <span className={cn("relative flex size-2", className)} aria-hidden>
      {state === "online" && (
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-40 motion-reduce:hidden" />
      )}
      <span className={cn("relative inline-flex size-2 rounded-full", DOT[state])} />
    </span>
  );
}

export function BackendStatus({
  variant = "pill",
  showLabel = true,
}: {
  variant?: "pill" | "plain";
  showLabel?: boolean;
}) {
  const state = useConnectionState();

  return (
    <div
      role="status"
      aria-live="polite"
      title={LABELS[state]}
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium",
        variant === "pill" && "rounded-full border bg-card px-2.5 py-1 text-muted-foreground",
      )}
    >
      <StatusDot state={state} />
      {showLabel ? <span>{LABELS[state]}</span> : <span className="sr-only">{LABELS[state]}</span>}
    </div>
  );
}
