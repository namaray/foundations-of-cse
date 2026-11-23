---
title: Heaps & Priority Queues
description: Binary max-heaps and min-heaps in an array, sift-up and sift-down, building a heap in O(n), heapsort, and heap-based priority queues.
sidebar:
  label: "9. Heaps"
  order: 9
lesson:
  module: Hashing and trees
  prerequisites:
    - label: Trees and BSTs
      link: /data-structures/trees-and-bst/
    - label: Queues (priority queues)
      link: /data-structures/queues/
  outcomes:
    - Store a heap in an array and find parents and children by index
    - Insert with sift up and extract the maximum with sift down
    - Build a heap bottom-up in $O(n)$ and explain why it is linear
    - Trace heapsort and state its properties
  keyIdea: >-
    A binary heap is a **complete** binary tree where every parent is at least as large as its children (max-heap), so the maximum is always at the root. Being complete, it lives in an **array** with no pointers. Insert and extract-max each walk one path: $O(\log n)$. That makes heaps the standard **priority queue** and the engine of heapsort.
---

A **binary heap** is a **complete** binary tree that satisfies the **heap property**:

- **Max-heap:** every parent is greater than or equal to its children, so the maximum is at the root.
- **Min-heap:** every parent is less than or equal to its children, so the minimum is at the root.

A heap is *not* sorted: siblings can be in any order. It only guarantees that the root is the extreme value.

## 1. Array representation

Because the tree is complete, it is stored in an array with no gaps and no pointers. With 0-based indexing:

$$
\text{parent}(i) = \left\lfloor \frac{i-1}{2} \right\rfloor, \qquad \text{left}(i) = 2i + 1, \qquad \text{right}(i) = 2i + 2
$$

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 560 226" role="img" aria-labelledby="heaparr-t"><title id="heaparr-t">The max-heap 90, 70, 80, 20, 60, 50 drawn as a tree and stored as an array; each node at index i has children at 2i+1 and 2i+2.</title><defs><marker id="ah-heaparr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-heaparr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-heaparr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="117.3" y1="42.7" x2="76.7" y2="83.3"/><line class="dg-line" x1="56" y1="112.1" x2="39" y2="145.9"/><line class="dg-line" x1="72" y1="112.1" x2="89" y2="145.9"/><line class="dg-line" x1="142.7" y1="42.7" x2="183.3" y2="83.3"/><line class="dg-line" x1="188" y1="112.1" x2="171" y2="145.9"/><path class="dg-line-a" d="M350.0,142 Q390.0,172 430.0,144" marker-end="url(#ah-heaparr-a)"/><path class="dg-line-a" d="M350.0,142 Q410.0,192 470.0,144" marker-end="url(#ah-heaparr-a)"/><circle class="dg-cell" cx="31" cy="162" r="18"/><text x="31" y="162" text-anchor="middle">20</text><circle class="dg-cell" cx="97" cy="162" r="18"/><text x="97" y="162" text-anchor="middle">60</text><circle class="dg-cell" cx="64" cy="96" r="18"/><text x="64" y="96" text-anchor="middle">70</text><circle class="dg-cell" cx="163" cy="162" r="18"/><text x="163" y="162" text-anchor="middle">50</text><circle class="dg-cell" cx="196" cy="96" r="18"/><text x="196" y="96" text-anchor="middle">80</text><circle class="dg-cell-a" cx="130" cy="30" r="18"/><text class="dg-t-a" x="130" y="30" text-anchor="middle">90</text><text class="dg-t-muted" x="154" y="12" text-anchor="middle" style="font-size:12px">0</text><text class="dg-t-muted" x="88" y="78" text-anchor="middle" style="font-size:12px">1</text><text class="dg-t-muted" x="220" y="78" text-anchor="middle" style="font-size:12px">2</text><text class="dg-t-muted" x="55" y="144" text-anchor="middle" style="font-size:12px">3</text><text class="dg-t-muted" x="121" y="144" text-anchor="middle" style="font-size:12px">4</text><text class="dg-t-muted" x="187" y="144" text-anchor="middle" style="font-size:12px">5</text><rect class="dg-cell-a" x="290" y="80" width="40" height="38" rx="4"/><text class="dg-t-a" x="310" y="99" text-anchor="middle">90</text><text class="dg-t-muted" x="310" y="132" text-anchor="middle">0</text><rect class="dg-cell" x="330" y="80" width="40" height="38" rx="4"/><text x="350" y="99" text-anchor="middle">70</text><text class="dg-t-muted" x="350" y="132" text-anchor="middle">1</text><rect class="dg-cell" x="370" y="80" width="40" height="38" rx="4"/><text x="390" y="99" text-anchor="middle">80</text><text class="dg-t-muted" x="390" y="132" text-anchor="middle">2</text><rect class="dg-cell" x="410" y="80" width="40" height="38" rx="4"/><text x="430" y="99" text-anchor="middle">20</text><text class="dg-t-muted" x="430" y="132" text-anchor="middle">3</text><rect class="dg-cell" x="450" y="80" width="40" height="38" rx="4"/><text x="470" y="99" text-anchor="middle">60</text><text class="dg-t-muted" x="470" y="132" text-anchor="middle">4</text><rect class="dg-cell" x="490" y="80" width="40" height="38" rx="4"/><text x="510" y="99" text-anchor="middle">50</text><text class="dg-t-muted" x="510" y="132" text-anchor="middle">5</text><text class="dg-t-muted" x="290" y="60">as an array</text><text class="dg-t-a" x="434" y="206" text-anchor="middle" style="font-size:13px">children of index 1: 3 and 4</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>root, the maximum</li></ul><figcaption>Small numbers beside the nodes are array indices. Reading the tree level by level gives the array, with no pointers needed: children of index i are 2i + 1 and 2i + 2, and its parent is ⌊(i − 1)/2⌋.</figcaption></figure>

