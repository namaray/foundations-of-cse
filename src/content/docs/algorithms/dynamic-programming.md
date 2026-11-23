---
title: Dynamic Programming
description: Overlapping subproblems and optimal substructure, memoisation vs tabulation, and worked tables for 0/1 knapsack, LCS, matrix chain multiplication, coin change, edit distance and LIS.
sidebar:
  label: "6. Dynamic programming"
  order: 6
lesson:
  module: Design paradigms
  prerequisites:
    - label: Recurrences
      link: /algorithms/recurrences/
    - label: Divide and conquer
      link: /algorithms/divide-and-conquer/
  outcomes:
    - Recognise overlapping subproblems and optimal substructure
    - Implement DP top-down with memoisation and bottom-up with a table
    - Fill and trace back the tables for 0/1 knapsack and LCS
    - Write recurrences for matrix chain, coin change, edit distance and LIS
  keyIdea: >-
    Dynamic programming solves each subproblem **once** and stores the answer, turning exponential recursion into polynomial time. It needs **overlapping subproblems** and **optimal substructure**. The work is in defining the **state** (what a table cell means) and the **recurrence** (how a cell follows from smaller ones); tracing back through the table recovers the actual solution.
---

**Dynamic programming (DP)** solves a problem by breaking it into subproblems, solving each subproblem **once**, and storing the answer so it is never recomputed.

DP applies when a problem has:

1. **Overlapping subproblems:** the same subproblems come up again and again.
2. **Optimal substructure:** an optimal solution is built from optimal solutions to subproblems.

## 1. Why storing answers matters

Naive recursive Fibonacci recomputes the same values over and over:

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 600 270" role="img" aria-labelledby="fibtree-t"><title id="fibtree-t">The call tree of naive recursive fib(5): fib(3) is computed twice and fib(2) three times.</title><defs><marker id="ah-fibtree" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-fibtree-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-fibtree-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="281.2" y1="39.3" x2="168.8" y2="94.7"/><line class="dg-line" x1="135.1" y1="118.7" x2="89.9" y2="163.3"/><line class="dg-line" x1="65.5" y1="196.7" x2="47" y2="233.3"/><line class="dg-line" x1="84.5" y1="196.7" x2="103" y2="233.3"/><line class="dg-line" x1="164.9" y1="118.7" x2="210.1" y2="163.3"/><line class="dg-line" x1="318.8" y1="39.3" x2="431.2" y2="94.7"/><line class="dg-line" x1="435.1" y1="118.7" x2="389.9" y2="163.3"/><line class="dg-line" x1="464.9" y1="118.7" x2="510.1" y2="163.3"/><circle class="dg-cell-a" cx="37.5" cy="252" r="21"/><text class="dg-t-a" x="37.5" y="252" text-anchor="middle" style="font-size:13px">f(2)</text><circle class="dg-cell" cx="112.5" cy="252" r="21"/><text x="112.5" y="252" text-anchor="middle" style="font-size:13px">f(1)</text><circle class="dg-cell-b" cx="75" cy="178" r="21"/><text class="dg-t-b" x="75" y="178" text-anchor="middle" style="font-size:13px">f(3)</text><circle class="dg-cell-a" cx="225" cy="178" r="21"/><text class="dg-t-a" x="225" y="178" text-anchor="middle" style="font-size:13px">f(2)</text><circle class="dg-cell" cx="150" cy="104" r="21"/><text x="150" y="104" text-anchor="middle" style="font-size:13px">f(4)</text><circle class="dg-cell-a" cx="375" cy="178" r="21"/><text class="dg-t-a" x="375" y="178" text-anchor="middle" style="font-size:13px">f(2)</text><circle class="dg-cell" cx="525" cy="178" r="21"/><text x="525" y="178" text-anchor="middle" style="font-size:13px">f(1)</text><circle class="dg-cell-b" cx="450" cy="104" r="21"/><text class="dg-t-b" x="450" y="104" text-anchor="middle" style="font-size:13px">f(3)</text><circle class="dg-cell" cx="300" cy="30" r="21"/><text x="300" y="30" text-anchor="middle" style="font-size:13px">f(5)</text></svg><ul class="dg-legend"><li><span class="dg-swatch b"></span>f(3): computed twice</li><li><span class="dg-swatch a"></span>f(2): computed three times</li></ul><figcaption>Naive recursion solves the same subproblems again and again: f(3) twice, f(2) three times, and the repetition grows exponentially with n. Dynamic programming computes each f(i) once.</figcaption></figure>

