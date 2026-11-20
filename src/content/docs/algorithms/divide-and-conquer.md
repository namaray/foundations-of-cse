---
title: Divide and Conquer
description: The divide-and-conquer paradigm with fast exponentiation, maximum subarray, counting inversions, Karatsuba multiplication, Strassen's algorithm and closest pair of points.
sidebar:
  label: "4. Divide and conquer"
  order: 4
lesson:
  module: Design paradigms
  minutes: 35
  priority: medium
---

**Divide and conquer** solves a problem in three steps:

1. **Divide** it into smaller subproblems of the same kind.
2. **Conquer** each subproblem recursively (small ones are solved directly).
3. **Combine** the sub-solutions into a solution for the original problem.

The running time is a recurrence, usually solved with the [Master theorem](/algorithms/recurrences/#the-master-theorem).

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

## Fast exponentiation

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

## Maximum subarray

Find the contiguous subarray with the largest sum. For `[-2, 1, -3, 4, -1, 2, 1, -5, 4]` the answer is `[4, -1, 2, 1]`, with sum **6**.

**Divide and conquer:** the best subarray lies entirely in the left half, entirely in the right half, or **crosses the middle**. The crossing case is found in $O(n)$ by extending left and right from the midpoint as far as profitable. So $T(n) = 2T(n/2) + O(n) = O(n \log n)$.

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

## Counting inversions

An **inversion** is a pair $i < j$ with $a[i] > a[j]$; the count measures how unsorted an array is. Checking all pairs takes $O(n^2)$.

Modify merge sort: while merging, whenever an element from the **right** half is placed before the remaining elements of the left half, it forms an inversion with **each** of them, so add the number of elements left in the left half. Total time $O(n \log n)$.

## Karatsuba multiplication

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

## Strassen's matrix multiplication

Splitting $n \times n$ matrices into four $\frac{n}{2} \times \frac{n}{2}$ blocks gives 8 block multiplications, and $T(n) = 8T(n/2) + O(n^2) = O(n^3)$, no better than the ordinary method. Strassen found a way to use only **7** block multiplications (with extra additions):

$$
T(n) = 7T(n/2) + O(n^2) = O(n^{\log_2 7}) \approx O(n^{2.81})
$$

In practice it only pays off for large matrices, and it is less numerically stable.

## Closest pair of points

Given $n$ points in the plane, find the two closest. Checking every pair takes $O(n^2)$.

1. Sort the points by x-coordinate and split them with a vertical line into two halves.
2. Recursively find the closest distances $\delta_L$ and $\delta_R$; let $\delta = \min(\delta_L, \delta_R)$.
3. A closer pair would have to straddle the line, so only points within distance $\delta$ of the line matter. Sort that strip by y-coordinate; each point needs comparing with at most **7** following points.

The strip check is $O(n)$ (with presorting), so $T(n) = 2T(n/2) + O(n) = O(n \log n)$.

## Viva questions

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
