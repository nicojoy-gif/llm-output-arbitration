import { Bot, Loader2 } from "lucide-react";

import { MODELS } from "@/constants/models";
import { cn } from "@/lib/utils";

export function ParticipatingModels({
  running = false,
  stacked = false,
}: {
  running?: boolean;
  stacked?: boolean;
}) {
  return (
    <ul className={cn("grid gap-2", !stacked && "sm:grid-cols-2")}>
      {MODELS.map((model) => (
        <li
          key={model.id}
          className={cn(
            "flex items-center gap-3 rounded-md border bg-card px-3 py-2.5",
            running && "border-primary/30",
          )}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Bot className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{model.name}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">{model.id}</p>
          </div>
          {running ? (
            <Loader2 className="size-4 animate-spin text-primary" aria-label="Awaiting result" />
          ) : (
            <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              {model.parameterSize}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
