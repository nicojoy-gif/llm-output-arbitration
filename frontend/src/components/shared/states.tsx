import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2, PlugZap, RotateCw, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/services/api-client";
import { cn } from "@/lib/utils";

function StateFrame({
  icon: Icon,
  title,
  description,
  action,
  tone = "default",
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  tone?: "default" | "danger" | "warning";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          tone === "danger" && "bg-danger-soft text-danger",
          tone === "warning" && "bg-warning-soft text-warning",
          tone === "default" && "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="max-w-md space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && <div className="text-sm text-muted-foreground">{description}</div>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon = Inbox,
  className,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <StateFrame icon={icon} title={title} description={description} action={action} className={className} />
  );
}

export function LoadingState({
  label = "Loading…",
  rows = 3,
  className,
}: {
  label?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)} role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        {label}
      </div>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function ErrorState({
  error,
  onRetry,
  title,
  className,
}: {
  error: unknown;
  onRetry?: () => void;
  title?: string;
  className?: string;
}) {
  const retry = onRetry ? (
    <Button variant="outline" size="sm" onClick={onRetry}>
      <RotateCw /> Retry
    </Button>
  ) : undefined;

  if (error instanceof ApiError && error.isBackendDown) {
    return (
      <StateFrame
        icon={PlugZap}
        tone="danger"
        title="Backend not reachable"
        description={`${error.message} Start the FastAPI server (uvicorn api:app --reload) and confirm NEXT_PUBLIC_API_URL points to it.`}
        action={retry}
        className={className}
      />
    );
  }

  return (
    <StateFrame
      icon={AlertTriangle}
      tone="danger"
      title={title ?? "Something went wrong"}
      description={error instanceof Error ? error.message : "An unexpected error occurred."}
      action={retry}
      className={className}
    />
  );
}
