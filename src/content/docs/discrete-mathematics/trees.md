---
title: Trees
description: Equivalent definitions of a tree, rooted and m-ary trees with their counting formulas, spanning trees, Cayley's formula, and where trees appear in computing.
sidebar:
  label: "11. Trees"
  order: 11
lesson:
  module: Graphs and trees
  prerequisites:
    - label: Graph theory
      link: /discrete-mathematics/graph-theory/
  outcomes:
    - State and use the equivalent characterisations of a tree
    - Apply the formulas relating internal vertices, leaves and total vertices in full m-ary trees
    - Explain what a spanning tree is and count them for small graphs
  keyIdea: >-
    A **tree** is a connected graph with no cycles. That single idea forces everything else: exactly $n - 1$ edges, a unique path between any two vertices, and simple formulas linking leaves and internal nodes in $m$-ary trees.
---

Binary trees, BSTs and traversals as data structures are covered in [Data Structures: Trees](/data-structures/trees-and-bst/). This lesson covers the mathematical facts.

## 1. What makes a tree

For a graph $T$ with $n$ vertices, these statements are **equivalent**: any one implies all the others.

1. $T$ is connected and has no cycles.
2. There is exactly one simple path between any two vertices.
3. $T$ is connected and has exactly $n - 1$ edges.
4. $T$ has no cycles and has exactly $n - 1$ edges.
5. $T$ is connected, but removing any edge disconnects it (every edge is a bridge).
6. $T$ has no cycles, but adding any edge creates exactly one cycle.

A graph with no cycles that may be disconnected is a **forest**; each component is a tree. A forest with $n$ vertices and $c$ components has $n - c$ edges.

Every tree with at least 2 vertices has at least 2 **leaves** (vertices of degree 1).

## 2. Rooted trees

Choosing a **root** gives every edge a direction away from it, and the usual vocabulary: parent, child, sibling, ancestor, descendant, leaf, internal vertex, level (depth) and height.

An **$m$-ary tree** gives every internal vertex at most $m$ children; a **full** $m$-ary tree gives every internal vertex exactly $m$. Binary trees are the case $m = 2$.

### Counting formulas for full m-ary trees

Let $n$ be the number of vertices, $i$ the number of internal vertices and $l$ the number of leaves. Every vertex except the root is a child of exactly one internal vertex, so $n = mi + 1$. Combining with $n = i + l$:

| Given | Then |
|---|---|
| $i$ internal | $n = mi + 1$, $\quad l = (m - 1)i + 1$ |
| $l$ leaves | $n = \dfrac{ml - 1}{m - 1}$, $\quad i = \dfrac{l - 1}{m - 1}$ |
| $n$ vertices | $i = \dfrac{n - 1}{m}$, $\quad l = \dfrac{(m - 1)n + 1}{m}$ |

**Example: a chain letter.** Each person who receives a letter sends it to 4 others, or to nobody. If 100 people receive it but do not send it on, how many people saw the letter in total? This is a full 4-ary tree with $l = 100$: $n = (4 \cdot 100 - 1)/3 = 133$. Those who sent it on: $i = 99/3 = 33$.

**Height.** An $m$-ary tree of height $h$ has at most $m^h$ leaves, so a tree with $l$ leaves has height at least $\lceil \log_m l \rceil$. This is the idea behind the [sorting lower bound](/algorithms/sorting/#5-why-n-log-n-is-the-limit).

## 3. Spanning trees

A **spanning tree** of a connected graph $G$ is a subgraph that is a tree and includes every vertex of $G$. Every connected graph has one: keep deleting an edge from some cycle until no cycles remain. DFS and BFS also produce spanning trees.

- A spanning tree of a graph with $n$ vertices has $n - 1$ edges.
- **Minimum spanning trees** (cheapest total weight) are found with Kruskal's and Prim's algorithms; see [Algorithms: MST](/algorithms/minimum-spanning-trees/).

**Cayley's formula.** The complete graph $K_n$ has $n^{n-2}$ spanning trees, which is also the number of labelled trees on $n$ vertices. For $K_4$: $4^2 = 16$.

**Example.** $C_n$ has $n$ spanning trees: remove any one of its $n$ edges.

## 4. Trees in computing

- **Search trees** (BST, AVL, B-trees) organise data for fast lookup.
- **Decision trees** model algorithms and give lower bounds.
- **Prefix codes** such as Huffman codes are binary trees with characters at the leaves; see [Greedy algorithms: Huffman coding](/algorithms/greedy/#huffman-coding).
- **Expression trees**: internal vertices are operators, leaves are operands. Preorder gives prefix notation and postorder gives postfix.
- **Game trees** for minimax search; see the [minimax simulation](/artificial-intelligence/minimax-simulation/).

## Summary

- A tree is connected and acyclic; equivalently, it is connected with $n - 1$ edges, or has a unique path between any two vertices.
- In a full $m$-ary tree, $n = mi + 1$ and $l = (m - 1)i + 1$.
- A tree of height $h$ has at most $m^h$ leaves, so height is at least $\lceil \log_m l \rceil$.
- Every connected graph has a spanning tree; $K_n$ has $n^{n-2}$ of them.

## Check yourself

<details>
<summary>A full binary tree has 50 internal vertices. How many leaves and total vertices does it have?</summary>

$l = (2 - 1) \cdot 50 + 1 = 51$ leaves, and $n = 2 \cdot 50 + 1 = 101$ vertices.
</details>

<details>
<summary>A forest has 20 vertices and 16 edges. How many trees are in it?</summary>

A forest with $c$ components has $n - c$ edges, so $c = 20 - 16 = 4$.
</details>

<details>
<summary>Can a full 3-ary tree have exactly 100 vertices? What about 101?</summary>

A full 3-ary tree has $n = 3i + 1$, so $n - 1$ must be divisible by 3. For 100 vertices, $99 = 3 \cdot 33$, so yes: $i = 33$ internal vertices and $l = 67$ leaves. For 101 vertices, 100 is not divisible by 3, so no.
</details>
