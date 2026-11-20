---
title: Heaps & Priority Queues
description: Binary max-heaps and min-heaps in an array, sift-up and sift-down, building a heap in O(n), heapsort, and heap-based priority queues.
sidebar:
  order: 9
---

A **binary heap** is a **complete** binary tree that satisfies the **heap property**:

- **Max-heap:** every parent is greater than or equal to its children, so the maximum is at the root.
- **Min-heap:** every parent is less than or equal to its children, so the minimum is at the root.

A heap is *not* sorted: siblings can be in any order. It only guarantees that the root is the extreme value.

## Array representation

Because the tree is complete, it is stored in an array with no gaps and no pointers. With 0-based indexing:

$$
\text{parent}(i) = \left\lfloor \frac{i-1}{2} \right\rfloor, \qquad \text{left}(i) = 2i + 1, \qquad \text{right}(i) = 2i + 2
$$

```text
Max-heap as a tree           As an array
          90
        /    \               index: 0  1  2  3  4  5
      70      80             value: 90 70 80 20 60 50
     /  \    /
   20   60  50
```

With 1-based indexing the formulas become parent $= \lfloor i/2 \rfloor$, left $= 2i$, right $= 2i + 1$. Exams use both, so check which one the question uses.

The height of a heap with $n$ nodes is $\lfloor \log_2 n \rfloor$.

## Insertion: sift up

Put the new key in the next free slot (the end of the array), then swap it with its parent while it is larger than the parent. $O(\log n)$.

**Example:** insert **85** into the heap above.

```text
[90 70 80 20 60 50 85]   85 at index 6, parent index 2 holds 80 → swap
[90 70 85 20 60 50 80]   85 at index 2, parent index 0 holds 90 → stop
```

## Extract max: sift down

1. Save the root (the maximum).
2. Move the **last** element to the root and shrink the heap by one.
3. Swap it with its **larger** child while it is smaller than that child.

$O(\log n)$.

```c
void sift_down(int a[], int n, int i) {
    while (1) {
        int largest = i, l = 2*i + 1, r = 2*i + 2;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest == i) return;
        int t = a[i]; a[i] = a[largest]; a[largest] = t;
        i = largest;
    }
}
```

## Building a heap in O(n)

Inserting $n$ keys one by one costs $O(n \log n)$. **Bottom-up heap construction** is faster: leaves are already heaps, so call `sift_down` on every internal node from the last one, index $\lfloor n/2 \rfloor - 1$, back to the root.

```c
void build_max_heap(int a[], int n) {
    for (int i = n/2 - 1; i >= 0; i--)
        sift_down(a, n, i);
}
```

**Example:** build a max-heap from `[4, 10, 3, 5, 1]`.

- $n = 5$, so start at index 1 (value 10). Its children are 5 and 1, so nothing changes.
- Index 0 (value 4): the larger child is 10, so swap → `[10, 4, 3, 5, 1]`. Now 4 is at index 1 with children 5 and 1; swap with 5 → `[10, 5, 3, 4, 1]`.

Result: **`[10, 5, 3, 4, 1]`**.

**Why $O(n)$?** Most nodes are near the bottom and sift down only a short way. About $n/2^{h+1}$ nodes have height $h$, and each costs $O(h)$:

$$
\sum_{h=0}^{\lfloor \log n \rfloor} \frac{n}{2^{h+1}} \cdot O(h) = O\!\left(n \sum_{h \ge 0} \frac{h}{2^h}\right) = O(n)
$$

because $\sum_{h \ge 0} h / 2^h = 2$.

## Heapsort

1. Build a max-heap: $O(n)$.
2. Repeat $n - 1$ times: swap the root (the maximum) with the last element of the heap, shrink the heap by one, and sift the new root down: $O(\log n)$ each.

```c
void heapsort(int a[], int n) {
    build_max_heap(a, n);
    for (int end = n - 1; end > 0; end--) {
        int t = a[0]; a[0] = a[end]; a[end] = t;  // move max to its final place
        sift_down(a, end, 0);
    }
}
```

| Property | Heapsort |
|---|---|
| Time (best, average, worst) | $O(n \log n)$ |
| Extra space | $O(1)$, in place |
| Stable? | **No** |

## Priority queue operations

| Operation | Binary heap |
|---|---|
| `insert` | $O(\log n)$ |
| `find-max` | $O(1)$ |
| `extract-max` | $O(\log n)$ |
| `increase-key` | $O(\log n)$ (sift up) |
| `build` from $n$ items | $O(n)$ |
| Search for an arbitrary key | $O(n)$ |

More advanced heaps (binomial, Fibonacci) speed up merging and decrease-key; Fibonacci heaps make Dijkstra's algorithm $O(E + V \log V)$.

## Applications

- **Dijkstra's** shortest paths and **Prim's** minimum spanning tree (min-heap of distances)
- **Huffman coding** (repeatedly take the two smallest frequencies)
- **Top-$k$** problems: keep a min-heap of size $k$
- **Median of a stream:** a max-heap for the lower half plus a min-heap for the upper half
- CPU and event scheduling

## Viva questions

<details>
<summary>What is the difference between a heap and a BST?</summary>

A BST orders left < node < right, so it supports sorted traversal and search in $O(\log n)$ when balanced. A heap only orders parent ≥ children, so it finds the max in $O(1)$ but searching for an arbitrary key takes $O(n)$. A heap is always complete, so it fits in an array; a BST need not be.
</details>

<details>
<summary>Why is heapsort not stable?</summary>

Swapping the root with the last element moves items across long distances, so equal keys can change their relative order.
</details>

<details>
<summary>Where is the minimum element in a max-heap?</summary>

Somewhere among the leaves, which occupy indices $\lfloor n/2 \rfloor$ to $n - 1$. Finding it takes $O(n)$.
</details>