That takes $O(\varphi^n) \approx O(1.618^n)$ time. Storing each value once takes $O(n)$.

## 2. Two ways to implement DP

**Top-down (memoisation):** write the natural recursion, and cache each result the first time it is computed.

```c
long long memo[100];            // initialise to -1

long long fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}
```

**Bottom-up (tabulation):** fill a table in an order where every subproblem is ready before it is needed.

```c
long long fib(int n) {
    long long dp[100];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}
```

| | Memoisation | Tabulation |
|---|---|---|
| Style | Recursive | Iterative |
| Solves | Only the subproblems actually needed | Every subproblem |
| Overhead | Function calls; risk of stack overflow | None |
| Easier to | Write from the recurrence | Optimise for space |

## 3. The DP recipe

1. **Define the state:** what does `dp[i]` (or `dp[i][j]`) mean, in words?
2. **Write the recurrence:** how does a state depend on smaller ones?
3. **Set the base cases.**
4. **Choose the order** to fill the table.
5. **Read off the answer**, and trace back through the table if you need the solution itself, not just its value.

## 4. 0/1 knapsack

**Problem.** Items have weights $w_i$ and values $v_i$. Choose a subset with total weight at most $W$ and maximum value. Each item is taken whole or not at all.

**State.** $K[i][w]$ = the best value using only the first $i$ items with capacity $w$.

$$
K[i][w] = \begin{cases} K[i-1][w] & w_i > w \\ \max\big(K[i-1][w],\; v_i + K[i-1][w - w_i]\big) & \text{otherwise} \end{cases}
$$

The two options are: skip item $i$, or take it and use the remaining capacity for the earlier items.

**Example:** $W = 5$.

| Item | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Weight | 2 | 3 | 4 | 5 |
| Value | 3 | 4 | 5 | 6 |

| $i$ \ $w$ | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| 0 (no items) | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 (w=2, v=3) | 0 | 0 | 3 | 3 | 3 | 3 |
| 2 (w=3, v=4) | 0 | 0 | 3 | 4 | 4 | **7** |
| 3 (w=4, v=5) | 0 | 0 | 3 | 4 | 5 | 7 |
| 4 (w=5, v=6) | 0 | 0 | 3 | 4 | 5 | **7** |

For example, $K[2][5] = \max(K[1][5],\; 4 + K[1][2]) = \max(3, 4 + 3) = 7$.

**Answer: 7.** Tracing back: $K[4][5] = K[3][5] = K[2][5]$, so items 4 and 3 were skipped. $K[2][5] \ne K[1][5]$, so item 2 was taken, leaving capacity 2; $K[1][2] = 3$ comes from item 1. **Items 1 and 2.**

Time and space $O(nW)$. This is **pseudo-polynomial**: polynomial in the *value* of $W$, but exponential in the number of bits needed to write $W$. 0/1 knapsack is NP-hard.

## 5. Longest common subsequence (LCS)

A **subsequence** keeps the order of characters but may skip some. The LCS of two strings is the longest subsequence of both.

**State.** $c[i][j]$ = the length of the LCS of $X[1..i]$ and $Y[1..j]$.

$$
c[i][j] = \begin{cases} 0 & i = 0 \text{ or } j = 0 \\ c[i-1][j-1] + 1 & x_i = y_j \\ \max(c[i-1][j],\; c[i][j-1]) & x_i \ne y_j \end{cases}
$$

