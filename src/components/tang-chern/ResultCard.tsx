import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResultCardProps {
  rounds: number;
  tangChern: number;
  kelly: number;
  p: number;
  b: number;
}

export function ResultCard({ rounds, tangChern, kelly, p, b }: ResultCardProps) {
  const negativeEV = p * b - (1 - p) <= 0;
  const halfP = Math.abs(p - 0.5) < 1e-9;

  const diff = tangChern - kelly;
  const cmp =
    Math.abs(diff) < 5e-4 ? "≈ Kelly" : diff > 0 ? "Above Kelly" : "Below Kelly";
  const cmpVariant = Math.abs(diff) < 5e-4 ? "secondary" : "outline";

  return (
    <Card className="rounded-3xl border-border/60 p-8 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Tang–Chern Fraction
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Optimal bet at n = {rounds}
          </p>
          <div className="mt-4 flex items-baseline gap-3">
            <span
              className="text-6xl font-semibold tabular-nums tracking-tight"
              style={{ color: "var(--accent-blue)" }}
            >
              {(tangChern * 100).toFixed(1)}
              <span className="text-3xl font-medium text-muted-foreground">%</span>
            </span>
            <Badge variant={cmpVariant} className="rounded-full">
              {cmp}
            </Badge>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Kelly Fraction
          </p>
          <p className="mt-1 text-xs text-muted-foreground">As n → ∞</p>
          <p className="mt-4 text-4xl font-medium tabular-nums tracking-tight text-foreground/80">
            {(kelly * 100).toFixed(2)}
            <span className="text-2xl text-muted-foreground">%</span>
          </p>
        </div>
      </div>

      {(negativeEV || halfP) && (
        <div className="mt-6 rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
          {negativeEV && (
            <p>
              <span className="font-medium text-foreground">Negative expected value.</span>{" "}
              Pb − (1 − P) ≤ 0, so both Kelly and the maximin strategy recommend not betting.
            </p>
          )}
          {halfP && !negativeEV && (
            <p>
              <span className="font-medium text-foreground">P = 0.5.</span> Argmax may be
              non-unique; the infimum is reported per the Tang–Chern definition.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
