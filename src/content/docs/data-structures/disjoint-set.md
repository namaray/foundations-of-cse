---
title: Disjoint Set Union (Union–Find)
description: The union–find data structure for tracking groups, with union by rank and path compression, its near-constant amortized cost, and its uses in Kruskal's algorithm and connectivity.
sidebar:
  order: 11
---

A **disjoint set union** (DSU), or **union–find**, keeps track of elements split into non-overlapping groups. It answers one question very fast: *are these two elements in the same group?*

## Operations

| Operation | Meaning |
|---|---|
| `make_set(x)` | Put `x` in a group of its own |
| `find(x)` | Return the **representative** (root) of the group containing `x` |
| `union(x, y)` | Merge the groups containing `x` and `y` |

Two elements are in the same group exactly when `find(x) == find(y)`.

## Forest representation

Each group is a tree, stored in a `parent` array. The root of a tree is the group's representative and is its own parent.

```text
parent: [0, 0, 1, 3, 3]        Groups: {0, 1, 2} and {3, 4}

   0        3
   |        |
   1        4
   |
   2
```

A naive implementation can build tall chains, making `find` $O(n)$. Two simple heuristics fix that.

## Union by rank (or size)

When merging, attach the root of the **shorter** tree under the root of the taller one. The tree height then stays $O(\log n)$.

## Path compression

During `find(x)`, make every node on the path point **directly** to the root. Later finds on those nodes take one step.

```text
Before find(3)        After find(3)

      0                    0
      |                  / | \
      1                 1  2  3
      |
      2
      |
      3
```

## Code

```c
int parent[N], rnk[N];

void make_set(int x) { parent[x] = x; rnk[x] = 0; }

int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);   // path compression
    return parent[x];
}

void unite(int x, int y) {
    int a = find(x), b = find(y);
    if (a == b) return;                // already in the same group
    if (rnk[a] < rnk[b]) { int t = a; a = b; b = t; }
    parent[b] = a;                     // attach the shorter tree under the taller
    if (rnk[a] == rnk[b]) rnk[a]++;
}
```

## Complexity

With **both** heuristics, any sequence of $m$ operations on $n$ elements takes $O(m \, \alpha(n))$ time, where $\alpha$ is the **inverse Ackermann function**. $\alpha(n) \le 4$ for any $n$ that could ever occur in practice, so each operation is effectively **constant time, amortized**.

| Version | `find` cost |
|---|---|
| Naive | $O(n)$ worst case |
| Union by rank only | $O(\log n)$ |
| Path compression only | $O(\log n)$ amortized |
| Both | $O(\alpha(n))$ amortized |

## Applications

- **Kruskal's algorithm** for minimum spanning trees: take edges in order of weight and add an edge only if its endpoints are in different groups.
- **Cycle detection** in an undirected graph: an edge whose endpoints are already in the same group closes a cycle.
- **Connected components** when edges arrive over time (dynamic connectivity).
- Image processing (labelling connected regions), network connectivity, and grouping equivalent items.

## Viva questions

<details>
<summary>What does path compression do?</summary>

Every node visited during a `find` is re-pointed directly at the root, flattening the tree so later finds on those nodes are fast.
</details>

<details>
<summary>How does Kruskal's algorithm use union–find?</summary>

It processes edges from lightest to heaviest. For edge $(u, v)$, if `find(u) != find(v)` the edge joins two different components, so it is added to the tree and `union(u, v)` merges them. Otherwise it would form a cycle and is skipped.
</details>

<details>
<summary>Can union–find split a group back into two?</summary>

Not efficiently. The standard structure supports only merging. Deleting edges needs more complex dynamic-connectivity structures.
</details>
