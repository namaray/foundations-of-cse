---
title: Analysing Algorithms & Recurrences
description: Loop invariants and correctness, and solving recurrences with the substitution method, recursion trees and the Master theorem, with many worked examples.
sidebar:
  label: "1. Recurrences"
  order: 1
lesson:
  module: Foundations
---

Asymptotic notation (Big-O, Ω, Θ) is covered in [Data Structures: Complexity Analysis](/data-structures/complexity-analysis/). This page covers the two other analysis skills every algorithms exam tests: **proving an algorithm correct** and **solving recurrences**.

## Correctness with loop invariants

A **loop invariant** is a statement that is true before every iteration of a loop. To prove an algorithm correct with one, show three things:

1. **Initialisation:** it is true before the first iteration.
2. **Maintenance:** if it is true before an iteration, it is still true before the next.
3. **Termination:** when the loop ends, the invariant gives you the result you wanted.

**Example: insertion sort.** Invariant: *before the iteration for index $j$, the subarray `A[0..j-1]` holds the original first $j$ elements in sorted order.*

- Initialisation: for $j = 1$, `A[0..0]` is a single element, which is sorted.
- Maintenance: the iteration shifts larger elements right and inserts `A[j]` in its place, so `A[0..j]` is sorted.
- Termination: the loop ends with $j = n$, so `A[0..n-1]`, the whole array, is sorted.

## Recurrences

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

## 1. Iteration (unrolling)

Expand the recurrence until a pattern appears, then sum it.

**Example:** $T(n) = T(n-1) + n$, $T(1) = 1$.

$$
T(n) = n + (n-1) + (n-2) + \dots + 1 = \frac{n(n+1)}{2} = \Theta(n^2)
$$

**Example:** $T(n) = 2T(n-1) + 1$, $T(1) = 1$ (Tower of Hanoi).

$$
T(n) = 2^{n-1} + 2^{n-2} + \dots + 2 + 1 = 2^n - 1 = \Theta(2^n)
$$

## 2. Recursion tree

Draw the tree of recursive calls, write the non-recursive cost at each node, add each level, then add the levels.

**Example:** $T(n) = 2T(n/2) + cn$.

```text
Level 0:             cn                          → cn
Level 1:       cn/2      cn/2                    → cn
Level 2:   cn/4  cn/4  cn/4  cn/4                → cn
  ...
Level log n:  c  c  c  ...  c   (n leaves)       → cn
```

Each of the $\log_2 n + 1$ levels costs $cn$, so $T(n) = \Theta(n \log n)$.

**Example:** $T(n) = 3T(n/4) + cn^2$. Level $i$ has $3^i$ nodes, each costing $c(n/4^i)^2$, so the level costs $(3/16)^i cn^2$. That is a decreasing geometric series dominated by the root:

$$
T(n) \le cn^2 \sum_{i=0}^{\infty} \left(\frac{3}{16}\right)^i = \frac{16}{13}cn^2 = \Theta(n^2)
$$

:::tip[Reading a recursion tree]
If the level costs **shrink** geometrically, the root dominates. If they **grow**, the leaves dominate. If they are **equal**, multiply one level's cost by the number of levels.
:::

## 3. Substitution

Guess the answer, then prove it by induction.

**Example:** show $T(n) = 2T(\lfloor n/2 \rfloor) + n$ is $O(n \log n)$.

Guess $T(n) \le cn \log_2 n$. Assume it holds for $\lfloor n/2 \rfloor$. Then

$$
T(n) \le 2c\frac{n}{2}\log_2\frac{n}{2} + n = cn\log_2 n - cn + n \le cn \log_2 n
$$

whenever $c \ge 1$. Base cases are handled by choosing $c$ large enough.

## The Master theorem

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

## Viva questions

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
