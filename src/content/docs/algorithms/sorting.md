---
title: Sorting
description: Elementary sorts, merge sort, quicksort and heapsort, linear-time counting, radix and bucket sort, the Ω(n log n) lower bound, and stability, with worked examples.
sidebar:
  order: 2
---

Sorting puts items in order. It is the most studied problem in algorithms because so many other algorithms (binary search, greedy algorithms, duplicate detection) start by sorting.

## Summary table

| Algorithm | Best | Average | Worst | Extra space | Stable | In place |
|---|---|---|---|---|---|---|
| Bubble sort (with early exit) | $n$ | $n^2$ | $n^2$ | $O(1)$ | Yes | Yes |
| Selection sort | $n^2$ | $n^2$ | $n^2$ | $O(1)$ | No | Yes |
| Insertion sort | $n$ | $n^2$ | $n^2$ | $O(1)$ | Yes | Yes |
| Merge sort | $n \log n$ | $n \log n$ | $n \log n$ | $O(n)$ | Yes | No |
| Quicksort | $n \log n$ | $n \log n$ | $n^2$ | $O(\log n)$ stack | No | Yes |
| Heapsort | $n \log n$ | $n \log n$ | $n \log n$ | $O(1)$ | No | Yes |
| Counting sort | $n + k$ | $n + k$ | $n + k$ | $O(n + k)$ | Yes | No |
| Radix sort | $d(n + k)$ | $d(n + k)$ | $d(n + k)$ | $O(n + k)$ | Yes | No |
| Bucket sort | $n$ | $n$ | $n^2$ | $O(n)$ | Yes | No |

Here $k$ is the range of key values and $d$ the number of digits.

A sort is **stable** if equal keys keep their original relative order. Stability matters when you sort by one field and then another, and it is required for the digit passes of radix sort.

## Elementary sorts

**Bubble sort** repeatedly swaps adjacent out-of-order pairs. After pass $i$, the $i$ largest items are in their final places. Stopping when a pass makes no swaps gives $O(n)$ on already sorted input.

**Selection sort** finds the minimum of the unsorted part and swaps it to the front. It always makes $\Theta(n^2)$ comparisons but only $O(n)$ swaps, which helps when writes are expensive.

**Insertion sort** takes each item and shifts it left into place among the already-sorted items, like sorting a hand of cards.

```c
void insertion_sort(int a[], int n) {
    for (int j = 1; j < n; j++) {
        int key = a[j], i = j - 1;
        while (i >= 0 && a[i] > key) {
            a[i + 1] = a[i];   // shift right
            i--;
        }
        a[i + 1] = key;
    }
}
```

Insertion sort is fast on small or nearly sorted arrays: its running time is $O(n + I)$, where $I$ is the number of inversions (out-of-order pairs). Library sorts use it for small subarrays.

## Merge sort

**Divide** the array in half, **sort** each half recursively, and **merge** the two sorted halves.

```text
[38 27 43 3 9 82 10]
[38 27 43 3]         [9 82 10]
[38 27] [43 3]       [9 82] [10]
[27 38] [3 43]       [9 82] [10]
[3 27 38 43]         [9 10 82]
[3 9 10 27 38 43 82]
```

Merging two sorted lists of total length $n$ takes $\Theta(n)$: repeatedly take the smaller front item.

```c
void merge(int a[], int lo, int mid, int hi, int tmp[]) {
    int i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi)
        tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];  // <= keeps it stable
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= hi)  tmp[k++] = a[j++];
    for (k = lo; k <= hi; k++) a[k] = tmp[k];
}

void merge_sort(int a[], int lo, int hi, int tmp[]) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    merge_sort(a, lo, mid, tmp);
    merge_sort(a, mid + 1, hi, tmp);
    merge(a, lo, mid, hi, tmp);
}
```

$T(n) = 2T(n/2) + \Theta(n) = \Theta(n \log n)$ in every case. Merge sort is the standard choice for **linked lists** and for **external sorting** of data too big for memory.

## Quicksort

Pick a **pivot**, **partition** the array so smaller items are left of it and larger items right, then sort the two sides recursively. All the work happens in the partition; there is no merge step.

**Lomuto partition** (pivot = last element):

```c
int partition(int a[], int lo, int hi) {
    int pivot = a[hi], i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (a[j] <= pivot) { i++; swap(&a[i], &a[j]); }
    swap(&a[i + 1], &a[hi]);
    return i + 1;            // pivot's final index
}

void quicksort(int a[], int lo, int hi) {
    if (lo < hi) {
        int p = partition(a, lo, hi);
        quicksort(a, lo, p - 1);
        quicksort(a, p + 1, hi);
    }
}
```

**Example:** partition `[2, 8, 7, 1, 3, 5, 6, 4]` with pivot 4.

| j | a[j] | Action | Array |
|---|---|---|---|
| 0 | 2 | ≤ 4: i = 0, swap a[0], a[0] | 2 8 7 1 3 5 6 4 |
| 1 | 8 | > 4 | 2 8 7 1 3 5 6 4 |
| 2 | 7 | > 4 | 2 8 7 1 3 5 6 4 |
| 3 | 1 | ≤ 4: i = 1, swap a[1], a[3] | 2 1 7 8 3 5 6 4 |
| 4 | 3 | ≤ 4: i = 2, swap a[2], a[4] | 2 1 3 8 7 5 6 4 |
| 5 | 5 | > 4 | 2 1 3 8 7 5 6 4 |
| 6 | 6 | > 4 | 2 1 3 8 7 5 6 4 |
| end | | swap a[3] with the pivot | **2 1 3 4 7 5 6 8** |

