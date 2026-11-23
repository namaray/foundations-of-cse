---
title: Analysing Algorithms & Recurrences
description: Loop invariants and correctness, and solving recurrences with the substitution method, recursion trees and the Master theorem, with many worked examples.
sidebar:
  label: "1. Recurrences"
  order: 1
lesson:
  module: Foundations
  prerequisites:
    - label: Complexity analysis
      link: /data-structures/complexity-analysis/
  outcomes:
    - Prove an algorithm correct with a loop invariant
    - Write the recurrence for a recursive algorithm
    - Solve recurrences by iteration, recursion trees and substitution
    - Apply the three cases of the Master theorem and recognise when it does not apply
  keyIdea: >-
    A recursive algorithm's running time is a **recurrence**, such as $T(n) = 2T(n/2) + n$. Solve it by unrolling, by adding up a **recursion tree** level by level, or by guessing and proving with induction. The **Master theorem** settles $T(n) = aT(n/b) + f(n)$ at once by comparing $f(n)$ with $n^{\log_b a}$.
---

Asymptotic notation (Big-O, Ω, Θ) is covered in [Data Structures: Complexity Analysis](/data-structures/complexity-analysis/). This page covers the two other analysis skills every algorithms exam tests: **proving an algorithm correct** and **solving recurrences**.

## 1. Correctness with loop invariants

A **loop invariant** is a statement that is true before every iteration of a loop. To prove an algorithm correct with one, show three things:

1. **Initialisation:** it is true before the first iteration.
2. **Maintenance:** if it is true before an iteration, it is still true before the next.
3. **Termination:** when the loop ends, the invariant gives you the result you wanted.

**Example: insertion sort.** Invariant: *before the iteration for index $j$, the subarray `A[0..j-1]` holds the original first $j$ elements in sorted order.*

- Initialisation: for $j = 1$, `A[0..0]` is a single element, which is sorted.
- Maintenance: the iteration shifts larger elements right and inserts `A[j]` in its place, so `A[0..j]` is sorted.
- Termination: the loop ends with $j = n$, so `A[0..n-1]`, the whole array, is sorted.

## 2. Recurrences

A recursive algorithm's running time is naturally written as a **recurrence**: the cost on input size $n$ in terms of the cost on smaller inputs.

| Algorithm | Recurrence | Solution |
|---|---|---|
| Binary search | $T(n) = T(n/2) + O(1)$ | $\Theta(\log n)$ |
| Merge sort | $T(n) = 2T(n/2) + \Theta(n)$ | $\Theta(n \log n)$ |
| Quicksort, worst case | $T(n) = T(n-1) + \Theta(n)$ | $\Theta(n^2)$ |
| Tower of Hanoi | $T(n) = 2T(n-1) + 1$ | $\Theta(2^n)$ |
| Karatsuba multiplication | $T(n) = 3T(n/2) + \Theta(n)$ | $\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})$ |
| Strassen matrix multiplication | $T(n) = 7T(n/2) + \Theta(n^2)$ | $\Theta(n^{\log_2 7}) \approx \Theta(n^{2.81})$ |

There are three standard ways to solve them.

### Method 1: iteration (unrolling)

Expand the recurrence until a pattern appears, then sum it.

**Example:** $T(n) = T(n-1) + n$, $T(1) = 1$.

$$
T(n) = n + (n-1) + (n-2) + \dots + 1 = \frac{n(n+1)}{2} = \Theta(n^2)
$$

**Example:** $T(n) = 2T(n-1) + 1$, $T(1) = 1$ (Tower of Hanoi).

$$
T(n) = 2^{n-1} + 2^{n-2} + \dots + 2 + 1 = 2^n - 1 = \Theta(2^n)
$$

### Method 2: recursion tree

Draw the tree of recursive calls, write the non-recursive cost at each node, add each level, then add the levels.

