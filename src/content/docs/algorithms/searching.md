---
title: Searching
description: Linear search, binary search and its variants (first/last occurrence, lower bound, binary search on the answer), interpolation and exponential search, and selection in linear time.
sidebar:
  label: "3. Searching"
  order: 3
lesson:
  module: Foundations
  prerequisites:
    - label: Sorting
      link: /algorithms/sorting/
  outcomes:
    - Trace binary search and give its worst-case number of comparisons
    - Adapt binary search to first and last occurrence and to monotonic conditions
    - Compare interpolation, exponential, jump and ternary search
    - Find the $k$-th smallest element in expected linear time
  keyIdea: >-
    Linear search works on anything in $O(n)$. On **sorted** data, **binary search** halves the range at every comparison, so it needs only $\lfloor \log_2 n \rfloor + 1$ comparisons. The same halving idea finds boundaries, answers "smallest value that works" questions, and underlies quickselect.
---

## 1. Linear search

Check every element in turn. $O(n)$ time, works on **unsorted** data and on linked lists.

```c
int linear_search(int a[], int n, int key) {
    for (int i = 0; i < n; i++)
        if (a[i] == key) return i;
    return -1;
}
```

## 2. Binary search

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

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 620 250" role="img" aria-labelledby="bsearch-t"><title id="bsearch-t">Binary search for 23 in a sorted array of 10 items: mid 16, then 56, then 23 found at index 5.</title><defs><marker id="ah-bsearch" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-bsearch-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-bsearch-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><rect class="dg-cell-a" x="20" y="18" width="40" height="34" rx="4"/><text class="dg-t-a" x="40" y="35" text-anchor="middle">2</text><rect class="dg-cell-a" x="60" y="18" width="40" height="34" rx="4"/><text class="dg-t-a" x="80" y="35" text-anchor="middle">5</text><rect class="dg-cell-a" x="100" y="18" width="40" height="34" rx="4"/><text class="dg-t-a" x="120" y="35" text-anchor="middle">8</text><rect class="dg-cell-a" x="140" y="18" width="40" height="34" rx="4"/><text class="dg-t-a" x="160" y="35" text-anchor="middle">12</text><rect class="dg-cell-b" x="180" y="18" width="40" height="34" rx="4"/><text class="dg-t-b" x="200" y="35" text-anchor="middle">16</text><rect class="dg-cell-a" x="220" y="18" width="40" height="34" rx="4"/><text class="dg-t-a" x="240" y="35" text-anchor="middle">23</text><rect class="dg-cell-a" x="260" y="18" width="40" height="34" rx="4"/><text class="dg-t-a" x="280" y="35" text-anchor="middle">38</text><rect class="dg-cell-a" x="300" y="18" width="40" height="34" rx="4"/><text class="dg-t-a" x="320" y="35" text-anchor="middle">56</text><rect class="dg-cell-a" x="340" y="18" width="40" height="34" rx="4"/><text class="dg-t-a" x="360" y="35" text-anchor="middle">72</text><rect class="dg-cell-a" x="380" y="18" width="40" height="34" rx="4"/><text class="dg-t-a" x="400" y="35" text-anchor="middle">91</text><text class="dg-t-muted" x="430" y="35" style="font-size:13px">mid = 4: 16 &lt; 23, go right</text><rect class="dg-cell-dim" x="20" y="94" width="40" height="34" rx="4"/><text x="40" y="111" text-anchor="middle">2</text><rect class="dg-cell-dim" x="60" y="94" width="40" height="34" rx="4"/><text x="80" y="111" text-anchor="middle">5</text><rect class="dg-cell-dim" x="100" y="94" width="40" height="34" rx="4"/><text x="120" y="111" text-anchor="middle">8</text><rect class="dg-cell-dim" x="140" y="94" width="40" height="34" rx="4"/><text x="160" y="111" text-anchor="middle">12</text><rect class="dg-cell-dim" x="180" y="94" width="40" height="34" rx="4"/><text x="200" y="111" text-anchor="middle">16</text><rect class="dg-cell-a" x="220" y="94" width="40" height="34" rx="4"/><text class="dg-t-a" x="240" y="111" text-anchor="middle">23</text><rect class="dg-cell-a" x="260" y="94" width="40" height="34" rx="4"/><text class="dg-t-a" x="280" y="111" text-anchor="middle">38</text><rect class="dg-cell-b" x="300" y="94" width="40" height="34" rx="4"/><text class="dg-t-b" x="320" y="111" text-anchor="middle">56</text><rect class="dg-cell-a" x="340" y="94" width="40" height="34" rx="4"/><text class="dg-t-a" x="360" y="111" text-anchor="middle">72</text><rect class="dg-cell-a" x="380" y="94" width="40" height="34" rx="4"/><text class="dg-t-a" x="400" y="111" text-anchor="middle">91</text><text class="dg-t-muted" x="430" y="111" style="font-size:13px">mid = 7: 56 &gt; 23, go left</text><rect class="dg-cell-dim" x="20" y="170" width="40" height="34" rx="4"/><text x="40" y="187" text-anchor="middle">2</text><text class="dg-t-muted" x="40" y="218" text-anchor="middle">0</text><rect class="dg-cell-dim" x="60" y="170" width="40" height="34" rx="4"/><text x="80" y="187" text-anchor="middle">5</text><text class="dg-t-muted" x="80" y="218" text-anchor="middle">1</text><rect class="dg-cell-dim" x="100" y="170" width="40" height="34" rx="4"/><text x="120" y="187" text-anchor="middle">8</text><text class="dg-t-muted" x="120" y="218" text-anchor="middle">2</text><rect class="dg-cell-dim" x="140" y="170" width="40" height="34" rx="4"/><text x="160" y="187" text-anchor="middle">12</text><text class="dg-t-muted" x="160" y="218" text-anchor="middle">3</text><rect class="dg-cell-dim" x="180" y="170" width="40" height="34" rx="4"/><text x="200" y="187" text-anchor="middle">16</text><text class="dg-t-muted" x="200" y="218" text-anchor="middle">4</text><rect class="dg-cell-c" x="220" y="170" width="40" height="34" rx="4"/><text class="dg-t-c" x="240" y="187" text-anchor="middle">23</text><text class="dg-t-muted" x="240" y="218" text-anchor="middle">5</text><rect class="dg-cell-a" x="260" y="170" width="40" height="34" rx="4"/><text class="dg-t-a" x="280" y="187" text-anchor="middle">38</text><text class="dg-t-muted" x="280" y="218" text-anchor="middle">6</text><rect class="dg-cell-dim" x="300" y="170" width="40" height="34" rx="4"/><text x="320" y="187" text-anchor="middle">56</text><text class="dg-t-muted" x="320" y="218" text-anchor="middle">7</text><rect class="dg-cell-dim" x="340" y="170" width="40" height="34" rx="4"/><text x="360" y="187" text-anchor="middle">72</text><text class="dg-t-muted" x="360" y="218" text-anchor="middle">8</text><rect class="dg-cell-dim" x="380" y="170" width="40" height="34" rx="4"/><text x="400" y="187" text-anchor="middle">91</text><text class="dg-t-muted" x="400" y="218" text-anchor="middle">9</text><text class="dg-t-c" x="430" y="187" style="font-size:13px">mid = 5: found 23</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>still possible</li><li><span class="dg-swatch b"></span>mid</li><li><span class="dg-swatch dim"></span>discarded</li><li><span class="dg-swatch c"></span>found</li></ul><figcaption>Each step compares the key with the middle of the live range and throws away the half that cannot hold it. Ten items need at most 4 comparisons; a million need at most 20.</figcaption></figure>

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