The pivot 4 is now at index 3, in its final position.

### Analysis

- **Best/average case:** the pivot splits the array roughly in half: $T(n) = 2T(n/2) + \Theta(n) = \Theta(n \log n)$. Even a fixed 9-to-1 split still gives $\Theta(n \log n)$.
- **Worst case:** the pivot is always the smallest or largest item, for example when a sorted array is partitioned around its last element: $T(n) = T(n-1) + \Theta(n) = \Theta(n^2)$.
- **Fixes:** choose a **random pivot** (expected $\Theta(n \log n)$ on every input) or the **median of three**.

In practice quicksort is usually the fastest comparison sort: its inner loop is tight and it is cache-friendly.

## Heapsort

Build a max-heap in $O(n)$, then repeatedly move the maximum to the end and restore the heap. $\Theta(n \log n)$ worst case with $O(1)$ extra space, but not stable. Full details are in [Data Structures: Heaps](/data-structures/heaps/#heapsort).

## The Ω(n log n) lower bound

**Any comparison-based sort needs $\Omega(n \log n)$ comparisons in the worst case.**

Model the sort as a **decision tree**: each internal node is a comparison $a_i \le a_j$, and each leaf is one final ordering. A correct sort must be able to output every one of the $n!$ permutations, so the tree has at least $n!$ leaves. A binary tree of height $h$ has at most $2^h$ leaves, so

$$
2^h \ge n! \implies h \ge \log_2(n!) = \Theta(n \log n)
$$

(using Stirling's approximation, $\log_2 n! \approx n \log_2 n - 1.44n$). So merge sort and heapsort are **asymptotically optimal** comparison sorts.

## Linear-time sorts

These beat $n \log n$ by **not comparing** keys. They need extra assumptions about the keys.

### Counting sort

For integer keys in the range $0 \dots k$:

1. Count how many times each value occurs.
2. Turn the counts into running totals, so `C[v]` is the number of keys $\le v$.
3. Walk the input **from right to left**, placing each key at position `C[key] − 1` and decrementing `C[key]`. Going right to left keeps it stable.

**Example:** `A = [2, 5, 3, 0, 2, 3, 0, 3]`, $k = 5$.

| Value | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Count | 2 | 0 | 2 | 3 | 0 | 1 |
| Running total | 2 | 2 | 4 | 7 | 7 | 8 |

Output: `[0, 0, 2, 2, 3, 3, 3, 5]`. Time $\Theta(n + k)$: excellent when $k = O(n)$, useless when keys range up to $10^9$.

### Radix sort

Sort by the **least significant digit** first, then the next digit, and so on, using a stable sort (usually counting sort) for each pass.

**Example:** `[170, 45, 75, 90, 802, 24, 2, 66]`

| Pass | Result |
|---|---|
| Ones digit | 170, 90, 802, 2, 24, 45, 75, 66 |
| Tens digit | 802, 2, 24, 45, 66, 170, 75, 90 |
| Hundreds digit | **2, 24, 45, 66, 75, 90, 170, 802** |

$d$ passes of $\Theta(n + k)$ each give $\Theta(d(n + k))$.

### Bucket sort

For keys spread **uniformly** over $[0, 1)$: create $n$ buckets, put each key in bucket $\lfloor n \cdot x \rfloor$, sort each bucket with insertion sort, and concatenate. Expected $\Theta(n)$; worst case $\Theta(n^2)$ if everything lands in one bucket.

## Which sort when?

| Situation | Good choice |
|---|---|
| Small or nearly sorted array | Insertion sort |
| Guaranteed $O(n \log n)$ and stable | Merge sort |
| Fastest in practice, general purpose | Quicksort with a random or median-of-three pivot |
| Guaranteed $O(n \log n)$ with $O(1)$ extra memory | Heapsort |
| Linked list | Merge sort |
| Small integer keys | Counting sort |
| Fixed-length integers or strings | Radix sort |

Real libraries combine these. **Introsort** (C++ `std::sort`) runs quicksort, switches to heapsort if recursion gets too deep, and uses insertion sort for small pieces. **Timsort** (Python, Java objects) merges naturally sorted runs found with insertion sort.

## Viva questions

<details>
<summary>Why is quicksort preferred over merge sort in practice, despite its O(n²) worst case?</summary>

It sorts in place, its inner loop is very tight, and it accesses memory sequentially, which suits caches. A random pivot makes the worst case extremely unlikely. Merge sort needs $O(n)$ extra memory for arrays.
</details>

<details>
<summary>Can any sort be faster than O(n log n)?</summary>

Not a comparison sort, by the decision-tree argument. Counting, radix and bucket sort run in linear time because they use the keys' values directly instead of comparing them, which needs assumptions such as small integer keys or a uniform distribution.
</details>

<details>
<summary>Which of the common sorts are stable?</summary>

Bubble, insertion, merge, counting and radix sort are stable. Selection sort, quicksort and heapsort are not, in their usual forms.
</details>

<details>
<summary>What is the worst-case input for quicksort with the last element as pivot?</summary>

An array that is already sorted (or reverse sorted). Every partition puts all remaining items on one side, giving $\Theta(n^2)$.
</details>
