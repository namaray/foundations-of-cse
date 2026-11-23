---
title: Graphs
description: Graph terminology, adjacency matrix vs adjacency list, BFS and DFS traversals, and which representation suits which problem.
sidebar:
  label: "10. Graphs"
  order: 10
lesson:
  module: Graphs and advanced structures
  prerequisites:
    - label: Queues
      link: /data-structures/queues/
    - label: Stacks
      link: /data-structures/stacks/
  outcomes:
    - Use graph terminology and apply the handshaking lemma
    - Represent a graph as an adjacency matrix, adjacency list or edge list, and choose between them
    - Trace BFS and DFS and state what each finds
    - Produce a topological order of a DAG
  keyIdea: >-
    A graph is vertices joined by edges. Store it as an **adjacency matrix** ($V^2$ space, $O(1)$ edge test) when dense, or an **adjacency list** ($V + E$ space) when sparse. **BFS** explores level by level with a queue and finds fewest-edge paths; **DFS** dives deep with a stack or recursion. Both take $O(V + E)$.
---

A **graph** $G = (V, E)$ is a set of **vertices** $V$ joined by **edges** $E$. Graphs model networks of any kind: roads, social connections, web links, task dependencies, circuits.

This page covers graphs as a **data structure**. Shortest paths, spanning trees and flows are covered in [Algorithms](/algorithms/).

## 1. Terminology

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

## 2. Representations

