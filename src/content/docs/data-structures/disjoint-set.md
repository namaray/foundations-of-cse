---
title: Disjoint Set Union (Union–Find)
description: The union–find data structure for tracking groups, with union by rank and path compression, its near-constant amortized cost, and its uses in Kruskal's algorithm and connectivity.
sidebar:
  label: "11. Disjoint sets"
  order: 11
lesson:
  module: Graphs and advanced structures
  prerequisites:
    - label: Trees and BSTs
      link: /data-structures/trees-and-bst/
  outcomes:
    - Represent disjoint sets as a forest in a parent array
    - Implement find and union with union by rank and path compression
    - State the amortized cost with both heuristics
    - Use union–find in Kruskal's algorithm and for connectivity
  keyIdea: >-
    Union–find keeps elements in non-overlapping groups and answers "are these two in the same group?" Each group is a tree whose **root** is its representative. **Union by rank** keeps trees short and **path compression** flattens them during `find`; together they make every operation effectively constant time, $O(\alpha(n))$.
---

A **disjoint set union** (DSU), or **union–find**, keeps track of elements split into non-overlapping groups. It answers one question very fast: *are these two elements in the same group?*

## 1. Operations

| Operation | Meaning |
|---|---|
| `make_set(x)` | Put `x` in a group of its own |
| `find(x)` | Return the **representative** (root) of the group containing `x` |
| `union(x, y)` | Merge the groups containing `x` and `y` |

Two elements are in the same group exactly when `find(x) == find(y)`.

## 2. Forest representation

Each group is a tree, stored in a `parent` array. The root of a tree is the group's representative and is its own parent.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 480 210" role="img" aria-labelledby="dsuforest-t"><title id="dsuforest-t">A disjoint-set forest with parent array 0, 0, 1, 3, 3: one tree 0, 1, 2 rooted at 0 and one tree 3, 4 rooted at 3.</title><defs><marker id="ah-dsuforest" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-dsuforest-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-dsuforest-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="330" y1="48" x2="330" y2="70"/><line class="dg-line" x1="330" y1="106" x2="330" y2="128"/><line class="dg-line" x1="420" y1="48" x2="420" y2="70"/><text class="dg-t-muted" x="16" y="26">parent:</text><rect class="dg-cell-a" x="80" y="8" width="40" height="36" rx="4"/><text class="dg-t-a" x="100" y="26" text-anchor="middle">0</text><text class="dg-t-muted" x="100" y="58" text-anchor="middle">0</text><rect class="dg-cell" x="120" y="8" width="40" height="36" rx="4"/><text x="140" y="26" text-anchor="middle">0</text><text class="dg-t-muted" x="140" y="58" text-anchor="middle">1</text><rect class="dg-cell" x="160" y="8" width="40" height="36" rx="4"/><text x="180" y="26" text-anchor="middle">1</text><text class="dg-t-muted" x="180" y="58" text-anchor="middle">2</text><rect class="dg-cell-c" x="200" y="8" width="40" height="36" rx="4"/><text class="dg-t-c" x="220" y="26" text-anchor="middle">3</text><text class="dg-t-muted" x="220" y="58" text-anchor="middle">3</text><rect class="dg-cell" x="240" y="8" width="40" height="36" rx="4"/><text x="260" y="26" text-anchor="middle">3</text><text class="dg-t-muted" x="260" y="58" text-anchor="middle">4</text><circle class="dg-cell" cx="330" cy="146" r="18"/><text x="330" y="146" text-anchor="middle">2</text><circle class="dg-cell" cx="330" cy="88" r="18"/><text x="330" y="88" text-anchor="middle">1</text><circle class="dg-cell-a" cx="330" cy="30" r="18"/><text class="dg-t-a" x="330" y="30" text-anchor="middle">0</text><circle class="dg-cell" cx="420" cy="88" r="18"/><text x="420" y="88" text-anchor="middle">4</text><circle class="dg-cell-c" cx="420" cy="30" r="18"/><text class="dg-t-c" x="420" y="30" text-anchor="middle">3</text><text class="dg-t-a" x="330" y="192" text-anchor="middle">{0, 1, 2}</text><text class="dg-t-c" x="420" y="192" text-anchor="middle">{3, 4}</text><text class="dg-t-muted" x="80" y="100">parent[i] is the node above i;</text><text class="dg-t-muted" x="80" y="122">a root is its own parent.</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>root of group 1</li><li><span class="dg-swatch c"></span>root of group 2</li></ul><figcaption>Each group is a tree stored in the parent array. find(2) follows 2 → 1 → 0 and returns the root 0, the group&#x27;s representative.</figcaption></figure>

