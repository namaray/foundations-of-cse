---
title: Informed and Local Search
description: Heuristic functions, greedy best-first search, A* with a worked example, admissible and consistent heuristics, designing heuristics by relaxation, and local search - hill climbing, simulated annealing and genetic algorithms.
sidebar:
  label: "3. Informed and local search"
  order: 3
lesson:
  module: Search
  prerequisites:
    - label: Uninformed search
      link: /artificial-intelligence/uninformed-search/
  outcomes:
    - Run greedy best-first search and A* by hand
    - Explain why A* is optimal with an admissible heuristic
    - Check whether a heuristic is admissible or consistent, and design one by relaxation
    - Describe hill climbing, simulated annealing and genetic algorithms and their weaknesses
  keyIdea: >-
    A **heuristic** $h(n)$ estimates the cost from $n$ to the goal. **A\*** expands the node with the lowest $f(n) = g(n) + h(n)$, the estimated total cost through $n$, and is **optimal** whenever $h$ never overestimates. **Local search** drops paths altogether and improves a single state step by step, which suits huge optimisation problems.
---

## 1. Heuristics

A **heuristic function** $h(n)$ estimates the cost of the cheapest path from node $n$ to a goal, using problem knowledge. $h(\text{goal}) = 0$.

**Examples:**

- Route finding: **straight-line distance** to the destination.
- 8-puzzle: $h_1$ = number of **misplaced tiles**; $h_2$ = sum of the **Manhattan distances** of the tiles from their goal positions.

## 2. Greedy best-first search

Expand the node that **looks closest to the goal**: the lowest $h(n)$.

- Often fast, but **not optimal** and, as tree search, **not complete** (it can loop).
- It ignores how much the path has already cost.

## 3. A* search

Expand the node with the lowest

$$
f(n) = g(n) + h(n)
$$

where $g(n)$ is the cost so far and $h(n)$ the estimated cost to go: the estimated cost of the **cheapest solution through $n$**.

### Worked example

| Edge | S–A | S–B | A–B | A–C | B–C | B–G | C–G |
|---|---|---|---|---|---|---|---|
| Cost | 1 | 4 | 2 | 5 | 1 | 6 | 3 |

| Node | S | A | B | C | G |
|---|---|---|---|---|---|
| $h$ | 5 | 4 | 2 | 1 | 0 |

**A\*** (each frontier entry written as node: $g + h = f$):

| Step | Expand | Frontier after expansion |
|---|---|---|
| 1 | S | A: 1 + 4 = **5**, B: 4 + 2 = 6 |
| 2 | A (f = 5) | B: 3 + 2 = **5** (better path, via A), C: 6 + 1 = 7 |
| 3 | B (f = 5) | C: 4 + 1 = **5** (better, via B), G: 9 + 0 = 9 |
| 4 | C (f = 5) | G: 7 + 0 = **7** (better, via C) |
| 5 | G (f = 7) | goal reached |

**Path S → A → B → C → G, cost 7**, which is optimal.

**Greedy best-first** on the same graph: from S, B has the lower $h$ (2); from B, G has $h = 0$. It returns **S → B → G with cost 10**: fast, but not optimal.

### Admissibility and consistency

- **Admissible:** $h(n) \le h^*(n)$ for every $n$, where $h^*$ is the true cost. The heuristic **never overestimates**.
- **Consistent (monotone):** $h(n) \le c(n, n') + h(n')$ for every successor $n'$: the triangle inequality. Consistent implies admissible.

| A* version | Optimal if $h$ is |
|---|---|
| Tree search | admissible |
| Graph search (with an explored set) | consistent |

**Why admissibility gives optimality:** if a suboptimal goal $G_2$ is on the frontier, some node $n$ on the optimal path is also there with $f(n) = g(n) + h(n) \le C^*$ (since $h$ underestimates), while $f(G_2) = g(G_2) > C^*$. So $n$ is always expanded before $G_2$.

A* is **optimally efficient**: no other optimal algorithm using the same heuristic is guaranteed to expand fewer nodes. Its weakness is **memory**: it keeps every generated node. **IDA\*** (iterative deepening on $f$) and **SMA\*** reduce memory use.

### Designing heuristics

- **Relaxed problems:** remove constraints from the problem; the exact cost of the relaxed problem is an admissible heuristic. If 8-puzzle tiles could move to **any** square, the cost is $h_1$ (misplaced tiles); if they could move to any **adjacent** square, even an occupied one, it is $h_2$ (Manhattan distance).
- **Dominance:** if $h_2(n) \ge h_1(n)$ for all $n$ and both are admissible, $h_2$ **dominates** $h_1$ and A* with $h_2$ expands no more nodes. Manhattan distance dominates misplaced tiles.
- The maximum of several admissible heuristics is also admissible.

## 4. Local search

For many problems (scheduling, 8-queens, circuit layout) the **path doesn't matter**, only the final state. Local search keeps **one current state** and moves to neighbouring states, using almost no memory.

### Hill climbing

Repeatedly move to the **best neighbour**; stop when no neighbour is better.

It gets stuck at:

- **Local maxima:** better than every neighbour but not the best overall.
- **Plateaus:** flat regions where neighbours are equally good.
- **Ridges:** narrow uphill paths that single moves can't follow.

Remedies: **random restarts** (run many times from random states), **sideways moves** (allowed a limited number of times), **stochastic** hill climbing (choose randomly among uphill moves).

### Simulated annealing

Allow occasional **downhill** moves to escape local maxima. A worse move with change $\Delta E < 0$ is accepted with probability

$$
P = e^{\Delta E / T}
$$

where the **temperature** $T$ starts high (many bad moves accepted) and slowly decreases (fewer accepted). With a slow enough cooling schedule it finds the global optimum with probability approaching 1.

### Genetic algorithms

Keep a **population** of candidate solutions, encoded as strings:

1. **Fitness:** score each individual.
2. **Selection:** pick parents, with fitter individuals more likely to be chosen.
3. **Crossover:** combine two parents by swapping parts at a crossover point.
4. **Mutation:** randomly change a small part, to keep diversity.
5. Repeat for many generations.

Useful when the search space is huge and poorly understood, but results depend heavily on the encoding and parameters.

## Summary

- A heuristic $h(n)$ estimates the cost to the goal; greedy best-first expands the lowest $h$ and is not optimal.
- A* expands the lowest $f = g + h$; it is optimal with an admissible heuristic (tree search) or a consistent one (graph search).
- Admissible heuristics come from relaxed problems; a dominating heuristic expands fewer nodes.
- Hill climbing gets stuck at local maxima, plateaus and ridges; simulated annealing accepts some bad moves; genetic algorithms evolve a population.

## Check yourself

<details>
<summary>What happens to A* if the heuristic overestimates?</summary>

It can return a suboptimal solution, because a good path may look too expensive and be left on the frontier while a worse goal is expanded first.
</details>

<details>
<summary>What is A* when h(n) = 0 for every node?</summary>

Uniform-cost search (Dijkstra's algorithm): $f(n) = g(n)$. It is still optimal, but expands more nodes.
</details>

<details>
<summary>Why can hill climbing fail to solve the 8-queens problem?</summary>

It can reach a local minimum of conflicts where every single-queen move makes things no better, even though a solution exists elsewhere. Random restarts largely fix this.
</details>