**Example:** $T(n) = 2T(n/2) + cn$.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 580 270" role="img" aria-labelledby="rtree-t"><title id="rtree-t">Recursion tree for T(n) = 2T(n/2) + cn: every level costs cn in total, and there are log n + 1 levels.</title><defs><marker id="ah-rtree" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-rtree-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-rtree-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="230" y1="52" x2="125" y2="82"/><line class="dg-line" x1="230" y1="52" x2="335" y2="82"/><line class="dg-line" x1="125" y1="114" x2="72.5" y2="144"/><line class="dg-line" x1="125" y1="114" x2="177.5" y2="144"/><line class="dg-line" x1="335" y1="114" x2="282.5" y2="144"/><line class="dg-line" x1="335" y1="114" x2="387.5" y2="144"/><rect class="dg-cell-a" x="202" y="20" width="56" height="32" rx="4"/><text class="dg-t-a" x="230" y="36" text-anchor="middle" style="font-size:14px">cn</text><text class="dg-t-c" x="470" y="36">= cn</text><rect class="dg-cell" x="97" y="82" width="56" height="32" rx="4"/><text x="125" y="98" text-anchor="middle" style="font-size:14px">cn/2</text><rect class="dg-cell" x="307" y="82" width="56" height="32" rx="4"/><text x="335" y="98" text-anchor="middle" style="font-size:14px">cn/2</text><text class="dg-t-c" x="470" y="98">= cn</text><rect class="dg-cell" x="47.5" y="144" width="50" height="32" rx="4"/><text x="72.5" y="160" text-anchor="middle" style="font-size:14px">cn/4</text><rect class="dg-cell" x="152.5" y="144" width="50" height="32" rx="4"/><text x="177.5" y="160" text-anchor="middle" style="font-size:14px">cn/4</text><rect class="dg-cell" x="257.5" y="144" width="50" height="32" rx="4"/><text x="282.5" y="160" text-anchor="middle" style="font-size:14px">cn/4</text><rect class="dg-cell" x="362.5" y="144" width="50" height="32" rx="4"/><text x="387.5" y="160" text-anchor="middle" style="font-size:14px">cn/4</text><text class="dg-t-c" x="470" y="160">= cn</text><text class="dg-t-muted" x="230" y="204" text-anchor="middle">⋮</text><rect class="dg-cell-c" x="26" y="214" width="34" height="30" rx="4"/><text class="dg-t-c" x="43" y="229" text-anchor="middle" style="font-size:13px">c</text><rect class="dg-cell-c" x="67" y="214" width="34" height="30" rx="4"/><text class="dg-t-c" x="84" y="229" text-anchor="middle" style="font-size:13px">c</text><rect class="dg-cell-c" x="108" y="214" width="34" height="30" rx="4"/><text class="dg-t-c" x="125" y="229" text-anchor="middle" style="font-size:13px">c</text><rect class="dg-cell-c" x="149" y="214" width="34" height="30" rx="4"/><text class="dg-t-c" x="166" y="229" text-anchor="middle" style="font-size:13px">c</text><rect class="dg-cell-c" x="190" y="214" width="34" height="30" rx="4"/><text class="dg-t-c" x="207" y="229" text-anchor="middle" style="font-size:13px">c</text><rect class="dg-cell-c" x="231" y="214" width="34" height="30" rx="4"/><text class="dg-t-c" x="248" y="229" text-anchor="middle" style="font-size:13px">c</text><rect class="dg-cell-c" x="272" y="214" width="34" height="30" rx="4"/><text class="dg-t-c" x="289" y="229" text-anchor="middle" style="font-size:13px">c</text><rect class="dg-cell-c" x="313" y="214" width="34" height="30" rx="4"/><text class="dg-t-c" x="330" y="229" text-anchor="middle" style="font-size:13px">c</text><rect class="dg-cell-c" x="354" y="214" width="34" height="30" rx="4"/><text class="dg-t-c" x="371" y="229" text-anchor="middle" style="font-size:13px">c</text><rect class="dg-cell-c" x="395" y="214" width="34" height="30" rx="4"/><text class="dg-t-c" x="412" y="229" text-anchor="middle" style="font-size:13px">c</text><text class="dg-t-c" x="470" y="229">= cn</text><text class="dg-t-muted" x="230" y="262" text-anchor="middle">n leaves, each costing c</text><text class="dg-t-muted" x="470" y="6">level total</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>top-level call</li><li><span class="dg-swatch c"></span>level cost and leaves</li></ul><figcaption>Write each call&#x27;s own (non-recursive) cost, add across each level, then add the levels. Here every level sums to cn and there are log₂ n + 1 levels, so T(n) = Θ(n log n).</figcaption></figure>

Each of the $\log_2 n + 1$ levels costs $cn$, so $T(n) = \Theta(n \log n)$.

**Example:** $T(n) = 3T(n/4) + cn^2$. Level $i$ has $3^i$ nodes, each costing $c(n/4^i)^2$, so the level costs $(3/16)^i cn^2$. That is a decreasing geometric series dominated by the root:

$$
T(n) \le cn^2 \sum_{i=0}^{\infty} \left(\frac{3}{16}\right)^i = \frac{16}{13}cn^2 = \Theta(n^2)
$$

:::tip[Reading a recursion tree]
If the level costs **shrink** geometrically, the root dominates. If they **grow**, the leaves dominate. If they are **equal**, multiply one level's cost by the number of levels.
:::

### Method 3: substitution

Guess the answer, then prove it by induction.

**Example:** show $T(n) = 2T(\lfloor n/2 \rfloor) + n$ is $O(n \log n)$.

Guess $T(n) \le cn \log_2 n$. Assume it holds for $\lfloor n/2 \rfloor$. Then

$$
T(n) \le 2c\frac{n}{2}\log_2\frac{n}{2} + n = cn\log_2 n - cn + n \le cn \log_2 n
$$

