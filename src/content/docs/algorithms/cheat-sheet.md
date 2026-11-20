---
title: Algorithms Cheat Sheet
description: One-page revision of algorithm running times, the Master theorem, design paradigms and the most-asked viva questions.
sidebar:
  label: Cheat sheet
  order: 20
  badge:
    text: Revision
    variant: note
---

Use this page for last-minute revision. Every row links back to the full notes.

## Running times

### Sorting and searching

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| [Insertion sort](/algorithms/sorting/#elementary-sorts) | $n$ | $n^2$ | $n^2$ | $1$ | Yes |
| [Merge sort](/algorithms/sorting/#merge-sort) | $n \log n$ | $n \log n$ | $n \log n$ | $n$ | Yes |
| [Quicksort](/algorithms/sorting/#quicksort) | $n \log n$ | $n \log n$ | $n^2$ | $\log n$ | No |
| [Heapsort](/data-structures/heaps/#heapsort) | $n \log n$ | $n \log n$ | $n \log n$ | $1$ | No |
| [Counting sort](/algorithms/sorting/#counting-sort) | $n + k$ | $n + k$ | $n + k$ | $n + k$ | Yes |
| [Radix sort](/algorithms/sorting/#radix-sort) | $d(n + k)$ | $d(n + k)$ | $d(n + k)$ | $n + k$ | Yes |
| [Binary search](/algorithms/searching/#binary-search) | $1$ | $\log n$ | $\log n$ | $1$ | — |
| [Quickselect](/algorithms/searching/#selection-the-k-th-smallest-element) | $n$ | $n$ | $n^2$ | $\log n$ | — |

### Graphs

| Algorithm | Solves | Time |
|---|---|---|
| [BFS / DFS](/algorithms/graph-traversal/) | Traversal, unweighted shortest paths | $O(V + E)$ |
| [Topological sort](/algorithms/graph-traversal/#topological-sort) | Ordering a DAG | $O(V + E)$ |
| [Kosaraju / Tarjan](/algorithms/graph-traversal/#strongly-connected-components-scc) | Strongly connected components | $O(V + E)$ |
| [Dijkstra](/algorithms/shortest-paths/#dijkstras-algorithm) | Single-source, non-negative weights | $O((V + E) \log V)$ |
| [Bellman–Ford](/algorithms/shortest-paths/#bellmanford) | Single-source, negative weights, cycle detection | $O(VE)$ |
| [DAG shortest paths](/algorithms/shortest-paths/#shortest-paths-in-a-dag) | Single-source in a DAG | $O(V + E)$ |
| [Floyd–Warshall](/algorithms/shortest-paths/#floydwarshall-all-pairs) | All pairs | $O(V^3)$ |
| [Kruskal](/algorithms/minimum-spanning-trees/#kruskals-algorithm) | MST | $O(E \log E)$ |
| [Prim](/algorithms/minimum-spanning-trees/#prims-algorithm) | MST | $O(E \log V)$ |
| [Edmonds–Karp](/algorithms/network-flow/#fordfulkerson-method) | Maximum flow | $O(VE^2)$ |

### Dynamic programming and strings

| Algorithm | Time |
|---|---|
| [0/1 knapsack](/algorithms/dynamic-programming/#01-knapsack) | $O(nW)$ (pseudo-polynomial) |
| [LCS](/algorithms/dynamic-programming/#longest-common-subsequence-lcs), [edit distance](/algorithms/dynamic-programming/#edit-distance) | $O(mn)$ |
| [Matrix chain multiplication](/algorithms/dynamic-programming/#matrix-chain-multiplication) | $O(n^3)$ |
| [LIS](/algorithms/dynamic-programming/#longest-increasing-subsequence-lis) | $O(n^2)$, or $O(n \log n)$ |
| [Naive string matching](/algorithms/string-matching/#naive-algorithm) | $O((n - m + 1)\,m)$ |
| [Rabin–Karp](/algorithms/string-matching/#rabinkarp) | $O(n + m)$ expected, $O(nm)$ worst |
| [KMP](/algorithms/string-matching/#knuthmorrispratt-kmp) | $O(n + m)$ |

## The Master theorem

For $T(n) = aT(n/b) + f(n)$, compare $f(n)$ with $n^{\log_b a}$:

| Case | If | Then |
|---|---|---|
| 1 | $f(n) = O(n^{\log_b a - \varepsilon})$ | $T(n) = \Theta(n^{\log_b a})$ |
| 2 | $f(n) = \Theta(n^{\log_b a} \log^k n)$ | $T(n) = \Theta(n^{\log_b a} \log^{k+1} n)$ |
| 3 | $f(n) = \Omega(n^{\log_b a + \varepsilon})$ and regular | $T(n) = \Theta(f(n))$ |

Quick answers: $T(n) = T(n/2) + 1 \to \log n$; $2T(n/2) + n \to n \log n$; $T(n-1) + n \to n^2$; $2T(n-1) + 1 \to 2^n$.

## Design paradigms compared

| Paradigm | Idea | Subproblems | Examples |
|---|---|---|---|
| [Divide and conquer](/algorithms/divide-and-conquer/) | Split, solve recursively, combine | Independent | Merge sort, quicksort, Karatsuba |
| [Greedy](/algorithms/greedy/) | Take the locally best choice, never undo it | One per step | Activity selection, Huffman, Dijkstra, Kruskal |
| [Dynamic programming](/algorithms/dynamic-programming/) | Solve every subproblem once and store it | Overlapping | Knapsack, LCS, Floyd–Warshall |
| [Backtracking](/algorithms/backtracking/) | Depth-first search, abandon invalid partial solutions | State-space tree | N-Queens, subset sum, colouring |
| [Branch and bound](/algorithms/backtracking/#branch-and-bound) | Search, prune with optimistic bounds | State-space tree | 0/1 knapsack, TSP |

## Key facts

- Comparison sorting needs $\Omega(n \log n)$ comparisons (decision tree with $n!$ leaves).
- Dijkstra fails with negative edges; Bellman–Ford handles them and detects negative cycles.
- A DAG has a topological order; a graph with a cycle does not.
- A directed graph has a cycle if and only if DFS finds a back edge.
- A spanning tree has $V - 1$ edges; with distinct weights the MST is unique.
- Max flow = min cut.
- Greedy works for fractional knapsack, not for 0/1 knapsack.
- To prove $X$ NP-complete: show $X \in NP$, then reduce a known NP-complete problem **to** $X$.

## Top viva questions

1. State the Master theorem and solve $T(n) = 2T(n/2) + n$.
2. Why is quicksort's worst case $O(n^2)$, and how do you avoid it?
3. Prove the $\Omega(n \log n)$ lower bound for comparison sorting.
4. Greedy vs dynamic programming: give an example where greedy fails.
5. Explain overlapping subproblems and optimal substructure.
6. Fill in the 0/1 knapsack or LCS table for a small example.
7. Run Dijkstra on a small graph. Why does it fail with negative edges?
8. Kruskal vs Prim: data structures and running times.
9. What does the KMP prefix function store?
10. Define P, NP, NP-hard and NP-complete.
11. Is P = NP? What would follow if 3-SAT had a polynomial algorithm?
12. Give a 2-approximation for vertex cover and explain why it works.
