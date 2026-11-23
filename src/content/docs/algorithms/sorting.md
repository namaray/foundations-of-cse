---
title: Sorting
description: Insertion sort, merge sort, quicksort and heapsort, the Ω(n log n) lower bound, and linear-time counting and radix sort, with worked examples.
sidebar:
  label: "2. Sorting"
  order: 2
lesson:
  module: Foundations
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

<figure class="diagram"><svg style="--dg-min:440px" class="dg" viewBox="0 0 482 254" role="img" aria-labelledby="ins-t"><title id="ins-t">One pass of insertion sort: the key 4 moves left past 9 and 5 into the sorted part.</title><defs><marker id="ah-ins" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-ins-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><text class="dg-t-muted" x="10" y="70.0">Before</text><text class="dg-t-muted" x="10" y="198.0">After</text><rect class="dg-cell-c" x="96" y="48" width="56" height="44" rx="5"/><text class="dg-t-c" x="124.0" y="70.0" text-anchor="middle">2</text><rect class="dg-cell-c" x="160" y="48" width="56" height="44" rx="5"/><text class="dg-t-c" x="188.0" y="70.0" text-anchor="middle">5</text><rect class="dg-cell-c" x="224" y="48" width="56" height="44" rx="5"/><text class="dg-t-c" x="252.0" y="70.0" text-anchor="middle">9</text><rect class="dg-cell-b" x="288" y="48" width="56" height="44" rx="5"/><text class="dg-t-b" x="316.0" y="70.0" text-anchor="middle">4</text><rect class="dg-cell-dim" x="352" y="48" width="56" height="44" rx="5"/><text x="380.0" y="70.0" text-anchor="middle">7</text><rect class="dg-cell-dim" x="416" y="48" width="56" height="44" rx="5"/><text x="444.0" y="70.0" text-anchor="middle">1</text><rect class="dg-cell-c" x="96" y="176" width="56" height="44" rx="5"/><text class="dg-t-c" x="124.0" y="198.0" text-anchor="middle">2</text><rect class="dg-cell-b" x="160" y="176" width="56" height="44" rx="5"/><text class="dg-t-b" x="188.0" y="198.0" text-anchor="middle">4</text><rect class="dg-cell-c" x="224" y="176" width="56" height="44" rx="5"/><text class="dg-t-c" x="252.0" y="198.0" text-anchor="middle">5</text><rect class="dg-cell-c" x="288" y="176" width="56" height="44" rx="5"/><text class="dg-t-c" x="316.0" y="198.0" text-anchor="middle">9</text><rect class="dg-cell-dim" x="352" y="176" width="56" height="44" rx="5"/><text x="380.0" y="198.0" text-anchor="middle">7</text><rect class="dg-cell-dim" x="416" y="176" width="56" height="44" rx="5"/><text x="444.0" y="198.0" text-anchor="middle">1</text><path class="dg-line" marker-end="url(#ah-ins)" d="M252.0,44 Q284.0,14 312.0,42"/><path class="dg-line" marker-end="url(#ah-ins)" d="M188.0,44 Q220.0,14 248.0,42"/><text class="dg-t-muted" x="252.0" y="10" text-anchor="middle">shift larger items right</text><path class="dg-line-b" marker-end="url(#ah-ins-b)" d="M316.0,96 Q252.0,144 192.0,98"/><text class="dg-t-b" x="252.0" y="138" text-anchor="middle" style="font-size:13px">drop the key in</text><text class="dg-t-muted" x="220.0" y="238" text-anchor="middle">sorted part grows by one</text><text class="dg-t-muted" x="412.0" y="238" text-anchor="middle">not yet seen</text></svg><ul class="dg-legend"><li><span class="dg-swatch c"></span>sorted part</li><li><span class="dg-swatch b"></span>key being inserted</li><li><span class="dg-swatch dim"></span>not yet seen</li></ul><figcaption>One pass of insertion sort with key 4. Larger items in the sorted part shift right, then the key drops into the gap.</figcaption></figure>

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

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 464 384" role="img" aria-labelledby="ms-t"><title id="ms-t">Merge sort on 38 27 43 3 9 82 10: the array is split down to single items, then merged back up in sorted order.</title><defs><marker id="ah-ms" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="218.0" y1="49" x2="164.0" y2="64" marker-end="url(#ah-ms)"/><line class="dg-line" x1="218.0" y1="49" x2="308.0" y2="64" marker-end="url(#ah-ms)"/><line class="dg-line" x1="164.0" y1="103" x2="128.0" y2="118" marker-end="url(#ah-ms)"/><line class="dg-line" x1="164.0" y1="103" x2="218.0" y2="118" marker-end="url(#ah-ms)"/><line class="dg-line" x1="308.0" y1="103" x2="308.0" y2="118" marker-end="url(#ah-ms)"/><line class="dg-line" x1="308.0" y1="103" x2="380.0" y2="118" marker-end="url(#ah-ms)"/><line class="dg-line" x1="128.0" y1="157" x2="110.0" y2="172" marker-end="url(#ah-ms)"/><line class="dg-line" x1="128.0" y1="157" x2="164.0" y2="172" marker-end="url(#ah-ms)"/><line class="dg-line" x1="218.0" y1="157" x2="218.0" y2="172" marker-end="url(#ah-ms)"/><line class="dg-line" x1="218.0" y1="157" x2="272.0" y2="172" marker-end="url(#ah-ms)"/><line class="dg-line" x1="308.0" y1="157" x2="326.0" y2="172" marker-end="url(#ah-ms)"/><line class="dg-line" x1="308.0" y1="157" x2="380.0" y2="172" marker-end="url(#ah-ms)"/><line class="dg-line" x1="380.0" y1="157" x2="434.0" y2="172" marker-end="url(#ah-ms)"/><line class="dg-line" x1="110.0" y1="211" x2="128.0" y2="226" marker-end="url(#ah-ms)"/><line class="dg-line" x1="164.0" y1="211" x2="128.0" y2="226" marker-end="url(#ah-ms)"/><line class="dg-line" x1="218.0" y1="211" x2="218.0" y2="226" marker-end="url(#ah-ms)"/><line class="dg-line" x1="272.0" y1="211" x2="218.0" y2="226" marker-end="url(#ah-ms)"/><line class="dg-line" x1="326.0" y1="211" x2="308.0" y2="226" marker-end="url(#ah-ms)"/><line class="dg-line" x1="380.0" y1="211" x2="308.0" y2="226" marker-end="url(#ah-ms)"/><line class="dg-line" x1="434.0" y1="211" x2="380.0" y2="226" marker-end="url(#ah-ms)"/><line class="dg-line" x1="128.0" y1="265" x2="164.0" y2="280" marker-end="url(#ah-ms)"/><line class="dg-line" x1="218.0" y1="265" x2="164.0" y2="280" marker-end="url(#ah-ms)"/><line class="dg-line" x1="308.0" y1="265" x2="308.0" y2="280" marker-end="url(#ah-ms)"/><line class="dg-line" x1="380.0" y1="265" x2="308.0" y2="280" marker-end="url(#ah-ms)"/><line class="dg-line" x1="164.0" y1="319" x2="218.0" y2="334" marker-end="url(#ah-ms)"/><line class="dg-line" x1="308.0" y1="319" x2="218.0" y2="334" marker-end="url(#ah-ms)"/><rect class="dg-cell" x="92" y="14" width="36" height="32" rx="3"/><text x="110.0" y="30.0" text-anchor="middle">38</text><rect class="dg-cell" x="128" y="14" width="36" height="32" rx="3"/><text x="146.0" y="30.0" text-anchor="middle">27</text><rect class="dg-cell" x="164" y="14" width="36" height="32" rx="3"/><text x="182.0" y="30.0" text-anchor="middle">43</text><rect class="dg-cell" x="200" y="14" width="36" height="32" rx="3"/><text x="218.0" y="30.0" text-anchor="middle">3</text><rect class="dg-cell" x="236" y="14" width="36" height="32" rx="3"/><text x="254.0" y="30.0" text-anchor="middle">9</text><rect class="dg-cell" x="272" y="14" width="36" height="32" rx="3"/><text x="290.0" y="30.0" text-anchor="middle">82</text><rect class="dg-cell" x="308" y="14" width="36" height="32" rx="3"/><text x="326.0" y="30.0" text-anchor="middle">10</text><rect class="dg-cell" x="92" y="68" width="36" height="32" rx="3"/><text x="110.0" y="84.0" text-anchor="middle">38</text><rect class="dg-cell" x="128" y="68" width="36" height="32" rx="3"/><text x="146.0" y="84.0" text-anchor="middle">27</text><rect class="dg-cell" x="164" y="68" width="36" height="32" rx="3"/><text x="182.0" y="84.0" text-anchor="middle">43</text><rect class="dg-cell" x="200" y="68" width="36" height="32" rx="3"/><text x="218.0" y="84.0" text-anchor="middle">3</text><rect class="dg-cell" x="254" y="68" width="36" height="32" rx="3"/><text x="272.0" y="84.0" text-anchor="middle">9</text><rect class="dg-cell" x="290" y="68" width="36" height="32" rx="3"/><text x="308.0" y="84.0" text-anchor="middle">82</text><rect class="dg-cell" x="326" y="68" width="36" height="32" rx="3"/><text x="344.0" y="84.0" text-anchor="middle">10</text><rect class="dg-cell" x="92" y="122" width="36" height="32" rx="3"/><text x="110.0" y="138.0" text-anchor="middle">38</text><rect class="dg-cell" x="128" y="122" width="36" height="32" rx="3"/><text x="146.0" y="138.0" text-anchor="middle">27</text><rect class="dg-cell" x="182" y="122" width="36" height="32" rx="3"/><text x="200.0" y="138.0" text-anchor="middle">43</text><rect class="dg-cell" x="218" y="122" width="36" height="32" rx="3"/><text x="236.0" y="138.0" text-anchor="middle">3</text><rect class="dg-cell" x="272" y="122" width="36" height="32" rx="3"/><text x="290.0" y="138.0" text-anchor="middle">9</text><rect class="dg-cell" x="308" y="122" width="36" height="32" rx="3"/><text x="326.0" y="138.0" text-anchor="middle">82</text><rect class="dg-cell" x="362" y="122" width="36" height="32" rx="3"/><text x="380.0" y="138.0" text-anchor="middle">10</text><rect class="dg-cell" x="92" y="176" width="36" height="32" rx="3"/><text x="110.0" y="192.0" text-anchor="middle">38</text><rect class="dg-cell" x="146" y="176" width="36" height="32" rx="3"/><text x="164.0" y="192.0" text-anchor="middle">27</text><rect class="dg-cell" x="200" y="176" width="36" height="32" rx="3"/><text x="218.0" y="192.0" text-anchor="middle">43</text><rect class="dg-cell" x="254" y="176" width="36" height="32" rx="3"/><text x="272.0" y="192.0" text-anchor="middle">3</text><rect class="dg-cell" x="308" y="176" width="36" height="32" rx="3"/><text x="326.0" y="192.0" text-anchor="middle">9</text><rect class="dg-cell" x="362" y="176" width="36" height="32" rx="3"/><text x="380.0" y="192.0" text-anchor="middle">82</text><rect class="dg-cell" x="416" y="176" width="36" height="32" rx="3"/><text x="434.0" y="192.0" text-anchor="middle">10</text><rect class="dg-cell-c" x="92" y="230" width="36" height="32" rx="3"/><text class="dg-t-c" x="110.0" y="246.0" text-anchor="middle">27</text><rect class="dg-cell-c" x="128" y="230" width="36" height="32" rx="3"/><text class="dg-t-c" x="146.0" y="246.0" text-anchor="middle">38</text><rect class="dg-cell-c" x="182" y="230" width="36" height="32" rx="3"/><text class="dg-t-c" x="200.0" y="246.0" text-anchor="middle">3</text><rect class="dg-cell-c" x="218" y="230" width="36" height="32" rx="3"/><text class="dg-t-c" x="236.0" y="246.0" text-anchor="middle">43</text><rect class="dg-cell-c" x="272" y="230" width="36" height="32" rx="3"/><text class="dg-t-c" x="290.0" y="246.0" text-anchor="middle">9</text><rect class="dg-cell-c" x="308" y="230" width="36" height="32" rx="3"/><text class="dg-t-c" x="326.0" y="246.0" text-anchor="middle">82</text><rect class="dg-cell-c" x="362" y="230" width="36" height="32" rx="3"/><text class="dg-t-c" x="380.0" y="246.0" text-anchor="middle">10</text><rect class="dg-cell-c" x="92" y="284" width="36" height="32" rx="3"/><text class="dg-t-c" x="110.0" y="300.0" text-anchor="middle">3</text><rect class="dg-cell-c" x="128" y="284" width="36" height="32" rx="3"/><text class="dg-t-c" x="146.0" y="300.0" text-anchor="middle">27</text><rect class="dg-cell-c" x="164" y="284" width="36" height="32" rx="3"/><text class="dg-t-c" x="182.0" y="300.0" text-anchor="middle">38</text><rect class="dg-cell-c" x="200" y="284" width="36" height="32" rx="3"/><text class="dg-t-c" x="218.0" y="300.0" text-anchor="middle">43</text><rect class="dg-cell-c" x="254" y="284" width="36" height="32" rx="3"/><text class="dg-t-c" x="272.0" y="300.0" text-anchor="middle">9</text><rect class="dg-cell-c" x="290" y="284" width="36" height="32" rx="3"/><text class="dg-t-c" x="308.0" y="300.0" text-anchor="middle">10</text><rect class="dg-cell-c" x="326" y="284" width="36" height="32" rx="3"/><text class="dg-t-c" x="344.0" y="300.0" text-anchor="middle">82</text><rect class="dg-cell-c" x="92" y="338" width="36" height="32" rx="3"/><text class="dg-t-c" x="110.0" y="354.0" text-anchor="middle">3</text><rect class="dg-cell-c" x="128" y="338" width="36" height="32" rx="3"/><text class="dg-t-c" x="146.0" y="354.0" text-anchor="middle">9</text><rect class="dg-cell-c" x="164" y="338" width="36" height="32" rx="3"/><text class="dg-t-c" x="182.0" y="354.0" text-anchor="middle">10</text><rect class="dg-cell-c" x="200" y="338" width="36" height="32" rx="3"/><text class="dg-t-c" x="218.0" y="354.0" text-anchor="middle">27</text><rect class="dg-cell-c" x="236" y="338" width="36" height="32" rx="3"/><text class="dg-t-c" x="254.0" y="354.0" text-anchor="middle">38</text><rect class="dg-cell-c" x="272" y="338" width="36" height="32" rx="3"/><text class="dg-t-c" x="290.0" y="354.0" text-anchor="middle">43</text><rect class="dg-cell-c" x="308" y="338" width="36" height="32" rx="3"/><text class="dg-t-c" x="326.0" y="354.0" text-anchor="middle">82</text><text class="dg-t-muted" x="10" y="111.0">split</text><text class="dg-t-muted" x="10" y="273.0">merge</text></svg><ul class="dg-legend"><li><span class="dg-swatch plain"></span>unsorted piece</li><li><span class="dg-swatch c"></span>sorted piece</li></ul><figcaption>Merge sort on [38, 27, 43, 3, 9, 82, 10]. The top half splits until every piece has one item; the bottom half merges pairs of sorted pieces.</figcaption></figure>

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

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 482 280" role="img" aria-labelledby="qs-t"><title id="qs-t">Quicksort partition of 2 8 7 1 3 5 6 4 around pivot 4, midway and after the final swap.</title><defs><marker id="ah-qs" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker></defs><rect class="dg-cell-a" x="20" y="40" width="50" height="44" rx="5"/><text class="dg-t-a" x="45.0" y="62.0" text-anchor="middle">2</text><rect class="dg-cell-a" x="76" y="40" width="50" height="44" rx="5"/><text class="dg-t-a" x="101.0" y="62.0" text-anchor="middle">1</text><rect class="dg-cell-a" x="132" y="40" width="50" height="44" rx="5"/><text class="dg-t-a" x="157.0" y="62.0" text-anchor="middle">3</text><rect class="dg-cell" x="188" y="40" width="50" height="44" rx="5"/><text x="213.0" y="62.0" text-anchor="middle">8</text><rect class="dg-cell" x="244" y="40" width="50" height="44" rx="5"/><text x="269.0" y="62.0" text-anchor="middle">7</text><rect class="dg-cell-dim" x="300" y="40" width="50" height="44" rx="5"/><text x="325.0" y="62.0" text-anchor="middle">5</text><rect class="dg-cell-dim" x="356" y="40" width="50" height="44" rx="5"/><text x="381.0" y="62.0" text-anchor="middle">6</text><rect class="dg-cell-b" x="412" y="40" width="50" height="44" rx="5"/><text class="dg-t-b" x="437.0" y="62.0" text-anchor="middle">4</text><text class="dg-t-a" x="101.0" y="24" text-anchor="middle" style="font-size:13px">≤ pivot</text><text class="dg-t-strong" x="241.0" y="24" text-anchor="middle" style="font-size:13px">> pivot</text><text class="dg-t-muted" x="353.0" y="24" text-anchor="middle" style="font-size:13px">not checked yet</text><text class="dg-t-b" x="437.0" y="24" text-anchor="middle" style="font-size:13px">pivot</text><line class="dg-line" x1="157.0" y1="114" x2="157.0" y2="90" marker-end="url(#ah-qs)"/><text class="dg-t-strong" x="157.0" y="126" text-anchor="middle">i</text><line class="dg-line" x1="325.0" y1="114" x2="325.0" y2="90" marker-end="url(#ah-qs)"/><text class="dg-t-strong" x="325.0" y="126" text-anchor="middle">j</text><text class="dg-t-muted" x="20" y="154">Midway through the scan (after j = 4)</text><rect class="dg-cell-a" x="20" y="196" width="50" height="44" rx="5"/><text class="dg-t-a" x="45.0" y="218.0" text-anchor="middle">2</text><rect class="dg-cell-a" x="76" y="196" width="50" height="44" rx="5"/><text class="dg-t-a" x="101.0" y="218.0" text-anchor="middle">1</text><rect class="dg-cell-a" x="132" y="196" width="50" height="44" rx="5"/><text class="dg-t-a" x="157.0" y="218.0" text-anchor="middle">3</text><rect class="dg-cell-b" x="188" y="196" width="50" height="44" rx="5"/><text class="dg-t-b" x="213.0" y="218.0" text-anchor="middle">4</text><rect class="dg-cell" x="244" y="196" width="50" height="44" rx="5"/><text x="269.0" y="218.0" text-anchor="middle">7</text><rect class="dg-cell" x="300" y="196" width="50" height="44" rx="5"/><text x="325.0" y="218.0" text-anchor="middle">5</text><rect class="dg-cell" x="356" y="196" width="50" height="44" rx="5"/><text x="381.0" y="218.0" text-anchor="middle">6</text><rect class="dg-cell" x="412" y="196" width="50" height="44" rx="5"/><text x="437.0" y="218.0" text-anchor="middle">8</text><text class="dg-t-a" x="101.0" y="180" text-anchor="middle" style="font-size:13px">smaller</text><text class="dg-t-b" x="213.0" y="180" text-anchor="middle" style="font-size:13px">final place</text><text class="dg-t-strong" x="353.0" y="180" text-anchor="middle" style="font-size:13px">larger</text><text class="dg-t-muted" x="20" y="262">After the final swap: sort each side recursively</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>≤ pivot</li><li><span class="dg-swatch plain"></span>> pivot</li><li><span class="dg-swatch dim"></span>not checked</li><li><span class="dg-swatch b"></span>pivot</li></ul><figcaption>The partition keeps four zones. Everything up to i is at most the pivot, everything between i and j is larger, and the rest has not been checked. The last swap puts the pivot between the two sides.</figcaption></figure>

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

Build a max-heap in $O(n)$, then repeatedly swap the maximum to the end of the array and restore the heap. $\Theta(n \log n)$ in every case with $O(1)$ extra memory, but not stable. See [Heaps](/data-structures/heaps/#5-heapsort) for the full walkthrough.

## 5. Why n log n is the limit

**Any sort that works by comparing items needs $\Omega(n \log n)$ comparisons in the worst case.**

Picture the sort as a **decision tree**: each internal node is one comparison, and each leaf is one possible final order. The sort must be able to produce any of the $n!$ orderings, so the tree needs at least $n!$ leaves. A binary tree of height $h$ has at most $2^h$ leaves, so

<figure class="diagram"><svg style="--dg-min:520px" class="dg" viewBox="0 0 650 285" role="img" aria-labelledby="dt-t"><title id="dt-t">Decision tree for sorting three items a, b, c: three levels of comparisons lead to six leaves, one per possible order.</title><line class="dg-line" x1="310" y1="47.0" x2="160" y2="87.0"/><text class="dg-t-muted" x="221.0" y="67.0" text-anchor="end">yes</text><line class="dg-line" x1="310" y1="47.0" x2="460" y2="87.0"/><text class="dg-t-muted" x="399.0" y="67.0" text-anchor="start">no</text><line class="dg-line" x1="160" y1="121.0" x2="85" y2="161.0"/><text class="dg-t-muted" x="108.5" y="141.0" text-anchor="end">yes</text><line class="dg-line" x1="160" y1="121.0" x2="235" y2="161.0"/><text class="dg-t-muted" x="211.5" y="141.0" text-anchor="start">no</text><line class="dg-line" x1="460" y1="121.0" x2="385" y2="161.0"/><text class="dg-t-muted" x="408.5" y="141.0" text-anchor="end">yes</text><line class="dg-line" x1="460" y1="121.0" x2="535" y2="161.0"/><text class="dg-t-muted" x="511.5" y="141.0" text-anchor="start">no</text><line class="dg-line" x1="235" y1="195.0" x2="180" y2="235.0"/><text class="dg-t-muted" x="193.5" y="215.0" text-anchor="end">yes</text><line class="dg-line" x1="235" y1="195.0" x2="290" y2="235.0"/><text class="dg-t-muted" x="276.5" y="215.0" text-anchor="start">no</text><line class="dg-line" x1="535" y1="195.0" x2="480" y2="235.0"/><text class="dg-t-muted" x="493.5" y="215.0" text-anchor="end">yes</text><line class="dg-line" x1="535" y1="195.0" x2="590" y2="235.0"/><text class="dg-t-muted" x="576.5" y="215.0" text-anchor="start">no</text><rect class="dg-cell" x="262.0" y="13.0" width="96" height="34" rx="6"/><text x="310" y="30" text-anchor="middle">a ≤ b ?</text><rect class="dg-cell" x="112.0" y="87.0" width="96" height="34" rx="6"/><text x="160" y="104" text-anchor="middle">b ≤ c ?</text><rect class="dg-cell" x="412.0" y="87.0" width="96" height="34" rx="6"/><text x="460" y="104" text-anchor="middle">a ≤ c ?</text><rect class="dg-cell-c" x="43.0" y="161.0" width="84" height="34" rx="17"/><text class="dg-t-c" x="85" y="178" text-anchor="middle">a, b, c</text><rect class="dg-cell" x="187.0" y="161.0" width="96" height="34" rx="6"/><text x="235" y="178" text-anchor="middle">a ≤ c ?</text><rect class="dg-cell-c" x="343.0" y="161.0" width="84" height="34" rx="17"/><text class="dg-t-c" x="385" y="178" text-anchor="middle">b, a, c</text><rect class="dg-cell" x="487.0" y="161.0" width="96" height="34" rx="6"/><text x="535" y="178" text-anchor="middle">b ≤ c ?</text><rect class="dg-cell-c" x="138.0" y="235.0" width="84" height="34" rx="17"/><text class="dg-t-c" x="180" y="252" text-anchor="middle">a, c, b</text><rect class="dg-cell-c" x="248.0" y="235.0" width="84" height="34" rx="17"/><text class="dg-t-c" x="290" y="252" text-anchor="middle">c, a, b</text><rect class="dg-cell-c" x="438.0" y="235.0" width="84" height="34" rx="17"/><text class="dg-t-c" x="480" y="252" text-anchor="middle">b, c, a</text><rect class="dg-cell-c" x="548.0" y="235.0" width="84" height="34" rx="17"/><text class="dg-t-c" x="590" y="252" text-anchor="middle">c, b, a</text></svg><ul class="dg-legend"><li><span class="dg-swatch plain"></span>comparison</li><li><span class="dg-swatch c"></span>final order</li></ul><figcaption>A decision tree for sorting three items. Every possible order (3! = 6) needs its own leaf, so at least 3 comparisons are needed in the worst case. For n items the tree needs n! leaves.</figcaption></figure>

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

Numbers are padded to three digits, and the digit used in each pass is in bold. Notice that items with the same digit keep their order from the previous pass; that is why each pass must be stable.

| After sorting by | Result |
|---|---|
| Start | 170, 045, 075, 090, 802, 024, 002, 066 |
| Ones digit | 17**0**, 09**0**, 80**2**, 00**2**, 02**4**, 04**5**, 07**5**, 06**6** |
| Tens digit | 8**0**2, 0**0**2, 0**2**4, 0**4**5, 0**6**6, 1**7**0, 0**7**5, 0**9**0 |
| Hundreds digit | **0**02, **0**24, **0**45, **0**66, **0**75, **0**90, **1**70, **8**02 |

Result: `[2, 24, 45, 66, 75, 90, 170, 802]`.

$d$ passes of $\Theta(n + k)$ each give $\Theta(d(n + k))$.

<details class="go-deeper">
<summary>Go deeper: bucket sort</summary>

For keys spread evenly over $[0, 1)$: make $n$ buckets, put each key $x$ in bucket $\lfloor n x \rfloor$, sort each bucket with insertion sort, and join the buckets in order. Expected time $\Theta(n)$. If the keys all land in one bucket, it degrades to $\Theta(n^2)$.
</details>

## Choosing a sort

:::note[Why n log n matters]
For a million items, an $n^2$ sort makes about $10^{12}$ comparisons. An $n \log n$ sort makes about $2 \times 10^7$, roughly **50,000 times fewer**. At a million comparisons per second, that is 20 seconds instead of 11 days.
:::

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
