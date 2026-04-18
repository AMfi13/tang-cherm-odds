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

// Centered moving average to filter the alternating "harmonics" around Kelly
// and reveal the underlying main component (the slow drift toward f*).
function mainComponentPath(fractions: number[], window = 3): (number | null)[] {
  const half = Math.floor(window / 2);
  return fractions.map((_, i) => {
    const lo = i - half;
    const hi = i + half;
    if (lo < 0 || hi >= fractions.length) return null; // undefined at the edges
    let sum = 0;
    for (let j = lo; j <= hi; j++) sum += fractions[j];
    return sum / window;
  });
}

export function ConvergenceChart({ fractions, kelly }: ConvergenceChartProps) {
  // Window grows slightly with n to smooth longer-period harmonics, but stays odd & small.
  const window = fractions.length >= 9 ? 5 : 3;
  const main = mainComponentPath(fractions, window);

  const data = fractions.map((f, i) => ({
    n: i + 1,
    fraction: +(f * 100).toFixed(2),
    main: main[i] === null ? null : +((main[i] as number) * 100).toFixed(2),
  }));

  const allValues = [
    kelly * 100,
    ...data.map((d) => d.fraction),
    ...data.map((d) => d.main).filter((v): v is number => v !== null),
  ];
  const maxY = Math.max(...allValues) * 1.15 + 1;

  return (
    <Card className="rounded-3xl border-border/60 p-8 shadow-[var(--shadow-soft)]">
      <div className="mb-6">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Convergence
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Tang–Chern fraction by round, the smoothed main component, and the Kelly limit.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full bg-[var(--accent-blue)]" />
            f_n
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full bg-foreground/70" />
            Main component
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0 w-4 border-t border-dashed border-muted-foreground" />
            Kelly
          </span>
        </div>
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
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)}%`,
                name === "main" ? "Main component" : "f_n",
              ]}
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
            <Line
              type="monotone"
              dataKey="main"
              stroke="var(--color-foreground)"
              strokeOpacity={0.7}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
