
## Tang–Chern Fraction Calculator

A single-page web app (built on the existing TanStack Start + Tailwind setup) that computes the **Tang–Chern Fraction** sequence from Tze Kai Chen's paper, alongside the classical **Kelly Fraction**, for a user-supplied bet.

### Inputs (left panel, sticky card)
- **Number of rounds (n)** — slider 1–20 + number input. (Computation gets very heavy past ~15; the paper itself shows convergence by round 15.)
- **Probability of winning (P)** — slider 0–1 (step 0.01) + number input.
- **Odds / Risk-Reward Ratio (R = b)** — slider 0–10 (step 0.1) + number input, with note "win R units per 1 unit risked".
- Live recompute as sliders move (debounced).

### Outputs (right panel)
1. **Headline result card** — the Tang–Chern Fraction f_n for the selected n, displayed as a large percentage, with the Kelly Fraction f* = (Pb − (1−P))/b shown beside it for comparison. A small badge indicates whether f_n is above, below, or equal to f*.
2. **Convergence chart** — line chart of f_1 … f_n (Tang–Chern) with a dashed horizontal line at f* (Kelly), styled like Figures 1–9 in the paper. Recharts (already in the project deps via shadcn).
3. **Sequence table** — round n vs f_n (%), scrollable.
4. **Edge-case messaging** — if Pb ≤ 1−P (negative-EV bet), show a note that Kelly suggests 0% and the maximin is also 0; if P = 0.5 exactly, note non-uniqueness.

### Computation logic (client-side, in a Web Worker so the UI stays smooth)
- Discretize k ∈ [0, 1] in 1% steps (matching the paper's tables, which report whole-percent fractions).
- For each candidate fraction k for Player A, simulate the distribution of final wealth W_n(k) over the 2^n outcomes (or via the binomial PMF over number of wins, since outcomes are i.i.d.) — wealth after w wins and n−w losses is (1 + kb)^w · (1 − k)^(n−w).
- For each opponent fraction g, compute P(W_n(k) ≥ W_n(g)) using the joint binomial distribution.
- For each k, take min over g; then take argmax over k. Per the Tang–Chern definition, when the argmax set has multiple elements, return its **infimum** (smallest k).
- Return the full sequence f_1, …, f_n.
- Cap n at 20 with a tooltip explanation; computation is O(n² × grid²) which stays interactive.

### Visual style — minimal Apple-like
- Light background, generous whitespace, large rounded cards with soft shadows, neutral grays with a single subtle accent color for the chart line and key numbers.
- Inter (already implicit) for body, larger weights for the headline percentage.
- Mobile-responsive: input panel stacks above the results.

### Header
- Title: "Tang–Chern Fraction Calculator"
- Subtitle: short attribution to the paper ("Based on Chen, T.K. (2025). *Kelly Criterion and Its Extension to Finite Games*") with a collapsible "What is this?" explainer that briefly defines the maximin strategy and Kelly comparison.

### File changes
- Replace placeholder in `src/routes/index.tsx` with the calculator page.
- New `src/lib/tang-chern.ts` — pure computation functions (Kelly fraction, Tang–Chern sequence).
- New `src/workers/tang-chern.worker.ts` — runs the computation off the main thread.
- New `src/components/tang-chern/` — InputPanel, ResultCard, ConvergenceChart, SequenceTable.
- Update `src/routes/__root.tsx` head meta (title + description) for the calculator.
