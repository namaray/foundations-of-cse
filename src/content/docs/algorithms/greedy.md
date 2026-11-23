---
title: Greedy Algorithms
description: The greedy choice and optimal substructure properties, exchange-argument proofs, and worked examples - activity selection, fractional knapsack, Huffman coding and job sequencing - plus cases where greedy fails.
sidebar:
  label: "5. Greedy algorithms"
  order: 5
lesson:
  module: Design paradigms
  prerequisites:
    - label: Sorting
      link: /algorithms/sorting/
    - label: Heaps
      link: /data-structures/heaps/
  outcomes:
    - State the greedy-choice property and prove a greedy rule with an exchange argument
    - Solve activity selection and fractional knapsack
    - Build a Huffman code and compute its total length
    - Recognise problems where greedy fails, such as 0/1 knapsack
  keyIdea: >-
    A greedy algorithm makes the choice that looks best **now** and never goes back. It is fast and simple, but only correct when the problem has the **greedy-choice property** and **optimal substructure**, which you show with an **exchange argument**. Choosing the right rule (earliest finish, best value per weight, least frequent first) is the whole game.
---

A **greedy algorithm** builds a solution step by step, always taking the choice that looks best **right now**, and never reconsidering it. Greedy algorithms are simple and fast, but they are only correct for problems with the right structure.

## 1. When does greedy work?

A problem can be solved greedily when it has both:

1. **Greedy choice property:** some optimal solution starts with the greedy choice. Making it never rules out an optimal answer.
2. **Optimal substructure:** after the greedy choice, what remains is a smaller instance of the same problem, and an optimal solution to it combines with the choice to give an optimal solution overall.

The usual proof technique is an **exchange argument**: take any optimal solution, swap one of its choices for the greedy choice, and show the result is no worse.

## 2. Activity selection

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

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 560 330" role="img" aria-labelledby="acts-t"><title id="acts-t">Activities a1 to a11 drawn as time bars, sorted by finish time; greedy picks a1, a4, a8 and a11.</title><defs><marker id="ah-acts" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-acts-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-acts-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="60" y1="14" x2="60" y2="306" stroke-dasharray="5 4"/><line class="dg-line" x1="116" y1="14" x2="116" y2="306" stroke-dasharray="5 4"/><line class="dg-line" x1="172" y1="14" x2="172" y2="306" stroke-dasharray="5 4"/><line class="dg-line" x1="228" y1="14" x2="228" y2="306" stroke-dasharray="5 4"/><line class="dg-line" x1="284" y1="14" x2="284" y2="306" stroke-dasharray="5 4"/><line class="dg-line" x1="340" y1="14" x2="340" y2="306" stroke-dasharray="5 4"/><line class="dg-line" x1="396" y1="14" x2="396" y2="306" stroke-dasharray="5 4"/><line class="dg-line" x1="452" y1="14" x2="452" y2="306" stroke-dasharray="5 4"/><line class="dg-line" x1="508" y1="14" x2="508" y2="306" stroke-dasharray="5 4"/><text class="dg-t-muted" x="60" y="318" text-anchor="middle">0</text><text class="dg-t-muted" x="116" y="318" text-anchor="middle">2</text><text class="dg-t-muted" x="172" y="318" text-anchor="middle">4</text><text class="dg-t-muted" x="228" y="318" text-anchor="middle">6</text><text class="dg-t-muted" x="284" y="318" text-anchor="middle">8</text><text class="dg-t-muted" x="340" y="318" text-anchor="middle">10</text><text class="dg-t-muted" x="396" y="318" text-anchor="middle">12</text><text class="dg-t-muted" x="452" y="318" text-anchor="middle">14</text><text class="dg-t-muted" x="508" y="318" text-anchor="middle">16</text><text class="dg-t-c" x="40" y="25" text-anchor="end" style="font-size:13px">a1</text><rect class="dg-cell-c" x="88" y="14" width="84" height="22" rx="4"/><text class="dg-t-muted" x="40" y="51" text-anchor="end" style="font-size:13px">a2</text><rect class="dg-cell-dim" x="144" y="40" width="56" height="22" rx="4"/><text class="dg-t-muted" x="40" y="77" text-anchor="end" style="font-size:13px">a3</text><rect class="dg-cell-dim" x="60" y="66" width="168" height="22" rx="4"/><text class="dg-t-c" x="40" y="103" text-anchor="end" style="font-size:13px">a4</text><rect class="dg-cell-c" x="200" y="92" width="56" height="22" rx="4"/><text class="dg-t-muted" x="40" y="129" text-anchor="end" style="font-size:13px">a5</text><rect class="dg-cell-dim" x="144" y="118" width="168" height="22" rx="4"/><text class="dg-t-muted" x="40" y="155" text-anchor="end" style="font-size:13px">a6</text><rect class="dg-cell-dim" x="200" y="144" width="112" height="22" rx="4"/><text class="dg-t-muted" x="40" y="181" text-anchor="end" style="font-size:13px">a7</text><rect class="dg-cell-dim" x="228" y="170" width="112" height="22" rx="4"/><text class="dg-t-c" x="40" y="207" text-anchor="end" style="font-size:13px">a8</text><rect class="dg-cell-c" x="284" y="196" width="84" height="22" rx="4"/><text class="dg-t-muted" x="40" y="233" text-anchor="end" style="font-size:13px">a9</text><rect class="dg-cell-dim" x="284" y="222" width="112" height="22" rx="4"/><text class="dg-t-muted" x="40" y="259" text-anchor="end" style="font-size:13px">a10</text><rect class="dg-cell-dim" x="116" y="248" width="336" height="22" rx="4"/><text class="dg-t-c" x="40" y="285" text-anchor="end" style="font-size:13px">a11</text><rect class="dg-cell-c" x="396" y="274" width="112" height="22" rx="4"/></svg><ul class="dg-legend"><li><span class="dg-swatch c"></span>chosen</li><li><span class="dg-swatch dim"></span>skipped: overlaps a chosen one</li></ul><figcaption>Scanning in order of finish time, take each activity that starts after the last chosen one ends. Finishing early leaves the most room for the rest, which is why this rule is optimal.</figcaption></figure>

