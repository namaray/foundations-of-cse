---
title: Arrays
description: One- and two-dimensional arrays, address calculation in row-major and column-major order, operation costs, and dynamic arrays.
sidebar:
  order: 2
---

An **array** stores elements of the same type in **contiguous memory**. Because every element has the same size, the address of any element can be computed directly, which gives $O(1)$ access by index.

## One-dimensional arrays

For an array `A` with lower bound $lb$, base address $B$ and element size $w$ bytes:

$$
\text{Loc}(A[i]) = B + w \cdot (i - lb)
$$

**Example.** `int A[100]` starts at address 2000, each `int` takes 4 bytes, and indexing starts at 0. Then `A[25]` is at $2000 + 4 \times 25 = 2100$.

## Two-dimensional arrays

Memory is one-dimensional, so a 2-D array must be **linearised**. There are two conventions.

Let the array have $m$ rows and $n$ columns, with row lower bound $l_r$ and column lower bound $l_c$.

**Row-major order** (C, C++, Java): store row 0, then row 1, and so on.

$$
\text{Loc}(A[i][j]) = B + w \cdot \big[(i - l_r) \cdot n + (j - l_c)\big]
$$

**Column-major order** (Fortran, MATLAB): store column 0, then column 1, and so on.

$$
\text{Loc}(A[i][j]) = B + w \cdot \big[(j - l_c) \cdot m + (i - l_r)\big]
$$

**Worked example.** `A[1..10][1..15]` has base address 100 and $w = 2$. Find `A[4][8]`.

- $m = 10$ rows, $n = 15$ columns, $l_r = l_c = 1$.
- Row-major: $100 + 2\,[(4-1)\cdot 15 + (8-1)] = 100 + 2 \times 52 = 204$.
- Column-major: $100 + 2\,[(8-1)\cdot 10 + (4-1)] = 100 + 2 \times 73 = 246$.

:::tip[Exam tip]
In row-major order, multiply the row offset by the **number of columns**. In column-major order, multiply the column offset by the **number of rows**. Mixing these up is the most common error.
:::

## Operation costs

| Operation | Cost | Why |
|---|---|---|
| Access `A[i]` | $O(1)$ | Address is computed directly |
| Search (unsorted) | $O(n)$ | Linear scan |
| Search (sorted) | $O(\log n)$ | Binary search |
| Insert at end (space available) | $O(1)$ | Write to the next free slot |
| Insert at position $k$ | $O(n)$ | Shift $n - k$ elements right |
| Delete at position $k$ | $O(n)$ | Shift $n - k - 1$ elements left |

```c
// Insert x at index pos in an array holding n elements (capacity > n).
void insert_at(int a[], int *n, int pos, int x) {
    for (int i = *n; i > pos; i--)
        a[i] = a[i - 1];   // shift right
    a[pos] = x;
    (*n)++;
}
```

## Dynamic arrays

A **dynamic array** (C++ `vector`, Java `ArrayList`, Python `list`) grows automatically. When it is full:

1. Allocate a new block, usually **twice** the size.
2. Copy all elements across.
3. Free the old block.

A single resize costs $O(n)$, but appends are **$O(1)$ amortized** because the total copying over $n$ appends is less than $2n$ (see [amortized analysis](/data-structures/complexity-analysis/#amortized-analysis)).

Growing by a constant amount (say +10 each time) instead of doubling makes $n$ appends cost $O(n^2)$ in total.

## Sparse matrices

A **sparse matrix** has mostly zero entries. Storing every zero wastes memory, so we store only the non-zeros, for example as **triplets** `(row, column, value)`:

```text
Matrix              Triplet form
0 0 3 0             row col val
0 0 0 0              0   2   3
5 0 0 7              2   0   5
                     2   3   7
```

Other formats include linked representations and CSR (compressed sparse row).

## Strengths and weaknesses

**Strengths:** $O(1)$ random access, excellent cache performance (neighbours are adjacent in memory), and no per-element pointer overhead.

**Weaknesses:** fixed size (for static arrays), and insertion or deletion in the middle is $O(n)$.

## Viva questions

<details>
<summary>Why is array access O(1)?</summary>

Elements are contiguous and equally sized, so the address of `A[i]` is one multiplication and one addition away from the base address, regardless of $i$ or $n$.
</details>

<details>
<summary>Why do arrays in C start at index 0?</summary>

The index is an offset from the base address. `A[i]` is defined as `*(A + i)`, so the first element is at offset 0.
</details>

<details>
<summary>Array vs linked list: when would you choose each?</summary>

Choose an array when you need fast random access and the size is known or changes mostly at the end. Choose a linked list when you insert and delete often in the middle and do not need indexing. See the comparison on the [linked lists](/data-structures/linked-lists/#array-vs-linked-list) page.
</details>
