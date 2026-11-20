---
title: Hashing
description: Hash functions, collision resolution by chaining and open addressing (linear probing, quadratic probing, double hashing), load factor and rehashing, with worked examples.
sidebar:
  order: 6
---

**Hashing** maps a key directly to a position in a table using a **hash function** $h(k)$. Search, insert and delete then take **$O(1)$ on average**, far faster than the $O(\log n)$ of a balanced tree.

## Hash functions

A good hash function is fast to compute and spreads keys **uniformly** over the table, $0 \dots m-1$.

| Method | Formula | Notes |
|---|---|---|
| Division | $h(k) = k \bmod m$ | Choose $m$ prime and not close to a power of 2 |
| Multiplication | $h(k) = \lfloor m \cdot (kA \bmod 1) \rfloor$, $0 < A < 1$ | $m$ can be anything; Knuth suggests $A \approx 0.618$ |
| Mid-square | Square $k$ and take the middle digits | Uses all digits of the key |
| Folding | Split $k$ into parts and add them | Good for long keys such as phone numbers |

**Example (mid-square).** $k = 3205$, $k^2 = 10272025$; the middle two digits are **72**.

**Example (folding).** $k = 123456789$ split into `123 | 456 | 789`: $123 + 456 + 789 = 1368$, then reduce modulo $m$.

## Collisions

A **collision** happens when two keys hash to the same slot: $h(k_1) = h(k_2)$. By the pigeonhole principle collisions are unavoidable once there are more possible keys than slots, so every hash table needs a collision strategy.

The **load factor** is

$$
\alpha = \frac{n}{m} = \frac{\text{number of keys}}{\text{number of slots}}
$$

## Separate chaining

Each slot holds a **linked list** of all keys that hash there.

```text
h(k) = k mod 7, keys 50, 700, 76, 85, 92, 73, 101

0 → 700
1 → 50 → 85 → 92
2
3 → 73 → 101
4
5
6 → 76
```

- Expected search cost: $\Theta(1 + \alpha)$. With $\alpha$ kept constant, that is $O(1)$.
- $\alpha$ can exceed 1.
- Deletion is easy: remove the node from its list.
- Worst case: every key lands in one list, giving $O(n)$.

## Open addressing

All keys live in the table itself. On a collision, **probe** other slots in a fixed sequence until a free one is found. Here $\alpha \le 1$ always.

For the $i$-th probe ($i = 0, 1, 2, \dots$):

| Method | Probe sequence | Problem |
|---|---|---|
| Linear probing | $(h(k) + i) \bmod m$ | **Primary clustering**: long runs of filled slots form and grow |
| Quadratic probing | $(h(k) + c_1 i + c_2 i^2) \bmod m$ | **Secondary clustering**: keys with the same home slot follow the same path |
| Double hashing | $(h_1(k) + i \cdot h_2(k)) \bmod m$ | Best spread; $h_2(k)$ must never be 0 |

### Worked example

Insert **50, 700, 76, 85, 92, 73, 101** into a table of size $m = 7$ with $h(k) = k \bmod 7$.

Home slots: 50→1, 700→0, 76→6, 85→1, 92→1, 73→3, 101→3.

**Linear probing**

- 85: slot 1 is taken, so try 2. Placed at **2**.
- 92: slots 1 and 2 are taken. Placed at **3**.
- 73: slot 3 is taken. Placed at **4**.
- 101: slots 3 and 4 are taken. Placed at **5**.

| Slot | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| Key | 700 | 50 | 85 | 92 | 73 | 101 | 76 |

**Quadratic probing**, $(h(k) + i^2) \bmod 7$

- 85: home 1 is taken; $1 + 1 = 2$. Placed at **2**.
- 92: home 1 is taken; $1 + 1 = 2$ is taken; $1 + 4 = 5$. Placed at **5**.
- 73: home 3 is free. Placed at **3**.
- 101: home 3 is taken; $3 + 1 = 4$. Placed at **4**.

| Slot | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| Key | 700 | 50 | 85 | 73 | 101 | 92 | 76 |

**Double hashing**, $h_2(k) = 5 - (k \bmod 5)$

- 85: $h_2 = 5$. Probes $1 \to 6$ (taken) $\to 4$. Placed at **4**.
- 92: $h_2 = 3$. Probes $1 \to 4$ (taken) $\to 0$ (taken) $\to 3$. Placed at **3**.
- 73: $h_2 = 2$. Probes $3$ (taken) $\to 5$. Placed at **5**.
- 101: $h_2 = 4$. Probes $3 \to 0 \to 4 \to 1 \to 5$ (all taken) $\to 2$. Placed at **2**.

| Slot | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| Key | 700 | 50 | 101 | 92 | 85 | 73 | 76 |

:::caution[Deleting in open addressing]
You cannot simply empty a slot, because that breaks the probe chain for keys inserted after it. Mark the slot with a **tombstone** ("deleted") instead: searches skip over it and insertions may reuse it.
:::

### Expected probes (uniform hashing)

| | Unsuccessful search | Successful search |
|---|---|---|
| Open addressing | $\dfrac{1}{1 - \alpha}$ | $\dfrac{1}{\alpha} \ln \dfrac{1}{1 - \alpha}$ |

At $\alpha = 0.5$ an unsuccessful search needs about 2 probes; at $\alpha = 0.9$, about 10. That is why open-addressing tables are kept well below full.

## Rehashing

When $\alpha$ passes a threshold (often 0.75 for chaining, 0.5 for linear probing), allocate a table about **twice as large** (usually the next prime) and re-insert every key with the new hash function. A single rehash is $O(n)$, but insertions stay **$O(1)$ amortized**.

## Chaining vs open addressing

| | Chaining | Open addressing |
|---|---|---|
| Load factor | Can exceed 1 | Must stay below 1 |
| Extra memory | Pointers in each node | None |
| Deletion | Simple | Needs tombstones |
| Cache performance | Worse (pointer chasing) | Better (probes are close together) |
| Sensitivity to a bad hash function | Lower | Higher (clustering) |

## Applications

Symbol tables in compilers, database indexing, caches, sets and dictionaries (Python `dict`, Java `HashMap`), duplicate detection, and password storage (with cryptographic hashes, a related but different idea).

## Viva questions

<details>
<summary>Why should the table size be a prime number for the division method?</summary>

If $m$ shares factors with patterns in the keys (for example, all keys even and $m$ even), those keys map to only a fraction of the slots. A prime $m$ not near a power of 2 spreads such keys more evenly.
</details>

<details>
<summary>What is primary clustering?</summary>

In linear probing, a run of occupied slots grows because any key that hashes anywhere into the run is placed at its end, making the run longer still. Searches then slow down sharply as the load factor rises.
</details>

<details>
<summary>If hashing is O(1), why do we still use balanced BSTs?</summary>

Hashing gives $O(1)$ only on average, has an $O(n)$ worst case, and keeps keys in no particular order. A balanced BST guarantees $O(\log n)$ and supports ordered operations: minimum, maximum, successor and range queries.
</details>
