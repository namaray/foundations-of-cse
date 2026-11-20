---
title: Graphs
description: Graph terminology, adjacency matrix vs adjacency list, BFS and DFS traversals, and which representation suits which problem.
sidebar:
  order: 10
---

A **graph** $G = (V, E)$ is a set of **vertices** $V$ joined by **edges** $E$. Graphs model networks of any kind: roads, social connections, web links, task dependencies, circuits.

This page covers graphs as a **data structure**. Shortest paths, spanning trees and flows are covered in [Algorithms](/algorithms/).

## Terminology

| Term | Meaning |
|---|---|
| Directed / undirected | Edges have a direction ($u \to v$) or not |
| Weighted | Each edge carries a cost or length |
| Degree | Number of edges at a vertex. In a directed graph: **in-degree** and **out-degree** |
| Path | A sequence of vertices joined by edges |
| Cycle | A path that starts and ends at the same vertex |
| Connected | Every vertex can reach every other (undirected) |
| Strongly connected | Every vertex can reach every other following edge directions (directed) |
| DAG | Directed acyclic graph: directed with no cycles |
| Sparse / dense | $E$ close to $V$ / $E$ close to $V^2$ |

**Handshaking lemma.** In an undirected graph, $\sum_{v} \deg(v) = 2|E|$, because every edge contributes to two degrees. So the number of odd-degree vertices is always even.

A simple undirected graph has at most $\dfrac{V(V-1)}{2}$ edges; a simple directed graph at most $V(V-1)$.

## Representations

Example graph (undirected): edges 0–1, 0–2, 1–2, 2–3.

```text
Adjacency matrix           Adjacency list

    0 1 2 3                0: 1 → 2
0 [ 0 1 1 0 ]              1: 0 → 2
1 [ 1 0 1 0 ]              2: 0 → 1 → 3
2 [ 1 1 0 1 ]              3: 2
3 [ 0 0 1 0 ]
```

For an undirected graph the matrix is **symmetric**. For a weighted graph, store the weight instead of 1 (and use ∞ or a sentinel for "no edge").

| | Adjacency matrix | Adjacency list |
|---|---|---|
| Space | $\Theta(V^2)$ | $\Theta(V + E)$ |
| Is there an edge $(u, v)$? | $O(1)$ | $O(\deg u)$ |
| List all neighbours of $u$ | $O(V)$ | $O(\deg u)$ |
| Add an edge | $O(1)$ | $O(1)$ |
| BFS / DFS over the whole graph | $O(V^2)$ | $O(V + E)$ |
| Best for | Dense graphs, quick edge checks (Floyd–Warshall) | Sparse graphs (most real graphs) |

An **edge list** (just an array of `(u, v, w)` triples) is a third option, used by Kruskal's algorithm, which sorts edges by weight.

## Breadth-first search (BFS)

BFS explores the graph **level by level** from a source, using a **queue**. In an unweighted graph it finds the **shortest path** (fewest edges) from the source to every vertex.

```text
BFS(G, s):
    mark s visited; dist[s] = 0; enqueue s
    while the queue is not empty:
        u = dequeue
        for each neighbour v of u:
            if v is not visited:
                mark v visited; dist[v] = dist[u] + 1; parent[v] = u
                enqueue v
```

On the example graph, starting at 0: **0, 1, 2, 3**.

## Depth-first search (DFS)

DFS goes as **deep** as possible before backtracking, using recursion (or an explicit **stack**).

```text
DFS(G, u):
    mark u visited
    for each neighbour v of u:
        if v is not visited:
            parent[v] = u
            DFS(G, v)
```

On the example graph, starting at 0 (neighbours in increasing order): **0, 1, 2, 3**.

Both BFS and DFS run in $O(V + E)$ with an adjacency list.

| | BFS | DFS |
|---|---|---|
| Data structure | Queue | Stack / recursion |
| Explores | Level by level | One branch fully, then backtracks |
| Finds shortest path (unweighted)? | Yes | No |
| Typical uses | Shortest paths, levels, bipartite check | Cycle detection, topological sort, connected and strongly connected components |

## Topological sort

A **topological order** of a DAG lists the vertices so that every edge $u \to v$ has $u$ before $v$. It exists **only** for DAGs. Typical uses: course prerequisites, build systems, task scheduling.

Two standard methods, both $O(V + E)$:

- **Kahn's algorithm:** repeatedly remove a vertex with in-degree 0 (using a queue) and decrease its neighbours' in-degrees. If some vertices are never removed, the graph has a cycle.
- **DFS:** output vertices in decreasing order of DFS finishing time.

## Viva questions

<details>
<summary>When would you use an adjacency matrix instead of a list?</summary>

When the graph is dense, or when you need constant-time edge lookups, as in Floyd–Warshall. For sparse graphs a matrix wastes $\Theta(V^2)$ space and makes traversals $O(V^2)$.
</details>

<details>
<summary>Why does BFS give shortest paths in an unweighted graph but DFS does not?</summary>

BFS visits all vertices at distance $k$ before any at distance $k + 1$, so the first time it reaches a vertex is along a shortest path. DFS may reach a vertex first through a long detour.
</details>

<details>
<summary>How do you detect a cycle in a directed graph?</summary>

Run DFS and track vertices on the current recursion stack. An edge to a vertex that is still on the stack (a *back edge*) means a cycle. Alternatively, Kahn's algorithm fails to remove every vertex exactly when there is a cycle.
</details>
