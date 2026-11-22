---
title: Graph Theory
description: Graph terminology and special graphs, the handshaking lemma, isomorphism, connectivity, Euler and Hamilton paths and circuits, planar graphs and Euler's formula, and graph colouring.
sidebar:
  label: "10. Graph theory"
  order: 10
lesson:
  module: Graphs and trees
  outcomes:
    - Use the handshaking lemma and the edge counts of special graphs
    - Decide whether a graph has an Euler path or circuit
    - Use Euler's formula to show a graph is not planar
    - Find the chromatic number of small graphs
  keyIdea: A graph is vertices joined by edges. Simple degree conditions answer some questions exactly (an **Euler circuit** exists iff every degree is even), while similar-looking ones are hard (no simple test exists for **Hamilton cycles**). Euler's formula $v - e + f = 2$ governs planar graphs.
---

Graphs as a data structure (adjacency matrices and lists, BFS and DFS) are covered in [Data Structures: Graphs](/data-structures/graphs/). This lesson covers the mathematics.

## 1. Terminology and special graphs

A **simple graph** has no loops and at most one edge between any two vertices. A **multigraph** allows repeated edges; a **pseudograph** also allows loops.

| Graph | Description | Vertices | Edges |
|---|---|---|---|
| Complete $K_n$ | every pair joined | $n$ | $\binom{n}{2} = \frac{n(n-1)}{2}$ |
| Cycle $C_n$ ($n \ge 3$) | a single ring | $n$ | $n$ |
| Wheel $W_n$ | $C_n$ plus a hub joined to all | $n + 1$ | $2n$ |
| Hypercube $Q_n$ | bit strings of length $n$, joined if they differ in one bit | $2^n$ | $n \, 2^{n-1}$ |
| Complete bipartite $K_{m,n}$ | two groups, every cross pair joined | $m + n$ | $mn$ |

A graph is **bipartite** if its vertices split into two sets with every edge crossing between them. Equivalently, it has **no odd cycle**. $C_6$ is bipartite; $C_5$ and $K_3$ are not.

## 2. Degrees

The **degree** of a vertex is the number of edges at it (a loop counts twice).

**Handshaking lemma:**

$$
\sum_{v \in V} \deg(v) = 2|E|
$$

Each edge adds 2 to the total. Consequences:

- The number of odd-degree vertices is always **even**.
- A graph with degrees 3, 3, 3, 2, 2 is impossible: the sum 13 is odd.
- A 4-regular graph (every degree 4) on 10 vertices has $4 \cdot 10 / 2 = 20$ edges.

In a directed graph, $\sum \deg^-(v) = \sum \deg^+(v) = |E|$.

## 3. Isomorphism and connectivity

Two graphs are **isomorphic** if there is a bijection between their vertices that preserves adjacency: the same graph drawn differently. To show two graphs are **not** isomorphic, find an **invariant** that differs: number of vertices or edges, the degree sequence, the number of cycles of a given length, bipartiteness, connectedness.

A graph is **connected** if there is a path between every pair of vertices. Its **connected components** are the maximal connected pieces. A **cut vertex** or **bridge** is a vertex or edge whose removal increases the number of components.

## 4. Euler paths and circuits

An **Euler circuit** uses every **edge** exactly once and returns to the start. An **Euler path** uses every edge exactly once but may end elsewhere.

For a connected graph:

| Condition | Result |
|---|---|
| Every vertex has even degree | Euler circuit exists |
| Exactly two vertices have odd degree | Euler path exists (from one odd vertex to the other), but no circuit |
| More than two odd-degree vertices | Neither |

**The Königsberg bridges.** Euler showed in 1736 that you cannot walk across all seven bridges of Königsberg exactly once: the graph has four vertices, all of odd degree.

Checking the degrees takes linear time, and **Fleury's** or **Hierholzer's** algorithm finds the circuit.

## 5. Hamilton paths and circuits

A **Hamilton circuit** visits every **vertex** exactly once and returns to the start. Despite the similarity to Euler circuits, there is **no known efficient test**: the problem is [NP-complete](/algorithms/np-completeness/).

Useful sufficient conditions, for a simple graph with $n \ge 3$ vertices:

- **Dirac's theorem:** if every vertex has degree at least $n/2$, a Hamilton circuit exists.
- **Ore's theorem:** if $\deg(u) + \deg(v) \ge n$ for every pair of non-adjacent vertices, a Hamilton circuit exists.

These are sufficient but not necessary: $C_n$ has a Hamilton circuit even though every degree is only 2.

| | Euler | Hamilton |
|---|---|---|
| Visits every | edge once | vertex once |
| Simple test? | Yes, degrees | No (NP-complete) |

## 6. Planar graphs

A graph is **planar** if it can be drawn in the plane with no edges crossing. Such a drawing divides the plane into **faces** (regions), including the outer one.

**Euler's formula.** For a connected planar graph,

$$
v - e + f = 2
$$

**Consequences** for a connected simple planar graph with $v \ge 3$:

- $e \le 3v - 6$. So $K_5$ ($v = 5$, $e = 10 > 9$) is **not planar**.
- If there are no triangles (for example, if bipartite), $e \le 2v - 4$. So $K_{3,3}$ ($v = 6$, $e = 9 > 8$) is **not planar**.
- Some vertex has degree at most 5.

**Kuratowski's theorem:** a graph is planar if and only if it contains no subdivision of $K_5$ or $K_{3,3}$.

## 7. Graph colouring

A **colouring** gives each vertex a colour so that adjacent vertices differ. The **chromatic number** $\chi(G)$ is the fewest colours needed.

| Graph | $\chi$ |
|---|---|
| $K_n$ | $n$ |
| $C_n$, $n$ even | 2 |
| $C_n$, $n$ odd | 3 |
| Bipartite graph with at least one edge | 2 |
| Any planar graph | at most 4 (the **four colour theorem**) |

Finding $\chi(G)$ is NP-hard in general. Applications include exam timetabling (courses are vertices, an edge means a shared student, colours are time slots) and register allocation in compilers. The [map colouring simulation](/artificial-intelligence/csp-simulation/) shows a colouring search in action.

## Summary

- $K_n$ has $n(n-1)/2$ edges; a graph is bipartite exactly when it has no odd cycle.
- The degrees add up to $2|E|$, so the number of odd-degree vertices is even.
- Euler circuit iff connected with all degrees even; Euler path iff exactly two odd degrees.
- Hamilton circuits have no simple test; Dirac's and Ore's theorems give sufficient conditions.
- Planar graphs satisfy $v - e + f = 2$ and $e \le 3v - 6$, so $K_5$ and $K_{3,3}$ are not planar.

## Check yourself

<details>
<summary>Can a simple graph have degree sequence 4, 4, 3, 2, 1?</summary>

The sum is 14, which is even, so the handshake lemma does not rule it out. But in a simple graph on 5 vertices, two vertices of degree 4 must each be adjacent to all others, which forces every other degree to be at least 2. The vertex of degree 1 makes it impossible.
</details>

<details>
<summary>Does K₅ have an Euler circuit? Does K₄?</summary>

$K_5$: every vertex has degree 4 (even), so yes. $K_4$: every vertex has degree 3 (odd), so no.
</details>

<details>
<summary>A connected planar graph has 8 vertices, each of degree 3. How many faces does it have?</summary>

$e = 8 \cdot 3 / 2 = 12$. Then $f = 2 - v + e = 2 - 8 + 12 = 6$.
</details>
