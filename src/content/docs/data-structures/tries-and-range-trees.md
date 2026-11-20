---
title: Tries, Segment Trees & Fenwick Trees
description: Tries for fast string and prefix lookups, segment trees for range queries with updates, and Fenwick (binary indexed) trees for prefix sums.
sidebar:
  order: 12
---

These three structures are less common in undergraduate exams than BSTs or heaps, but they appear in admission tests, programming contests and technical interviews.

## Tries (prefix trees)

A **trie** stores strings character by character. Each edge is labelled with a character, and the path from the root spells a prefix. A flag marks nodes where a complete word ends.

```text
Words: car, cat, cart, dog

        (root)
        /    \
       c      d
       |      |
       a      o
      / \     |
     r*  t*   g*
     |
     t*                * = end of a word
```

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

## Segment trees

A **segment tree** answers **range queries** on an array, such as the sum, minimum or maximum of `a[l..r]`, while still allowing the array to change.

Each node covers a segment of the array: the root covers the whole array, and each node's two children cover the left and right halves of its segment. Leaves are single elements.

```text
Array: [2, 5, 1, 4]          Sum segment tree

                 [0..3] = 12
                /           \
        [0..1] = 7        [2..3] = 5
         /     \           /      \
     [0]=2   [1]=5     [2]=1    [3]=4
```

- **Query** `sum(l, r)`: combine the $O(\log n)$ nodes whose segments exactly cover $[l, r]$.
- **Point update** `a[i] = x`: change the leaf and recompute the $O(\log n)$ ancestors.
- **Lazy propagation** extends this to updating a whole range in $O(\log n)$.

| Operation | Cost |
|---|---|
| Build | $O(n)$ |
| Range query | $O(\log n)$ |
| Point update | $O(\log n)$ |
| Memory | About $4n$ array slots |

## Fenwick trees (binary indexed trees)

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

## Comparison

| | Prefix sum array | Fenwick tree | Segment tree |
|---|---|---|---|
| Range sum query | $O(1)$ | $O(\log n)$ | $O(\log n)$ |
| Point update | $O(n)$ | $O(\log n)$ | $O(\log n)$ |
| Range min/max | No | Not easily | Yes |
| Range update | No | With tricks | Yes (lazy propagation) |
| Code size | Tiny | Small | Larger |

## Viva questions

<details>
<summary>Why is trie search independent of the number of stored words?</summary>

Search follows one edge per character of the query, so it takes $O(L)$ steps for a word of length $L$, however many other words the trie holds.
</details>

<details>
<summary>When would you choose a segment tree over a Fenwick tree?</summary>

When you need operations a Fenwick tree cannot do easily, such as range minimum or maximum, or range updates with lazy propagation. For plain prefix sums with point updates, a Fenwick tree is simpler and uses less memory.
</details>
