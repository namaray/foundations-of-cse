---
title: Query Processing and Optimization
description: The steps of query processing, cost of selection, join algorithms (nested loop, block nested loop, indexed, sort-merge, hash) with cost formulas, heuristic optimization rules, and cost-based plan choice.
sidebar:
  label: "8. Query processing"
  order: 8
lesson:
  module: Storage and queries
  prerequisites:
    - label: Indexing
      link: /database-systems/indexing/
  outcomes:
    - Describe how a SQL query becomes an execution plan
    - Compute block-transfer costs for nested-loop, block nested-loop and hash joins
    - Apply heuristic rules such as pushing selections down
  keyIdea: >-
    The same SQL query can be executed in many ways with costs differing by orders of magnitude. The optimizer rewrites the relational algebra (for example, **filtering early**) and estimates the cost of each plan, choosing join algorithms and join orders that minimise block transfers.
---

## 1. From SQL to a plan

1. **Parsing and translation:** check the syntax and names, and convert the query to relational algebra.
2. **Optimization:** generate equivalent plans and estimate their costs, using statistics such as table sizes and the number of distinct values.
3. **Evaluation:** run the chosen plan. Operators often **pipeline** results to the next operator without writing them to disk.

A **query plan** is a tree of relational algebra operators, each annotated with an algorithm (for example, "hash join" or "index scan").

## 2. Notation

- $b_r$, $b_s$: number of **blocks** in relations $r$ and $s$.
- $n_r$, $n_s$: number of **tuples** (rows).
- $M$: number of memory buffer blocks available.

Costs below count **block transfers**.

## 3. Selection

| Method | When | Cost (approximately) |
|---|---|---|
| Linear scan | Always works | $b_r$ (half on average for a unique key) |
| Binary search | File sorted on the attribute | $\lceil \log_2 b_r \rceil$ + matching blocks |
| Primary B+ tree index | Index on the sorted key | tree height + matching blocks |
| Secondary index | Index on an unsorted attribute | height + **one block per matching record** (can be worse than a scan if many match) |

## 4. Join algorithms

**Example sizes:** $r$ = Student, with $n_r = 5{,}000$ tuples in $b_r = 100$ blocks; $s$ = Enrolled, with $n_s = 20{,}000$ tuples in $b_s = 400$ blocks.

### Nested loop join

```text
for each tuple t_r in r:
    for each tuple t_s in s:
        if they match, output (t_r, t_s)
```

Worst case (one buffer block each): $n_r \cdot b_s + b_r$ transfers.

With Student outer: $5000 \times 400 + 100 = 2{,}000{,}100$.

### Block nested loop join

Loop over **blocks**, not tuples: for each block of $r$, scan $s$ once.

$$
\text{cost} = b_r \cdot b_s + b_r
$$

$100 \times 400 + 100 = 40{,}100$. With $M$ buffers, read $M - 2$ blocks of $r$ at a time: $\lceil b_r / (M-2) \rceil \cdot b_s + b_r$. If the smaller relation fits in memory entirely, the cost drops to $b_r + b_s = 500$.

**Rule:** put the **smaller** relation in the outer loop.

### Indexed nested loop join

If $s$ has an index on the join attribute, look up the matches for each tuple of $r$: cost $\approx b_r + n_r \cdot c$, where $c$ is the cost of one index lookup. Good when $r$ is small.

### Sort-merge join

Sort both relations on the join attribute, then merge them in one pass, like the merge step of [merge sort](/algorithms/sorting/#2-merge-sort-always-n-log-n).

- If already sorted: $b_r + b_s$.
- Otherwise add the cost of external sorting, roughly $2b \log_{M-1}(b/M)$ transfers per relation.

Works for equijoins and natural joins; it also produces sorted output.

### Hash join

1. **Partition** both relations with the same hash function on the join attribute, writing the partitions to disk.
2. For each partition $i$, build an in-memory hash table on $r_i$ and probe it with the tuples of $s_i$.

Matching tuples always land in partitions with the same number.

$$
\text{cost} \approx 3(b_r + b_s) = 3 \times 500 = 1{,}500
$$

(read and write both relations while partitioning, then read them again to join). Only for equijoins.

| Algorithm | Example cost | Needs |
|---|---|---|
| Nested loop | 2,000,100 | Nothing (works for any condition) |
| Block nested loop | 40,100 | Nothing |
| Indexed nested loop | depends | Index on the inner relation |
| Sort-merge | 500 + sorting | Equijoin |
| Hash join | 1,500 | Equijoin |

## 5. Heuristic optimization

Equivalence rules let the optimizer rewrite expressions without changing the result. The key heuristics:

1. **Push selections down:** filter as early as possible, so later operations handle fewer rows.
2. **Push projections down:** drop unneeded columns early.
3. **Turn a product plus selection into a join:** $\sigma_\theta(r \times s) = r \bowtie_\theta s$.
4. **Do the most selective joins first**, to keep intermediate results small.

**Example.** Names of CSE students enrolled in C1:

$$
\pi_{\text{name}}\big(\sigma_{\text{dept}='CSE' \,\land\, \text{cid}='C1'}(\text{Student} \bowtie \text{Enrolled})\big)
$$

is rewritten with the selections pushed down:

$$
\pi_{\text{name}}\big(\sigma_{\text{dept}='CSE'}(\text{Student}) \bowtie \sigma_{\text{cid}='C1'}(\text{Enrolled})\big)
$$

Now only CSE students and C1 enrolments are joined, not the whole tables.

## 6. Cost-based optimization

For each candidate plan, the optimizer estimates the size of intermediate results using **catalog statistics**: row counts, block counts, numbers of distinct values, and histograms. For example, $\sigma_{A = v}(r)$ is estimated at $n_r / V(A, r)$ rows, where $V(A, r)$ is the number of distinct values of $A$.

Joining $k$ relations can be done in a huge number of orders, so optimizers use **dynamic programming** over subsets of relations (as in System R), usually considering only **left-deep** join trees.

You can see the chosen plan with `EXPLAIN` in most databases.

## Summary

- A query is parsed into relational algebra, optimized into a plan, then evaluated, often with pipelining.
- Block nested loop costs $b_r b_s + b_r$; put the smaller relation outside.
- Hash join costs about $3(b_r + b_s)$ and sort-merge $b_r + b_s$ plus sorting; both need equijoins.
- Heuristics: push selections and projections down, turn products into joins, join selective pairs first.
- Cost-based optimizers use statistics and dynamic programming to choose join orders.

## Check yourself

<details>
<summary>In a block nested loop join with b_r = 50 and b_s = 1000, which relation should be outer?</summary>

The smaller one, $r$: $50 \times 1000 + 50 = 50{,}050$. With $s$ outer: $1000 \times 50 + 1000 = 51{,}000$.
</details>

<details>
<summary>Why is pushing selections down usually a good idea?</summary>

It shrinks the inputs to expensive operations like joins, so fewer blocks are read and smaller intermediate results are produced.
</details>

<details>
<summary>Can a hash join evaluate R ⋈ S on R.a < S.b?</summary>

No. Hashing only groups equal values, so it works only for equality conditions. Use a nested-loop variant instead.
</details>
