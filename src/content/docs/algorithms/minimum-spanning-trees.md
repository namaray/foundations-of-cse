---
title: Minimum Spanning Trees
description: Spanning trees, the cut property, Kruskal's and Prim's algorithms with a worked example on the same graph, and their running times.
sidebar:
  label: "9. Minimum spanning trees"
  order: 9
lesson:
  module: Graph algorithms
  prerequisites:
    - label: Greedy algorithms
      link: /algorithms/greedy/
    - label: Disjoint sets
      link: /data-structures/disjoint-set/
  outcomes:
    - State the cut property and use it to justify greedy MST algorithms
    - Trace Kruskal's algorithm with union–find
    - Trace Prim's algorithm with a priority queue
    - Choose between Kruskal and Prim for sparse and dense graphs
  keyIdea: >-
    A minimum spanning tree connects all vertices with the least total edge weight. By the **cut property**, the lightest edge across any cut is safe to add, so greedy works. **Kruskal** adds edges in increasing weight order, skipping any that would form a cycle (union–find); **Prim** grows one tree outward, always taking the cheapest edge leaving it.
---

A **spanning tree** of a connected, undirected graph is a subset of edges that connects every vertex with no cycles. It always has exactly $V - 1$ edges. A **minimum spanning tree (MST)** is a spanning tree with the smallest total edge weight.

