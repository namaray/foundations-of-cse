---
title: Arrays
description: One- and two-dimensional arrays, address calculation in row-major and column-major order, operation costs, and dynamic arrays.
sidebar:
  label: "2. Arrays"
  order: 2
lesson:
  module: Linear structures
  prerequisites:
    - label: Complexity analysis
      link: /data-structures/complexity-analysis/
  outcomes:
    - Compute the address of an element in a 1-D array
    - Compute 2-D addresses in row-major and column-major order
    - State the cost of each array operation
    - Explain why dynamic arrays double and how sparse matrices save memory
  keyIdea: >-
    An array stores equal-sized elements **contiguously**, so the address of `A[i]` is base $+\; w \cdot i$ and access is $O(1)$. The price is $O(n)$ insertion and deletion in the middle. A 2-D array is laid out row by row (**row-major**, C) or column by column (**column-major**, Fortran).
---

An **array** stores elements of the same type in **contiguous memory**. Because every element has the same size, the address of any element can be computed directly, which gives $O(1)$ access by index.

## 1. One-dimensional arrays

For an array `A` with lower bound $lb$, base address $B$ and element size $w$ bytes:

$$
\text{Loc}(A[i]) = B + w \cdot (i - lb)
$$

**Example.** `int A[100]` starts at address 2000, each `int` takes 4 bytes, and indexing starts at 0. Then `A[25]` is at $2000 + 4 \times 25 = 2100$.

## 2. Two-dimensional arrays

Memory is one-dimensional, so a 2-D array must be **linearised**. There are two conventions.

Let the array have $m$ rows and $n$ columns, with row lower bound $l_r$ and column lower bound $l_c$.

**Row-major order** (C, C++, Java): store row 0, then row 1, and so on.

$$
\text{Loc}(A[i][j]) = B + w \cdot \big[(i - l_r) \cdot n + (j - l_c)\big]
$$

**Column-major order** (Fortran, MATLAB): store column 0, then column 1, and so on.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 520 250" role="img" aria-labelledby="rowcol-t"><title id="rowcol-t">A 2 by 3 matrix stored in row-major order (row 0 then row 1) and column-major order (column by column).</title><defs><marker id="ah-rowcol" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-rowcol-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-rowcol-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><text class="dg-t-muted" x="70" y="18" text-anchor="middle">Matrix A[2][3]</text><rect class="dg-cell-a" x="16" y="34" width="36" height="36" rx="3"/><text class="dg-t-a" x="34" y="52" text-anchor="middle" style="font-size:13px">a00</text><rect class="dg-cell-a" x="52" y="34" width="36" height="36" rx="3"/><text class="dg-t-a" x="70" y="52" text-anchor="middle" style="font-size:13px">a01</text><rect class="dg-cell-a" x="88" y="34" width="36" height="36" rx="3"/><text class="dg-t-a" x="106" y="52" text-anchor="middle" style="font-size:13px">a02</text><rect class="dg-cell-c" x="16" y="70" width="36" height="36" rx="3"/><text class="dg-t-c" x="34" y="88" text-anchor="middle" style="font-size:13px">a10</text><rect class="dg-cell-c" x="52" y="70" width="36" height="36" rx="3"/><text class="dg-t-c" x="70" y="88" text-anchor="middle" style="font-size:13px">a11</text><rect class="dg-cell-c" x="88" y="70" width="36" height="36" rx="3"/><text class="dg-t-c" x="106" y="88" text-anchor="middle" style="font-size:13px">a12</text><text class="dg-t-a" x="198" y="52" style="font-size:13px">row 0</text><text class="dg-t-c" x="198" y="88" style="font-size:13px">row 1</text><text class="dg-t-strong" x="16" y="150">Row-major</text><rect class="dg-cell-a" x="140" y="132" width="56" height="36" rx="4"/><text class="dg-t-a" x="168" y="150" text-anchor="middle" style="font-size:13px">a00</text><text class="dg-t-muted" x="168" y="182" text-anchor="middle">0</text><rect class="dg-cell-a" x="196" y="132" width="56" height="36" rx="4"/><text class="dg-t-a" x="224" y="150" text-anchor="middle" style="font-size:13px">a01</text><text class="dg-t-muted" x="224" y="182" text-anchor="middle">1</text><rect class="dg-cell-a" x="252" y="132" width="56" height="36" rx="4"/><text class="dg-t-a" x="280" y="150" text-anchor="middle" style="font-size:13px">a02</text><text class="dg-t-muted" x="280" y="182" text-anchor="middle">2</text><rect class="dg-cell-c" x="308" y="132" width="56" height="36" rx="4"/><text class="dg-t-c" x="336" y="150" text-anchor="middle" style="font-size:13px">a10</text><text class="dg-t-muted" x="336" y="182" text-anchor="middle">3</text><rect class="dg-cell-c" x="364" y="132" width="56" height="36" rx="4"/><text class="dg-t-c" x="392" y="150" text-anchor="middle" style="font-size:13px">a11</text><text class="dg-t-muted" x="392" y="182" text-anchor="middle">4</text><rect class="dg-cell-c" x="420" y="132" width="56" height="36" rx="4"/><text class="dg-t-c" x="448" y="150" text-anchor="middle" style="font-size:13px">a12</text><text class="dg-t-muted" x="448" y="182" text-anchor="middle">5</text><text class="dg-t-strong" x="16" y="214">Column-major</text><rect class="dg-cell-a" x="140" y="196" width="56" height="36" rx="4"/><text class="dg-t-a" x="168" y="214" text-anchor="middle" style="font-size:13px">a00</text><text class="dg-t-muted" x="168" y="246" text-anchor="middle">0</text><rect class="dg-cell-c" x="196" y="196" width="56" height="36" rx="4"/><text class="dg-t-c" x="224" y="214" text-anchor="middle" style="font-size:13px">a10</text><text class="dg-t-muted" x="224" y="246" text-anchor="middle">1</text><rect class="dg-cell-a" x="252" y="196" width="56" height="36" rx="4"/><text class="dg-t-a" x="280" y="214" text-anchor="middle" style="font-size:13px">a01</text><text class="dg-t-muted" x="280" y="246" text-anchor="middle">2</text><rect class="dg-cell-c" x="308" y="196" width="56" height="36" rx="4"/><text class="dg-t-c" x="336" y="214" text-anchor="middle" style="font-size:13px">a11</text><text class="dg-t-muted" x="336" y="246" text-anchor="middle">3</text><rect class="dg-cell-a" x="364" y="196" width="56" height="36" rx="4"/><text class="dg-t-a" x="392" y="214" text-anchor="middle" style="font-size:13px">a02</text><text class="dg-t-muted" x="392" y="246" text-anchor="middle">4</text><rect class="dg-cell-c" x="420" y="196" width="56" height="36" rx="4"/><text class="dg-t-c" x="448" y="214" text-anchor="middle" style="font-size:13px">a12</text><text class="dg-t-muted" x="448" y="246" text-anchor="middle">5</text><text class="dg-t-muted" x="308" y="120" text-anchor="middle">memory offsets 0 to 5</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>row 0</li><li><span class="dg-swatch c"></span>row 1</li></ul><figcaption>Row-major keeps each row together, so A[i][j] is at offset i·n + j. Column-major keeps each column together, so it is at offset j·m + i.</figcaption></figure>

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

