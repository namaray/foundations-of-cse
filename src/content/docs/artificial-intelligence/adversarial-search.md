---
title: Adversarial Search
description: Games as search problems, the minimax algorithm with a worked game tree, alpha–beta pruning and the effect of move ordering, evaluation functions and depth cut-offs, and expectiminimax for games of chance.
sidebar:
  label: "4. Adversarial search"
  order: 4
lesson:
  module: Search
  prerequisites:
    - label: Uninformed search
      link: /artificial-intelligence/uninformed-search/
  outcomes:
    - Compute minimax values for a game tree
    - Run alpha–beta pruning and identify which branches are pruned
    - Explain how move ordering affects alpha–beta's efficiency
    - Describe evaluation functions and expectiminimax
  keyIdea: >-
    In two-player games, **MAX** chooses moves to maximise the outcome and **MIN** to minimise it. **Minimax** backs values up the game tree assuming both play perfectly. **Alpha–beta pruning** gets the same answer while skipping branches that cannot affect the decision, often searching twice as deep in the same time.
---

Try the [minimax and alpha–beta simulation](/artificial-intelligence/minimax-simulation/) alongside this lesson.

## 1. Games as search

A two-player, zero-sum, perfect-information game (chess, tic-tac-toe, Go) is a search problem with:

- an **initial state** and a **player-to-move** function,
- **actions** and a **transition model**,
- a **terminal test** (is the game over?),
- a **utility function** giving the outcome of terminal states for MAX (for example +1 win, 0 draw, −1 loss).

The **game tree** alternates MAX levels and MIN levels. Full game trees are enormous: chess has a branching factor of about 35 and games of about 80 moves, roughly $35^{80}$ nodes.

## 2. Minimax

The **minimax value** of a node is the utility MAX can guarantee from it, assuming MIN also plays optimally:

$$
\text{MINIMAX}(n) = \begin{cases} \text{UTILITY}(n) & \text{if } n \text{ is terminal} \\ \max_{s} \text{MINIMAX}(s) & \text{if MAX moves at } n \\ \min_{s} \text{MINIMAX}(s) & \text{if MIN moves at } n \end{cases}
$$

```text
function MINIMAX(n):
    if n is terminal: return UTILITY(n)
    if MAX to move:   return max over children s of MINIMAX(s)
    else:             return min over children s of MINIMAX(s)
```

**Worked example** (MAX at the root, three MIN children, leaves are utilities):

```text
                 MAX
        ┌─────────┼─────────┐
       MIN       MIN       MIN
     ┌──┼──┐   ┌──┼──┐   ┌──┼──┐
     3  12  8  2  4  6  14  5  2
```

- Left MIN: min(3, 12, 8) = **3**
- Middle MIN: min(2, 4, 6) = **2**
- Right MIN: min(14, 5, 2) = **2**
- Root MAX: max(3, 2, 2) = **3**, so MAX plays the left move.

Minimax is a depth-first search: complete for finite trees, optimal against an optimal opponent, time $O(b^m)$, space $O(bm)$.

## 3. Alpha–beta pruning

Track two bounds along the current path:

- **α:** the best value MAX can already guarantee (starts at $-\infty$).
- **β:** the best value MIN can already guarantee (starts at $+\infty$).

**Prune** (stop examining a node's remaining children) when $\alpha \ge \beta$:

- At a **MIN** node, once its value $v \le \alpha$, MAX already has something at least as good elsewhere, so it will never let play reach here.
- At a **MAX** node, once $v \ge \beta$, MIN will avoid this node.

**On the tree above:**

1. Left MIN examines 3, 12, 8: value **3**. At the root, α = 3.
2. Middle MIN (with α = 3): its first leaf is 2, so its value is at most 2 ≤ α = 3. MAX will never choose it, so **4 and 6 are pruned**.
3. Right MIN: 14 (value ≤ 14), 5 (≤ 5), 2 (= 2). All three must be examined, since the value stays above α until the last leaf. Value **2**.
4. Root: max(3, ≤ 2, 2) = **3**, the same answer as minimax, having skipped 2 of the 9 leaves.

**Alpha–beta never changes the minimax value**; it only avoids work.

### Move ordering

The amount pruned depends on the order children are examined:

| Ordering | Nodes examined |
|---|---|
| Worst (best moves last) | $O(b^m)$: no pruning at all |
| Random | about $O(b^{3m/4})$ |
| **Perfect** (best moves first) | $O(b^{m/2})$: effectively doubles the searchable depth |

Programs therefore try likely-good moves first (captures, moves that were best in a previous shallower search, "killer moves"). In the example, if the right MIN's leaves were ordered 2, 5, 14, the 5 and 14 would be pruned too.

## 4. Imperfect real-time decisions

Real games can't be searched to the end. Instead:

- **Cut off** the search at a depth limit (often with iterative deepening, to use the available time).
- Apply an **evaluation function** $\text{EVAL}(s)$ estimating how good the position is, usually a weighted sum of features: $w_1 f_1 + w_2 f_2 + \dots$ (in chess: material, mobility, king safety).

Problems: the **horizon effect** (a bad event pushed just beyond the depth limit looks avoided) and evaluating unstable positions (in the middle of an exchange). **Quiescence search** extends the search in such positions.

## 5. Games of chance: expectiminimax

In games with dice (backgammon), add **chance nodes** whose value is the **expected value** of their children:

$$
\text{EXPECTIMINIMAX}(n) = \sum_{s} P(s) \cdot \text{EXPECTIMINIMAX}(s) \quad \text{at a chance node}
$$

MAX and MIN nodes work as in minimax. Evaluation functions must now be scaled sensibly, since only the order of values mattered before, but expected values depend on the actual numbers.

## Summary

- Games are search problems with alternating MAX and MIN levels and utilities at terminal states.
- Minimax backs up max at MAX nodes and min at MIN nodes; it is optimal against a perfect opponent.
- Alpha–beta keeps the best guaranteed values α (MAX) and β (MIN) and prunes when α ≥ β; the result is identical to minimax.
- With perfect move ordering, alpha–beta examines $O(b^{m/2})$ nodes instead of $O(b^m)$.
- Real programs cut off the search and use evaluation functions; expectiminimax handles chance with expected values.

## Check yourself

<details>
<summary>Can alpha–beta pruning ever change the move chosen compared with minimax?</summary>

No. It only skips branches that provably cannot affect the root's value, so the value and the best move are the same.
</details>

<details>
<summary>A MIN node has α = 5 passed down, and its first child evaluates to 3. What happens?</summary>

The MIN node's value can only be 3 or less, which is below MAX's guaranteed 5, so MAX will never choose it. Its remaining children are pruned.
</details>

<details>
<summary>What is the horizon effect?</summary>

When a search cut off at a fixed depth fails to see an unavoidable bad event just beyond its depth limit, and so makes moves that only delay it, believing it has been avoided.
</details>
