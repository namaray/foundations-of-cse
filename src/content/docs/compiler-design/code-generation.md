---
title: Code Generation
description: Issues in code generation, the target machine model and instruction costs, instruction selection, a simple code generator with register and address descriptors and next-use information, register allocation by graph colouring, and instruction scheduling.
sidebar:
  label: "9. Code generation"
  order: 9
lesson:
  module: Back end
  prerequisites:
    - label: Code optimization
      link: /compiler-design/code-optimization/
  outcomes:
    - Name the main problems a code generator must solve
    - Generate simple target code for three-address statements
    - Allocate registers by colouring an interference graph
  keyIdea: >-
    The code generator turns intermediate code into target instructions. Its three hard problems are **instruction selection** (which instructions to use), **register allocation** (which values live in the few fast registers) and **instruction ordering**. Register allocation is modelled as **graph colouring**: variables that are live at the same time interfere and need different registers.
---

## 1. The problems

| Problem | Why it is hard |
|---|---|
| **Instruction selection** | Many instruction sequences compute the same thing, with very different costs; special instructions (increment, multiply-add) should be used where they fit |
| **Register allocation** | Registers are far faster than memory but there are few of them; deciding which values to keep in them is NP-complete in general |
| **Instruction ordering** | Order affects how many registers are needed and how well the processor's pipeline is used |

The output must also be **correct**, and the code generator itself should be reasonably fast.

## 2. A target machine

A simple load/store machine with registers R0, R1, …:

| Instruction | Meaning |
|---|---|
| `LD R, x` | load: R = x |
| `ST x, R` | store: x = R |
| `ADD Rd, Rs1, Rs2` | Rd = Rs1 + Rs2 (similarly `SUB`, `MUL`) |
| `BLTZ R, L` | branch to L if R < 0 |

A simple **cost model**: each instruction costs 1, plus 1 for every operand that is in memory or is a constant stored with the instruction. Register-only instructions are cheapest.

## 3. A simple code generator

Process each three-address instruction in a basic block, keeping:

- **Register descriptors:** for each register, which variables it currently holds.
- **Address descriptors:** for each variable, where its current value is (a register, memory, or both).
- **Next-use information:** whether each variable is used again later in the block, found by a backward scan. Values with no next use need not stay in registers.

For `x = y + z`:

1. Choose registers for `y` and `z`, loading them if they are not already in registers (`LD`).
2. Choose a register for `x` (preferably one holding a value with no next use).
3. Emit `ADD Rx, Ry, Rz`; update the descriptors: `Rx` now holds only `x`, and `x` is only in `Rx`.

At the end of the block, **store** any variable whose up-to-date value is only in a register and which is live after the block.

**Example:** `t = a - b`, `u = a - c`, `v = t + u`, `a = d`, `d = v + u`, with `a`, `b`, `c` and `d` live at the end of the block.

```text
LD  R1, a
LD  R2, b
SUB R2, R1, R2      ; t in R2 (b not needed again)
LD  R3, c
SUB R1, R1, R3      ; u in R1 (a's old value not needed again)
ADD R3, R2, R1      ; v in R3
LD  R2, d           ; a = d: R2 now holds both a and d
ADD R1, R3, R1      ; d = v + u, in R1
ST  a, R2           ; store live variables at the end of the block
ST  d, R1
```

## 4. Register allocation by graph colouring

1. Compute which variables are **live** at each point ([live variable analysis](/compiler-design/code-optimization/#5-data-flow-analysis)).
2. Build an **interference graph**: one node per variable, and an edge between two variables that are live at the same time.
3. **Colour** the graph with $k$ colours, where $k$ is the number of registers; adjacent nodes need different colours. Each colour is a register.
4. If the graph cannot be coloured with $k$ colours, **spill** a variable: keep it in memory and load it around each use, then try again.

**Chaitin's heuristic:** repeatedly remove a node with fewer than $k$ neighbours (it can always be coloured later) and push it on a stack. If none exists, pick a spill candidate (rarely used, or with many neighbours). Then pop nodes and give each a colour not used by its already-coloured neighbours.

**Example.** Suppose `a` interferes with `b` and `c`, `b` interferes with `c`, and `d` interferes only with `a`. With $k = 3$ registers: `a` → R1, `b` → R2, `c` → R3, and `d` can share R2 (or R3) since it does not interfere with `b` or `c`. Four variables fit in three registers.

This is the same problem as [graph colouring in Discrete Mathematics](/discrete-mathematics/graph-theory/#7-graph-colouring). Simpler **linear-scan** allocators are used in JIT compilers, where compile time matters most.

## 5. Instruction scheduling

Modern processors are **pipelined**: an instruction that uses the result of a slow instruction (such as a load from memory) may have to wait. **Instruction scheduling** reorders independent instructions to fill those gaps, without changing the program's meaning. There is a tension with register allocation: scheduling wants more values in flight at once, which needs more registers.

## Summary

- Code generation must select instructions, allocate registers and order instructions, while staying correct.
- A simple generator tracks register descriptors, address descriptors and next-use information, and stores live values at block ends.
- Register allocation colours an interference graph with $k$ colours; variables that don't fit are spilled to memory.
- Instruction scheduling reorders independent instructions to keep the pipeline busy.

## Check yourself

<details>
<summary>When do two variables interfere?</summary>

When both are live at the same program point, so they hold values that are both still needed. They then cannot share a register.
</details>

<details>
<summary>What does it mean to spill a variable?</summary>

Keep it in memory instead of a register, loading it just before each use and storing it after each definition. It is needed when there are more simultaneously live values than registers.
</details>

<details>
<summary>Why does the code generator need next-use information?</summary>

To know when a register's value is dead, so the register can be reused without saving the value, and to choose which value to evict when registers run out.
</details>
