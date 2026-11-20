---
title: Sorting
description: Insertion sort, merge sort, quicksort and heapsort, the Ω(n log n) lower bound, and linear-time counting and radix sort, with worked examples.
sidebar:
  label: "2. Sorting"
  order: 2
lesson:
  module: Foundations
  minutes: 50
  priority: high
  prerequisites:
    - label: Recurrences
      link: /algorithms/recurrences/
    - label: Heaps
      link: /data-structures/heaps/
  outcomes:
    - Trace merge sort and a quicksort partition by hand
    - Give the best, average and worst case of each major sort, and say which are stable
    - Explain why no comparison sort can beat $\Omega(n \log n)$
    - Use counting sort or radix sort when the keys allow it
  keyIdea: Comparison sorts can't beat $n \log n$. **Merge sort** guarantees it, **quicksort** is usually fastest in practice, and **counting** and **radix sort** go faster only by using the key values instead of comparing them.
---

Sorting puts items in order. Many other algorithms, such as binary search and most greedy algorithms, start by sorting, so it's worth knowing the main methods well.

## Two words you'll need

- **Stable:** items with equal keys stay in their original order. This matters when you sort by one field and then another.
- **In place:** the sort uses only $O(1)$ extra memory (or $O(\log n)$ for the recursion stack).

## 1. Insertion sort: the simple baseline

Take each item in turn and slide it left into place among the items already sorted, as you would sort a hand of cards.

```c
void insertion_sort(int a[], int n) {
    for (int j = 1; j < n; j++) {
        int key = a[j], i = j - 1;
        while (i >= 0 && a[i] > key) {
            a[i + 1] = a[i];   // shift larger items right
            i--;
        }
        a[i + 1] = key;
    }
}
```

- **Worst and average case:** $\Theta(n^2)$, for example on reverse-sorted input.
- **Best case:** $\Theta(n)$ on sorted input. In general it takes $O(n + I)$ time, where $I$ is the number of out-of-order pairs.
- Stable and in place.

Because it is so fast on small or nearly sorted arrays, real library sorts switch to insertion sort for small pieces.

<details class="go-deeper">
<summary>Go deeper: bubble sort and selection sort</summary>

**Bubble sort** repeatedly swaps neighbouring pairs that are out of order; after pass $i$ the $i$ largest items are in place. Stopping when a pass makes no swaps gives $O(n)$ on sorted input. Stable.

**Selection sort** finds the smallest remaining item and swaps it to the front. Always $\Theta(n^2)$ comparisons, but only $O(n)$ swaps, which helps when writing is expensive. Not stable.

Both are $\Theta(n^2)$ on average and are mainly asked about in exams, not used in practice.
</details>

## 2. Merge sort: always n log n

**Split** the array in half, **sort** each half recursively, then **merge** the two sorted halves.

```text
[38 27 43 3 9 82 10]
[38 27 43 3]         [9 82 10]          split
[38 27] [43 3]       [9 82] [10]        split
[27 38] [3 43]       [9 82] [10]        sort pairs
[3 27 38 43]         [9 10 82]          merge
[3 9 10 27 38 43 82]                    merge
```

Merging two sorted lists takes linear time: keep taking the smaller of the two front items.

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

- $T(n) = 2T(n/2) + \Theta(n) = \Theta(n \log n)$ in **every** case.
- Stable, but needs $O(n)$ extra memory for arrays.
- The standard choice for **linked lists** and for **external sorting** (data too big for memory).

## 3. Quicksort: fastest in practice

Pick a **pivot** and **partition** the array so smaller items end up on its left and larger items on its right. The pivot is now in its final place; sort the two sides recursively. All the work is in the partition, and there is nothing to merge afterwards.

```c
int partition(int a[], int lo, int hi) {   // Lomuto: pivot = last element
    int pivot = a[hi], i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (a[j] <= pivot) { i++; swap(&a[i], &a[j]); }
    swap(&a[i + 1], &a[hi]);
    return i + 1;                          // pivot's final index
}

void quicksort(int a[], int lo, int hi) {
    if (lo < hi) {
        int p = partition(a, lo, hi);
        quicksort(a, lo, p - 1);
        quicksort(a, p + 1, hi);
    }
}
```

**Worked example:** partition `[2, 8, 7, 1, 3, 5, 6, 4]` around the pivot 4. `i` marks the end of the "≤ pivot" zone.

| j | a[j] | Action | Array after |
|---|---|---|---|
| 0 | 2 | ≤ 4, so i = 0 and swap a[0] with itself | 2 8 7 1 3 5 6 4 |
| 1, 2 | 8, 7 | > 4, skip | 2 8 7 1 3 5 6 4 |
| 3 | 1 | ≤ 4, so i = 1 and swap a[1], a[3] | 2 1 7 8 3 5 6 4 |
| 4 | 3 | ≤ 4, so i = 2 and swap a[2], a[4] | 2 1 3 8 7 5 6 4 |
| 5, 6 | 5, 6 | > 4, skip | 2 1 3 8 7 5 6 4 |
| end | | swap the pivot into a[3] | **2 1 3 4 7 5 6 8** |

**How fast is it?**

- **Average case** $\Theta(n \log n)$: the pivot usually splits the array into reasonable parts. Even a fixed 9-to-1 split still gives $\Theta(n \log n)$.
- **Worst case** $\Theta(n^2)$: the pivot is always the smallest or largest item, for example a sorted array with the last element as pivot. Then $T(n) = T(n-1) + \Theta(n)$.
- **The fix:** choose a random pivot, or the median of the first, middle and last items.
- In place, but **not stable**.

:::tip[Exam tip]
When tracing a partition, write the array after every swap and mark where `i` is. Most lost marks come from forgetting the final swap that puts the pivot in place.
:::

