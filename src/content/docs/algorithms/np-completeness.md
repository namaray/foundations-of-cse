---
title: NP-Completeness & Approximation
description: Decision problems, the classes P, NP, NP-hard and NP-complete, polynomial-time reductions, the Cook–Levin theorem, classic NP-complete problems, how to prove NP-completeness, and approximation algorithms.
sidebar:
  order: 13
---

Some problems have fast algorithms; for others, nobody has found one despite decades of effort. NP-completeness theory explains which problems are probably hard, and gives a way to prove that a new problem is at least as hard as the famous ones.

## Decision problems

The theory is stated for **decision problems**, whose answer is *yes* or *no*. Optimisation problems have a matching decision version:

- Optimisation: *what is the shortest tour through these cities?*
- Decision: *is there a tour of length at most $k$?*

If the decision version is hard, the optimisation version is at least as hard.

## The complexity classes

| Class | Definition | Examples |
|---|---|---|
| **P** | Can be **solved** in polynomial time, $O(n^k)$ | Sorting, shortest paths, MST, maximum flow, 2-SAT |
| **NP** | A proposed *yes* answer (a **certificate**) can be **verified** in polynomial time | SAT, Hamiltonian cycle, subset sum, and everything in P |
| **NP-hard** | Every problem in NP reduces to it in polynomial time. It need not be in NP itself | TSP optimisation, the halting problem |
| **NP-complete** | In NP **and** NP-hard: the hardest problems in NP | SAT, 3-SAT, clique, vertex cover, Hamiltonian cycle, subset sum |

NP stands for **nondeterministic polynomial** time, not "non-polynomial".

**Certificate example.** For Hamiltonian cycle, the certificate is the cycle itself: checking that it visits every vertex once and uses real edges takes polynomial time, even though *finding* one seems to need exponential search.

How the classes relate, assuming $P \ne NP$:

- $P \subseteq NP$.
- **NP-complete** $= NP \cap$ **NP-hard**: the part of NP that is as hard as anything in NP.
- P and the NP-complete problems are separate regions inside NP.
- NP-hard extends **beyond** NP, to problems whose answers cannot even be checked quickly, such as the halting problem.

## P vs NP

Clearly $P \subseteq NP$: if you can solve a problem quickly, you can verify an answer by solving it. Whether $P = NP$ is the most famous open problem in computer science, with a million-dollar Clay Millennium Prize.

If **any** NP-complete problem were solved in polynomial time, then **every** problem in NP would be, and $P = NP$. Most researchers believe $P \ne NP$.

## Polynomial-time reductions

Problem $A$ **reduces** to problem $B$, written $A \le_p B$, if there is a polynomial-time transformation $f$ that turns any instance $x$ of $A$ into an instance $f(x)$ of $B$ with the **same answer**.

Then $B$ is at least as hard as $A$:

- If $B$ is easy (in P), then $A$ is easy: transform, then solve $B$.
- If $A$ is hard (NP-hard), then $B$ is hard.

:::caution[Direction matters]
To prove a **new** problem $X$ is hard, reduce a **known** NP-complete problem **to** $X$. Reducing $X$ to a known hard problem proves nothing about $X$'s hardness.
:::

## Cook–Levin theorem

**SAT is NP-complete.** SAT asks whether a Boolean formula has an assignment of true/false values that makes it true. Cook and Levin proved, directly from the definition of NP, that every problem in NP reduces to SAT. It was the first problem shown NP-complete; every later proof builds on it through chains of reductions.

## Classic NP-complete problems

```text
SAT → 3-SAT ─┬─→ CLIQUE → VERTEX COVER → SET COVER
             ├─→ HAMILTONIAN CYCLE → TSP (decision)
             ├─→ SUBSET SUM → 0/1 KNAPSACK (decision)
             └─→ 3-COLOURING
```

| Problem | Question |
|---|---|
| 3-SAT | Is a formula in CNF with exactly 3 literals per clause satisfiable? |
| Clique | Does the graph contain $k$ vertices that are all pairwise adjacent? |
| Independent set | Are there $k$ vertices with no edges between them? |
| Vertex cover | Are there $k$ vertices that touch every edge? |
| Hamiltonian cycle | Is there a cycle visiting every vertex exactly once? |
| TSP (decision) | Is there a tour of total cost at most $k$? |
| Subset sum | Does some subset add up exactly to a target $t$? |
| Graph 3-colouring | Can the vertices be coloured with 3 colours, adjacent vertices differing? |
| Set cover | Can $k$ of the given sets cover every element? |

