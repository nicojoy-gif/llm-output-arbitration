"use client";

import { ChevronRight } from "lucide-react";

import { ArbitrationStatusBadge, TieBadge } from "@/components/evaluation/arbitration-status";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getModelDefinition } from "@/constants/models";
import { getArbitrationDecision } from "@/lib/arbitration";
import { formatScore, formatTimestamp } from "@/lib/format";
import type { ArbitrationRecord } from "@/types/arbitration";

export function HistoryTable({
  records,
  onSelect,
}: {
  records: ArbitrationRecord[];
  onSelect: (record: ArbitrationRecord) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Question</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Winning model</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tie</TableHead>
          <TableHead className="w-8">
            <span className="sr-only">Details</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record, index) => {
          const decision = getArbitrationDecision(record);
          return (
            <TableRow
              key={`${record.timestamp}-${index}`}
              tabIndex={0}
              role="button"
              aria-label={`View details for "${record.question}" at ${formatTimestamp(record.timestamp)}`}
              onClick={() => onSelect(record)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(record);
                }
              }}
              className="cursor-pointer outline-none focus-visible:bg-accent/60"
            >
              <TableCell className="max-w-72 truncate font-medium">{record.question}</TableCell>
              <TableCell className="text-muted-foreground">{formatTimestamp(record.timestamp)}</TableCell>
              <TableCell>
                {decision.winner ? (
                  <span>
                    {getModelDefinition(decision.winner.model_name).name}
                    <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                      {decision.winner.model_name}
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">No winner</span>
                )}
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {decision.winner ? formatScore(decision.winner.score) : "—"}
              </TableCell>
              <TableCell>
                <ArbitrationStatusBadge status={record.status} />
              </TableCell>
              <TableCell>{decision.tie ? <TieBadge /> : <span className="text-muted-foreground">—</span>}</TableCell>
              <TableCell>
                <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
