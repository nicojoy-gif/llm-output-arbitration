import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "danger" | "primary";

const ICON_TONE: Record<Tone, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  primary: "bg-accent text-primary",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  loading = false,
}: {
  label: string;
  value: string | number | null;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  loading?: boolean;
}) {
  return (
    <Card className="gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className={cn("flex size-7 items-center justify-center rounded-md", ICON_TONE[tone])}>
          <Icon className="size-3.5" aria-hidden />
        </span>
      </div>
      {loading ? (
        <Skeleton className="h-7 w-16" />
      ) : (
        <p className="text-2xl font-semibold tabular-nums tracking-tight">{value ?? "—"}</p>
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
