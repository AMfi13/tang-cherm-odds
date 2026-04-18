// Tang–Chern Fraction computation
// Based on Chen, T.K. (2025). Kelly Criterion and Its Extension to Finite Games.
//
// For a finite n-round i.i.d. bet (win prob p, payoff ratio b on win; lose stake on loss),
// each player picks a constant fraction k of wealth to wager each round.
// Final wealth after w wins and n-w losses:  W_n(k) = (1 + k*b)^w * (1 - k)^(n - w)
// Tang–Chern fraction f_n = inf argmax_k  min_g  P( W_n(k) >= W_n(g) )
// As n -> infinity, f_n -> Kelly fraction f* = (p*b - (1 - p)) / b.

export function kellyFraction(p: number, b: number): number {
  if (b <= 0) return 0;
  const f = (p * b - (1 - p)) / b;
  return Math.max(0, Math.min(1, f));
}

// Precompute log-binomial coefficients for n up to maxN
function binomialPMF(n: number, p: number): number[] {
  // returns array of length n+1: P(W = w) for w = 0..n
  const out = new Array(n + 1);
  // log C(n, w) via recurrence
  // P(w) = C(n,w) p^w (1-p)^(n-w)
  let c = 1;
  for (let w = 0; w <= n; w++) {
    if (w > 0) c = (c * (n - w + 1)) / w;
    out[w] = c * Math.pow(p, w) * Math.pow(1 - p, n - w);
  }
  return out;
}

// log W_n for w wins out of n with fraction k (handles k=0 and k=1 edge cases)
function logWealth(k: number, b: number, w: number, n: number): number {
  // W = (1 + k*b)^w * (1 - k)^(n - w)
  const winTerm = w === 0 ? 0 : w * Math.log(1 + k * b);
  const loseTerm = n - w === 0 ? 0 : (n - w) * Math.log(Math.max(1 - k, 1e-300));
  // If k == 1 and there is any loss, wealth is 0 -> -Infinity
  if (k >= 1 && n - w > 0) return -Infinity;
  return winTerm + loseTerm;
}

export interface TangChernResult {
  fractions: number[]; // f_1 .. f_n (each in [0,1])
  kelly: number;
}

// Compute Tang–Chern fractions for rounds 1..maxN.
// gridStep: discretisation of [0, 1] (default 0.01 = 1% steps, matches the paper).
export function computeTangChern(p: number, b: number, maxN: number, gridStep = 0.01): TangChernResult {
  const kelly = kellyFraction(p, b);

  // Build grid
  const grid: number[] = [];
  for (let i = 0; i * gridStep <= 1 + 1e-9; i++) {
    grid.push(Math.min(1, i * gridStep));
  }
  const G = grid.length;

  const fractions: number[] = [];

  // Negative-EV: maximin is 0 (don't bet)
  if (kelly <= 0) {
    for (let n = 1; n <= maxN; n++) fractions.push(0);
    return { fractions, kelly };
  }

  for (let n = 1; n <= maxN; n++) {
    const pmf = binomialPMF(n, p);

    // Precompute logWealth[k_idx][w] for all k in grid, w = 0..n
    const logW: Float64Array[] = new Array(G);
    for (let i = 0; i < G; i++) {
      const arr = new Float64Array(n + 1);
      for (let w = 0; w <= n; w++) {
        arr[w] = logWealth(grid[i], b, w, n);
      }
      logW[i] = arr;
    }

    // For each k, compute min_g P(W_n(k) >= W_n(g))
    // Joint distribution: independent? In the paper Players A and B face the SAME
    // sequence of outcomes (same coin flips). So W_n(k) and W_n(g) share w (number of wins).
    // P(W_n(k) >= W_n(g)) = sum_{w: logW[k][w] >= logW[g][w]} pmf[w]
    let bestK = 0;
    let bestVal = -Infinity;

    for (let i = 0; i < G; i++) {
      // min over g of P(A_wins_or_ties)
      let minProb = Infinity;
      for (let j = 0; j < G; j++) {
        if (i === j) continue;
        let prob = 0;
        for (let w = 0; w <= n; w++) {
          if (logW[i][w] >= logW[j][w] - 1e-15) {
            prob += pmf[w];
          }
        }
        if (prob < minProb) minProb = prob;
      }
      // Track argmax with infimum tie-break: only update on strict improvement
      if (minProb > bestVal + 1e-12) {
        bestVal = minProb;
        bestK = grid[i];
      }
    }

    fractions.push(bestK);
  }

  return { fractions, kelly };
}
