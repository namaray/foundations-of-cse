---
title: Tries, Segment Trees & Fenwick Trees
description: Tries for fast string and prefix lookups, segment trees for range queries with updates, and Fenwick (binary indexed) trees for prefix sums.
sidebar:
  label: "12. Tries and range trees"
  order: 12
lesson:
  module: Graphs and advanced structures
  prerequisites:
    - label: Trees and BSTs
      link: /data-structures/trees-and-bst/
  outcomes:
    - Insert and search strings in a trie in time proportional to the word length
    - Build a segment tree and answer range queries with point updates
    - Use a Fenwick tree for prefix sums
    - Choose between a segment tree and a Fenwick tree
  keyIdea: >-
    A **trie** stores strings one character per edge, so search costs $O(L)$ for a word of length $L$, regardless of how many words are stored. **Segment trees** and **Fenwick trees** answer range queries (sums, minimums) on an array that keeps changing, in $O(\log n)$ per query and update.
---

These three structures are less common in undergraduate exams than BSTs or heaps, but they appear in admission tests, programming contests and technical interviews.

## 1. Tries (prefix trees)

A **trie** stores strings character by character. Each edge is labelled with a character, and the path from the root spells a prefix. A flag marks nodes where a complete word ends.

<figure class="diagram"><svg style="--dg-min:440px" class="dg" viewBox="0 0 440 270" role="img" aria-labelledby="trie-t"><title id="trie-t">A trie storing car, cat, cart and dog; nodes where a word ends are highlighted.</title><defs><marker id="ah-trie" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-trie-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-trie-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="187.5" y1="36" x2="142.5" y2="72"/><line class="dg-line" x1="130" y1="98" x2="130" y2="122"/><line class="dg-line" x1="125.2" y1="153.3" x2="117.3" y2="178.7"/><line class="dg-line" x1="112.5" y1="210" x2="112.5" y2="234"/><line class="dg-line" x1="134.8" y1="153.3" x2="142.7" y2="178.7"/><line class="dg-line" x1="212.5" y1="36" x2="257.5" y2="72"/><line class="dg-line" x1="270" y1="98" x2="270" y2="122"/><line class="dg-line" x1="270" y1="154" x2="270" y2="178"/><circle class="dg-cell-c" cx="112.5" cy="250" r="16"/><text class="dg-t-c" x="112.5" y="250" text-anchor="middle">t</text><circle class="dg-cell-c" cx="112.5" cy="194" r="16"/><text class="dg-t-c" x="112.5" y="194" text-anchor="middle">r</text><circle class="dg-cell-c" cx="147.5" cy="194" r="16"/><text class="dg-t-c" x="147.5" y="194" text-anchor="middle">t</text><circle class="dg-cell" cx="130" cy="138" r="16"/><text x="130" y="138" text-anchor="middle">a</text><circle class="dg-cell" cx="130" cy="82" r="16"/><text x="130" y="82" text-anchor="middle">c</text><circle class="dg-cell-c" cx="270" cy="194" r="16"/><text class="dg-t-c" x="270" y="194" text-anchor="middle">g</text><circle class="dg-cell" cx="270" cy="138" r="16"/><text x="270" y="138" text-anchor="middle">o</text><circle class="dg-cell" cx="270" cy="82" r="16"/><text x="270" y="82" text-anchor="middle">d</text><circle class="dg-cell" cx="200" cy="26" r="16"/><text x="200" y="26" text-anchor="middle">·</text><text class="dg-t-muted" x="228" y="26">root</text><text class="dg-t-c" x="72" y="194" text-anchor="end" style="font-size:13px">car</text><text class="dg-t-c" x="72" y="250" text-anchor="end" style="font-size:13px">cart</text><text class="dg-t-c" x="188" y="194" style="font-size:13px">cat</text><text class="dg-t-c" x="294" y="194" style="font-size:13px">dog</text></svg><ul class="dg-legend"><li><span class="dg-swatch c"></span>end of a word</li></ul><figcaption>Each edge adds one character, so the path from the root spells a prefix. car and cart share the path c-a-r; highlighted nodes mark where a stored word ends.</figcaption></figure>

```c
#define ALPHA 26
typedef struct Trie {
    struct Trie *child[ALPHA];
    int is_end;
} Trie;

void insert(Trie *root, const char *s) {
    for (; *s; s++) {
        int c = *s - 'a';
        if (!root->child[c]) root->child[c] = calloc(1, sizeof(Trie));
        root = root->child[c];
    }
    root->is_end = 1;
}
```

| Operation | Cost (word length $L$) |
|---|---|
| Insert | $O(L)$ |
| Search for a word | $O(L)$ |
| Find all words with a prefix | $O(L + \text{number of matches})$ |

The cost does not depend on how many words are stored. The trade-off is memory: each node may hold an array of 26 (or more) child pointers. A **compressed trie** (radix tree) merges chains of single-child nodes to save space.

**Uses:** autocomplete, spell checking, IP routing (longest prefix match), and dictionary word games.

## 2. Segment trees

A **segment tree** answers **range queries** on an array, such as the sum, minimum or maximum of `a[l..r]`, while still allowing the array to change.

