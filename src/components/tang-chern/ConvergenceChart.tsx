import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface ConvergenceChartProps {
  fractions: number[];
  kelly: number;
}

export function ConvergenceChart({ fractions, kelly }: ConvergenceChartProps) {
  const data = fractions.map((f, i) => ({
    n: i + 1,
    fraction: +(f * 100).toFixed(2),
  }));

  const maxY = Math.max(kelly * 100, ...data.map((d) => d.fraction)) * 1.15 + 1;

  return (
    <Card className="rounded-3xl border-border/60 p-8 shadow-[var(--shadow-soft)]">
      <div className="mb-6">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Convergence
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Tang–Chern fraction by round, vs. the Kelly limit.
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 8 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="n"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
              label={{ value: "Round (n)", position: "insideBottom", offset: -4, fontSize: 12, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, maxY]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, "f_n"]}
              labelFormatter={(label) => `Round ${label}`}
            />
            <ReferenceLine
              y={+(kelly * 100).toFixed(4)}
              stroke="var(--color-muted-foreground)"
              strokeDasharray="6 4"
              label={{
                value: `Kelly ${(kelly * 100).toFixed(2)}%`,
                position: "right",
                fontSize: 11,
                fill: "var(--color-muted-foreground)",
              }}
            />
            <Line
              type="monotone"
              dataKey="fraction"
              stroke="var(--accent-blue)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "var(--accent-blue)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