whenever $c \ge 1$. Base cases are handled by choosing $c$ large enough.

## 3. The Master theorem

For recurrences of the form

$$
T(n) = a\,T\!\left(\frac{n}{b}\right) + f(n), \qquad a \ge 1,\; b > 1
$$

compare $f(n)$ with $n^{\log_b a}$, the total cost of the leaves of the recursion tree.

| Case | Condition | Result |
|---|---|---|
| 1. Leaves dominate | $f(n) = O(n^{\log_b a - \varepsilon})$ for some $\varepsilon > 0$ | $T(n) = \Theta(n^{\log_b a})$ |
| 2. Balanced | $f(n) = \Theta(n^{\log_b a} \log^k n)$, $k \ge 0$ | $T(n) = \Theta(n^{\log_b a} \log^{k+1} n)$ |
| 3. Root dominates | $f(n) = \Omega(n^{\log_b a + \varepsilon})$ **and** $a f(n/b) \le c f(n)$ for some $c < 1$ | $T(n) = \Theta(f(n))$ |

The extra condition in case 3 is the **regularity condition**. It holds for all ordinary polynomial $f(n)$.

### Worked examples

| Recurrence | $a, b$ | $n^{\log_b a}$ | $f(n)$ | Case | Answer |
|---|---|---|---|---|---|
| $T(n) = 9T(n/3) + n$ | 9, 3 | $n^2$ | $n$, polynomially smaller | 1 | $\Theta(n^2)$ |
| $T(n) = T(2n/3) + 1$ | 1, 3/2 | $n^0 = 1$ | $1$, equal | 2 ($k=0$) | $\Theta(\log n)$ |
| $T(n) = 2T(n/2) + n$ | 2, 2 | $n$ | $n$, equal | 2 ($k=0$) | $\Theta(n \log n)$ |
| $T(n) = 2T(n/2) + n\log n$ | 2, 2 | $n$ | $n \log n$ | 2 ($k=1$) | $\Theta(n \log^2 n)$ |
| $T(n) = 3T(n/4) + n\log n$ | 3, 4 | $n^{0.793}$ | $n \log n$, polynomially larger | 3 | $\Theta(n \log n)$ |
| $T(n) = 8T(n/2) + n^2$ | 8, 2 | $n^3$ | $n^2$ | 1 | $\Theta(n^3)$ |
| $T(n) = 4T(n/2) + n^3$ | 4, 2 | $n^2$ | $n^3$ | 3 | $\Theta(n^3)$ |

### When it does not apply

- The subproblems are not all the same size, for example $T(n) = T(n/3) + T(2n/3) + n$. Use a recursion tree (answer: $\Theta(n \log n)$).
- The size shrinks by subtraction, for example $T(n) = T(n-1) + n$. Use iteration.
- $a < 1$, or $f(n)$ is not positive.
- $f(n)$ falls in a gap between the cases, for example $T(n) = 2T(n/2) + n/\log n$: $f(n)$ is smaller than $n$, but not *polynomially* smaller.

:::caution[Common mistake]
"Polynomially smaller" means smaller by a factor of $n^\varepsilon$. $n \log n$ is larger than $n$, but only by a log factor, which is case 2 with $k = 1$, not case 3.
:::

## Summary

- Loop invariant proofs: initialisation, maintenance, termination.
- Iteration: unroll and sum. $T(n) = T(n - 1) + n$ gives $\Theta(n^2)$; $2T(n - 1) + 1$ gives $\Theta(2^n)$.
- Recursion tree: add each level; shrinking levels → root dominates, growing → leaves dominate, equal → level cost × number of levels.
- Master theorem: compare $f(n)$ with $n^{\log_b a}$. Smaller → $\Theta(n^{\log_b a})$; equal (× $\log^k n$) → multiply by $\log n$; larger (with regularity) → $\Theta(f(n))$.
- It doesn't apply to unequal splits, subtraction recurrences, or gaps such as $n/\log n$.

## Check yourself

<details>
<summary>What is a loop invariant, and why is it useful?</summary>

A property that holds before every iteration of a loop. Proving it holds initially, is maintained by each iteration, and gives the desired result at termination proves the loop correct, in the same way as induction.
</details>

<details>
<summary>What does n^(log_b a) represent in the Master theorem?</summary>

The total work at the leaves of the recursion tree: there are $a^{\log_b n} = n^{\log_b a}$ leaves. The theorem compares this with $f(n)$, the work at the root, to see which part dominates.
</details>

<details>
<summary>Solve T(n) = 2T(√n) + log n.</summary>

Substitute $m = \log_2 n$ and $S(m) = T(2^m)$: $S(m) = 2S(m/2) + m$, so $S(m) = \Theta(m \log m)$. Hence $T(n) = \Theta(\log n \cdot \log \log n)$.
</details>