A naive implementation can build tall chains, making `find` $O(n)$. Two simple heuristics fix that.

## 3. Union by rank (or size)

When merging, attach the root of the **shorter** tree under the root of the taller one. The tree height then stays $O(\log n)$.

## 4. Path compression

During `find(x)`, make every node on the path point **directly** to the root. Later finds on those nodes take one step.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 480 250" role="img" aria-labelledby="pathc-t"><title id="pathc-t">Path compression: before find(3) the nodes form a chain 0, 1, 2, 3; afterwards 1, 2 and 3 all point directly to 0.</title><defs><marker id="ah-pathc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-pathc-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-pathc-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line-b" x1="90" y1="48" x2="90" y2="70"/><line class="dg-line-b" x1="90" y1="106" x2="90" y2="128"/><line class="dg-line-b" x1="90" y1="164" x2="90" y2="186"/><line class="dg-line" x1="358.3" y1="73.7" x2="321.7" y2="116.3"/><line class="dg-line" x1="370" y1="78" x2="370" y2="112"/><line class="dg-line" x1="381.7" y1="73.7" x2="418.3" y2="116.3"/><line class="dg-line" x1="170" y1="100" x2="260" y2="100" marker-end="url(#ah-pathc)"/><circle class="dg-cell-b" cx="90" cy="204" r="18"/><text class="dg-t-b" x="90" y="204" text-anchor="middle">3</text><circle class="dg-cell-b" cx="90" cy="146" r="18"/><text class="dg-t-b" x="90" y="146" text-anchor="middle">2</text><circle class="dg-cell-b" cx="90" cy="88" r="18"/><text class="dg-t-b" x="90" y="88" text-anchor="middle">1</text><circle class="dg-cell-a" cx="90" cy="30" r="18"/><text class="dg-t-a" x="90" y="30" text-anchor="middle">0</text><circle class="dg-cell-c" cx="310" cy="130" r="18"/><text class="dg-t-c" x="310" y="130" text-anchor="middle">1</text><circle class="dg-cell-c" cx="370" cy="130" r="18"/><text class="dg-t-c" x="370" y="130" text-anchor="middle">2</text><circle class="dg-cell-c" cx="430" cy="130" r="18"/><text class="dg-t-c" x="430" y="130" text-anchor="middle">3</text><circle class="dg-cell-a" cx="370" cy="60" r="18"/><text class="dg-t-a" x="370" y="60" text-anchor="middle">0</text><text class="dg-t-muted" x="215" y="86" text-anchor="middle" style="font-size:13px">find(3)</text><text class="dg-t-muted" x="90" y="240" text-anchor="middle">before</text><text class="dg-t-muted" x="370" y="180" text-anchor="middle">after</text></svg><ul class="dg-legend"><li><span class="dg-swatch b"></span>path walked by find(3)</li><li><span class="dg-swatch c"></span>re-pointed to the root</li></ul><figcaption>find(3) walks up the path 3 → 2 → 1 → 0, then points every node on it straight at the root. The next find on any of them takes one step.</figcaption></figure>

## 5. Code

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

## 6. Complexity

With **both** heuristics, any sequence of $m$ operations on $n$ elements takes $O(m \, \alpha(n))$ time, where $\alpha$ is the **inverse Ackermann function**. $\alpha(n) \le 4$ for any $n$ that could ever occur in practice, so each operation is effectively **constant time, amortized**.

| Version | `find` cost |
|---|---|
| Naive | $O(n)$ worst case |
| Union by rank only | $O(\log n)$ |
| Path compression only | $O(\log n)$ amortized |
| Both | $O(\alpha(n))$ amortized |

## 7. Applications

- **Kruskal's algorithm** for minimum spanning trees: take edges in order of weight and add an edge only if its endpoints are in different groups.
- **Cycle detection** in an undirected graph: an edge whose endpoints are already in the same group closes a cycle.
- **Connected components** when edges arrive over time (dynamic connectivity).
- Image processing (labelling connected regions), network connectivity, and grouping equivalent items.

## Summary

- `find(x)` returns the root of x's tree; `union(x, y)` links one root under the other.
- Union by rank or size attaches the shorter tree under the taller: height $O(\log n)$.
- Path compression points every node on a find path directly at the root.
- Both together: $m$ operations in $O(m\,\alpha(n))$, where $\alpha(n) \le 4$ in practice.
- Used by Kruskal's MST, connected components, and cycle detection in undirected graphs.

## Check yourself

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
