---
title: Semantic Analysis and Intermediate Code
description: Type checking, type conversion and scope with symbol tables, intermediate representations (syntax trees, DAGs, three-address code), quadruples, triples and indirect triples, and translating expressions, arrays and control flow with backpatching.
sidebar:
  label: "6. Intermediate code"
  order: 6
lesson:
  module: Middle end
  prerequisites:
    - label: Syntax-directed translation
      link: /compiler-design/syntax-directed-translation/
  outcomes:
    - Describe what semantic analysis checks
    - Translate an expression into three-address code
    - Represent three-address code as quadruples, triples and indirect triples
    - Translate if and while statements into jumps
  keyIdea: >-
    After parsing, the compiler checks meaning (types, declarations, scope) and translates the program into a simple **intermediate representation**. **Three-address code**, where each instruction has at most one operator, is the most common; control flow becomes labels and conditional jumps.
---

## 1. Semantic analysis

The parser checks **form**; semantic analysis checks **meaning**:

- **Declarations:** every identifier is declared before use, and not declared twice in the same scope.
- **Type checking:** operands suit their operators (`"abc" * 3` is an error in C); function calls have the right number and types of arguments; return types match.
- **Other rules:** `break` only inside loops or switches; array indexes are integers.

**Type conversion.** When `int` and `float` mix, the compiler inserts **coercions** (implicit conversions), such as `inttofloat`. Explicit conversions written by the programmer are **casts**.

**Static vs dynamic checking.** Static checks happen at compile time (C, Java); dynamic checks happen at run time (Python, and array bounds checks in Java).

**Symbol tables and scope.** For nested scopes, keep a **stack of tables**, one per block: entering a block pushes a new table; lookups search from the innermost table outwards; leaving a block pops it. Hash tables make each lookup fast.

## 2. Intermediate representations

| Representation | Description |
|---|---|
| Syntax tree (AST) | Operators as internal nodes, operands as leaves |
| **DAG** | A syntax tree where identical subexpressions share one node, exposing common subexpressions |
| **Three-address code** | A sequence of simple instructions, each with at most three addresses |
| Postfix notation | Operators after operands; used by stack machines (Java bytecode is similar) |
| SSA form | Three-address code where each variable is assigned exactly once; used by GCC and LLVM for optimization |

## 3. Three-address code

Instructions have **at most one operator** on the right side:

| Form | Example |
|---|---|
| Assignment with a binary operator | `x = y op z` |
| Unary | `x = minus y` |
| Copy | `x = y` |
| Unconditional jump | `goto L` |
| Conditional jump | `if x relop y goto L` |
| Procedure call | `param x` … `call p, n` |
| Indexed | `x = y[i]`, `x[i] = y` |
| Address and pointer | `x = &y`, `x = *y`, `*x = y` |

**Worked example:** `a = b * -c + b * -c`.

```text
t1 = minus c
t2 = b * t1
t3 = minus c
t4 = b * t3
t5 = t2 + t4
a  = t5
```

The DAG would notice that `b * -c` appears twice and compute it once: `t1 = minus c`, `t2 = b * t1`, `t5 = t2 + t2`.

## 4. Quadruples, triples and indirect triples

Three ways to store three-address code:

**Quadruples** (op, arg1, arg2, result):

| # | op | arg1 | arg2 | result |
|---|---|---|---|---|
| 0 | minus | c | | t1 |
| 1 | * | b | t1 | t2 |
| 2 | minus | c | | t3 |
| 3 | * | b | t3 | t4 |
| 4 | + | t2 | t4 | t5 |
| 5 | = | t5 | | a |

**Triples** (op, arg1, arg2): no result field; a result is referred to by its instruction **number**.

| # | op | arg1 | arg2 |
|---|---|---|---|
| 0 | minus | c | |
| 1 | * | b | (0) |
| 2 | minus | c | |
| 3 | * | b | (2) |
| 4 | + | (1) | (3) |
| 5 | = | a | (4) |

**Indirect triples:** a separate list of pointers to triples gives the execution order, so an optimizer can **reorder** instructions by reordering the pointer list without renumbering the triples.

| | Quadruples | Triples | Indirect triples |
|---|---|---|---|
| Space | Most (explicit temporaries) | Least | Medium |
| Moving instructions | Easy | Hard (references by position break) | Easy |

## 5. Arrays

For `A[i]` with base address `base` and element width `w`, the address is `base + i * w`. For a 2-D array in [row-major order](/data-structures/arrays/#2-two-dimensional-arrays) with $n$ columns, `A[i][j]` is at `base + (i * n + j) * w`.

```text
t1 = i * n
t2 = t1 + j
t3 = t2 * w
t4 = A[t3]      ; A here means its base address
```

## 6. Control flow

**`if (x < y) a = b; else a = c;`**

```text
    if x < y goto L1
    goto L2
L1: a = b
    goto L3
L2: a = c
L3: ...
```

**`while (i < n) i = i + 1;`**

```text
L1: if i >= n goto L2
    i = i + 1
    goto L1
L2: ...
```

**Short-circuit evaluation.** `if (a < b && c < d) S` jumps out as soon as the first condition fails, without evaluating the second:

```text
    if a >= b goto Lfalse
    if c >= d goto Lfalse
    S
Lfalse:
```

**Backpatching.** In a single pass, the target of a forward jump (such as `Lfalse`) is not known when the jump is generated. The compiler emits the jump with an empty target, keeps a list of such jumps, and fills them in ("backpatches") once the target label's position is known.

## Summary

- Semantic analysis checks declarations, types and scope, inserting coercions where needed; scopes use a stack of symbol tables.
- Three-address code has at most one operator per instruction; temporaries hold intermediate results.
- Quadruples name results explicitly; triples refer to results by position; indirect triples add a reorderable list.
- Control flow becomes labels and conditional jumps; backpatching fills in forward jump targets.

## Check yourself

<details>
<summary>Write three-address code for x = (a + b) * (a + b - c).</summary>

`t1 = a + b`, `t2 = a + b` (or reuse `t1`), `t3 = t2 - c`, `t4 = t1 * t3`, `x = t4`.
</details>

<details>
<summary>Why are indirect triples easier to optimize than triples?</summary>

Optimization often moves instructions. In triples, other instructions refer to results by position, so moving one breaks those references. With indirect triples, only the pointer list is reordered.
</details>

<details>
<summary>What is backpatching?</summary>

Generating jumps whose targets are not yet known, recording them in a list, and filling in the target addresses later when the destination label is reached.
</details>