Each node covers a segment of the array: the root covers the whole array, and each node's two children cover the left and right halves of its segment. Leaves are single elements.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 560 230" role="img" aria-labelledby="segtree-t"><title id="segtree-t">A sum segment tree for the array 2, 5, 1, 4: the root holds 12 for the whole range, its children 7 and 5, and the leaves hold the elements.</title><defs><marker id="ah-segtree" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-segtree-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-segtree-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="264.4" y1="38.9" x2="155.6" y2="101.1"/><line class="dg-line" x1="128.1" y1="123.5" x2="81.9" y2="176.5"/><line class="dg-line" x1="151.9" y1="123.5" x2="198.1" y2="176.5"/><line class="dg-line" x1="295.6" y1="38.9" x2="404.4" y2="101.1"/><line class="dg-line" x1="408.1" y1="123.5" x2="361.9" y2="176.5"/><line class="dg-line" x1="431.9" y1="123.5" x2="478.1" y2="176.5"/><rect class="dg-cell-c" x="23.5" y="174" width="93" height="32" rx="4"/><text class="dg-t-c" x="70" y="190" text-anchor="middle" style="font-size:14px">[0] = 2</text><rect class="dg-cell-c" x="163.5" y="174" width="93" height="32" rx="4"/><text class="dg-t-c" x="210" y="190" text-anchor="middle" style="font-size:14px">[1] = 5</text><rect class="dg-cell" x="77" y="94" width="126" height="32" rx="4"/><text x="140" y="110" text-anchor="middle" style="font-size:14px">[0..1] = 7</text><rect class="dg-cell-c" x="303.5" y="174" width="93" height="32" rx="4"/><text class="dg-t-c" x="350" y="190" text-anchor="middle" style="font-size:14px">[2] = 1</text><rect class="dg-cell-c" x="443.5" y="174" width="93" height="32" rx="4"/><text class="dg-t-c" x="490" y="190" text-anchor="middle" style="font-size:14px">[3] = 4</text><rect class="dg-cell" x="357" y="94" width="126" height="32" rx="4"/><text x="420" y="110" text-anchor="middle" style="font-size:14px">[2..3] = 5</text><rect class="dg-cell-a" x="211.5" y="14" width="137" height="32" rx="4"/><text class="dg-t-a" x="280" y="30" text-anchor="middle" style="font-size:14px">[0..3] = 12</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>whole array</li><li><span class="dg-swatch c"></span>single elements</li></ul><figcaption>Each node stores the sum of its segment and equals the sum of its two children. A range query combines O(log n) nodes, and a point update changes one leaf and the O(log n) nodes above it.</figcaption></figure>

- **Query** `sum(l, r)`: combine the $O(\log n)$ nodes whose segments exactly cover $[l, r]$.
- **Point update** `a[i] = x`: change the leaf and recompute the $O(\log n)$ ancestors.
- **Lazy propagation** extends this to updating a whole range in $O(\log n)$.

| Operation | Cost |
|---|---|
| Build | $O(n)$ |
| Range query | $O(\log n)$ |
| Point update | $O(\log n)$ |
| Memory | About $4n$ array slots |

## 3. Fenwick trees (binary indexed trees)

A **Fenwick tree** supports **prefix sums** with point updates, using a single array of size $n + 1$ and very short code. It relies on the lowest set bit of an index, `i & (-i)`.

```c
int bit[N + 1];   // 1-indexed

void update(int i, int delta) {          // a[i] += delta
    for (; i <= N; i += i & (-i)) bit[i] += delta;
}

int prefix_sum(int i) {                  // a[1] + ... + a[i]
    int s = 0;
    for (; i > 0; i -= i & (-i)) s += bit[i];
    return s;
}
```

A range sum is `prefix_sum(r) - prefix_sum(l - 1)`. Both operations are $O(\log n)$.

## 4. Comparison

| | Prefix sum array | Fenwick tree | Segment tree |
|---|---|---|---|
| Range sum query | $O(1)$ | $O(\log n)$ | $O(\log n)$ |
| Point update | $O(n)$ | $O(\log n)$ | $O(\log n)$ |
| Range min/max | No | Not easily | Yes |
| Range update | No | With tricks | Yes (lazy propagation) |
| Code size | Tiny | Small | Larger |

## Summary

- Trie: one edge per character; insert and search $O(L)$; great for prefixes and autocomplete; memory-hungry.
- Segment tree: each node stores its segment's sum (or min or max); query and update $O(\log n)$; build $O(n)$.
- Lazy propagation extends segment trees to range updates.
- Fenwick tree: prefix sums with point updates in $O(\log n)$ using `i & -i`; range sum = prefix(r) − prefix(l − 1).
- Use a Fenwick tree for plain sums, a segment tree for min, max or range updates.

## Check yourself

<details>
<summary>Why is trie search independent of the number of stored words?</summary>

Search follows one edge per character of the query, so it takes $O(L)$ steps for a word of length $L$, however many other words the trie holds.
</details>

<details>
<summary>When would you choose a segment tree over a Fenwick tree?</summary>

When you need operations a Fenwick tree cannot do easily, such as range minimum or maximum, or range updates with lazy propagation. For plain prefix sums with point updates, a Fenwick tree is simpler and uses less memory.
</details>
