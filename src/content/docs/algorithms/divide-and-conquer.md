---
title: Divide and Conquer
description: The divide-and-conquer paradigm with fast exponentiation, maximum subarray, counting inversions, Karatsuba multiplication, Strassen's algorithm and closest pair of points.
sidebar:
  label: "4. Divide and conquer"
  order: 4
lesson:
  module: Design paradigms
  prerequisites:
    - label: Recurrences
      link: /algorithms/recurrences/
    - label: Sorting
      link: /algorithms/sorting/
  outcomes:
    - Describe the divide, conquer and combine steps of an algorithm
    - Compute powers in $O(\log n)$ multiplications
    - Solve maximum subarray and count inversions in $O(n \log n)$
    - Explain how Karatsuba and Strassen beat the obvious algorithms
  keyIdea: >-
    Divide and conquer splits a problem into **independent** smaller copies, solves them recursively and **combines** the answers. The running time is a recurrence, and the trick is usually to make the combine step cheap or to need **fewer subproblems**: Karatsuba uses 3 half-size products instead of 4, and Strassen 7 instead of 8.
---

**Divide and conquer** solves a problem in three steps:

1. **Divide** it into smaller subproblems of the same kind.
2. **Conquer** each subproblem recursively (small ones are solved directly).
3. **Combine** the sub-solutions into a solution for the original problem.

