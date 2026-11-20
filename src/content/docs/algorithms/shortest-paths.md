---
title: Shortest Paths
description: Relaxation, Dijkstra's algorithm with a worked example, why it fails on negative edges, Bellman–Ford and negative cycles, shortest paths in DAGs, and Floyd–Warshall for all pairs.
sidebar:
  label: "8. Shortest paths"
  order: 8
lesson:
  module: Graph algorithms
  minutes: 45
  priority: high
---

Given a weighted graph, find the minimum-total-weight path from a source $s$ to other vertices. For unweighted graphs, [BFS](/algorithms/graph-traversal/#bfs-shortest-paths-in-unweighted-graphs) already solves this.

## Relaxation

Every single-source algorithm here keeps an estimate `d[v]` (initially $\infty$, and $0$ for $s$) and improves it by **relaxing** edges:

```text
RELAX(u, v, w):
    if d[u] + w(u, v) < d[v]:
        d[v] = d[u] + w(u, v)
        parent[v] = u
```

The algorithms differ only in **which edges they relax, and in what order**.

## Dijkstra's algorithm

**Requirement:** all edge weights are **non-negative**.

**Idea (greedy):** repeatedly take the unvisited vertex with the smallest `d`, mark it final, and relax its outgoing edges.

```text
DIJKSTRA(G, s):
    d[v] = ∞ for all v;  d[s] = 0
    put every vertex in a min-priority queue Q keyed by d
    while Q is not empty:
        u = EXTRACT-MIN(Q)          // d[u] is now final
        for each edge (u, v):
            RELAX(u, v, w)          // DECREASE-KEY if d[v] improves
```

### Worked example

A directed graph with source **A**:

| Edge | A→B | A→C | C→B | B→D | C→D | C→E | D→E |
|---|---|---|---|---|---|---|---|
| Weight | 4 | 2 | 1 | 5 | 8 | 10 | 2 |

Each row shows the distances after extracting one vertex and relaxing its edges. The extracted vertex's distance (in bold) is final; a ✓ marks vertices finalised earlier.

| Step | Extract | A | B | C | D | E |
|---|---|---|---|---|---|---|
| Start | | 0 | ∞ | ∞ | ∞ | ∞ |
| 1 | A | **0** | 4 | 2 | ∞ | ∞ |
| 2 | C | 0 ✓ | 3 (via C) | **2** | 10 | 12 |
| 3 | B | 0 ✓ | **3** | 2 ✓ | 8 (via B) | 12 |
| 4 | D | 0 ✓ | 3 ✓ | 2 ✓ | **8** | 10 (via D) |
| 5 | E | 0 ✓ | 3 ✓ | 2 ✓ | 8 ✓ | **10** |

Final distances: B = 3 (A→C→B), C = 2, D = 8 (A→C→B→D), E = 10 (A→C→B→D→E).

### Running time

| Priority queue | Time |
|---|---|
| Plain array | $O(V^2)$, best for dense graphs |
| Binary heap | $O((V + E) \log V)$ |
| Fibonacci heap | $O(E + V \log V)$ |

### Why negative edges break it

Edges A→B (2), A→C (3), C→B (−2). Dijkstra extracts B first with $d[B] = 2$ and treats it as final. Later it finds A→C→B with cost $3 - 2 = 1$, but B is already finished. The answer 2 is wrong.

Dijkstra's correctness depends on the fact that adding an edge never makes a path shorter, which is false once weights can be negative.

## Bellman–Ford

**Handles negative edge weights** and **detects negative cycles**.

```text
BELLMAN-FORD(G, s):
    initialise d
    repeat V − 1 times:
        for each edge (u, v):  RELAX(u, v, w)
    for each edge (u, v):
        if d[u] + w(u, v) < d[v]:  report "negative cycle"
```

**Why $V - 1$ rounds?** A shortest path without cycles has at most $V - 1$ edges. After round $k$, every shortest path that uses at most $k$ edges has been found. If an edge can still be relaxed after $V - 1$ rounds, some path keeps getting shorter forever: there is a **negative cycle** reachable from $s$, and shortest paths are undefined.

Time $O(VE)$. Bellman–Ford is a form of dynamic programming; it underlies distance-vector routing protocols such as RIP.

## Shortest paths in a DAG

In a DAG, relax the edges out of each vertex in **topological order**. Every vertex's distance is final before its outgoing edges are used, so a single pass suffices: $O(V + E)$, and negative weights are fine.

Negating the weights finds **longest** paths in a DAG, which is how project scheduling finds the *critical path*.

## Floyd–Warshall (all pairs)

Finds the shortest path between **every** pair of vertices. Let $d_k[i][j]$ be the shortest $i \to j$ path using only vertices $1 \dots k$ as intermediate stops:

$$
d_k[i][j] = \min\big(d_{k-1}[i][j],\; d_{k-1}[i][k] + d_{k-1}[k][j]\big)
$$

```c
for (int k = 0; k < V; k++)
    for (int i = 0; i < V; i++)
        for (int j = 0; j < V; j++)
            if (d[i][k] + d[k][j] < d[i][j])
                d[i][j] = d[i][k] + d[k][j];
```

The loop over $k$ **must** be the outermost. Time $O(V^3)$, space $O(V^2)$. Negative edges are allowed; a negative value on the diagonal, $d[i][i] < 0$, signals a negative cycle.

## Which algorithm when?

| Situation | Algorithm | Time |
|---|---|---|
| Unweighted graph | BFS | $O(V + E)$ |
| Non-negative weights, one source | Dijkstra | $O((V + E) \log V)$ |
| Negative weights, or need to detect negative cycles | Bellman–Ford | $O(VE)$ |
| DAG (any weights) | Topological order + relaxation | $O(V + E)$ |
| All pairs, dense graph | Floyd–Warshall | $O(V^3)$ |
| All pairs, sparse graph with negative edges | Johnson's (reweight, then Dijkstra from each vertex) | $O(VE \log V)$ |

## Viva questions

<details>
<summary>Why can't Dijkstra's algorithm handle negative edge weights?</summary>

It finalises a vertex as soon as it is extracted, assuming no later path can be shorter. A negative edge discovered later can create a shorter path to an already-finalised vertex.
</details>

<details>
<summary>How does Bellman–Ford detect a negative cycle?</summary>

After $V - 1$ rounds all shortest paths are final if no negative cycle exists. It does one more round: if any edge can still be relaxed, distances are still decreasing, which only happens with a reachable negative cycle.
</details>

<details>
<summary>Dijkstra vs Prim: what is the difference?</summary>

The structure is almost identical: a priority queue of vertices. Dijkstra keys each vertex by its total distance from the source, $d[u] + w(u, v)$. Prim keys it by the single cheapest edge connecting it to the tree, $w(u, v)$. Dijkstra builds a shortest-path tree; Prim builds a minimum spanning tree.
</details>
