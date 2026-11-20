---
title: Searching
description: Linear search, binary search and its variants (first/last occurrence, lower bound, binary search on the answer), interpolation and exponential search, and selection in linear time.
sidebar:
  order: 3
---

## Linear search

Check every element in turn. $O(n)$ time, works on **unsorted** data and on linked lists.

```c
int linear_search(int a[], int n, int key) {
    for (int i = 0; i < n; i++)
        if (a[i] == key) return i;
    return -1;
}
```

## Binary search

On a **sorted** array, compare the key with the middle element and discard the half that cannot contain it. Each step halves the search space, so it takes at most $\lfloor \log_2 n \rfloor + 1$ comparisons: $O(\log n)$.

```c
int binary_search(int a[], int n, int key) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;   // avoids overflow of (lo + hi)
        if (a[mid] == key) return mid;
        if (a[mid] < key) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
```

**Example:** search for 23 in `[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]`.

| lo | hi | mid | a[mid] | Decision |
|---|---|---|---|---|
| 0 | 9 | 4 | 16 | 16 < 23, go right |
| 5 | 9 | 7 | 56 | 56 > 23, go left |
| 5 | 6 | 5 | 23 | **Found** at index 5 |

:::caution[The classic bug]
`mid = (lo + hi) / 2` overflows when `lo + hi` exceeds the largest `int`. Writing `lo + (hi - lo) / 2` avoids it. This bug sat unnoticed in Java's standard library for years.
:::

### Variants

**First occurrence (lower bound).** Find the first index with `a[i] >= key`. When `a[mid] >= key`, record `mid` and keep searching left.

```c
int lower_bound(int a[], int n, int key) {
    int lo = 0, hi = n;            // search in [lo, hi)
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < key) lo = mid + 1;
        else hi = mid;
    }
    return lo;                     // n if every element is smaller than key
}
```

The number of occurrences of `key` is `upper_bound(key) − lower_bound(key)`, where `upper_bound` finds the first element strictly greater than `key`.

**Binary search on the answer.** If a yes/no condition is *monotonic* (false, false, …, true, true), binary search finds the boundary. For example: the smallest ship capacity that ships all packages within $D$ days, or the integer square root of $n$.

**Rotated sorted array.** One half around `mid` is always sorted. Check whether the key lies in that half and discard the other: still $O(\log n)$.

## Other search techniques

| Method | Idea | Time |
|---|---|---|
| Interpolation search | Guess the position from the key's value, like opening a dictionary near the right letter | $O(\log \log n)$ on uniform data, $O(n)$ worst |
| Exponential search | Check indices 1, 2, 4, 8, … until passing the key, then binary search that range | $O(\log i)$, where $i$ is the key's position; works on unbounded lists |
| Jump search | Jump ahead in steps of $\sqrt{n}$, then scan back linearly | $O(\sqrt{n})$ |
| Ternary search | Find the maximum of a **unimodal** function by discarding a third each step | $O(\log n)$ |
| Hash table lookup | Compute the position from the key | $O(1)$ average; see [Hashing](/data-structures/hashing/) |

## Selection: the k-th smallest element

Sorting finds the $k$-th smallest in $O(n \log n)$, but we can do better.

- **Quickselect:** partition as in quicksort, then recurse into **only** the side containing position $k$. Expected $O(n)$, worst case $O(n^2)$.
- **Median of medians:** choose the pivot as the median of the medians of groups of 5. This guarantees a good split, giving **worst case $O(n)$**: $T(n) \le T(n/5) + T(7n/10) + O(n)$.
- **A heap of size $k$:** $O(n \log k)$, and works on a stream.

## Viva questions

<details>
<summary>Why does binary search need a sorted array?</summary>

Discarding half the array is only safe if everything in that half is known to be smaller (or larger) than the key, which is only guaranteed when the array is sorted.
</details>

<details>
<summary>How many comparisons does binary search need for 1,000,000 elements?</summary>

At most $\lfloor \log_2 10^6 \rfloor + 1 = 20$.
</details>

<details>
<summary>Why is binary search not used on linked lists?</summary>

Reaching the middle node takes $O(n)$ steps, so the total cost is $O(n)$, no better than linear search.
</details>
