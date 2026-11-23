---
title: Graph Traversal
description: BFS and DFS in depth - discovery and finish times, edge classification, topological sort, strongly connected components, bipartite checking, and articulation points.
sidebar:
  label: "7. Graph traversal"
  order: 7
lesson:
  module: Graph algorithms
  prerequisites:
    - label: Graphs
      link: /data-structures/graphs/
  outcomes:
    - Use BFS for shortest unweighted paths and bipartite checking
    - Record DFS discovery and finish times and classify edges
    - Produce a topological order with DFS or Kahn's algorithm
    - Find strongly connected components, articulation points and bridges
  keyIdea: >-
    BFS and DFS are the two ways to explore a graph, both in $O(V + E)$. **BFS** finds fewest-edge paths and checks bipartiteness. **DFS**, with its discovery and finish times, detects cycles (back edges), orders a DAG **topologically** (by decreasing finish time), and finds **strongly connected components** and weak points such as articulation points.
---

Graph representations and the basic BFS and DFS procedures are introduced in [Data Structures: Graphs](/data-structures/graphs/). This page covers what the traversals are used **for**. All the algorithms here run in $O(V + E)$ with an adjacency list.

## 1. BFS: shortest paths in unweighted graphs

BFS from source $s$ visits vertices in order of their distance (number of edges) from $s$. It records:

- `dist[v]`: the length of the shortest path from $s$ to $v$
- `parent[v]`: the previous vertex on that path

Following `parent` pointers back from $v$ reconstructs the path. The parent edges form a **BFS tree**.

**Uses:** shortest paths when every edge costs the same, finding all vertices within $k$ steps, level-order traversal, and the bipartite check below.

### Bipartite checking

A graph is **bipartite** if its vertices can be split into two sets with every edge going between the sets, that is, if it can be **2-coloured**. Run BFS and colour each newly found vertex the opposite colour to its parent. If an edge ever joins two vertices of the same colour, the graph is not bipartite.

A graph is bipartite **if and only if it has no odd-length cycle**.

## 2. DFS with timestamps

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

## 3. Topological sort

A **topological order** of a DAG lists the vertices so that every edge $u \to v$ goes from earlier to later.

**DFS method.** Run DFS and output vertices in **decreasing order of finish time**. (Push each vertex onto a stack when it finishes; the stack top-to-bottom is the order.) This works because for every edge $u \to v$ in a DAG, $f[u] > f[v]$.

**Kahn's method.** Repeatedly output a vertex with in-degree 0 and remove its outgoing edges. If vertices remain but none has in-degree 0, the graph has a cycle.

**Example:** getting dressed. Edges: underwear → trousers, trousers → shoes, socks → shoes, shirt → tie, shirt → belt, trousers → belt, tie → jacket, belt → jacket.