## 3. Operation costs

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

## 4. Dynamic arrays

A **dynamic array** (C++ `vector`, Java `ArrayList`, Python `list`) grows automatically. When it is full:

1. Allocate a new block, usually **twice** the size.
2. Copy all elements across.
3. Free the old block.

A single resize costs $O(n)$, but appends are **$O(1)$ amortized** because the total copying over $n$ appends is less than $2n$ (see [amortized analysis](/data-structures/complexity-analysis/#5-amortized-analysis)).

Growing by a constant amount (say +10 each time) instead of doubling makes $n$ appends cost $O(n^2)$ in total.

## 5. Sparse matrices

A **sparse matrix** has mostly zero entries. Storing every zero wastes memory, so we store only the non-zeros, for example as **triplets** `(row, column, value)`:

```text
Matrix              Triplet form
0 0 3 0             row col val
0 0 0 0              0   2   3
5 0 0 7              2   0   5
                     2   3   7
```

Other formats include linked representations and CSR (compressed sparse row).

## 6. Strengths and weaknesses

**Strengths:** $O(1)$ random access, excellent cache performance (neighbours are adjacent in memory), and no per-element pointer overhead.

**Weaknesses:** fixed size (for static arrays), and insertion or deletion in the middle is $O(n)$.

## Summary

- $\text{Loc}(A[i]) = B + w(i - lb)$: one multiply and one add, so access is $O(1)$.
- Row-major: $B + w[(i - l_r)n + (j - l_c)]$ (times the number of **columns**). Column-major: $B + w[(j - l_c)m + (i - l_r)]$ (times the number of **rows**).
- Insert or delete in the middle is $O(n)$ because elements shift.
- Dynamic arrays double when full: $O(1)$ amortized append. Growing by a constant gives $O(n^2)$ total.
- Sparse matrices store only non-zeros, for example as (row, column, value) triplets.

## Check yourself

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

Choose an array when you need fast random access and the size is known or changes mostly at the end. Choose a linked list when you insert and delete often in the middle and do not need indexing. See the comparison on the [linked lists](/data-structures/linked-lists/#4-array-vs-linked-list) page.
</details>
