---
title: Uninformed Search
description: Formulating problems as search, state spaces and search trees, tree vs graph search, and the uninformed strategies - BFS, uniform-cost, DFS, depth-limited, iterative deepening and bidirectional search - compared on completeness, optimality, time and space.
sidebar:
  label: "2. Uninformed search"
  order: 2
lesson:
  module: Search
  prerequisites:
    - label: Intelligent agents
      link: /artificial-intelligence/intelligent-agents/
  outcomes:
    - Formulate a problem with states, actions, a transition model, a goal test and path costs
    - Run BFS, DFS, uniform-cost search and iterative deepening by hand
    - Compare the strategies on completeness, optimality, time and space
  keyIdea: >-
    Many AI problems become **search** through a space of states. **Uninformed** strategies know nothing about where the goal is and differ only in which node they expand next: **BFS** (shallowest first), **uniform-cost** (cheapest first), **DFS** (deepest first) and **iterative deepening**, which combines DFS's small memory with BFS's completeness.
---

## 1. Formulating a search problem

| Component | Meaning | Example: route finding |
|---|---|---|
| **Initial state** | Where the agent starts | In Dhaka |
| **Actions** | What it can do in each state | Drive to a neighbouring city |
| **Transition model** | The result of each action | Driving to Cumilla puts you in Cumilla |
| **Goal test** | Is this a goal state? | Are we in Chattogram? |
| **Path cost** | The cost of a sequence of actions | Total distance |

A **solution** is a sequence of actions from the initial state to a goal; an **optimal** solution has the lowest path cost.

**Classic examples:** the 8-puzzle (states are tile arrangements; actions slide the blank), the 8-queens problem, missionaries and cannibals, and route finding.

## 2. Search trees and graph search

Search algorithms build a **search tree**: the root is the initial state, and expanding a node generates its children (successors). The **frontier** (or fringe, open list) holds nodes generated but not yet expanded. **The strategy is simply the order in which frontier nodes are expanded.**

- **Tree search** may revisit the same state many times along different paths, and can loop forever.
- **Graph search** keeps an **explored (closed) set** of states already expanded and never expands them again.

Measures, using $b$ = branching factor, $d$ = depth of the shallowest goal, $m$ = maximum depth:

- **Complete:** is it guaranteed to find a solution if one exists?
- **Optimal:** does it find the lowest-cost solution?
- **Time** and **space** complexity.

## 3. Breadth-first search (BFS)

Expand the **shallowest** node first; the frontier is a **FIFO queue**.

- Complete (if $b$ is finite).
- Optimal when every step costs the same.
- Time and space $O(b^d)$. **Memory is the problem**: with $b = 10$ and $d = 10$, storing $10^{10}$ nodes is impractical.

## 4. Uniform-cost search (UCS)

Expand the node with the **lowest path cost** $g(n)$; the frontier is a **priority queue**. This is [Dijkstra's algorithm](/algorithms/shortest-paths/#dijkstras-algorithm) stopped at the goal.

- Complete and **optimal** for any positive step costs.
- The goal test must be applied when a node is **expanded**, not when it is generated, or a cheaper path found later would be missed.
- Time and space $O(b^{1 + \lfloor C^*/\varepsilon \rfloor})$, where $C^*$ is the optimal cost and $\varepsilon$ the smallest step cost.

## 5. Depth-first search (DFS)

Expand the **deepest** node first; the frontier is a **stack** (LIFO).

- **Not complete** in infinite state spaces or with loops (tree search); complete in finite spaces with graph search.
- **Not optimal**: it returns the first solution found, which may be long.
- Time $O(b^m)$, but space only **$O(bm)$**: it keeps just the current path and its siblings.

**Depth-limited search (DLS)** stops DFS at a depth limit $l$. It always terminates, but misses goals deeper than $l$.

## 6. Iterative deepening search (IDS)

Run depth-limited search with limits $0, 1, 2, \dots$ until a goal is found.

- Complete and optimal (for equal step costs), like BFS.
- Space $O(bd)$, like DFS.
- Time $O(b^d)$. Repeating the shallow levels costs surprisingly little, because most nodes are at the deepest level: with $b = 10$, $d = 5$, IDS generates about 123,450 nodes against BFS's 111,110, an overhead of only about 11%.

**IDS is the preferred uninformed method when the search space is large and the solution depth is unknown.**

## 7. Bidirectional search

Search **forward** from the start and **backward** from the goal at the same time, stopping when the two frontiers meet. Time and space $O(b^{d/2})$, a huge saving, but it needs a single, known goal and actions that can be reversed.

## 8. Comparison

| | BFS | Uniform-cost | DFS | Depth-limited | Iterative deepening | Bidirectional |
|---|---|---|---|---|---|---|
| Complete? | Yes* | Yes* | No | No (if $l < d$) | Yes* | Yes* |
| Optimal? | Yes (equal costs) | **Yes** | No | No | Yes (equal costs) | Yes (equal costs, BFS both ways) |
| Time | $O(b^d)$ | $O(b^{1 + C^*/\varepsilon})$ | $O(b^m)$ | $O(b^l)$ | $O(b^d)$ | $O(b^{d/2})$ |
| Space | $O(b^d)$ | $O(b^{1 + C^*/\varepsilon})$ | $O(bm)$ | $O(bl)$ | $O(bd)$ | $O(b^{d/2})$ |

\*If $b$ is finite (and, for UCS, step costs are at least some $\varepsilon > 0$).

## 9. Worked example

Graph (undirected), with edge costs: S–A 1, S–B 5, A–C 2, B–G 2, C–G 6, A–B 3. Start S, goal G. Neighbours are taken in alphabetical order.

| Strategy | Order of expansion | Path found | Cost |
|---|---|---|---|
| BFS | S, A, B (goal G found as a child of B) | S → B → G | 7 |
| DFS | S, A, B (G found as a child of B, via S → A → B) | S → A → B → G | 6 |
| Uniform-cost | S (0), A (1), C (3), B (4, via A), G (6) | S → A → B → G | **6** (optimal) |

BFS finds the path with the fewest edges, not the cheapest; UCS finds the cheapest; DFS's answer here happens to be optimal, but only by luck.

## Summary

- A search problem has an initial state, actions, a transition model, a goal test and path costs.
- Strategies differ only in the order of expansion: BFS uses a queue, DFS a stack, UCS a priority queue on $g(n)$.
- BFS is complete and optimal for equal costs but needs $O(b^d)$ memory; DFS needs only $O(bm)$ but is neither complete nor optimal.
- UCS is optimal for any positive costs; test for the goal on expansion.
- Iterative deepening combines BFS's guarantees with DFS's memory use.

## Check yourself

<details>
<summary>Why is BFS rarely practical for deep problems?</summary>

Its memory grows as $O(b^d)$: it must store the whole frontier, which becomes enormous long before time runs out.
</details>

<details>
<summary>Why does uniform-cost search apply the goal test on expansion rather than generation?</summary>

The first path generated to the goal may not be the cheapest. Waiting until the goal node is expanded (has the lowest cost on the frontier) guarantees no cheaper path remains.
</details>

<details>
<summary>Doesn't iterative deepening waste a lot of time repeating work?</summary>

Not much. In a tree most nodes are at the deepest level, so re-expanding the shallower levels adds only a small fraction (about $1/(b-1)$) to the total.
</details>