## 3. Other search techniques

| Method | Idea | Time |
|---|---|---|
| Interpolation search | Guess the position from the key's value, like opening a dictionary near the right letter | $O(\log \log n)$ on uniform data, $O(n)$ worst |
| Exponential search | Check indices 1, 2, 4, 8, … until passing the key, then binary search that range | $O(\log i)$, where $i$ is the key's position; works on unbounded lists |
| Jump search | Jump ahead in steps of $\sqrt{n}$, then scan back linearly | $O(\sqrt{n})$ |
| Ternary search | Find the maximum of a **unimodal** function by discarding a third each step | $O(\log n)$ |
| Hash table lookup | Compute the position from the key | $O(1)$ average; see [Hashing](/data-structures/hashing/) |

## 4. Selection: the k-th smallest element

Sorting finds the $k$-th smallest in $O(n \log n)$, but we can do better.

- **Quickselect:** partition as in quicksort, then recurse into **only** the side containing position $k$. Expected $O(n)$, worst case $O(n^2)$.
- **Median of medians:** choose the pivot as the median of the medians of groups of 5. This guarantees a good split, giving **worst case $O(n)$**: $T(n) \le T(n/5) + T(7n/10) + O(n)$.
- **A heap of size $k$:** $O(n \log k)$, and works on a stream.

## Summary

- Linear search: $O(n)$, works unsorted and on linked lists.
- Binary search: sorted array, $O(\log n)$, at most $\lfloor \log_2 n \rfloor + 1$ comparisons; use `lo + (hi - lo) / 2`.
- Lower and upper bound variants count occurrences; binary search on the answer needs a monotonic condition.
- Interpolation $O(\log \log n)$ on uniform data; exponential $O(\log i)$; jump $O(\sqrt n)$; ternary for unimodal functions.
- Quickselect finds the $k$-th smallest in $O(n)$ expected; median of medians guarantees $O(n)$.

## Check yourself

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
