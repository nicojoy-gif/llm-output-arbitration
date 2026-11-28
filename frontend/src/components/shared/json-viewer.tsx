"use client";

import { useId, useState } from "react";
import { AlertTriangle, Check, ChevronRight, Copy } from "lucide-react";

import { parseRawResponse } from "@/lib/format";
import { cn } from "@/lib/utils";

export function JsonViewer({
  raw,
  label = "Raw response",
  defaultOpen = false,
}: {
  raw: string | null;
  label?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const contentId = useId();
  const parsed = parseRawResponse(raw);

  async function copy() {
    if (raw === null) return;
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="overflow-hidden rounded-md border bg-muted/40">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={contentId}
          className="flex cursor-pointer items-center gap-1.5 rounded-sm text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ChevronRight className={cn("size-3.5 transition-transform", open && "rotate-90")} aria-hidden />
          {label}
          {parsed.kind === "invalid" && (
            <span className="ml-1 inline-flex items-center gap-1 text-danger">
              <AlertTriangle className="size-3" aria-hidden /> invalid JSON
            </span>
          )}
          {parsed.kind === "empty" && <span className="ml-1 text-danger">no response</span>}
        </button>
        {raw !== null && (
          <button
            type="button"
            onClick={copy}
            aria-label="Copy raw response"
            className="cursor-pointer rounded-sm p-1 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </button>
        )}
      </div>
      {open && (
        <div id={contentId} className="border-t">
          {parsed.kind === "empty" && (
            <p className="px-3 py-3 text-xs text-muted-foreground">
              The model returned no content, or the request to the model failed.
            </p>
          )}
          {parsed.kind === "json" && (
            <pre className="max-h-64 overflow-auto px-3 py-3 font-mono text-xs leading-relaxed">
              {parsed.formatted}
            </pre>
          )}
          {parsed.kind === "invalid" && (
            <div className="space-y-2 px-3 py-3">
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all font-mono text-xs leading-relaxed">
                {parsed.raw}
              </pre>
              <p className="text-xs text-danger">Parser: {parsed.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