With 1-based indexing the formulas become parent $= \lfloor i/2 \rfloor$, left $= 2i$, right $= 2i + 1$. Exams use both, so check which one the question uses.

The height of a heap with $n$ nodes is $\lfloor \log_2 n \rfloor$.

## 2. Insertion: sift up

Put the new key in the next free slot (the end of the array), then swap it with its parent while it is larger than the parent. $O(\log n)$.

**Example:** insert **85** into the heap above.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 600 220" role="img" aria-labelledby="siftup-t"><title id="siftup-t">Inserting 85: it starts as the last leaf under 80, swaps with 80, then stops under 90.</title><defs><marker id="ah-siftup" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-siftup-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-siftup-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="127.5" y1="42.9" x2="88.5" y2="83.1"/><line class="dg-line" x1="68.1" y1="112.2" x2="51.9" y2="145.8"/><line class="dg-line" x1="83.9" y1="112.2" x2="100.1" y2="145.8"/><line class="dg-line" x1="152.5" y1="42.9" x2="191.5" y2="83.1"/><line class="dg-line" x1="196.1" y1="112.2" x2="179.9" y2="145.8"/><line class="dg-line-b" x1="211.9" y1="112.2" x2="228.1" y2="145.8"/><line class="dg-line" x1="447.5" y1="42.9" x2="408.5" y2="83.1"/><line class="dg-line" x1="388.1" y1="112.2" x2="371.9" y2="145.8"/><line class="dg-line" x1="403.9" y1="112.2" x2="420.1" y2="145.8"/><line class="dg-line-b" x1="472.5" y1="42.9" x2="511.5" y2="83.1"/><line class="dg-line" x1="516.1" y1="112.2" x2="499.9" y2="145.8"/><line class="dg-line" x1="531.9" y1="112.2" x2="548.1" y2="145.8"/><line class="dg-line" x1="260" y1="96" x2="330" y2="96" marker-end="url(#ah-siftup)"/><circle class="dg-cell" cx="44" cy="162" r="18"/><text x="44" y="162" text-anchor="middle">20</text><circle class="dg-cell" cx="108" cy="162" r="18"/><text x="108" y="162" text-anchor="middle">60</text><circle class="dg-cell" cx="76" cy="96" r="18"/><text x="76" y="96" text-anchor="middle">70</text><circle class="dg-cell" cx="172" cy="162" r="18"/><text x="172" y="162" text-anchor="middle">50</text><circle class="dg-cell-b" cx="236" cy="162" r="18"/><text class="dg-t-b" x="236" y="162" text-anchor="middle">85</text><circle class="dg-cell-a" cx="204" cy="96" r="18"/><text class="dg-t-a" x="204" y="96" text-anchor="middle">80</text><circle class="dg-cell" cx="140" cy="30" r="18"/><text x="140" y="30" text-anchor="middle">90</text><circle class="dg-cell" cx="364" cy="162" r="18"/><text x="364" y="162" text-anchor="middle">20</text><circle class="dg-cell" cx="428" cy="162" r="18"/><text x="428" y="162" text-anchor="middle">60</text><circle class="dg-cell" cx="396" cy="96" r="18"/><text x="396" y="96" text-anchor="middle">70</text><circle class="dg-cell" cx="492" cy="162" r="18"/><text x="492" y="162" text-anchor="middle">50</text><circle class="dg-cell" cx="556" cy="162" r="18"/><text x="556" y="162" text-anchor="middle">80</text><circle class="dg-cell-b" cx="524" cy="96" r="18"/><text class="dg-t-b" x="524" y="96" text-anchor="middle">85</text><circle class="dg-cell-a" cx="460" cy="30" r="18"/><text class="dg-t-a" x="460" y="30" text-anchor="middle">90</text><text class="dg-t-muted" x="295" y="82" text-anchor="middle" style="font-size:13px">swap with 80</text><text class="dg-t-a" x="460" y="6" text-anchor="middle" style="font-size:13px">85 &lt; 90: stop</text></svg><ul class="dg-legend"><li><span class="dg-swatch b"></span>new key</li><li><span class="dg-swatch a"></span>parent compared</li></ul><figcaption>Sift up: place the new key in the next free slot (index 6), then swap it with its parent while it is larger. It took one swap here, and never more than the height, O(log n).</figcaption></figure>

## 3. Extract max: sift down

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

## 4. Building a heap in O(n)

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

## 5. Heapsort

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

## 6. Priority queue operations

| Operation | Binary heap |
|---|---|
| `insert` | $O(\log n)$ |
| `find-max` | $O(1)$ |
| `extract-max` | $O(\log n)$ |
| `increase-key` | $O(\log n)$ (sift up) |
| `build` from $n$ items | $O(n)$ |
| Search for an arbitrary key | $O(n)$ |

More advanced heaps (binomial, Fibonacci) speed up merging and decrease-key; Fibonacci heaps make Dijkstra's algorithm $O(E + V \log V)$.

## 7. Applications

- **Dijkstra's** shortest paths and **Prim's** minimum spanning tree (min-heap of distances)
- **Huffman coding** (repeatedly take the two smallest frequencies)
- **Top-$k$** problems: keep a min-heap of size $k$
- **Median of a stream:** a max-heap for the lower half plus a min-heap for the upper half
- CPU and event scheduling

## Summary

- Heap property: parent ≥ children (max-heap); the array is not sorted.
- 0-based: children $2i + 1$, $2i + 2$; parent $\lfloor (i - 1)/2 \rfloor$. 1-based: $2i$, $2i + 1$, $\lfloor i/2 \rfloor$.
- Insert: add at the end and sift up. Extract max: move the last item to the root and sift down. Both $O(\log n)$.
- Bottom-up build calls sift down from $n/2 - 1$ to 0: $O(n)$ in total.
- Heapsort: $O(n \log n)$ in every case, in place, not stable.

## Check yourself

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
