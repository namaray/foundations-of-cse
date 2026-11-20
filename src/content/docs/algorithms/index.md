---
title: "Algorithms"
description: "Algorithm design paradigms, graph algorithms, and the limits of efficient computation."
sidebar:
  label: Overview
  order: 0
---

Algorithm design paradigms, graph algorithms, and the limits of efficient computation.

## Topics to master

- [ ] Asymptotic analysis and solving recurrences
- [ ] Sorting and searching
- [ ] Divide and conquer
- [ ] Greedy algorithms
- [ ] Dynamic programming
- [ ] Graph traversal: BFS, DFS, topological sort, SCC
- [ ] Shortest paths: Dijkstra, Bellman–Ford, Floyd–Warshall
- [ ] Minimum spanning trees: Kruskal, Prim
- [ ] Maximum flow
- [ ] String matching: KMP, Rabin–Karp
- [ ] Backtracking and branch and bound
- [ ] NP-completeness and approximation algorithms

## Standard textbooks

- Cormen, Leiserson, Rivest & Stein: *Introduction to Algorithms* (CLRS)
- Jon Kleinberg & Éva Tardos: *Algorithm Design*

## Key formula

The Master theorem solves recurrences of the form

$$
T(n) = a\,T\!\left(\frac{n}{b}\right) + f(n), \qquad a \ge 1,\ b > 1
$$

by comparing $f(n)$ with $n^{\log_b a}$.