**Uses:** designing the cheapest network of cables, roads or pipes; clustering; and as a step in approximation algorithms such as the [metric TSP](/algorithms/np-completeness/#9-approximation-algorithms).

## 1. The cut property

A **cut** splits the vertices into two groups. An edge **crosses** the cut if its endpoints are in different groups.

**Cut property:** for any cut, the lightest edge crossing it belongs to some MST. (If all edge weights are distinct, the MST is unique and contains it.)

Both Kruskal's and Prim's algorithms are greedy, and both are correct because every edge they add is the lightest edge across some cut.

**Cycle property:** the heaviest edge on any cycle is not in any MST (when weights are distinct).

## 2. Example graph

Both algorithms below run on this undirected graph:

| Edge | B–C | A–B | A–C | B–D | C–D | C–E | D–E |
|---|---|---|---|---|---|---|---|
| Weight | 1 | 2 | 3 | 4 | 5 | 6 | 7 |

## 3. Kruskal's algorithm

Sort all edges by weight. Go through them in order and add an edge if it **does not form a cycle** with the edges already chosen. Cycle checks use [union–find](/data-structures/disjoint-set/).

```text
KRUSKAL(G):
    T = ∅;  make_set(v) for every vertex
    for each edge (u, v) in increasing order of weight:
        if find(u) != find(v):
            add (u, v) to T
            union(u, v)
    return T
```

| Edge | Weight | Decision |
|---|---|---|
| B–C | 1 | Add |
| A–B | 2 | Add |
| A–C | 3 | Reject: A and C are already connected through B |
| B–D | 4 | Add |
| C–D | 5 | Reject: would form a cycle |
| C–E | 6 | Add. 4 edges = $V - 1$, so stop |

**MST: B–C, A–B, B–D, C–E. Total weight 13.**

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 460 230" role="img" aria-labelledby="mst-t"><title id="mst-t">The example graph with its minimum spanning tree B–C, A–B, B–D, C–E (total 13) highlighted.</title><defs><marker id="ah-mst" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-mst-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-mst-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line-a" x1="210" y1="60" x2="210" y2="160"/><line class="dg-line-a" x1="68.3" y1="102" x2="191.7" y2="48"/><line class="dg-line" x1="68.3" y1="118" x2="191.7" y2="172" stroke-dasharray="5 4"/><line class="dg-line-a" x1="230" y1="40" x2="360" y2="40"/><line class="dg-line" x1="225.4" y1="167.3" x2="364.6" y2="52.7" stroke-dasharray="5 4"/><line class="dg-line-a" x1="230" y1="180" x2="360" y2="180"/><line class="dg-line" x1="380" y1="60" x2="380" y2="160" stroke-dasharray="5 4"/><text class="dg-t-a" x="198" y="110" text-anchor="middle">1</text><text class="dg-t-a" x="134.8" y="86" text-anchor="middle">2</text><text class="dg-t-muted" x="125.2" y="156" text-anchor="middle">3</text><text class="dg-t-a" x="295" y="52" text-anchor="middle">4</text><text class="dg-t-muted" x="302.6" y="119.3" text-anchor="middle">5</text><text class="dg-t-a" x="295" y="192" text-anchor="middle">6</text><text class="dg-t-muted" x="368" y="110" text-anchor="middle">7</text><circle class="dg-cell-c" cx="50" cy="110" r="20"/><text class="dg-t-c" x="50" y="110" text-anchor="middle">A</text><circle class="dg-cell-c" cx="210" cy="40" r="20"/><text class="dg-t-c" x="210" y="40" text-anchor="middle">B</text><circle class="dg-cell-c" cx="210" cy="180" r="20"/><text class="dg-t-c" x="210" y="180" text-anchor="middle">C</text><circle class="dg-cell-c" cx="380" cy="40" r="20"/><text class="dg-t-c" x="380" y="40" text-anchor="middle">D</text><circle class="dg-cell-c" cx="380" cy="180" r="20"/><text class="dg-t-c" x="380" y="180" text-anchor="middle">E</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>MST edge</li></ul><figcaption>The four highlighted edges connect all five vertices with the least total weight, 1 + 2 + 4 + 6 = 13. Every dashed edge would close a cycle with heavier or equal edges.</figcaption></figure>

Time: sorting dominates, $O(E \log E) = O(E \log V)$.

## 4. Prim's algorithm

Grow **one** tree from a starting vertex. At each step, add the cheapest edge that joins a vertex in the tree to a vertex outside it.

```text
PRIM(G, r):
    key[v] = ∞ for all v;  key[r] = 0
    Q = all vertices (min-priority queue keyed by key)
    while Q is not empty:
        u = EXTRACT-MIN(Q)
        for each neighbour v of u still in Q:
            if w(u, v) < key[v]:
                key[v] = w(u, v);  parent[v] = u
```

Starting from **A**:

| Tree so far | Candidate edges | Chosen |
|---|---|---|
| {A} | A–B 2, A–C 3 | A–B (2) |
| {A, B} | A–C 3, B–C 1, B–D 4 | B–C (1) |
| {A, B, C} | B–D 4, C–D 5, C–E 6 | B–D (4) |
| {A, B, C, D} | C–E 6, D–E 7 | C–E (6) |

The same MST, **total weight 13**.

| Priority queue | Time |
|---|---|
| Plain array | $O(V^2)$, best for dense graphs |
| Binary heap | $O(E \log V)$ |
| Fibonacci heap | $O(E + V \log V)$ |

## 5. Kruskal vs Prim

| | Kruskal | Prim |
|---|---|---|
| Grows | A forest that merges into one tree | One tree |
| Key data structure | Union–find | Priority queue |
| Time | $O(E \log E)$ | $O(E \log V)$ with a binary heap |
| Better for | Sparse graphs, edges already sorted | Dense graphs |
| Works on a disconnected graph? | Yes, giving a minimum spanning forest | Only spans the start vertex's component |

## Summary

- An MST of $V$ vertices has $V - 1$ edges; it is unique if all weights differ.
- Cut property: the lightest edge crossing any cut belongs to some MST.
- Kruskal: sort edges, add if the endpoints are in different sets; $O(E \log E)$.
- Prim: grow from a root with a min-priority queue; $O(E \log V)$ with a heap, $O(V^2)$ with an array.
- Kruskal suits sparse graphs (edge list); Prim with an array suits dense graphs.

## Check yourself

<details>
<summary>How many edges does a spanning tree of a graph with V vertices have?</summary>

Exactly $V - 1$: that is the number of edges needed to connect $V$ vertices, and one more would create a cycle.
</details>

<details>
<summary>Is the MST unique?</summary>

It is unique when all edge weights are distinct. With repeated weights there can be several MSTs, but they all have the same total weight.
</details>

<details>
<summary>Does a minimum spanning tree give the shortest path between two vertices?</summary>

No. An MST minimises the total weight of the whole tree, not the distance between a particular pair. The path between two vertices in the MST can be much longer than their shortest path.
</details>

<details>
<summary>What happens if you run Kruskal's algorithm on a graph with negative edges?</summary>

It still works. Kruskal and Prim only compare edge weights, so negative weights cause no problem, unlike Dijkstra's algorithm.
</details>