Example graph (undirected): edges 0–1, 0–2, 1–2, 2–3.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 640 210" role="img" aria-labelledby="grep-t"><title id="grep-t">The undirected graph with edges 0–1, 0–2, 1–2 and 2–3, with its adjacency matrix and adjacency list.</title><defs><marker id="ah-grep" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-grep-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-grep-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="40" y1="68" x2="40" y2="132"/><line class="dg-line" x1="56.1" y1="58" x2="123.9" y2="92"/><line class="dg-line" x1="56.1" y1="142" x2="123.9" y2="108"/><line class="dg-line" x1="158" y1="100" x2="202" y2="100"/><line class="dg-line" x1="488" y1="54" x2="506" y2="54" marker-end="url(#ah-grep)"/><line class="dg-line" x1="536" y1="54" x2="554" y2="54" marker-end="url(#ah-grep)"/><line class="dg-line" x1="488" y1="88" x2="506" y2="88" marker-end="url(#ah-grep)"/><line class="dg-line" x1="536" y1="88" x2="554" y2="88" marker-end="url(#ah-grep)"/><line class="dg-line" x1="488" y1="122" x2="506" y2="122" marker-end="url(#ah-grep)"/><line class="dg-line" x1="536" y1="122" x2="554" y2="122" marker-end="url(#ah-grep)"/><line class="dg-line" x1="584" y1="122" x2="602" y2="122" marker-end="url(#ah-grep)"/><line class="dg-line" x1="488" y1="156" x2="506" y2="156" marker-end="url(#ah-grep)"/><circle class="dg-cell" cx="40" cy="50" r="18"/><text x="40" y="50" text-anchor="middle">0</text><circle class="dg-cell" cx="40" cy="150" r="18"/><text x="40" y="150" text-anchor="middle">1</text><circle class="dg-cell-a" cx="140" cy="100" r="18"/><text class="dg-t-a" x="140" y="100" text-anchor="middle">2</text><circle class="dg-cell" cx="220" cy="100" r="18"/><text x="220" y="100" text-anchor="middle">3</text><text class="dg-t-muted" x="130" y="190" text-anchor="middle">graph</text><text class="dg-t-muted" x="306" y="28" text-anchor="middle">0</text><text class="dg-t-muted" x="338" y="28" text-anchor="middle">1</text><text class="dg-t-muted" x="370" y="28" text-anchor="middle">2</text><text class="dg-t-muted" x="402" y="28" text-anchor="middle">3</text><text class="dg-t-muted" x="278" y="56" text-anchor="middle">0</text><rect class="dg-cell-dim" x="290" y="40" width="32" height="32" rx="2"/><text x="306" y="56" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell" x="322" y="40" width="32" height="32" rx="2"/><text x="338" y="56" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell" x="354" y="40" width="32" height="32" rx="2"/><text x="370" y="56" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell-dim" x="386" y="40" width="32" height="32" rx="2"/><text x="402" y="56" text-anchor="middle" style="font-size:14px">0</text><text class="dg-t-muted" x="278" y="88" text-anchor="middle">1</text><rect class="dg-cell" x="290" y="72" width="32" height="32" rx="2"/><text x="306" y="88" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell-dim" x="322" y="72" width="32" height="32" rx="2"/><text x="338" y="88" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell" x="354" y="72" width="32" height="32" rx="2"/><text x="370" y="88" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell-dim" x="386" y="72" width="32" height="32" rx="2"/><text x="402" y="88" text-anchor="middle" style="font-size:14px">0</text><text class="dg-t-muted" x="278" y="120" text-anchor="middle">2</text><rect class="dg-cell-a" x="290" y="104" width="32" height="32" rx="2"/><text class="dg-t-a" x="306" y="120" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell-a" x="322" y="104" width="32" height="32" rx="2"/><text class="dg-t-a" x="338" y="120" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell-dim" x="354" y="104" width="32" height="32" rx="2"/><text x="370" y="120" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell-a" x="386" y="104" width="32" height="32" rx="2"/><text class="dg-t-a" x="402" y="120" text-anchor="middle" style="font-size:14px">1</text><text class="dg-t-muted" x="278" y="152" text-anchor="middle">3</text><rect class="dg-cell-dim" x="290" y="136" width="32" height="32" rx="2"/><text x="306" y="152" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell-dim" x="322" y="136" width="32" height="32" rx="2"/><text x="338" y="152" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell" x="354" y="136" width="32" height="32" rx="2"/><text x="370" y="152" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell-dim" x="386" y="136" width="32" height="32" rx="2"/><text x="402" y="152" text-anchor="middle" style="font-size:14px">0</text><text class="dg-t-muted" x="354" y="190" text-anchor="middle">adjacency matrix</text><rect class="dg-cell-c" x="460" y="40" width="28" height="28" rx="3"/><text class="dg-t-c" x="474" y="54" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell" x="508" y="40" width="28" height="28" rx="3"/><text x="522" y="54" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell" x="556" y="40" width="28" height="28" rx="3"/><text x="570" y="54" text-anchor="middle" style="font-size:14px">2</text><rect class="dg-cell-c" x="460" y="74" width="28" height="28" rx="3"/><text class="dg-t-c" x="474" y="88" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell" x="508" y="74" width="28" height="28" rx="3"/><text x="522" y="88" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell" x="556" y="74" width="28" height="28" rx="3"/><text x="570" y="88" text-anchor="middle" style="font-size:14px">2</text><rect class="dg-cell-a" x="460" y="108" width="28" height="28" rx="3"/><text class="dg-t-a" x="474" y="122" text-anchor="middle" style="font-size:14px">2</text><rect class="dg-cell" x="508" y="108" width="28" height="28" rx="3"/><text x="522" y="122" text-anchor="middle" style="font-size:14px">0</text><rect class="dg-cell" x="556" y="108" width="28" height="28" rx="3"/><text x="570" y="122" text-anchor="middle" style="font-size:14px">1</text><rect class="dg-cell" x="604" y="108" width="28" height="28" rx="3"/><text x="618" y="122" text-anchor="middle" style="font-size:14px">3</text><rect class="dg-cell-c" x="460" y="142" width="28" height="28" rx="3"/><text class="dg-t-c" x="474" y="156" text-anchor="middle" style="font-size:14px">3</text><rect class="dg-cell" x="508" y="142" width="28" height="28" rx="3"/><text x="522" y="156" text-anchor="middle" style="font-size:14px">2</text><text class="dg-t-muted" x="530" y="190" text-anchor="middle">adjacency list</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>vertex 2 and its edges</li></ul><figcaption>The same graph three ways. The matrix uses V² cells and is symmetric for an undirected graph; the list stores each edge twice, once from each end, using V + 2E entries. Vertex 2 is highlighted in all three.</figcaption></figure>

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

## 3. Breadth-first search (BFS)

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

## 4. Depth-first search (DFS)

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

## 5. Topological sort

A **topological order** of a DAG lists the vertices so that every edge $u \to v$ has $u$ before $v$. It exists **only** for DAGs. Typical uses: course prerequisites, build systems, task scheduling.

Two standard methods, both $O(V + E)$:

- **Kahn's algorithm:** repeatedly remove a vertex with in-degree 0 (using a queue) and decrease its neighbours' in-degrees. If some vertices are never removed, the graph has a cycle.
- **DFS:** output vertices in decreasing order of DFS finishing time.

## Summary

- $\sum \deg(v) = 2|E|$; a simple undirected graph has at most $V(V - 1)/2$ edges.
- Matrix: $\Theta(V^2)$ space, $O(1)$ edge lookup. List: $\Theta(V + E)$ space, fast neighbour iteration.
- BFS uses a queue and gives shortest paths in unweighted graphs.
- DFS uses a stack or recursion; back edges reveal cycles.
- Topological order exists only for DAGs (Kahn's algorithm or DFS finishing order).

## Check yourself

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
