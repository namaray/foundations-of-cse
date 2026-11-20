---
title: Complexity Analysis
description: Asymptotic notation (Big-O, Omega, Theta), growth rates, best/worst/average case, amortized analysis and space complexity.
sidebar:
  order: 1
---

Complexity analysis measures how the **running time** or **memory** of an algorithm grows as the input size $n$ grows. We ignore constant factors and machine details and compare *growth rates*.

## Asymptotic notation

Let $f(n)$ be the cost of an algorithm and $g(n)$ a simple comparison function.

| Notation | Meaning | Formal definition |
|---|---|---|
| $f(n) = O(g(n))$ | Upper bound: grows **no faster** than $g$ | $\exists\, c > 0, n_0$ such that $0 \le f(n) \le c\,g(n)$ for all $n \ge n_0$ |
| $f(n) = \Omega(g(n))$ | Lower bound: grows **at least as fast** as $g$ | $\exists\, c > 0, n_0$ such that $f(n) \ge c\,g(n) \ge 0$ for all $n \ge n_0$ |
| $f(n) = \Theta(g(n))$ | Tight bound: grows **at the same rate** | $f(n) = O(g(n))$ **and** $f(n) = \Omega(g(n))$ |
| $f(n) = o(g(n))$ | Strictly slower | $\lim_{n\to\infty} f(n)/g(n) = 0$ |
| $f(n) = \omega(g(n))$ | Strictly faster | $\lim_{n\to\infty} f(n)/g(n) = \infty$ |

**Worked example.** Show that $f(n) = 3n^2 + 5n + 2$ is $\Theta(n^2)$.

- Upper bound: for $n \ge 1$, $3n^2 + 5n + 2 \le 3n^2 + 5n^2 + 2n^2 = 10n^2$. So $c = 10$, $n_0 = 1$ gives $O(n^2)$.
- Lower bound: $3n^2 + 5n + 2 \ge 3n^2$ for all $n \ge 1$. So $c = 3$, $n_0 = 1$ gives $\Omega(n^2)$.

:::tip[Rule of thumb]
Keep the fastest-growing term and drop its coefficient: $7n^3 + 100n^2 \log n + 10^6 = \Theta(n^3)$.
:::

## Common growth rates

From slowest to fastest growing:

$$
1 < \log n < \sqrt{n} < n < n \log n < n^2 < n^3 < 2^n < n! < n^n
$$

| Class | Name | Typical example |
|---|---|---|
| $O(1)$ | Constant | Array access `a[i]`, push onto a stack |
| $O(\log n)$ | Logarithmic | Binary search, balanced BST search |
| $O(n)$ | Linear | Linear search, traversing a list |
| $O(n \log n)$ | Linearithmic | Merge sort, heapsort |
| $O(n^2)$ | Quadratic | Bubble sort, comparing all pairs |
| $O(2^n)$ | Exponential | All subsets of a set |
| $O(n!)$ | Factorial | All permutations (brute-force TSP) |

## Counting steps in code

```c
// O(n): the loop body runs n times
for (int i = 0; i < n; i++) sum += a[i];

// O(n^2): n iterations of an O(n) loop
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++) count++;

// O(log n): i doubles each time, so about log2(n) iterations
for (int i = 1; i < n; i *= 2) count++;

// O(n log n): the outer loop runs n times, the inner loop log n times
for (int i = 0; i < n; i++)
    for (int j = 1; j < n; j *= 2) count++;
```

A nested loop where the inner bound depends on the outer index still gives $O(n^2)$:

$$
\sum_{i=0}^{n-1} i = \frac{n(n-1)}{2} = \Theta(n^2)
$$

## Best, worst and average case

The same algorithm can cost different amounts on different inputs of the same size. For **linear search** in an array of $n$ items:

- **Best case:** the key is first. $\Theta(1)$.
- **Worst case:** the key is last or missing. $\Theta(n)$.
- **Average case:** if the key is equally likely to be anywhere, about $n/2$ comparisons. $\Theta(n)$.

Worst-case analysis is the default because it is a guarantee.

:::caution[Common mistake]
Big-O is not the same thing as "worst case". Big-O is a bound on a function; worst case is a choice of input. You can give a Big-O bound for the best case, too.
:::

## Amortized analysis

Amortized analysis averages the cost of a **sequence** of operations, even when a single operation is occasionally expensive. No probability is involved.

**Example: dynamic array append.** When the array is full, allocate double the space and copy everything. Most appends cost 1; an append that triggers a resize costs $k$ copies. Over $n$ appends, the total copying is at most

$$
1 + 2 + 4 + \dots + n < 2n
$$

so the total cost is $O(n)$ and each append is **$O(1)$ amortized**.

The three standard methods are the **aggregate** method (total cost ÷ number of operations, as above), the **accounting** method (overcharge cheap operations and save credit) and the **potential** method (define a potential function on the data structure's state).

## Space complexity

Space complexity counts the **extra** memory an algorithm uses beyond its input.

- Iterative sum of an array: $O(1)$ extra space.
- Merge sort: $O(n)$ for the temporary array.
- Recursive algorithms use stack space proportional to the **recursion depth**. Recursive factorial uses $O(n)$; recursive binary search uses $O(\log n)$.

## Viva questions

<details>
<summary>What is the difference between O, Ω and Θ?</summary>

O is an upper bound, Ω is a lower bound, and Θ is both at once (a tight bound). Saying binary search is $O(n)$ is true but loose; $\Theta(\log n)$ is precise for its worst case.
</details>

<details>
<summary>Why do we ignore constants in asymptotic analysis?</summary>

Constants depend on the machine, compiler and implementation. For large $n$ the growth rate dominates: a $100n$ algorithm beats a $n^2$ one once $n > 100$.
</details>

<details>
<summary>Is an O(n log n) algorithm always faster than an O(n²) one?</summary>

No. Only for large enough $n$. For small inputs, a simple $O(n^2)$ algorithm like insertion sort is often faster because of smaller constants, which is why real sorting libraries switch to insertion sort for small subarrays.
</details>

<details>
<summary>What does amortized O(1) mean?</summary>

Any sequence of $n$ operations costs $O(n)$ in total, so the average per operation is constant, even though a single operation may occasionally cost more.
</details>
