---
title: Minimum Spanning Trees
description: Spanning trees, the cut property, Kruskal's and Prim's algorithms with a worked example on the same graph, and their running times.
sidebar:
  order: 9
---

A **spanning tree** of a connected, undirected graph is a subset of edges that connects every vertex with no cycles. It always has exactly $V - 1$ edges. A **minimum spanning tree (MST)** is a spanning tree with the smallest total edge weight.

**Uses:** designing the cheapest network of cables, roads or pipes; clustering; and as a step in approximation algorithms such as the [metric TSP](/algorithms/np-completeness/#approximation-algorithms).

## The cut property

A **cut** splits the vertices into two groups. An edge **crosses** the cut if its endpoints are in different groups.

**Cut property:** for any cut, the lightest edge crossing it belongs to some MST. (If all edge weights are distinct, the MST is unique and contains it.)

Both Kruskal's and Prim's algorithms are greedy, and both are correct because every edge they add is the lightest edge across some cut.

**Cycle property:** the heaviest edge on any cycle is not in any MST (when weights are distinct).

## Example graph

Both algorithms below run on this undirected graph:

| Edge | B–C | A–B | A–C | B–D | C–D | C–E | D–E |
|---|---|---|---|---|---|---|---|
| Weight | 1 | 2 | 3 | 4 | 5 | 6 | 7 |

## Kruskal's algorithm

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

Time: sorting dominates, $O(E \log E) = O(E \log V)$.

## Prim's algorithm

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

## Kruskal vs Prim

| | Kruskal | Prim |
|---|---|---|
| Grows | A forest that merges into one tree | One tree |
| Key data structure | Union–find | Priority queue |
| Time | $O(E \log E)$ | $O(E \log V)$ with a binary heap |
| Better for | Sparse graphs, edges already sorted | Dense graphs |
| Works on a disconnected graph? | Yes, giving a minimum spanning forest | Only spans the start vertex's component |

## Viva questions

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
