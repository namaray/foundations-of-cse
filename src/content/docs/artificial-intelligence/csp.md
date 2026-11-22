---
title: Constraint Satisfaction Problems
description: Formulating CSPs with variables, domains and constraints, constraint graphs, backtracking search, forward checking, arc consistency and AC-3, the MRV, degree and LCV heuristics, and local search with min-conflicts.
sidebar:
  label: "5. Constraint satisfaction"
  order: 5
lesson:
  module: Search
  prerequisites:
    - label: Uninformed search
      link: /artificial-intelligence/uninformed-search/
  outcomes:
    - Formulate a problem as a CSP
    - Run backtracking search with forward checking
    - Apply arc consistency (AC-3)
    - Use the MRV, degree and LCV heuristics to order the search
  keyIdea: >-
    A CSP describes a problem by **variables**, their **domains** and **constraints** between them. Backtracking assigns one variable at a time and undoes choices that break a constraint. **Inference** (forward checking, arc consistency) removes impossible values early, and **ordering heuristics** (MRV, LCV) choose variables and values to fail fast or succeed easily.
---

Try the [map colouring simulation](/artificial-intelligence/csp-simulation/) alongside this lesson.

## 1. Formulation

A CSP has:

- **Variables** $X_1, \dots, X_n$
- **Domains** $D_1, \dots, D_n$ of allowed values for each variable
- **Constraints** saying which combinations of values are allowed

A **solution** assigns every variable a value from its domain, satisfying every constraint.

**Example: colouring the map of Australia.**

- Variables: WA, NT, SA, Q, NSW, V, T
- Domains: {red, green, blue} for each
- Constraints: neighbouring regions differ: WA ≠ NT, WA ≠ SA, NT ≠ SA, NT ≠ Q, SA ≠ Q, SA ≠ NSW, SA ≠ V, Q ≠ NSW, NSW ≠ V

The **constraint graph** has a node per variable and an edge per (binary) constraint. Tasmania (T) has no edges: it is an **independent subproblem**.

Other CSPs: Sudoku, N-queens, timetabling, scheduling, cryptarithmetic (SEND + MORE = MONEY).

**Types of constraints:** **unary** (one variable: SA ≠ green), **binary** (two variables), **global** (many: *AllDifferent* in Sudoku).

## 2. Backtracking search

Assign variables **one at a time**; after each assignment, check the constraints; if a variable has no consistent value left, **backtrack** to the previous variable and try its next value.

```text
BACKTRACK(assignment):
    if the assignment is complete: return it
    var = SELECT-UNASSIGNED-VARIABLE()
    for each value in ORDER-DOMAIN-VALUES(var):
        if value is consistent with the assignment:
            add var = value
            (optional inference: forward checking or AC-3)
            result = BACKTRACK(assignment)
            if result is not failure: return result
            remove var = value (and undo inference)
    return failure
```

It is depth-first search where each level is one variable, so the depth is $n$ and nothing needs to be stored beyond the current path. Plain backtracking can still waste huge effort; the improvements below fix that.

## 3. Inference

### Forward checking

After assigning a variable $X$, **remove** from each unassigned neighbour's domain any value inconsistent with $X$'s value. If some domain becomes **empty**, backtrack immediately.

**Example.** Assign WA = red. Forward checking removes red from NT and SA. Then assign Q = green: green is removed from NT, SA and NSW. NT now has only {blue}, and SA only {blue}, but NT and SA are neighbours and must differ. Forward checking **does not notice** this, because it only checks between an assigned variable and its neighbours.

### Arc consistency (AC-3)

An arc $X \to Y$ is **consistent** if for **every** value of $X$ there is **some** allowed value of $Y$. AC-3 makes every arc consistent:

1. Put every arc in a queue.
2. Take arc $X \to Y$. Remove any value of $X$ that has no supporting value in $Y$.
3. If $X$'s domain changed, add every arc $Z \to X$ (for neighbours $Z \neq Y$) back into the queue.
4. If any domain becomes empty, there is no solution.

In the example above, AC-3 checks NT → SA: NT's only value, blue, has no support in SA = {blue}, so NT's domain empties and the failure is detected **before** further search.

AC-3 runs in $O(cd^3)$ for $c$ constraints and domain size $d$. **MAC** (maintaining arc consistency) runs AC-3 after every assignment during backtracking.

## 4. Ordering heuristics

| Heuristic | Chooses | Idea |
|---|---|---|
| **MRV** (minimum remaining values) | The **variable** with the fewest legal values left | "Fail first": tackle the most constrained variable before it causes trouble |
| **Degree heuristic** | Tie-breaker: the variable involved in the most constraints with unassigned variables | Reduce future branching (SA in the Australia map, with 5 neighbours) |
| **LCV** (least constraining value) | The **value** that rules out the fewest choices for neighbours | "Succeed first": leave as much flexibility as possible |

MRV and degree choose **which variable** next; LCV chooses **which value** to try first. With these heuristics, problems like 1,000-queens become solvable.

## 5. Problem structure

- **Independent subproblems** (separate components of the constraint graph) can be solved separately, turning $d^n$ into $(n/c) \cdot d^c$.
- **Tree-structured** constraint graphs can be solved in $O(nd^2)$: make arcs consistent from the leaves up, then assign from the root down with no backtracking.
- Nearly-tree graphs can be handled by **cutset conditioning**: assign a few variables so the rest forms a tree.

## 6. Local search: min-conflicts

Start with a **complete** (possibly inconsistent) assignment. Repeatedly pick a variable involved in a conflict and change it to the value that **minimises the number of conflicts**. Min-conflicts solves even million-queens problems in a few dozen steps on average, and works well for scheduling where constraints change over time.

## Summary

- A CSP is variables, domains and constraints; a solution satisfies every constraint.
- Backtracking assigns one variable at a time and undoes choices on failure.
- Forward checking removes values from neighbours of each assigned variable; AC-3 enforces arc consistency between every pair and catches more failures.
- MRV and degree pick the variable (most constrained first); LCV picks the value (least constraining first).
- Tree-structured CSPs are easy; min-conflicts local search is fast for large problems.

## Check yourself

<details>
<summary>Why does MRV help?</summary>

A variable with very few legal values is the most likely to cause failure. Assigning it first detects dead ends early, before effort is wasted on other variables.
</details>

<details>
<summary>What does forward checking miss that arc consistency catches?</summary>

Conflicts between two **unassigned** variables. Forward checking only checks neighbours of the variable just assigned; arc consistency checks every pair.
</details>

<details>
<summary>Why is Tasmania easy in the map-colouring CSP?</summary>

It has no constraints with other regions, so it forms an independent subproblem: any colour works, and it never causes backtracking.
</details>
