"use client";

import { ArbitrationResult } from "@/components/evaluation/arbitration-result";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatTimestamp } from "@/lib/format";
import type { ArbitrationRecord } from "@/types/arbitration";

export function EvaluationDetailsDrawer({
  record,
  onOpenChange,
}: {
  record: ArbitrationRecord | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={record !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        {record && (
          <>
            <SheetHeader>
              <SheetTitle>{record.question}</SheetTitle>
              <SheetDescription>Logged {formatTimestamp(record.timestamp)}</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-5">
              <ArbitrationResult result={record} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
