---
title: Maximum Flow
description: Flow networks, residual graphs and augmenting paths, the Ford–Fulkerson and Edmonds–Karp algorithms, the max-flow min-cut theorem, and bipartite matching.
sidebar:
  label: "10. Maximum flow"
  order: 10
lesson:
  module: Graph algorithms
---

A **flow network** is a directed graph where each edge $(u, v)$ has a **capacity** $c(u, v) \ge 0$, with a **source** $s$ and a **sink** $t$. Think of water pipes, road traffic or network bandwidth. The **maximum flow** problem asks how much can be sent from $s$ to $t$.

A **flow** $f$ must satisfy:

1. **Capacity constraint:** $0 \le f(u, v) \le c(u, v)$ on every edge.
2. **Flow conservation:** at every vertex except $s$ and $t$, flow in equals flow out.

The **value** of the flow is the total leaving $s$ (equivalently, the total entering $t$).

## Residual graph and augmenting paths

The **residual graph** $G_f$ shows how much more flow each edge can take:

- A **forward** edge $u \to v$ with residual capacity $c(u, v) - f(u, v)$: room to send more.
- A **backward** edge $v \to u$ with residual capacity $f(u, v)$: the option to *undo* flow already sent.

An **augmenting path** is any path from $s$ to $t$ in the residual graph. Its **bottleneck** is the smallest residual capacity along it, and the flow can be increased by that amount.

Backward edges are essential: they let the algorithm reroute flow it committed to earlier.

## Ford–Fulkerson method

```text
FORD-FULKERSON(G, s, t):
    f = 0 on every edge
    while there is an augmenting path p in G_f:
        b = bottleneck(p)
        push b units along p (add on forward edges, subtract on backward edges)
    return f
```

With integer capacities each augmentation adds at least 1, so it runs in $O(E \cdot |f^*|)$, where $|f^*|$ is the maximum flow value. That can be slow if capacities are huge.

**Edmonds–Karp** always picks the **shortest** augmenting path (fewest edges), found by BFS. This bounds the number of augmentations, giving $O(VE^2)$ regardless of the capacities.

## Worked example

| Edge | s→a | s→b | a→b | a→t | b→t |
|---|---|---|---|---|---|
| Capacity | 10 | 5 | 15 | 5 | 10 |

| Augmenting path | Bottleneck | Total flow |
|---|---|---|
| s → a → t | min(10, 5) = 5 | 5 |
| s → b → t | min(5, 10) = 5 | 10 |
| s → a → b → t | min(10 − 5, 15, 10 − 5) = 5 | 15 |

Now a→t and b→t are both full, so no augmenting path remains. **Maximum flow = 15.**

## Max-flow min-cut theorem

An **$s$–$t$ cut** $(S, T)$ splits the vertices with $s \in S$ and $t \in T$. Its **capacity** is the total capacity of edges going **from $S$ to $T$** (edges from $T$ back to $S$ do not count).

**Theorem.** The maximum flow value equals the minimum cut capacity.

In the example, the cut $S = \{s, a, b\}$, $T = \{t\}$ has capacity $5 + 10 = 15$, matching the maximum flow. The cut $S = \{s\}$ also has capacity $10 + 5 = 15$. When Ford–Fulkerson stops, the vertices still reachable from $s$ in the residual graph form a minimum cut.

The theorem also proves Ford–Fulkerson correct: it stops exactly when no augmenting path exists, and at that point the flow equals the capacity of a cut, so it cannot be increased further.

## Applications

**Maximum bipartite matching.** Given two groups (say applicants and jobs) and the allowed pairings, find the largest set of pairs with no one used twice. Add a source joined to every left vertex and a sink joined from every right vertex, give every edge capacity 1, and find the maximum flow. Its value is the size of the maximum matching.

**Other uses:** network reliability (edge-disjoint paths), project selection, image segmentation, airline scheduling, and baseball elimination.

## Viva questions

<details>
<summary>Why does the residual graph need backward edges?</summary>

They allow flow sent earlier to be cancelled and rerouted. Without them, a poor early choice of path could block the maximum flow permanently.
</details>

<details>
<summary>State the max-flow min-cut theorem.</summary>

In any flow network, the value of a maximum $s$–$t$ flow equals the capacity of a minimum $s$–$t$ cut.
</details>

<details>
<summary>What is the advantage of Edmonds–Karp over basic Ford–Fulkerson?</summary>

Choosing shortest augmenting paths with BFS bounds the running time at $O(VE^2)$, independent of the capacity values. Basic Ford–Fulkerson with arbitrary path choices can take time proportional to the flow value, and may not terminate with irrational capacities.
</details>
