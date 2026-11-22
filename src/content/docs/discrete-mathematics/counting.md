---
title: Counting
description: The sum and product rules, permutations and combinations, counting with repetition, the pigeonhole principle, inclusion–exclusion, derangements, and the binomial theorem.
sidebar:
  label: "7. Counting"
  order: 7
lesson:
  module: Counting
  prerequisites:
    - label: Sets
      link: /discrete-mathematics/sets/
  outcomes:
    - Decide whether a problem needs the sum rule, product rule, permutations or combinations
    - Count selections with repetition using stars and bars
    - Apply the pigeonhole principle to prove that something must happen
    - Expand powers of a binomial and use Pascal's identity
  keyIdea: Ask two questions. **Does order matter?** (permutations if yes, combinations if no). **Is repetition allowed?** Most counting problems are one of the four answers, combined with the sum rule (either/or) and the product rule (first this, then that).
---

## 1. Sum and product rules

- **Sum rule:** if a task can be done in one of $m$ ways **or** one of $n$ ways, with no overlap, there are $m + n$ ways.
- **Product rule:** if a task is a sequence of a step with $m$ ways **and then** a step with $n$ ways, there are $m \times n$ ways.

**Examples.**

- A student picks one project from 5 AI topics or 7 networking topics: $5 + 7 = 12$ choices.
- A password is 2 letters followed by 3 digits: $26^2 \times 10^3 = 676{,}000$.
- Bit strings of length 8: $2^8 = 256$.

## 2. The four basic counts

Choosing $r$ items from $n$:

| | Order matters | Order does not matter |
|---|---|---|
| **No repetition** | $P(n, r) = \dfrac{n!}{(n - r)!}$ | $\dbinom{n}{r} = \dfrac{n!}{r!\,(n - r)!}$ |
| **Repetition allowed** | $n^r$ | $\dbinom{n + r - 1}{r}$ |

**Examples.**

- **Permutation:** a president, secretary and treasurer from 10 people: $P(10, 3) = 10 \cdot 9 \cdot 8 = 720$.
- **Combination:** a committee of 3 from 10 people: $\binom{10}{3} = 120$. Each committee corresponds to $3! = 6$ ordered selections, and $720 / 6 = 120$.
- **With repetition, ordered:** 4-digit PINs: $10^4$.
- **With repetition, unordered:** 6 doughnuts chosen from 4 flavours: $\binom{6 + 4 - 1}{6} = \binom{9}{6} = 84$.

### Stars and bars

The last formula counts solutions of $x_1 + x_2 + \dots + x_n = r$ with every $x_i \ge 0$. Write $r$ stars and $n - 1$ bars in a row; the bars split the stars into $n$ groups. Choosing positions for the bars gives $\binom{r + n - 1}{n - 1} = \binom{r + n - 1}{r}$.

**Example.** $x_1 + x_2 + x_3 = 10$ with $x_i \ge 0$: $\binom{12}{2} = 66$ solutions. If each $x_i \ge 1$, substitute $y_i = x_i - 1$ to get $y_1 + y_2 + y_3 = 7$: $\binom{9}{2} = 36$.

### Arrangements with identical items

The number of distinct arrangements of $n$ items, where $n_1$ are alike of one kind, $n_2$ of another, and so on, is

$$
\frac{n!}{n_1!\, n_2! \cdots n_k!}
$$

**Example.** Arrangements of the letters of BANANA: $\dfrac{6!}{1!\, 3!\, 2!} = 60$.

## 3. The pigeonhole principle

If $N$ objects are placed in $k$ boxes, some box contains at least $\lceil N / k \rceil$ objects. In particular, if $N > k$, some box contains at least two.

**Examples.**

- Among any 367 people, two share a birthday (366 possible birthdays).
- In a class of 50, at least $\lceil 50/12 \rceil = 5$ were born in the same month.
- **Choose any 5 integers from 1 to 8. Two of them add up to 9.** The pairs $\{1,8\}, \{2,7\}, \{3,6\}, \{4,5\}$ are 4 boxes; 5 numbers put two in the same pair.

:::tip[Spotting pigeonhole problems]
They say "show that at least", "must" or "guarantee". The work is choosing the boxes cleverly.
:::

## 4. Inclusion–exclusion and derangements

For counting things that satisfy **at least one** of several conditions, add the single conditions, subtract the overlaps of pairs, add back triples, and so on. See the [worked example in Sets](/discrete-mathematics/sets/#6-inclusionexclusion).

A **derangement** is a permutation where no item stays in its own place: for example, $n$ letters put in $n$ envelopes with every one wrong. Inclusion–exclusion gives

$$
D_n = n! \left(1 - \frac{1}{1!} + \frac{1}{2!} - \frac{1}{3!} + \dots + (-1)^n \frac{1}{n!}\right)
$$

$D_1 = 0$, $D_2 = 1$, $D_3 = 2$, $D_4 = 9$, $D_5 = 44$. As $n$ grows, $D_n / n! \to 1/e \approx 0.368$.

## 5. The binomial theorem

$$
(x + y)^n = \sum_{k=0}^{n} \binom{n}{k} x^{n-k} y^k
$$

**Example.** $(x + y)^4 = x^4 + 4x^3y + 6x^2y^2 + 4xy^3 + y^4$. The coefficient of $x^5y^3$ in $(x + y)^8$ is $\binom{8}{3} = 56$.

**Useful identities:**

- **Pascal's identity:** $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$. Each row of Pascal's triangle is built from the row above.
- **Symmetry:** $\binom{n}{k} = \binom{n}{n-k}$.
- **Row sum:** $\sum_k \binom{n}{k} = 2^n$ (set $x = y = 1$): the number of subsets of an $n$-set.

```text
              1
            1   1
          1   2   1
        1   3   3   1
      1   4   6   4   1
    1   5  10  10   5   1
```

## Summary

- Sum rule for "or" with no overlap; product rule for "and then".
- Ordered without repetition: $P(n, r)$. Unordered without repetition: $\binom{n}{r}$. Ordered with repetition: $n^r$. Unordered with repetition: $\binom{n + r - 1}{r}$.
- Divide by $n_1!\, n_2! \cdots$ for identical items.
- Pigeonhole: $N$ items in $k$ boxes put at least $\lceil N/k \rceil$ in some box.
- $(x + y)^n$ expands with binomial coefficients $\binom{n}{k}$, which obey Pascal's identity.

## Check yourself

<details>
<summary>How many ways can 5 books be arranged on a shelf if two particular books must be next to each other?</summary>

Glue the two books into one block: $4!$ arrangements of the block and the other 3 books, times $2!$ orders inside the block. $24 \times 2 = 48$.
</details>

<details>
<summary>How many bit strings of length 10 contain exactly four 1s?</summary>

Choose the positions of the 1s: $\binom{10}{4} = 210$.
</details>

<details>
<summary>How many people are needed to guarantee that 3 share a birth month?</summary>

$2 \times 12 + 1 = 25$. With 24 people, it is possible to have exactly 2 in each month.
</details>
