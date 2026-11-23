---
title: Data Structures Cheat Sheet
description: One-page revision of operation costs, key formulas and the most-asked viva questions for every data structure.
sidebar:
  label: "13. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Every row links back to the full notes.

## Operation costs

Average case, with the worst case in brackets where it differs.

| Structure | Access | Search | Insert | Delete | Notes |
|---|---|---|---|---|---|
| [Array](/data-structures/arrays/) | $O(1)$ | $O(n)$ | $O(n)$ | $O(n)$ | Sorted: search $O(\log n)$ |
| [Dynamic array](/data-structures/arrays/#4-dynamic-arrays) | $O(1)$ | $O(n)$ | $O(1)$ amortized at end | $O(n)$ | Doubling on resize |
| [Linked list](/data-structures/linked-lists/) | $O(n)$ | $O(n)$ | $O(1)$ at a known node | $O(1)$ at a known node | Doubly linked for $O(1)$ delete |
| [Stack](/data-structures/stacks/) | top only | — | $O(1)$ push | $O(1)$ pop | LIFO |
| [Queue](/data-structures/queues/) | front only | — | $O(1)$ enqueue | $O(1)$ dequeue | FIFO; circular in arrays |
| [Hash table](/data-structures/hashing/) | — | $O(1)$ [$O(n)$] | $O(1)$ [$O(n)$] | $O(1)$ [$O(n)$] | Unordered |
| [BST](/data-structures/trees-and-bst/) | — | $O(\log n)$ [$O(n)$] | $O(\log n)$ [$O(n)$] | $O(\log n)$ [$O(n)$] | Skewed when input is sorted |
| [AVL / red–black](/data-structures/balanced-trees/) | — | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | Guaranteed worst case |
| [B-tree](/data-structures/balanced-trees/#3-b-trees) | — | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | Few disk reads |
| [Binary heap](/data-structures/heaps/) | max/min $O(1)$ | $O(n)$ | $O(\log n)$ | $O(\log n)$ extract | Build in $O(n)$ |
| [Union–find](/data-structures/disjoint-set/) | — | find $O(\alpha(n))$ | union $O(\alpha(n))$ | — | Amortized, both heuristics |
| [Trie](/data-structures/tries-and-range-trees/) | — | $O(L)$ | $O(L)$ | $O(L)$ | $L$ = key length |
| [Segment tree](/data-structures/tries-and-range-trees/#2-segment-trees) | — | range query $O(\log n)$ | update $O(\log n)$ | — | Build $O(n)$ |

## Formulas to memorise

**Array address (row-major):** $\text{Loc}(A[i][j]) = B + w\,[(i - l_r)\,n + (j - l_c)]$, where $n$ is the number of **columns**.

**Array address (column-major):** $\text{Loc}(A[i][j]) = B + w\,[(j - l_c)\,m + (i - l_r)]$, where $m$ is the number of **rows**.

**Circular queue:** next index $= (i + 1) \bmod N$; full when $(\text{rear} + 1) \bmod N = \text{front}$.

**Binary tree** (root at level 0, height in edges):

- At most $2^i$ nodes on level $i$, and at most $2^{h+1} - 1$ nodes in total
- Minimum height with $n$ nodes: $\lfloor \log_2 n \rfloor$
- Leaves $n_0 = n_2 + 1$
- Distinct binary trees with $n$ nodes: $C_n = \frac{1}{n+1}\binom{2n}{n}$ (1, 1, 2, 5, 14, 42, …)

**Heap (0-indexed):** parent $\lfloor (i-1)/2 \rfloor$, children $2i + 1$ and $2i + 2$. Leaves are at indices $\lfloor n/2 \rfloor \dots n - 1$.

**AVL height:** $h < 1.44 \log_2(n + 2)$. **Red–black height:** $h \le 2 \log_2(n + 1)$.

**B-tree of order $m$:** at most $m$ children and $m - 1$ keys; non-root internal nodes have at least $\lceil m/2 \rceil$ children.

**Hashing:** load factor $\alpha = n/m$. Chaining costs $\Theta(1 + \alpha)$. Open addressing needs about $\frac{1}{1-\alpha}$ probes for an unsuccessful search.

**Graphs:** $\sum \deg(v) = 2|E|$. A simple undirected graph has at most $V(V-1)/2$ edges. BFS and DFS cost $O(V + E)$ with adjacency lists.

## Which structure should I use?

| You need to… | Use |
|---|---|
| Access items by position | Array |
| Insert and delete often in the middle | Linked list |
| Undo, backtrack, match brackets, evaluate expressions | Stack |
| Process items in arrival order, BFS | Queue |
| Look up by key as fast as possible, order irrelevant | Hash table |
| Keep keys sorted with fast search, min/max and range queries | Balanced BST |
| Repeatedly take the largest or smallest item | Heap / priority queue |
| Index data stored on disk | B+ tree |
| Track groups that merge, check connectivity | Union–find |
| Prefix search or autocomplete on strings | Trie |
| Range sums or minimums on an array that changes | Segment tree / Fenwick tree |

## Top viva questions

1. Array vs linked list: trade-offs and when to use each.
2. Why do we need a circular queue?
3. Convert an infix expression to postfix, then evaluate it.
4. What is a collision in hashing, and how is it resolved?
5. Why does inorder traversal of a BST give sorted output?
6. What is the worst case of a BST, and how do AVL trees prevent it?
7. Name and draw the four AVL rotation cases.
8. Why does building a heap take $O(n)$ rather than $O(n \log n)$?
9. Why do databases use B+ trees?
10. Adjacency matrix vs adjacency list.
11. BFS vs DFS: data structure used and typical applications.
12. What do path compression and union by rank achieve?