**Example:** $X = $ `ABCB`, $Y = $ `BDCAB`.

| | ε | B | D | C | A | B |
|---|---|---|---|---|---|---|
| ε | 0 | 0 | 0 | 0 | 0 | 0 |
| A | 0 | 0 | 0 | 0 | 1 | 1 |
| B | 0 | 1 | 1 | 1 | 1 | 2 |
| C | 0 | 1 | 1 | 2 | 2 | 2 |
| B | 0 | 1 | 1 | 2 | 2 | **3** |

**LCS length 3**, and tracing back diagonal moves on matches gives **`BCB`**. Time and space $O(mn)$.

<figure class="diagram"><svg style="--dg-min:400px" class="dg" viewBox="0 0 400 250" role="img" aria-labelledby="lcs-t"><title id="lcs-t">The LCS table for ABCB and BDCAB with the traceback path; diagonal steps on matching letters spell BCB.</title><defs><marker id="ah-lcs" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-lcs-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-lcs-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><text class="dg-t-strong" x="83" y="24" text-anchor="middle">ε</text><text class="dg-t-strong" x="129" y="24" text-anchor="middle">B</text><text class="dg-t-strong" x="175" y="24" text-anchor="middle">D</text><text class="dg-t-strong" x="221" y="24" text-anchor="middle">C</text><text class="dg-t-strong" x="267" y="24" text-anchor="middle">A</text><text class="dg-t-strong" x="313" y="24" text-anchor="middle">B</text><text class="dg-t-strong" x="42" y="59" text-anchor="middle">ε</text><rect class="dg-cell-dim" x="60" y="40" width="46" height="38" rx="2"/><text x="83" y="59" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell-dim" x="106" y="40" width="46" height="38" rx="2"/><text x="129" y="59" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell-dim" x="152" y="40" width="46" height="38" rx="2"/><text x="175" y="59" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell-dim" x="198" y="40" width="46" height="38" rx="2"/><text x="221" y="59" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell-dim" x="244" y="40" width="46" height="38" rx="2"/><text x="267" y="59" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell-dim" x="290" y="40" width="46" height="38" rx="2"/><text x="313" y="59" text-anchor="middle" style="font-size:14px">0</text><text class="dg-t-strong" x="42" y="97" text-anchor="middle">A</text><rect class="dg-cell-dim" x="60" y="78" width="46" height="38" rx="2"/><text x="83" y="97" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell" x="106" y="78" width="46" height="38" rx="2"/><text x="129" y="97" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell" x="152" y="78" width="46" height="38" rx="2"/><text x="175" y="97" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell" x="198" y="78" width="46" height="38" rx="2"/><text x="221" y="97" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell" x="244" y="78" width="46" height="38" rx="2"/><text x="267" y="97" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell" x="290" y="78" width="46" height="38" rx="2"/><text x="313" y="97" text-anchor="middle" style="font-size:14px">1</text><text class="dg-t-strong" x="42" y="135" text-anchor="middle">B</text><rect class="dg-cell-dim" x="60" y="116" width="46" height="38" rx="2"/><text x="83" y="135" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell-c" x="106" y="116" width="46" height="38" rx="2"/><text class="dg-t-c" x="129" y="135" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell-a" x="152" y="116" width="46" height="38" rx="2"/><text class="dg-t-a" x="175" y="135" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell" x="198" y="116" width="46" height="38" rx="2"/><text x="221" y="135" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell" x="244" y="116" width="46" height="38" rx="2"/><text x="267" y="135" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell" x="290" y="116" width="46" height="38" rx="2"/><text x="313" y="135" text-anchor="middle" style="font-size:14px">2</text><text class="dg-t-strong" x="42" y="173" text-anchor="middle">C</text><rect class="dg-cell-dim" x="60" y="154" width="46" height="38" rx="2"/><text x="83" y="173" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell" x="106" y="154" width="46" height="38" rx="2"/><text x="129" y="173" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell" x="152" y="154" width="46" height="38" rx="2"/><text x="175" y="173" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell-c" x="198" y="154" width="46" height="38" rx="2"/><text class="dg-t-c" x="221" y="173" text-anchor="middle" style="font-size:14px">2</text><rect class="dg-cell-a" x="244" y="154" width="46" height="38" rx="2"/><text class="dg-t-a" x="267" y="173" text-anchor="middle" style="font-size:14px">2</text><rect class="dg-cell" x="290" y="154" width="46" height="38" rx="2"/><text x="313" y="173" text-anchor="middle" style="font-size:14px">2</text><text class="dg-t-strong" x="42" y="211" text-anchor="middle">B</text><rect class="dg-cell-dim" x="60" y="192" width="46" height="38" rx="2"/><text x="83" y="211" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell" x="106" y="192" width="46" height="38" rx="2"/><text x="129" y="211" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell" x="152" y="192" width="46" height="38" rx="2"/><text x="175" y="211" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell" x="198" y="192" width="46" height="38" rx="2"/><text x="221" y="211" text-anchor="middle" style="font-size:14px">2</text><rect class="dg-cell" x="244" y="192" width="46" height="38" rx="2"/><text x="267" y="211" text-anchor="middle" style="font-size:14px">2</text><rect class="dg-cell-c" x="290" y="192" width="46" height="38" rx="2"/><text class="dg-t-c" x="313" y="211" text-anchor="middle" style="font-size:14px">3</text><line class="dg-line-b" x1="298" y1="198" x2="284" y2="186" marker-end="url(#ah-lcs-b)"/><line class="dg-line-b" x1="206" y1="160" x2="192" y2="148" marker-end="url(#ah-lcs-b)"/><line class="dg-line-b" x1="114" y1="122" x2="100" y2="110" marker-end="url(#ah-lcs-b)"/></svg><ul class="dg-legend"><li><span class="dg-swatch c"></span>match: letter kept</li><li><span class="dg-swatch a"></span>traceback path</li></ul><figcaption>Trace back from the bottom-right cell. On a match (highlighted) step diagonally and keep the letter; otherwise move to the larger neighbour above or to the left. Read backwards, the kept letters are B, C, B.</figcaption></figure>

## 6. Matrix chain multiplication

**Problem.** Multiplying a $p \times q$ matrix by a $q \times r$ matrix costs $pqr$ scalar multiplications. Choose where to put the brackets in $A_1 A_2 \cdots A_n$ to minimise the total cost. Matrix $A_i$ has dimensions $p_{i-1} \times p_i$.

**Why it matters.** $A_1 = 10 \times 30$, $A_2 = 30 \times 5$, $A_3 = 5 \times 60$:

- $(A_1 A_2) A_3$: $10 \cdot 30 \cdot 5 + 10 \cdot 5 \cdot 60 = 1500 + 3000 = 4{,}500$
- $A_1 (A_2 A_3)$: $30 \cdot 5 \cdot 60 + 10 \cdot 30 \cdot 60 = 9000 + 18000 = 27{,}000$

**State.** $m[i][j]$ = the minimum cost of computing $A_i \cdots A_j$. Try every split point $k$:

$$
m[i][j] = \min_{i \le k < j} \big(m[i][k] + m[k+1][j] + p_{i-1}\, p_k\, p_j\big), \qquad m[i][i] = 0
$$

Fill the table by increasing chain length. $O(n^3)$ time, $O(n^2)$ space.

## 7. Coin change

**Minimum coins.** $dp[a]$ = the fewest coins that make amount $a$.

$$
dp[a] = 1 + \min_{c \le a} dp[a - c], \qquad dp[0] = 0
$$

**Example:** coins {1, 3, 4}, amount 6.

| $a$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| $dp[a]$ | 0 | 1 | 2 | 1 | 1 | 2 | **2** |

$dp[6] = 1 + \min(dp[5], dp[3], dp[2]) = 1 + 1 = 2$, using 3 + 3. The [greedy rule](/algorithms/greedy/#7-when-greedy-fails) gives 3 coins here.

**Number of ways** to make the amount: $ways[a] \mathrel{+}= ways[a - c]$, looping over coins in the outer loop so each combination is counted once.

## 8. Edit distance

The **edit (Levenshtein) distance** is the fewest insertions, deletions and substitutions that turn string $X$ into $Y$.

$$
d[i][j] = \begin{cases} d[i-1][j-1] & x_i = y_j \\ 1 + \min\big(d[i-1][j],\; d[i][j-1],\; d[i-1][j-1]\big) & \text{otherwise} \end{cases}
$$

with $d[i][0] = i$ and $d[0][j] = j$. The three options are delete, insert and substitute. For example, *kitten* → *sitting* has distance **3**. $O(mn)$ time.

## 9. Longest increasing subsequence (LIS)

$L[i]$ = the length of the longest increasing subsequence ending at index $i$:

$$
L[i] = 1 + \max\{L[j] : j < i,\ a[j] < a[i]\}
$$

That is $O(n^2)$. A cleverer method keeps, for each length, the smallest possible tail value and uses binary search: $O(n \log n)$.

For `[10, 9, 2, 5, 3, 7, 101, 18]` the LIS has length **4**, for example `2, 3, 7, 18`.

## 10. Classic DP problems at a glance

| Problem | State | Time |
|---|---|---|
| Fibonacci | $dp[i]$ | $O(n)$ |
| 0/1 knapsack | $K[i][w]$ | $O(nW)$ |
| LCS | $c[i][j]$ | $O(mn)$ |
| Edit distance | $d[i][j]$ | $O(mn)$ |
| Matrix chain | $m[i][j]$ over splits | $O(n^3)$ |
| Coin change | $dp[a]$ | $O(n \cdot \text{amount})$ |
| LIS | $L[i]$ | $O(n^2)$ or $O(n \log n)$ |
| Floyd–Warshall | $d_k[i][j]$ | $O(V^3)$ |
| Bellman–Ford | $d_k[v]$ | $O(VE)$ |
| Optimal BST | $e[i][j]$ over roots | $O(n^3)$ |

## Summary

- DP = recursion + memory; applies with overlapping subproblems and optimal substructure.
- Top-down memoises the natural recursion; bottom-up fills a table in dependency order.
- Recipe: define the state, write the recurrence, set base cases, choose the fill order, trace back.
- 0/1 knapsack $O(nW)$ (pseudo-polynomial); LCS and edit distance $O(mn)$; matrix chain $O(n^3)$.
- Coin change: $dp[a] = 1 + \min_c dp[a - c]$; LIS $O(n^2)$, or $O(n \log n)$ with binary search.

## Check yourself

<details>
<summary>What are overlapping subproblems? Give an example.</summary>

The same subproblem is needed many times while solving the bigger problem. In recursive Fibonacci, `fib(3)` is computed repeatedly when computing `fib(5)`. DP computes it once and stores it.
</details>

<details>
<summary>Memoisation vs tabulation: which is better?</summary>

Neither always. Memoisation is easier to write from a recurrence and skips subproblems that are never needed. Tabulation avoids recursion overhead and stack overflow, and makes space optimisations easier, such as keeping only the previous row of a table.
</details>

<details>
<summary>Why is the O(nW) knapsack algorithm not polynomial?</summary>

Input size is measured in bits. $W$ takes only about $\log_2 W$ bits to write, so $O(nW)$ is exponential in the input size. Such algorithms are called pseudo-polynomial.
</details>

<details>
<summary>How do you reduce the space of the LCS or knapsack table?</summary>

Each row depends only on the previous row, so keep two rows (or one, filled in the right direction). Space drops from $O(mn)$ to $O(\min(m, n))$, but you can no longer trace back the solution without extra work.
</details>
