import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { computeTangChern } from "@/lib/tang-chern";
import { InputPanel } from "@/components/tang-chern/InputPanel";
import { ResultCard } from "@/components/tang-chern/ResultCard";
import { ConvergenceChart } from "@/components/tang-chern/ConvergenceChart";
import { SequenceTable } from "@/components/tang-chern/SequenceTable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Tang–Chern Fraction Calculator" },
      {
        name: "description",
        content:
          "Compute the Tang–Chern maximin betting fraction for finite-round bets and compare it to the Kelly criterion.",
      },
      { property: "og:title", content: "Tang–Chern Fraction Calculator" },
      {
        property: "og:description",
        content:
          "A finite-game extension of the Kelly criterion. Enter rounds, win probability and odds to see the maximin fraction converge to Kelly.",
      },
    ],
  }),
});

function Index() {
  const [rounds, setRounds] = useState(10);
  const [p, setP] = useState(0.6);
  const [r, setR] = useState(1);

  // Debounce inputs so dragging sliders stays smooth
  const [debounced, setDebounced] = useState({ rounds, p, r });
  useEffect(() => {
    const t = setTimeout(() => setDebounced({ rounds, p, r }), 120);
    return () => clearTimeout(t);
  }, [rounds, p, r]);

  const result = useMemo(
    () => computeTangChern(debounced.p, debounced.r, debounced.rounds),
    [debounced],
  );

  const currentFraction = result.fractions[debounced.rounds - 1] ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        {/* Header */}
        <header className="mb-12">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Finite Kelly
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Tang–Chern Fraction Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Based on Chen, T.K. (2025).{" "}
            <em className="text-foreground/80">
              Kelly Criterion and Its Extension to Finite Games
            </em>
            .
          </p>

          <Collapsible className="mt-6">
            <CollapsibleTrigger className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              What is this?
              <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 max-w-2xl space-y-2 text-sm text-muted-foreground">
              <p>
                The classical Kelly fraction f* = (Pb − (1−P)) / b maximises long-run
                growth — but only as the number of rounds tends to infinity.
              </p>
              <p>
                The <span className="text-foreground">Tang–Chern fraction</span> f_n is
                the maximin strategy in a finite n-round game: the bet size that
                maximises the worst-case probability of beating any opposing constant
                fraction. As n grows, f_n converges to the Kelly fraction.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </header>

        {/* Layout */}
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <InputPanel
              rounds={rounds}
              p={p}
              r={r}
              onRoundsChange={setRounds}
              onPChange={setP}
              onRChange={setR}
            />
          </div>

          <div className="space-y-6">
            <ResultCard
              rounds={debounced.rounds}
              tangChern={currentFraction}
              kelly={result.kelly}
              p={debounced.p}
              b={debounced.r}
            />
            <ConvergenceChart fractions={result.fractions} kelly={result.kelly} />
            <SequenceTable fractions={result.fractions} kelly={result.kelly} />
          </div>
        </div>

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          Computed client-side over a 1% strategy grid · Maximin over the joint binomial
          outcome distribution
        </footer>
      </div>
    </div>
  );
}
