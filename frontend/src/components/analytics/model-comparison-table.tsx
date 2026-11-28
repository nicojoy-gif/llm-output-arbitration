import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getModelDefinition } from "@/constants/models";
import { formatPercent } from "@/lib/format";
import type { ModelPerformance } from "@/types/arbitration";

export function ModelComparisonTable({ data }: { data: ModelPerformance[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Model</TableHead>
          <TableHead className="text-right">Attempts</TableHead>
          <TableHead className="text-right">Wins</TableHead>
          <TableHead className="text-right">Win rate</TableHead>
          <TableHead className="text-right">Avg. score</TableHead>
          <TableHead className="text-right">Schema success</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((model) => {
          const definition = getModelDefinition(model.model_name);
          return (
            <TableRow key={model.model_name}>
              <TableCell>
                <p className="font-medium">{definition.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{model.model_name}</p>
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">{model.attempts}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">{model.wins}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">{formatPercent(model.win_rate, 1)}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">{model.average_score.toFixed(1)}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">{formatPercent(model.schema_success_rate, 1)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
