import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface InputPanelProps {
  rounds: number;
  p: number;
  r: number;
  onRoundsChange: (n: number) => void;
  onPChange: (p: number) => void;
  onRChange: (r: number) => void;
}

export function InputPanel({
  rounds,
  p,
  r,
  onRoundsChange,
  onPChange,
  onRChange,
}: InputPanelProps) {
  return (
    <Card className="rounded-3xl border-border/60 p-8 shadow-[var(--shadow-soft)]">
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Parameters
      </h2>

      <div className="mt-8 space-y-10">
        {/* Rounds */}
        <Field
          label="Number of rounds"
          symbol="n"
          value={rounds}
          display={String(rounds)}
        >
          <div className="flex items-center gap-4">
            <Slider
              value={[rounds]}
              min={1}
              max={20}
              step={1}
              onValueChange={(v) => onRoundsChange(v[0])}
              className="flex-1"
            />
            <Input
              type="number"
              min={1}
              max={20}
              value={rounds}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!isNaN(v)) onRoundsChange(Math.max(1, Math.min(20, v)));
              }}
              className="w-20 text-right tabular-nums"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Capped at 20 — convergence to Kelly is typically clear by round 15.
          </p>
        </Field>

        {/* Probability */}
        <Field
          label="Probability of winning"
          symbol="P"
          value={p}
          display={p.toFixed(2)}
        >
          <div className="flex items-center gap-4">
            <Slider
              value={[p]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(v) => onPChange(v[0])}
              className="flex-1"
            />
            <Input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={p}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v)) onPChange(Math.max(0, Math.min(1, v)));
              }}
              className="w-20 text-right tabular-nums"
            />
          </div>
        </Field>

        {/* Odds */}
        <Field
          label="Risk–reward ratio"
          symbol="R"
          value={r}
          display={r.toFixed(2)}
        >
          <div className="flex items-center gap-4">
            <Slider
              value={[r]}
              min={0.1}
              max={10}
              step={0.1}
              onValueChange={(v) => onRChange(v[0])}
              className="flex-1"
            />
            <Input
              type="number"
              min={0.1}
              max={10}
              step={0.1}
              value={r}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v)) onRChange(Math.max(0.1, Math.min(10, v)));
              }}
              className="w-20 text-right tabular-nums"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Win <span className="tabular-nums">{r.toFixed(2)}</span> units per 1 unit risked.
          </p>
        </Field>
      </div>
    </Card>
  );
}

function Field({
  label,
  symbol,
  display,
  children,
}: {
  label: string;
  symbol: string;
  value: number;
  display: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <Label className="text-base font-medium text-foreground">
          {label}
          <span className="ml-2 font-mono text-sm text-muted-foreground">{symbol}</span>
        </Label>
        <span className="font-mono text-lg tabular-nums text-foreground">{display}</span>
      </div>
      {children}
    </div>
  );
}
