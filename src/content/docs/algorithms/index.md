---
title: "Algorithms"
description: "Algorithm design paradigms, graph algorithms, and the limits of efficient computation."
sidebar:
  label: Overview
  order: 0
---

An **algorithm** is a precise, finite procedure for solving a problem. This course asks three questions about every algorithm: *is it correct?*, *how fast is it?*, and *can we do better?* It builds directly on [Data Structures](/data-structures/), and together they make up the core of both lecturer vivas and master's admission tests.

## Study path

Each page covers how the algorithm works, a worked example you can follow by hand, its running time, and viva questions with answers you can reveal.

**Foundations**

- [ ] [Analysing algorithms & recurrences](/algorithms/recurrences/): loop invariants, recursion trees, the Master theorem
- [ ] [Sorting](/algorithms/sorting/): elementary sorts, merge sort, quicksort, linear-time sorts, the $\Omega(n \log n)$ lower bound
- [ ] [Searching](/algorithms/searching/): binary search and its variants, selection

**Design paradigms**

- [ ] [Divide and conquer](/algorithms/divide-and-conquer/): maximum subarray, Karatsuba, Strassen, closest pair
- [ ] [Greedy algorithms](/algorithms/greedy/): activity selection, fractional knapsack, Huffman coding
- [ ] [Dynamic programming](/algorithms/dynamic-programming/): knapsack, LCS, matrix chain, coin change, edit distance

**Graph algorithms**

- [ ] [Graph traversal](/algorithms/graph-traversal/): DFS timestamps, topological sort, strongly connected components
- [ ] [Shortest paths](/algorithms/shortest-paths/): Dijkstra, Bellman–Ford, Floyd–Warshall
- [ ] [Minimum spanning trees](/algorithms/minimum-spanning-trees/): Kruskal and Prim
- [ ] [Maximum flow](/algorithms/network-flow/): Ford–Fulkerson, max-flow min-cut, bipartite matching

**Further topics**

- [ ] [String matching](/algorithms/string-matching/): naive, Rabin–Karp, KMP
- [ ] [Backtracking & branch and bound](/algorithms/backtracking/): N-Queens, subset sum, knapsack, TSP
- [ ] [NP-completeness & approximation](/algorithms/np-completeness/): P vs NP, reductions, approximation algorithms

Then revise with the **[cheat sheet](/algorithms/cheat-sheet/)**.

**Interactive:** the [minimax](/artificial-intelligence/minimax-simulation/) and [map colouring](/artificial-intelligence/csp-simulation/) simulations show search, pruning and backtracking step by step.

## Standard textbooks

- Cormen, Leiserson, Rivest & Stein: *Introduction to Algorithms* (CLRS)
- Jon Kleinberg & Éva Tardos: *Algorithm Design*
- Ellis Horowitz, Sartaj Sahni & Sanguthevar Rajasekaran: *Fundamentals of Computer Algorithms*
