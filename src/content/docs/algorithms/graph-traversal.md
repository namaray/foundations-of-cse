---
title: Graph Traversal
description: BFS and DFS in depth - discovery and finish times, edge classification, topological sort, strongly connected components, bipartite checking, and articulation points.
sidebar:
  label: "7. Graph traversal"
  order: 7
lesson:
  module: Graph algorithms
---

Graph representations and the basic BFS and DFS procedures are introduced in [Data Structures: Graphs](/data-structures/graphs/). This page covers what the traversals are used **for**. All the algorithms here run in $O(V + E)$ with an adjacency list.

## BFS: shortest paths in unweighted graphs

BFS from source $s$ visits vertices in order of their distance (number of edges) from $s$. It records:

- `dist[v]`: the length of the shortest path from $s$ to $v$
- `parent[v]`: the previous vertex on that path

Following `parent` pointers back from $v$ reconstructs the path. The parent edges form a **BFS tree**.

**Uses:** shortest paths when every edge costs the same, finding all vertices within $k$ steps, level-order traversal, and the bipartite check below.

### Bipartite checking

A graph is **bipartite** if its vertices can be split into two sets with every edge going between the sets, that is, if it can be **2-coloured**. Run BFS and colour each newly found vertex the opposite colour to its parent. If an edge ever joins two vertices of the same colour, the graph is not bipartite.

A graph is bipartite **if and only if it has no odd-length cycle**.

## DFS with timestamps

DFS records two times for each vertex: `d[v]` when it is first **discovered**, and `f[v]` when it **finishes** (all its descendants are done).

```text
DFS-VISIT(u):
    time = time + 1;  d[u] = time;  colour[u] = GREY
    for each v adjacent to u:
        if colour[v] == WHITE:
            parent[v] = u
            DFS-VISIT(v)
    time = time + 1;  f[u] = time;  colour[u] = BLACK
```

White means not yet discovered, grey means discovered but not finished (on the recursion stack), and black means finished.

**Parenthesis theorem.** For any two vertices, the intervals $[d[u], f[u]]$ and $[d[v], f[v]]$ are either completely separate or one is nested inside the other, like matched brackets. $v$ is a descendant of $u$ exactly when $v$'s interval is inside $u$'s.

### Edge classification

During DFS of a directed graph, each edge $(u, v)$ is one of:

| Edge type | Meaning | Colour of $v$ when explored |
|---|---|---|
| Tree edge | $v$ discovered through this edge | White |
| **Back edge** | $v$ is an ancestor of $u$ | **Grey** |
| Forward edge | $v$ is a descendant of $u$, but not a tree child | Black, with $d[u] < d[v]$ |
| Cross edge | Neither ancestor nor descendant | Black, with $d[v] < d[u]$ |

**A directed graph has a cycle if and only if DFS finds a back edge.** In an undirected graph every edge is either a tree edge or a back edge.

## Topological sort

A **topological order** of a DAG lists the vertices so that every edge $u \to v$ goes from earlier to later.

**DFS method.** Run DFS and output vertices in **decreasing order of finish time**. (Push each vertex onto a stack when it finishes; the stack top-to-bottom is the order.) This works because for every edge $u \to v$ in a DAG, $f[u] > f[v]$.

**Kahn's method.** Repeatedly output a vertex with in-degree 0 and remove its outgoing edges. If vertices remain but none has in-degree 0, the graph has a cycle.

**Example:** getting dressed. Edges: underwear → trousers, trousers → shoes, socks → shoes, shirt → tie, shirt → belt, trousers → belt, tie → jacket, belt → jacket.

One valid order: socks, underwear, trousers, shoes, shirt, belt, tie, jacket. Topological orders are usually **not unique**.

## Strongly connected components (SCC)

In a directed graph, a **strongly connected component** is a maximal set of vertices where every vertex can reach every other. Shrinking each SCC to a single vertex always leaves a DAG (the *component graph*).

**Kosaraju's algorithm:**

1. Run DFS on $G$ and record finish times.
2. Build the **transpose** $G^T$ (every edge reversed).
3. Run DFS on $G^T$, starting new trees in **decreasing order of finish time** from step 1. Each DFS tree is one SCC.

Three linear passes: $O(V + E)$. **Tarjan's algorithm** finds SCCs in a single DFS using "low-link" values.

**Uses:** finding groups of mutually reachable web pages, analysing dependencies, and solving 2-SAT.

## Articulation points and bridges

In an undirected connected graph:

- An **articulation point** (cut vertex) is a vertex whose removal disconnects the graph.
- A **bridge** is an edge whose removal disconnects the graph.

Both are found in one DFS by computing `low[v]`, the earliest discovery time reachable from $v$'s subtree using at most one back edge. A non-root vertex $u$ is an articulation point if it has a child $v$ with `low[v] >= d[u]`. The root is an articulation point if it has two or more DFS children. They identify single points of failure in networks.

## BFS vs DFS

| | BFS | DFS |
|---|---|---|
| Data structure | Queue | Stack / recursion |
| Shortest paths (unweighted) | Yes | No |
| Memory | Proportional to the widest level | Proportional to the deepest path |
| Applications | Shortest paths, bipartite check, levels | Cycle detection, topological sort, SCC, articulation points, maze solving |

## Viva questions

<details>
<summary>How do you detect a cycle in a directed graph? In an undirected graph?</summary>

Directed: run DFS and look for a back edge, an edge to a grey vertex still on the recursion stack. Undirected: run DFS (or BFS) and look for an edge to an already-visited vertex other than the current vertex's parent; union–find also works.
</details>

<details>
<summary>Why does sorting by decreasing finish time give a topological order?</summary>

For any edge $u \to v$ in a DAG, $v$ finishes before $u$: either DFS reaches $v$ from $u$ (so $v$ finishes first), or $v$ was already finished. It cannot be grey, since that would mean a cycle. So $u$ comes before $v$ when sorted by decreasing finish time.
</details>

<details>
<summary>Can a graph with a cycle have a topological sort?</summary>

No. In a cycle $u_1 \to u_2 \to \dots \to u_1$, each vertex would have to come before the next, including $u_1$ before itself.
</details>
