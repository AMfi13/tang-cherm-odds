import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SequenceTableProps {
  fractions: number[];
  kelly: number;
}

export function SequenceTable({ fractions, kelly }: SequenceTableProps) {
  return (
    <Card className="rounded-3xl border-border/60 p-8 shadow-[var(--shadow-soft)]">
      <div className="mb-4">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Sequence
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Tang–Chern fraction f_n for every round.
        </p>
      </div>

      <ScrollArea className="h-72 w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="w-24">Round n</TableHead>
              <TableHead className="text-right">Tang–Chern f_n</TableHead>
              <TableHead className="text-right">Δ vs. Kelly</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fractions.map((f, i) => {
              const delta = (f - kelly) * 100;
              return (
                <TableRow key={i} className="border-border/40">
                  <TableCell className="font-mono tabular-nums">{i + 1}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {(f * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                    {delta >= 0 ? "+" : ""}
                    {delta.toFixed(2)}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