## 4. Heapsort, in brief

Build a max-heap in $O(n)$, then repeatedly swap the maximum to the end of the array and restore the heap. $\Theta(n \log n)$ in every case with $O(1)$ extra memory, but not stable. See [Heaps](/data-structures/heaps/#heapsort) for the full walkthrough.

## 5. Why n log n is the limit

**Any sort that works by comparing items needs $\Omega(n \log n)$ comparisons in the worst case.**

Picture the sort as a **decision tree**: each internal node is one comparison, and each leaf is one possible final order. The sort must be able to produce any of the $n!$ orderings, so the tree needs at least $n!$ leaves. A binary tree of height $h$ has at most $2^h$ leaves, so

$$
2^h \ge n! \implies h \ge \log_2(n!) = \Theta(n \log n)
$$

So merge sort and heapsort are as fast as a comparison sort can be.

## 6. Going faster without comparisons

If keys are small integers, you can sort them in linear time by **using their values** instead of comparing them.

### Counting sort

For integer keys from $0$ to $k$:

1. Count how often each value occurs.
2. Turn the counts into running totals, so `C[v]` is the number of keys $\le v$.
3. Walk the input **from right to left**, placing each key at position `C[key] − 1`, then decrementing `C[key]`. Going right to left keeps it stable.

**Example:** `[2, 5, 3, 0, 2, 3, 0, 3]` with $k = 5$.

| Value | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Count | 2 | 0 | 2 | 3 | 0 | 1 |
| Running total | 2 | 2 | 4 | 7 | 7 | 8 |

Result: `[0, 0, 2, 2, 3, 3, 3, 5]`. Time $\Theta(n + k)$, so it is only useful when $k$ is not much bigger than $n$.

### Radix sort

Sort by the **last digit** first, then the next digit, and so on, using a stable sort such as counting sort for each pass.

**Example:** `[170, 45, 75, 90, 802, 24, 2, 66]`

| After sorting by | Result |
|---|---|
| Ones digit | 170, 90, 802, 2, 24, 45, 75, 66 |
| Tens digit | 802, 2, 24, 45, 66, 170, 75, 90 |
| Hundreds digit | **2, 24, 45, 66, 75, 90, 170, 802** |

$d$ passes of $\Theta(n + k)$ each give $\Theta(d(n + k))$.

<details class="go-deeper">
<summary>Go deeper: bucket sort</summary>

For keys spread evenly over $[0, 1)$: make $n$ buckets, put each key $x$ in bucket $\lfloor n x \rfloor$, sort each bucket with insertion sort, and join the buckets in order. Expected time $\Theta(n)$. If the keys all land in one bucket, it degrades to $\Theta(n^2)$.
</details>

## Choosing a sort

| Algorithm | Best | Average | Worst | Extra space | Stable |
|---|---|---|---|---|---|
| Insertion | $n$ | $n^2$ | $n^2$ | $O(1)$ | Yes |
| Merge | $n \log n$ | $n \log n$ | $n \log n$ | $O(n)$ | Yes |
| Quick | $n \log n$ | $n \log n$ | $n^2$ | $O(\log n)$ | No |
| Heap | $n \log n$ | $n \log n$ | $n \log n$ | $O(1)$ | No |
| Counting | $n + k$ | $n + k$ | $n + k$ | $O(n + k)$ | Yes |
| Radix | $d(n + k)$ | $d(n + k)$ | $d(n + k)$ | $O(n + k)$ | Yes |

- **Small or nearly sorted data:** insertion sort.
- **Must be stable, or sorting a linked list:** merge sort.
- **General purpose, fastest in practice:** quicksort with a random or median-of-three pivot.
- **Guaranteed $n \log n$ with little memory:** heapsort.
- **Small integer keys:** counting sort. **Fixed-length numbers or strings:** radix sort.

<details class="go-deeper">
<summary>Go deeper: what real libraries use</summary>

Real libraries combine these methods. **Introsort** (C++ `std::sort`) runs quicksort, switches to heapsort if the recursion gets too deep, and finishes small pieces with insertion sort. **Timsort** (Python, and Java for objects) finds runs that are already sorted and merges them, using insertion sort to build short runs.
</details>

## Summary

- **Insertion sort** is $\Theta(n^2)$ but excellent on small or nearly sorted input.
- **Merge sort** is always $\Theta(n \log n)$ and stable, at the cost of $O(n)$ extra memory.
- **Quicksort** is $\Theta(n \log n)$ on average and fastest in practice, but $\Theta(n^2)$ in the worst case; a random pivot avoids that.
- No comparison sort can beat $\Omega(n \log n)$, because a decision tree needs at least $n!$ leaves.
- **Counting** and **radix sort** run in linear time by using key values, when keys are small integers or fixed-length.

## Check yourself

<details>
<summary>Why is quicksort usually preferred over merge sort, despite its O(n²) worst case?</summary>

It sorts in place, its inner loop is very short, and it reads memory in order, which suits caches. A random pivot makes the worst case extremely unlikely. Merge sort needs $O(n)$ extra memory for arrays.
</details>

<details>
<summary>What input makes quicksort with the last element as pivot take O(n²)?</summary>

An array that is already sorted, or reverse sorted. Every partition puts all the remaining items on one side.
</details>

<details>
<summary>Which of these sorts are stable: insertion, merge, quick, heap, counting?</summary>

Insertion, merge and counting sort are stable. Quicksort and heapsort, in their usual forms, are not.
</details>

<details>
<summary>Can any sort run faster than O(n log n)?</summary>

Not a comparison sort, by the decision-tree argument. Counting, radix and bucket sort can, because they use the key values directly, but they need extra assumptions such as small integer keys or evenly spread values.
</details>
