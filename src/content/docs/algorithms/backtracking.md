---
title: Backtracking & Branch and Bound
description: State-space trees, backtracking for N-Queens, subset sum, graph colouring and Hamiltonian cycles, and branch and bound for 0/1 knapsack and the travelling salesman problem.
sidebar:
  label: "12. Backtracking"
  order: 12
lesson:
  module: Further topics
  minutes: 30
  priority: medium
---

Some problems have no known fast algorithm, so we must search through possible solutions. **Backtracking** and **branch and bound** search systematically and **prune** branches that cannot lead to a (better) solution, which is often far faster than trying everything.

## The state-space tree

Both techniques explore a **state-space tree**: the root is the empty solution, and each level fixes one more decision (which column the next queen goes in, whether to take the next item, and so on). Leaves are complete candidate solutions.

Brute force visits every leaf. Pruning cuts off whole subtrees early.

## Backtracking

Build the solution one decision at a time, depth first. As soon as a partial solution **violates a constraint**, abandon it and go back (*backtrack*) to try the next option at the previous level.

```text
BACKTRACK(partial):
    if partial is a complete solution:
        report it
        return
    for each choice c for the next decision:
        if partial + c is still valid:      // the pruning test
            BACKTRACK(partial + c)
```

### N-Queens

Place $N$ queens on an $N \times N$ board so that no two share a row, column or diagonal.

Place one queen per row. For row $r$, try each column $c$ that is not attacked by queens in earlier rows: same column, or same diagonal, meaning $|r - r'| = |c - c'|$.

```c
int col[20], N;

int safe(int r, int c) {
    for (int i = 0; i < r; i++)
        if (col[i] == c || abs(col[i] - c) == r - i) return 0;
    return 1;
}

void solve(int r) {
    if (r == N) { /* print col[0..N-1] */ return; }
    for (int c = 0; c < N; c++)
        if (safe(r, c)) { col[r] = c; solve(r + 1); }
}
```

**4-Queens** has exactly two solutions. Listing the column of the queen in each row (1-indexed): **(2, 4, 1, 3)** and **(3, 1, 4, 2)**.

```text
Solution (2, 4, 1, 3)
. Q . .
. . . Q
Q . . .
. . Q .
```

Without pruning there are $4^4 = 256$ placements to check (one queen per row). Backtracking visits only a few dozen nodes.

### Subset sum

Given a set of positive integers and a target, find a subset that adds up to the target. For each item, branch on *include* or *exclude*. Prune when the running sum exceeds the target, or when even adding all remaining items cannot reach it.

**Example:** set {3, 34, 4, 12, 5, 2}, target 9. Solutions include {4, 5} and {3, 4, 2}.

### Graph colouring

Colour the vertices with at most $m$ colours so that adjacent vertices differ. Assign colours vertex by vertex, trying each colour that no already-coloured neighbour uses; backtrack when a vertex has no legal colour. The [map colouring simulation](/artificial-intelligence/csp-simulation/) shows this search step by step, along with heuristics that speed it up.

### Hamiltonian cycle

Find a cycle that visits every vertex exactly once. Extend the path one vertex at a time, using only unvisited neighbours, and backtrack at dead ends.

Backtracking is still exponential in the worst case, since these problems are [NP-complete](/algorithms/np-completeness/), but pruning makes it practical for moderate sizes.

## Branch and bound

Branch and bound is used for **optimisation** problems (find the *best* solution, not just any valid one). At each node it computes a **bound**: an optimistic estimate of the best solution reachable from that node.

- For a **maximisation** problem, the bound is an upper bound. If a node's upper bound is no better than the best complete solution found so far, prune it.
- For a **minimisation** problem, use a lower bound in the same way.

Nodes are often explored **best-first**, taking the node with the most promising bound from a priority queue, rather than depth first.

### 0/1 knapsack

Branch on *take* or *skip* for each item, with items sorted by value per weight. The **upper bound** at a node is the current value plus the value of the [fractional knapsack](/algorithms/greedy/#fractional-knapsack) solution for the remaining capacity, which can never be beaten by a 0/1 choice. Prune any node whose bound is not better than the best value found so far.

### Travelling salesman problem

Find the cheapest tour visiting every city once and returning to the start. A common **lower bound** comes from the **reduced cost matrix**: subtract each row's minimum and then each column's minimum; the total subtracted is a lower bound on any tour. Branch on which city to visit next, updating the matrix and the bound, and prune nodes whose bound exceeds the best tour found.

## Backtracking vs branch and bound

| | Backtracking | Branch and bound |
|---|---|---|
| Problem type | Decision or enumeration: find any or all valid solutions | Optimisation: find the best solution |
| Prunes when | A partial solution breaks a constraint | The bound shows it cannot beat the best so far |
| Search order | Depth-first | Often best-first (priority queue), or BFS/DFS |
| Examples | N-Queens, subset sum, graph colouring, Sudoku | 0/1 knapsack, TSP, job assignment |

## Viva questions

<details>
<summary>What is the difference between backtracking and brute force?</summary>

Brute force generates every complete candidate and tests each one. Backtracking tests partial solutions as it builds them and abandons a whole branch as soon as it becomes invalid, so it usually explores a small fraction of the tree.
</details>

<details>
<summary>What is a bounding function?</summary>

An optimistic estimate of the best objective value reachable from a node of the state-space tree. If even that estimate cannot beat the best solution already found, the node and its subtree are pruned.
</details>

<details>
<summary>How many solutions does the 8-Queens problem have?</summary>

92 solutions, of which 12 are distinct up to rotation and reflection.
</details>
