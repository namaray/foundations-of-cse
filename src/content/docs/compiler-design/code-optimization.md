---
title: Code Optimization
description: Basic blocks and flow graphs, local optimizations (constant folding, common subexpressions, copy propagation, dead code), the DAG of a basic block, loop optimizations (code motion, strength reduction, induction variables), peephole optimization, and data-flow analysis.
sidebar:
  label: "8. Code optimization"
  order: 8
lesson:
  module: Back end
  prerequisites:
    - label: Intermediate code
      link: /compiler-design/intermediate-code/
  outcomes:
    - Split three-address code into basic blocks and draw the flow graph
    - Apply the standard local optimizations to a basic block
    - Apply loop-invariant code motion and strength reduction
    - Explain what liveness and reaching-definitions analysis compute
  keyIdea: >-
    Optimization rewrites intermediate code to run faster or use less space **without changing what it does**. The code is split into **basic blocks** joined in a **flow graph**; local optimizations work inside a block, while loop optimizations and **data-flow analysis** work across blocks. Loops matter most, since programs spend most of their time in them.
---

## 1. Basic blocks and flow graphs

A **basic block** is a sequence of instructions with one entry (the first instruction) and one exit (the last): once it starts, every instruction runs.

**Finding leaders** (first instructions of blocks):

1. The first instruction of the program is a leader.
2. Any target of a jump is a leader.
3. Any instruction immediately after a jump is a leader.

Each block runs from a leader up to (but not including) the next leader. A **flow graph** has a node per block and an edge wherever control can pass from one block to another.

**Example.**

```text
(1)  i = 1
(2)  t1 = i * 4
(3)  t2 = a[t1]
(4)  sum = sum + t2
(5)  i = i + 1
(6)  if i <= 10 goto (2)
(7)  x = sum
```

Leaders: (1) (first instruction), (2) (jump target) and (7) (after a jump). Blocks: **B1** = {1}, **B2** = {2–6}, **B3** = {7}. Edges: B1 → B2, B2 → B2 (the loop) and B2 → B3.

## 2. Local optimizations (within a block)

| Optimization | Before | After |
|---|---|---|
| **Constant folding** | `x = 2 * 3.14` | `x = 6.28` |
| **Constant propagation** | `n = 10; y = n * 4` | `n = 10; y = 40` |
| **Common subexpression elimination** | `t1 = b * c; t2 = b * c` | `t1 = b * c; t2 = t1` |
| **Copy propagation** | `x = y; z = x + 1` | `x = y; z = y + 1` |
| **Dead code elimination** | `x = y + 1` where `x` is never used again | (removed) |
| **Algebraic simplification** | `x = y * 1`, `x = y + 0` | `x = y` |
| **Strength reduction** | `x = y * 2`, `x = y ** 2` | `x = y + y`, `x = y * y` |

These often enable each other: copy propagation can leave a copy unused, which dead code elimination then removes.

### The DAG of a basic block

Build a **DAG** for the block: leaves for initial values, interior nodes for operations, with each node labelled by the variables holding its value. Reusing an existing node whenever the same operation on the same operands appears again **detects common subexpressions automatically**.

```text
a = b + c
b = a - d
c = b + c
d = a - d
```

The fourth line computes `a - d` with the same `a` and `d` as the second, so it reuses that node: `d = b`. The third line uses the **new** `b`, so `b + c` there is **not** the same as the first line's.

## 3. Loop optimizations

**Loop-invariant code motion.** Move computations whose value doesn't change inside the loop to just before it:

```text
while (i < n) {                    t = x * y
    a[i] = x * y + i;      ⟹       while (i < n) {
    i = i + 1;                         a[i] = t + i;
}                                      i = i + 1;
                                   }
```

**Induction variables and strength reduction.** In the loop of section 1, `t1 = i * 4` increases by exactly 4 each time `i` increases by 1. Replace the multiplication with an addition:

```text
     t1 = 0                  ; before the loop (i starts at 1, so t1 = 4 at first use)
L:   t1 = t1 + 4
     t2 = a[t1]
     ...
```

If `i` is then used only to control the loop, the test can be rewritten in terms of `t1` (`if t1 <= 40`) and `i` removed (**induction variable elimination**).

**Loop unrolling** repeats the body several times per iteration to reduce the loop-control overhead, at the cost of larger code.

## 4. Peephole optimization

Slide a small window over the target code and replace short instruction patterns with better ones:

- **Redundant loads and stores:** `MOV R0, a` followed by `MOV a, R0`: remove the second.
- **Unreachable code:** instructions after an unconditional jump with no label.
- **Jumps to jumps:** `goto L1` where `L1: goto L2` becomes `goto L2`.
- **Algebraic and machine idioms:** `ADD R1, #1` becomes `INC R1`; multiply by 8 becomes shift left by 3.

## 5. Data-flow analysis

Global optimizations need facts that hold across the whole flow graph. **Data-flow analysis** computes them by solving equations over the blocks, iterating until nothing changes.

| Analysis | Question | Direction | Used for |
|---|---|---|---|
| **Reaching definitions** | Which assignments to `x` might reach this point unchanged? | Forward | Constant propagation |
| **Live variables** | Will this variable's current value be used later? | Backward | Dead code elimination, register allocation |
| **Available expressions** | Has this expression already been computed on **every** path here, with its operands unchanged since? | Forward | Global common subexpression elimination |

**Live variables equations** for a block $B$, where $\textit{use}[B]$ is variables read before being written in $B$, and $\textit{def}[B]$ is variables written in $B$:

$$
\textit{in}[B] = \textit{use}[B] \cup (\textit{out}[B] - \textit{def}[B]), \qquad \textit{out}[B] = \bigcup_{S \in \text{succ}(B)} \textit{in}[S]
$$

A variable that is not live after an assignment to it makes that assignment dead.

:::caution[Optimizations must be safe]
An optimization must never change the program's observable behaviour. That is why compilers are cautious around pointers (two names may refer to the same memory: **aliasing**) and function calls (which might modify any global variable).
:::

## Summary

- Leaders: the first instruction, jump targets, and instructions after jumps. Blocks run from one leader to the next.
- Local optimizations: constant folding and propagation, common subexpression elimination, copy propagation, dead code elimination, strength reduction. A DAG finds common subexpressions.
- Loop optimizations: move invariant code out, reduce the strength of induction variables, unroll.
- Peephole optimization improves short instruction sequences in the target code.
- Data-flow analyses (reaching definitions, liveness, available expressions) provide the facts global optimization needs.

## Check yourself

<details>
<summary>Find the leaders: (1) a = 0 (2) if a > 5 goto (5) (3) a = a + 1 (4) goto (2) (5) b = a</summary>

(1) first instruction; (2) target of the jump in (4); (3) follows a conditional jump; (5) target of the jump in (2), and follows a jump.
</details>

<details>
<summary>Why is loop-invariant code motion worth more than optimizing straight-line code?</summary>

A computation inside a loop runs once per iteration, possibly millions of times. Moving it out saves all but one of those executions.
</details>

<details>
<summary>Which data-flow analysis tells the register allocator that a register can be reused?</summary>

Live variable analysis: once a variable is no longer live, its register can hold something else.
</details>