The running time is a recurrence, usually solved with the [Master theorem](/algorithms/recurrences/#3-the-master-theorem).

| Algorithm | Divide | Combine | Recurrence | Time |
|---|---|---|---|---|
| Binary search | Pick one half | Nothing | $T(n/2) + O(1)$ | $O(\log n)$ |
| Merge sort | Split in half | Merge, $O(n)$ | $2T(n/2) + O(n)$ | $O(n \log n)$ |
| Quicksort | Partition, $O(n)$ | Nothing | $2T(n/2) + O(n)$ on average | $O(n \log n)$ average |
| Fast exponentiation | Halve the exponent | Square | $T(n/2) + O(1)$ | $O(\log n)$ |
| Karatsuba | Split the digits | Add and shift | $3T(n/2) + O(n)$ | $O(n^{1.585})$ |
| Strassen | Split into quadrants | Add matrices | $7T(n/2) + O(n^2)$ | $O(n^{2.81})$ |
| Closest pair | Split by x-coordinate | Check a strip | $2T(n/2) + O(n)$ | $O(n \log n)$ |

[Merge sort and quicksort](/algorithms/sorting/) are covered on the sorting page.

## 1. Fast exponentiation

Computing $a^n$ by repeated multiplication takes $n - 1$ steps. Instead use

$$
a^n = \begin{cases} (a^{n/2})^2 & n \text{ even} \\ a \cdot (a^{(n-1)/2})^2 & n \text{ odd} \end{cases}
$$

```c
long long power(long long a, int n) {
    if (n == 0) return 1;
    long long half = power(a, n / 2);
    return (n % 2 == 0) ? half * half : a * half * half;
}
```

$O(\log n)$ multiplications. With a modulus this is **modular exponentiation**, the core operation of RSA.

## 2. Maximum subarray

Find the contiguous subarray with the largest sum. For `[-2, 1, -3, 4, -1, 2, 1, -5, 4]` the answer is `[4, -1, 2, 1]`, with sum **6**.

**Divide and conquer:** the best subarray lies entirely in the left half, entirely in the right half, or **crosses the middle**. The crossing case is found in $O(n)$ by extending left and right from the midpoint as far as profitable. So $T(n) = 2T(n/2) + O(n) = O(n \log n)$.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 520 178" role="img" aria-labelledby="maxsub-t"><title id="maxsub-t">Maximum subarray of -2, 1, -3, 4, -1, 2, 1, -5, 4: the best run 4, -1, 2, 1 (sum 6) crosses the middle.</title><defs><marker id="ah-maxsub" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-maxsub-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-maxsub-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line-b" x1="280" y1="30" x2="280" y2="124" stroke-dasharray="5 4"/><rect class="dg-cell" x="30" y="54" width="50" height="40" rx="4"/><text x="55" y="74" text-anchor="middle">-2</text><text class="dg-t-muted" x="55" y="108" text-anchor="middle">0</text><rect class="dg-cell" x="80" y="54" width="50" height="40" rx="4"/><text x="105" y="74" text-anchor="middle">1</text><text class="dg-t-muted" x="105" y="108" text-anchor="middle">1</text><rect class="dg-cell" x="130" y="54" width="50" height="40" rx="4"/><text x="155" y="74" text-anchor="middle">-3</text><text class="dg-t-muted" x="155" y="108" text-anchor="middle">2</text><rect class="dg-cell-c" x="180" y="54" width="50" height="40" rx="4"/><text class="dg-t-c" x="205" y="74" text-anchor="middle">4</text><text class="dg-t-muted" x="205" y="108" text-anchor="middle">3</text><rect class="dg-cell-c" x="230" y="54" width="50" height="40" rx="4"/><text class="dg-t-c" x="255" y="74" text-anchor="middle">-1</text><text class="dg-t-muted" x="255" y="108" text-anchor="middle">4</text><rect class="dg-cell-c" x="280" y="54" width="50" height="40" rx="4"/><text class="dg-t-c" x="305" y="74" text-anchor="middle">2</text><text class="dg-t-muted" x="305" y="108" text-anchor="middle">5</text><rect class="dg-cell-c" x="330" y="54" width="50" height="40" rx="4"/><text class="dg-t-c" x="355" y="74" text-anchor="middle">1</text><text class="dg-t-muted" x="355" y="108" text-anchor="middle">6</text><rect class="dg-cell" x="380" y="54" width="50" height="40" rx="4"/><text x="405" y="74" text-anchor="middle">-5</text><text class="dg-t-muted" x="405" y="108" text-anchor="middle">7</text><rect class="dg-cell" x="430" y="54" width="50" height="40" rx="4"/><text x="455" y="74" text-anchor="middle">4</text><text class="dg-t-muted" x="455" y="108" text-anchor="middle">8</text><text class="dg-t-b" x="280" y="18" text-anchor="middle" style="font-size:13px">middle</text><text class="dg-t-muted" x="155" y="36" text-anchor="middle">left half</text><text class="dg-t-muted" x="380" y="36" text-anchor="middle">right half</text><text class="dg-t-c" x="280" y="144" text-anchor="middle" style="font-size:13px">best run ending at the middle: 4 − 1 = 3</text><text class="dg-t-c" x="280" y="164" text-anchor="middle" style="font-size:13px">plus best run starting after it: 2 + 1 = 3, total 6</text></svg><ul class="dg-legend"><li><span class="dg-swatch c"></span>best subarray, sum 6</li></ul><figcaption>The best subarray is in the left half, in the right half, or crosses the middle. The crossing case takes O(n): extend left from the middle as far as pays, then right. So T(n) = 2T(n/2) + O(n) = O(n log n).</figcaption></figure>

**Kadane's algorithm** does better, in $O(n)$, with a dynamic-programming idea: the best subarray ending at position $i$ is either `a[i]` alone or `a[i]` added to the best subarray ending at $i - 1$.

```c
int max_subarray(int a[], int n) {
    int best = a[0], cur = a[0];
    for (int i = 1; i < n; i++) {
        cur = (cur + a[i] > a[i]) ? cur + a[i] : a[i];
        if (cur > best) best = cur;
    }
    return best;
}
```

## 3. Counting inversions

An **inversion** is a pair $i < j$ with $a[i] > a[j]$; the count measures how unsorted an array is. Checking all pairs takes $O(n^2)$.

Modify merge sort: while merging, whenever an element from the **right** half is placed before the remaining elements of the left half, it forms an inversion with **each** of them, so add the number of elements left in the left half. Total time $O(n \log n)$.

## 4. Karatsuba multiplication

Multiplying two $n$-digit numbers the school way takes $O(n^2)$. Split each number into halves:

$$
x = a \cdot 10^m + b, \qquad y = c \cdot 10^m + d
$$

$$
xy = ac \cdot 10^{2m} + (ad + bc) \cdot 10^m + bd
$$

That needs four half-size products. Karatsuba's trick computes the middle term from **one** extra product:

$$
ad + bc = (a + b)(c + d) - ac - bd
$$

Three multiplications instead of four: $T(n) = 3T(n/2) + O(n) = O(n^{\log_2 3}) \approx O(n^{1.585})$.

## 5. Strassen's matrix multiplication

Splitting $n \times n$ matrices into four $\frac{n}{2} \times \frac{n}{2}$ blocks gives 8 block multiplications, and $T(n) = 8T(n/2) + O(n^2) = O(n^3)$, no better than the ordinary method. Strassen found a way to use only **7** block multiplications (with extra additions):

$$
T(n) = 7T(n/2) + O(n^2) = O(n^{\log_2 7}) \approx O(n^{2.81})
$$

In practice it only pays off for large matrices, and it is less numerically stable.

## 6. Closest pair of points

Given $n$ points in the plane, find the two closest. Checking every pair takes $O(n^2)$.

1. Sort the points by x-coordinate and split them with a vertical line into two halves.
2. Recursively find the closest distances $\delta_L$ and $\delta_R$; let $\delta = \min(\delta_L, \delta_R)$.
3. A closer pair would have to straddle the line, so only points within distance $\delta$ of the line matter. Sort that strip by y-coordinate; each point needs comparing with at most **7** following points.

The strip check is $O(n)$ (with presorting), so $T(n) = 2T(n/2) + O(n) = O(n \log n)$.

## Summary

- Divide, conquer, combine; the subproblems don't overlap (unlike dynamic programming).
- Fast exponentiation: $a^n = (a^{n/2})^2$, $O(\log n)$ multiplications.
- Maximum subarray: left, right or crossing, $O(n \log n)$; Kadane's algorithm does it in $O(n)$.
- Counting inversions piggybacks on merge sort: $O(n \log n)$.
- Karatsuba $3T(n/2) + O(n) = O(n^{1.585})$; Strassen $7T(n/2) + O(n^2) = O(n^{2.81})$; closest pair $O(n \log n)$.

## Check yourself

<details>
<summary>What is the difference between divide and conquer and dynamic programming?</summary>

Both split a problem into subproblems. In divide and conquer the subproblems are **independent** (the two halves in merge sort never overlap). In dynamic programming they **overlap**, so solutions are stored and reused instead of being recomputed.
</details>

<details>
<summary>Why does Karatsuba's algorithm beat O(n²)?</summary>

It replaces four half-size multiplications with three, at the cost of a few extra additions. Reducing $a$ from 4 to 3 in $T(n) = aT(n/2) + O(n)$ lowers the exponent from $\log_2 4 = 2$ to $\log_2 3 \approx 1.585$.
</details>

<details>
<summary>Give an example where divide and conquer is not the best approach.</summary>

Maximum subarray: divide and conquer gives $O(n \log n)$, but Kadane's algorithm solves it in $O(n)$. Naive recursive Fibonacci is another: its subproblems overlap, so plain recursion is exponential.
</details>