Note how close easy and hard problems can be: **2-SAT** is in P but 3-SAT is NP-complete; **Euler circuit** (every *edge* once) is in P but Hamiltonian cycle (every *vertex* once) is NP-complete; **shortest path** is in P but longest simple path is NP-hard.

## Proving a problem NP-complete

To show problem $X$ is NP-complete:

1. **Show $X \in NP$.** Describe a certificate and a polynomial-time verifier.
2. **Choose a known NP-complete problem $Y$.**
3. **Construct a reduction $Y \le_p X$:** a polynomial-time transformation from instances of $Y$ to instances of $X$.
4. **Prove both directions:** $y$ is a *yes* instance of $Y$ **if and only if** $f(y)$ is a *yes* instance of $X$.

**Example: Clique ≤ₚ Vertex cover.** Given a graph $G$ and $k$, build the **complement** $\bar{G}$ (edges exactly where $G$ has none). $G$ has a clique of size $k$ if and only if $\bar{G}$ has a vertex cover of size $|V| - k$. The vertices outside the cover form an independent set in $\bar{G}$, which is a clique in $G$.

## Coping with NP-hard problems

When a problem is NP-hard, practical options are:

- **Exact but exponential:** [backtracking or branch and bound](/algorithms/backtracking/), or DP when numbers are small (pseudo-polynomial algorithms such as knapsack in $O(nW)$).
- **Special cases:** many problems are easy on trees, bipartite graphs or planar graphs.
- **Approximation algorithms:** fast, with a proven guarantee on how far from optimal the answer can be.
- **Heuristics:** local search, simulated annealing, genetic algorithms. Often good in practice, but with no guarantee.

## Approximation algorithms

An algorithm has **approximation ratio** $\rho$ if its answer is always within a factor $\rho$ of the optimum: for minimisation, $\text{ALG} \le \rho \cdot \text{OPT}$.

### Vertex cover: a 2-approximation

```text
C = ∅
while some edge (u, v) is not covered:
    add both u and v to C
    remove every edge touching u or v
return C
```

The chosen edges share no endpoints (they form a matching). Any vertex cover must include at least one endpoint of each of them, so $\text{OPT} \ge$ (number of chosen edges), while $|C| = 2 \times$ (number of chosen edges). Hence $|C| \le 2 \cdot \text{OPT}$.

### Metric TSP: a 2-approximation

When distances obey the triangle inequality:

1. Build a [minimum spanning tree](/algorithms/minimum-spanning-trees/).
2. Walk around the tree (a preorder traversal), visiting cities in the order first seen, and return to the start.

Removing one edge from the optimal tour gives a spanning tree, so $\text{MST} \le \text{OPT}$. The walk costs at most $2 \cdot \text{MST}$, and shortcutting repeated cities never adds cost (by the triangle inequality). So the tour costs at most $2 \cdot \text{OPT}$. **Christofides' algorithm** improves this to 1.5.

Without the triangle inequality, TSP cannot be approximated within **any** constant factor unless $P = NP$.

### Others

- **Set cover:** repeatedly pick the set covering the most uncovered elements; ratio $O(\ln n)$.
- **0/1 knapsack:** has a *fully polynomial-time approximation scheme* (FPTAS), getting within $(1 + \varepsilon)$ of optimal for any $\varepsilon > 0$.

## Viva questions

<details>
<summary>What is the difference between NP-hard and NP-complete?</summary>

Both are at least as hard as every problem in NP. NP-complete problems must also be in NP (yes-answers can be verified in polynomial time). NP-hard problems need not be: the halting problem is NP-hard but not in NP, since it is not even decidable.
</details>

<details>
<summary>Does NP mean "not polynomial"?</summary>

No. It means **nondeterministic polynomial** time: problems whose solutions can be verified in polynomial time. Every problem in P is also in NP.
</details>

<details>
<summary>If someone found a polynomial algorithm for 3-SAT, what would follow?</summary>

$P = NP$. 3-SAT is NP-complete, so every problem in NP reduces to it in polynomial time, and all of them could then be solved in polynomial time.
</details>

<details>
<summary>To prove a new problem X is NP-hard, which way do you reduce?</summary>

From a known NP-complete problem **to** X. That shows X is at least as hard as the known problem.
</details>