**Why it is correct.** Let $O$ be any optimal solution and $g$ the activity that finishes first overall. Swap $O$'s earliest-finishing activity for $g$: since $g$ finishes no later, it overlaps nothing else in $O$, and the set is the same size. So some optimal solution contains the greedy choice.

:::caution[Wrong greedy rules]
Choosing the **shortest** activity first, or the one that **starts earliest**, can both give suboptimal answers. The choice of greedy rule matters, and must be proved.
:::

## 3. Fractional knapsack

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

If items cannot be split, the same rule takes items 1 and 2 for a value of **160**, but items 2 and 3 give **220**. The 0/1 knapsack needs [dynamic programming](/algorithms/dynamic-programming/#4-01-knapsack).

## 4. Huffman coding

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

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 500 320" role="img" aria-labelledby="huff-t"><title id="huff-t">Huffman tree for a 45, b 13, c 12, d 16, e 9, f 5; left edges are 0 and right edges are 1.</title><defs><marker id="ah-huff" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-huff-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-huff-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="150.7" y1="41.9" x2="78.5" y2="88.1"/><line class="dg-line" x1="187.8" y1="41.9" x2="260" y2="88.1"/><line class="dg-line" x1="260.2" y1="112.2" x2="192.3" y2="157.8"/><line class="dg-line" x1="163.5" y1="189.3" x2="146.5" y2="220.7"/><line class="dg-line" x1="184.5" y1="189.3" x2="201.5" y2="220.7"/><line class="dg-line" x1="296.8" y1="112.2" x2="364.7" y2="157.8"/><line class="dg-line" x1="369.1" y1="187.1" x2="339.9" y2="222.9"/><line class="dg-line" x1="315.5" y1="259.3" x2="298.5" y2="290.7"/><line class="dg-line" x1="336.5" y1="259.3" x2="353.5" y2="290.7"/><line class="dg-line" x1="396.9" y1="187.1" x2="426.1" y2="222.9"/><text class="dg-t-muted" x="108.2" y="54.9" text-anchor="middle">0</text><circle class="dg-cell-c" cx="60" cy="100" r="22"/><text class="dg-t-c" x="60" y="100" text-anchor="middle" style="font-size:13px">a:45</text><text class="dg-t-muted" x="217.4" y="75.1" text-anchor="middle">1</text><text class="dg-t-muted" x="219.6" y="125" text-anchor="middle">0</text><text class="dg-t-muted" x="144.5" y="199.3" text-anchor="middle">0</text><circle class="dg-cell-c" cx="136" cy="240" r="22"/><text class="dg-t-c" x="136" y="240" text-anchor="middle" style="font-size:13px">c:12</text><text class="dg-t-muted" x="182.5" y="210.7" text-anchor="middle">1</text><circle class="dg-cell-c" cx="212" cy="240" r="22"/><text class="dg-t-c" x="212" y="240" text-anchor="middle" style="font-size:13px">b:13</text><circle class="dg-cell" cx="174" cy="170" r="22"/><text x="174" y="170" text-anchor="middle" style="font-size:13px">25</text><text class="dg-t-muted" x="324.1" y="145" text-anchor="middle">1</text><text class="dg-t-muted" x="345.2" y="197.4" text-anchor="middle">0</text><text class="dg-t-muted" x="296.5" y="269.3" text-anchor="middle">0</text><circle class="dg-cell-c" cx="288" cy="310" r="22"/><text class="dg-t-c" x="288" y="310" text-anchor="middle" style="font-size:13px">f:5</text><text class="dg-t-muted" x="334.5" y="280.7" text-anchor="middle">1</text><circle class="dg-cell-c" cx="364" cy="310" r="22"/><text class="dg-t-c" x="364" y="310" text-anchor="middle" style="font-size:13px">e:9</text><circle class="dg-cell" cx="326" cy="240" r="22"/><text x="326" y="240" text-anchor="middle" style="font-size:13px">14</text><text class="dg-t-muted" x="402.2" y="212.6" text-anchor="middle">1</text><circle class="dg-cell-c" cx="440" cy="240" r="22"/><text class="dg-t-c" x="440" y="240" text-anchor="middle" style="font-size:13px">d:16</text><circle class="dg-cell" cx="383" cy="170" r="22"/><text x="383" y="170" text-anchor="middle" style="font-size:13px">30</text><circle class="dg-cell" cx="278.5" cy="100" r="22"/><text x="278.5" y="100" text-anchor="middle" style="font-size:13px">55</text><circle class="dg-cell-a" cx="169.2" cy="30" r="22"/><text class="dg-t-a" x="169.2" y="30" text-anchor="middle" style="font-size:13px">100</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>root (total frequency)</li><li><span class="dg-swatch c"></span>characters</li></ul><figcaption>Reading the edge labels from the root gives each code: a = 0, c = 100, b = 101, f = 1100, e = 1101, d = 111. Frequent characters sit near the root and get short codes.</figcaption></figure>

| Char | a | b | c | d | e | f |
|---|---|---|---|---|---|---|
| Code | 0 | 101 | 100 | 111 | 1101 | 1100 |
| Bits | 1 | 3 | 3 | 3 | 4 | 4 |

Total bits per 100 characters: $45(1) + 13(3) + 12(3) + 16(3) + 9(4) + 5(4) = 224$, compared with 300 for a fixed 3-bit code. Time $O(n \log n)$ with a heap.

The exact codes depend on how ties and left/right are chosen, but the total length is always optimal.

## 5. Job sequencing with deadlines

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

## 6. More greedy algorithms

These are covered on their own pages:

- [Dijkstra's shortest paths](/algorithms/shortest-paths/#2-dijkstras-algorithm): always settle the closest unsettled vertex.
- [Kruskal's and Prim's MST](/algorithms/minimum-spanning-trees/): always add the cheapest safe edge.

## 7. When greedy fails

| Problem | Greedy rule | Counterexample |
|---|---|---|
| Coin change, coins {1, 3, 4}, amount 6 | Largest coin first | Greedy: 4 + 1 + 1 (3 coins). Optimal: 3 + 3 (2 coins) |
| 0/1 knapsack | Best value per weight | See above: 160 instead of 220 |
| Longest path in a graph | Take the longest edge | Easy to build a graph where it leads to a dead end |

Greedy coin change does work for "canonical" coin systems such as 1, 2, 5, 10, 20, 50.

## Summary

- Greedy works when the greedy choice is part of some optimal solution and the rest is a smaller instance of the same problem.
- Activity selection: sort by finish time and take each compatible activity; $O(n \log n)$.
- Fractional knapsack: sort by value per weight; take a fraction of the last item. 0/1 knapsack needs DP.
- Huffman: repeatedly merge the two least frequent nodes with a min-heap; prefix-free and optimal.
- Job sequencing: take jobs by decreasing profit, each in the latest free slot before its deadline.

## Check yourself

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