One valid order: socks, underwear, trousers, shoes, shirt, belt, tie, jacket. Topological orders are usually **not unique**.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 600 240" role="img" aria-labelledby="topo-t"><title id="topo-t">The getting-dressed DAG: underwear and socks before trousers and shoes, shirt before tie and belt, and everything before the jacket.</title><defs><marker id="ah-topo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-topo-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-topo-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="120" y1="40" x2="168" y2="40" marker-end="url(#ah-topo)"/><line class="dg-line" x1="270" y1="50" x2="318" y2="59.6" marker-end="url(#ah-topo)"/><line class="dg-line" x1="120" y1="111.7" x2="318" y2="78.7" marker-end="url(#ah-topo)"/><line class="dg-line" x1="120" y1="200" x2="168" y2="200" marker-end="url(#ah-topo)"/><line class="dg-line" x1="120" y1="191.7" x2="318" y2="158.7" marker-end="url(#ah-topo)"/><line class="dg-line" x1="240.5" y1="55" x2="347.9" y2="133.8" marker-end="url(#ah-topo)"/><line class="dg-line" x1="270" y1="200" x2="468" y2="200" marker-end="url(#ah-topo)"/><line class="dg-line" x1="415" y1="165" x2="473.1" y2="184.4" marker-end="url(#ah-topo)"/><rect class="dg-cell-a" x="20" y="25" width="100" height="30" rx="6"/><text class="dg-t-a" x="70" y="40" text-anchor="middle" style="font-size:13px">underwear</text><rect class="dg-cell-a" x="20" y="105" width="100" height="30" rx="6"/><text class="dg-t-a" x="70" y="120" text-anchor="middle" style="font-size:13px">socks</text><rect class="dg-cell-a" x="20" y="185" width="100" height="30" rx="6"/><text class="dg-t-a" x="70" y="200" text-anchor="middle" style="font-size:13px">shirt</text><rect class="dg-cell-a" x="170" y="25" width="100" height="30" rx="6"/><text class="dg-t-a" x="220" y="40" text-anchor="middle" style="font-size:13px">trousers</text><rect class="dg-cell-a" x="170" y="185" width="100" height="30" rx="6"/><text class="dg-t-a" x="220" y="200" text-anchor="middle" style="font-size:13px">tie</text><rect class="dg-cell-a" x="320" y="55" width="100" height="30" rx="6"/><text class="dg-t-a" x="370" y="70" text-anchor="middle" style="font-size:13px">shoes</text><rect class="dg-cell-a" x="320" y="135" width="100" height="30" rx="6"/><text class="dg-t-a" x="370" y="150" text-anchor="middle" style="font-size:13px">belt</text><rect class="dg-cell-a" x="470" y="185" width="100" height="30" rx="6"/><text class="dg-t-a" x="520" y="200" text-anchor="middle" style="font-size:13px">jacket</text><text class="dg-t-b" x="120" y="16" text-anchor="end" style="font-size:13px">2</text><text class="dg-t-b" x="120" y="96" text-anchor="end" style="font-size:13px">1</text><text class="dg-t-b" x="120" y="176" text-anchor="end" style="font-size:13px">5</text><text class="dg-t-b" x="270" y="16" text-anchor="end" style="font-size:13px">3</text><text class="dg-t-b" x="270" y="176" text-anchor="end" style="font-size:13px">7</text><text class="dg-t-b" x="420" y="46" text-anchor="end" style="font-size:13px">4</text><text class="dg-t-b" x="420" y="126" text-anchor="end" style="font-size:13px">6</text><text class="dg-t-b" x="570" y="176" text-anchor="end" style="font-size:13px">8</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>task</li><li><span class="dg-swatch b"></span>position in the order</li></ul><figcaption>Small numbers give one valid topological order. Every arrow goes from a smaller number to a larger one; any order with that property is correct, so there are many.</figcaption></figure>

## 4. Strongly connected components (SCC)

In a directed graph, a **strongly connected component** is a maximal set of vertices where every vertex can reach every other. Shrinking each SCC to a single vertex always leaves a DAG (the *component graph*).

**Kosaraju's algorithm:**

1. Run DFS on $G$ and record finish times.
2. Build the **transpose** $G^T$ (every edge reversed).
3. Run DFS on $G^T$, starting new trees in **decreasing order of finish time** from step 1. Each DFS tree is one SCC.

Three linear passes: $O(V + E)$. **Tarjan's algorithm** finds SCCs in a single DFS using "low-link" values.

**Uses:** finding groups of mutually reachable web pages, analysing dependencies, and solving 2-SAT.

## 5. Articulation points and bridges

In an undirected connected graph:

- An **articulation point** (cut vertex) is a vertex whose removal disconnects the graph.
- A **bridge** is an edge whose removal disconnects the graph.

Both are found in one DFS by computing `low[v]`, the earliest discovery time reachable from $v$'s subtree using at most one back edge. A non-root vertex $u$ is an articulation point if it has a child $v$ with `low[v] >= d[u]`. The root is an articulation point if it has two or more DFS children. They identify single points of failure in networks.

## 6. BFS vs DFS

| | BFS | DFS |
|---|---|---|
| Data structure | Queue | Stack / recursion |
| Shortest paths (unweighted) | Yes | No |
| Memory | Proportional to the widest level | Proportional to the deepest path |
| Applications | Shortest paths, bipartite check, levels | Cycle detection, topological sort, SCC, articulation points, maze solving |

## Summary

- BFS: distances in edges, BFS tree, bipartite iff no odd cycle.
- DFS: discovery and finish times nest (parenthesis theorem); tree, back, forward and cross edges.
- A directed graph has a cycle iff DFS finds a back edge.
- Topological order: decreasing finish time, or Kahn's repeated removal of in-degree-0 vertices.
- SCCs with Kosaraju (two DFS passes) or Tarjan; articulation points and bridges via low-link values.

## Check yourself

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
