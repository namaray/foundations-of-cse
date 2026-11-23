---
title: Maximum Flow
description: Flow networks, residual graphs and augmenting paths, the Ford–Fulkerson and Edmonds–Karp algorithms, the max-flow min-cut theorem, and bipartite matching.
sidebar:
  label: "10. Maximum flow"
  order: 10
lesson:
  module: Graph algorithms
  prerequisites:
    - label: Graph traversal
      link: /algorithms/graph-traversal/
  outcomes:
    - Define flow networks, residual graphs and augmenting paths
    - Trace the Ford–Fulkerson method on a small network
    - State the max-flow min-cut theorem and find a minimum cut
    - Model bipartite matching as a flow problem
  keyIdea: >-
    A flow network carries flow from a source $s$ to a sink $t$ without exceeding edge capacities. **Ford–Fulkerson** keeps finding an **augmenting path** in the residual graph and pushing its bottleneck amount. When no path remains, the flow is maximum, and it equals the capacity of the **minimum cut** separating $s$ from $t$.
---

A **flow network** is a directed graph where each edge $(u, v)$ has a **capacity** $c(u, v) \ge 0$, with a **source** $s$ and a **sink** $t$. Think of water pipes, road traffic or network bandwidth. The **maximum flow** problem asks how much can be sent from $s$ to $t$.

A **flow** $f$ must satisfy:

1. **Capacity constraint:** $0 \le f(u, v) \le c(u, v)$ on every edge.
2. **Flow conservation:** at every vertex except $s$ and $t$, flow in equals flow out.

The **value** of the flow is the total leaving $s$ (equivalently, the total entering $t$).

## 1. Residual graph and augmenting paths

The **residual graph** $G_f$ shows how much more flow each edge can take:

- A **forward** edge $u \to v$ with residual capacity $c(u, v) - f(u, v)$: room to send more.
- A **backward** edge $v \to u$ with residual capacity $f(u, v)$: the option to *undo* flow already sent.

An **augmenting path** is any path from $s$ to $t$ in the residual graph. Its **bottleneck** is the smallest residual capacity along it, and the flow can be increased by that amount.

Backward edges are essential: they let the algorithm reroute flow it committed to earlier.

## 2. Ford–Fulkerson method

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

## 3. Worked example

| Edge | s→a | s→b | a→b | a→t | b→t |
|---|---|---|---|---|---|
| Capacity | 10 | 5 | 15 | 5 | 10 |

| Augmenting path | Bottleneck | Total flow |
|---|---|---|
| s → a → t | min(10, 5) = 5 | 5 |
| s → b → t | min(5, 10) = 5 | 10 |
| s → a → b → t | min(10 − 5, 15, 10 − 5) = 5 | 15 |

Now a→t and b→t are both full, so no augmenting path remains. **Maximum flow = 15.**

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 520 250" role="img" aria-labelledby="flow-t"><title id="flow-t">Maximum flow 15 from s to t: s to a 10 of 10, s to b 5 of 5, a to b 5 of 15, a to t 5 of 5, b to t 10 of 10.</title><defs><marker id="ah-flow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-flow-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-flow-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line-b" x1="58.1" y1="106.5" x2="180.1" y2="49.3" marker-end="url(#ah-flow-b)"/><line class="dg-line-b" x1="58.1" y1="123.5" x2="180.1" y2="180.7" marker-end="url(#ah-flow-b)"/><line class="dg-line-a" x1="200" y1="60" x2="200" y2="168" marker-end="url(#ah-flow-a)"/><line class="dg-line-b" x1="219" y1="46.2" x2="409.1" y2="108.2" marker-end="url(#ah-flow-b)"/><line class="dg-line-b" x1="219" y1="183.8" x2="409.1" y2="121.8" marker-end="url(#ah-flow-b)"/><path class="dg-line-b" d="M384,16 Q350,115 384,214" stroke-dasharray="5 4"/><text class="dg-t-muted" x="124.2" y="88.8" text-anchor="middle">10/10</text><text class="dg-t-muted" x="114" y="162.9" text-anchor="middle">5/5</text><text class="dg-t-muted" x="188" y="114" text-anchor="middle">5/15</text><text class="dg-t-muted" x="310.3" y="88.6" text-anchor="middle">5/5</text><text class="dg-t-muted" x="317.8" y="164.2" text-anchor="middle">10/10</text><circle class="dg-cell-c" cx="40" cy="115" r="20"/><text class="dg-t-c" x="40" y="115" text-anchor="middle">s</text><circle class="dg-cell" cx="200" cy="40" r="20"/><text x="200" y="40" text-anchor="middle">a</text><circle class="dg-cell" cx="200" cy="190" r="20"/><text x="200" y="190" text-anchor="middle">b</text><circle class="dg-cell-c" cx="430" cy="115" r="20"/><text class="dg-t-c" x="430" y="115" text-anchor="middle">t</text><text class="dg-t-b" x="384" y="236" text-anchor="middle" style="font-size:13px">min cut = 5 + 10 = 15</text></svg><ul class="dg-legend"><li><span class="dg-swatch b"></span>saturated edge</li><li><span class="dg-swatch a"></span>spare capacity</li></ul><figcaption>Labels are flow/capacity. The dashed cut separates t from everything else; both edges crossing it are full, so their capacity, 15, is the maximum flow (max-flow min-cut theorem).</figcaption></figure>

## 4. Max-flow min-cut theorem

An **$s$–$t$ cut** $(S, T)$ splits the vertices with $s \in S$ and $t \in T$. Its **capacity** is the total capacity of edges going **from $S$ to $T$** (edges from $T$ back to $S$ do not count).

**Theorem.** The maximum flow value equals the minimum cut capacity.

In the example, the cut $S = \{s, a, b\}$, $T = \{t\}$ has capacity $5 + 10 = 15$, matching the maximum flow. The cut $S = \{s\}$ also has capacity $10 + 5 = 15$. When Ford–Fulkerson stops, the vertices still reachable from $s$ in the residual graph form a minimum cut.

The theorem also proves Ford–Fulkerson correct: it stops exactly when no augmenting path exists, and at that point the flow equals the capacity of a cut, so it cannot be increased further.

## 5. Applications

**Maximum bipartite matching.** Given two groups (say applicants and jobs) and the allowed pairings, find the largest set of pairs with no one used twice. Add a source joined to every left vertex and a sink joined from every right vertex, give every edge capacity 1, and find the maximum flow. Its value is the size of the maximum matching.

**Other uses:** network reliability (edge-disjoint paths), project selection, image segmentation, airline scheduling, and baseball elimination.

## Summary

- Flow respects capacities and is conserved at every vertex except $s$ and $t$.
- The residual graph has forward edges for spare capacity and backward edges to undo flow.
- Ford–Fulkerson: augment along residual paths, $O(E\,|f^*|)$; Edmonds–Karp uses BFS paths, $O(VE^2)$.
- Max-flow min-cut: the maximum flow value equals the minimum cut capacity.
- Applications: bipartite matching, edge-disjoint paths, project selection.

## Check yourself

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
