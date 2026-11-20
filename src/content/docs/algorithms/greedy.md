---
title: Greedy Algorithms
description: The greedy choice and optimal substructure properties, exchange-argument proofs, and worked examples - activity selection, fractional knapsack, Huffman coding and job sequencing - plus cases where greedy fails.
sidebar:
  order: 5
---

A **greedy algorithm** builds a solution step by step, always taking the choice that looks best **right now**, and never reconsidering it. Greedy algorithms are simple and fast, but they are only correct for problems with the right structure.

## When does greedy work?

A problem can be solved greedily when it has both:

1. **Greedy choice property:** some optimal solution starts with the greedy choice. Making it never rules out an optimal answer.
2. **Optimal substructure:** after the greedy choice, what remains is a smaller instance of the same problem, and an optimal solution to it combines with the choice to give an optimal solution overall.

The usual proof technique is an **exchange argument**: take any optimal solution, swap one of its choices for the greedy choice, and show the result is no worse.

## Activity selection

**Problem.** Given activities with start and finish times, choose the largest set that do not overlap.

**Greedy rule.** Sort by **finish time**, and repeatedly take the next activity that starts after the last chosen one finishes.

| Activity | a1 | a2 | a3 | a4 | a5 | a6 | a7 | a8 | a9 | a10 | a11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Start | 1 | 3 | 0 | 5 | 3 | 5 | 6 | 8 | 8 | 2 | 12 |
| Finish | 4 | 5 | 6 | 7 | 9 | 9 | 10 | 11 | 12 | 14 | 16 |

- Take **a1** (finishes at 4).
- a2 and a3 start before 4; skip them. Take **a4** (5 to 7).
- a5, a6 and a7 start before 7. Take **a8** (8 to 11).
- a9 and a10 start before 11. Take **a11** (12 to 16).

Answer: **{a1, a4, a8, a11}**, 4 activities. Time $O(n \log n)$ for sorting, then $O(n)$.

**Why it is correct.** Let $O$ be any optimal solution and $g$ the activity that finishes first overall. Swap $O$'s earliest-finishing activity for $g$: since $g$ finishes no later, it overlaps nothing else in $O$, and the set is the same size. So some optimal solution contains the greedy choice.

:::caution[Wrong greedy rules]
Choosing the **shortest** activity first, or the one that **starts earliest**, can both give suboptimal answers. The choice of greedy rule matters, and must be proved.
:::

## Fractional knapsack

**Problem.** A knapsack holds weight $W$. Each item has a value and a weight, and you may take **any fraction** of an item. Maximise the total value.

**Greedy rule.** Sort by **value per unit weight**, take the best items whole, and take a fraction of the next one to fill the knapsack.

**Example:** $W = 50$.

| Item | Value | Weight | Value/weight |
|---|---|---|---|
| 1 | 60 | 10 | 6 |
| 2 | 100 | 20 | 5 |
| 3 | 120 | 30 | 4 |

Take item 1 (weight 10, value 60) and item 2 (weight 20, value 100). The remaining capacity is 20, so take $20/30$ of item 3: value 80. **Total 240.**

### Greedy fails for 0/1 knapsack

If items cannot be split, the same rule takes items 1 and 2 for a value of **160**, but items 2 and 3 give **220**. The 0/1 knapsack needs [dynamic programming](/algorithms/dynamic-programming/#01-knapsack).

## Huffman coding

**Problem.** Give each character a binary code so that no code is a prefix of another (a **prefix code**) and the encoded text is as short as possible.

**Greedy rule.** Put every character in a min-priority queue keyed by frequency. Repeatedly remove the **two least frequent** nodes, merge them under a new node whose frequency is their sum, and insert it back. The last node is the root; left edges are 0 and right edges are 1.

**Example** (frequencies per 100 characters):

| Char | a | b | c | d | e | f |
|---|---|---|---|---|---|---|
| Frequency | 45 | 13 | 12 | 16 | 9 | 5 |

| Step | Merge | New node |
|---|---|---|
| 1 | f (5) + e (9) | 14 |
| 2 | c (12) + b (13) | 25 |
| 3 | 14 + d (16) | 30 |
| 4 | 25 + 30 | 55 |
| 5 | a (45) + 55 | 100 (root) |

```text
              100
            0/   \1
           a:45   55
                0/   \1
               25     30
             0/ \1   0/ \1
            c   b   14   d
                   0/ \1
                   f   e
```

| Char | a | b | c | d | e | f |
|---|---|---|---|---|---|---|
| Code | 0 | 101 | 100 | 111 | 1101 | 1100 |
| Bits | 1 | 3 | 3 | 3 | 4 | 4 |

Total bits per 100 characters: $45(1) + 13(3) + 12(3) + 16(3) + 9(4) + 5(4) = 224$, compared with 300 for a fixed 3-bit code. Time $O(n \log n)$ with a heap.

The exact codes depend on how ties and left/right are chosen, but the total length is always optimal.

## Job sequencing with deadlines

**Problem.** Each job takes one unit of time, has a deadline and earns a profit if finished by its deadline. Maximise the profit.

**Greedy rule.** Sort jobs by profit, highest first. Put each job in the **latest free time slot** on or before its deadline; skip it if there is none.

| Job | J1 | J2 | J3 | J4 | J5 |
|---|---|---|---|---|---|
| Profit | 100 | 19 | 27 | 25 | 15 |
| Deadline | 2 | 1 | 2 | 1 | 3 |

- J1 (100, deadline 2): slot 2.
- J3 (27, deadline 2): slot 2 is taken, so slot 1.
- J4 (25, deadline 1): slot 1 is taken. Skip.
- J2 (19, deadline 1): skip.
- J5 (15, deadline 3): slot 3.

Schedule: **J3, J1, J5**, total profit **142**.

## More greedy algorithms

These are covered on their own pages:

- [Dijkstra's shortest paths](/algorithms/shortest-paths/#dijkstras-algorithm): always settle the closest unsettled vertex.
- [Kruskal's and Prim's MST](/algorithms/minimum-spanning-trees/): always add the cheapest safe edge.

## When greedy fails

| Problem | Greedy rule | Counterexample |
|---|---|---|
| Coin change, coins {1, 3, 4}, amount 6 | Largest coin first | Greedy: 4 + 1 + 1 (3 coins). Optimal: 3 + 3 (2 coins) |
| 0/1 knapsack | Best value per weight | See above: 160 instead of 220 |
| Longest path in a graph | Take the longest edge | Easy to build a graph where it leads to a dead end |

Greedy coin change does work for "canonical" coin systems such as 1, 2, 5, 10, 20, 50.

## Viva questions

<details>
<summary>What two properties must a problem have for a greedy algorithm to work?</summary>

The greedy choice property (a locally best choice is part of some optimal solution) and optimal substructure (an optimal solution contains optimal solutions to its subproblems).
</details>

<details>
<summary>Why does greedy work for fractional knapsack but not for 0/1 knapsack?</summary>

With fractions, you can always fill the knapsack exactly with the highest-ratio material, so taking it first is never wrong. Without fractions, a high-ratio item can leave unusable empty space, and a combination of lower-ratio items can fill the knapsack better.
</details>

<details>
<summary>Why is a Huffman code a prefix code, and why does that matter?</summary>

Characters sit only at leaves, so no character's path is the start of another's. That means the encoded bit string can be decoded unambiguously, left to right, without separators.
</details>

<details>
<summary>Greedy vs dynamic programming: what is the key difference?</summary>

Greedy makes one choice at each step and never looks back. DP considers all choices, solving and storing every subproblem, then picks the best. DP is more general; greedy is faster when it is provably correct.
</details>
