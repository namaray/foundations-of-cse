---
title: Compiler Design Cheat Sheet
description: One-page revision of compiler phases, lexical analysis, FIRST and FOLLOW, LL(1) and LR parsing, syntax-directed translation, three-address code, runtime environments and optimization.
sidebar:
  label: "10. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [Phases](/compiler-design/compiler-structure/)

Lexical (tokens) → syntax (parse tree) → semantic (types) → intermediate code → optimization → code generation, all sharing the symbol table. Front end depends on the source language, back end on the target machine.

## [Lexical analysis](/compiler-design/lexical-analysis/)

- Token = category, lexeme = text, pattern = rule.
- Regular expressions → NFA → DFA. Longest match, then priority (keywords first).
- A string literal is one token; punctuation counts.

## [Top-down parsing](/compiler-design/top-down-parsing/)

- Left recursion: $A \to A\alpha \mid \beta$ ⟹ $A \to \beta A'$, $A' \to \alpha A' \mid \varepsilon$.
- Left factoring: $A \to \alpha\beta_1 \mid \alpha\beta_2$ ⟹ $A \to \alpha A'$, $A' \to \beta_1 \mid \beta_2$.
- LL(1) table: $A \to \alpha$ goes in $M[A, a]$ for $a \in \text{FIRST}(\alpha)$, and for $a \in \text{FOLLOW}(A)$ if $\alpha \Rightarrow^* \varepsilon$. LL(1) iff no cell has two entries.

## [Bottom-up parsing](/compiler-design/bottom-up-parsing/)

- Shift, reduce (the handle), accept, error. Produces a rightmost derivation in reverse.
- SLR: reduce $A \to \alpha\cdot$ on FOLLOW($A$). CLR: on the item's lookahead. LALR: merge LR(1) states with the same core.
- LR(0) ⊂ SLR ⊂ LALR ⊂ CLR. LALR merging can add reduce-reduce (not shift-reduce) conflicts. Dangling else: prefer shift.

## [Translation](/compiler-design/syntax-directed-translation/) and [intermediate code](/compiler-design/intermediate-code/)

- Synthesized: from children. Inherited: from parent and siblings. S-attributed ⊂ L-attributed.
- Three-address code: at most one operator per instruction.
- Quadruples (op, arg1, arg2, result); triples refer to results by position; indirect triples add a reorderable list.
- Backpatching fills in forward jump targets later.

## [Runtime environments](/compiler-design/runtime-environments/)

- Activation record: parameters, return value, control link (caller), access link (enclosing scope), saved state, locals, temporaries.
- `f(a, a)` with `x = x + 1; y = y + x` and `a = 1`: by value 1, by reference 4, by value-result 3, by name 4.
- Reference counting misses cycles; mark-sweep and copying collectors don't.

## [Optimization](/compiler-design/code-optimization/) and [code generation](/compiler-design/code-generation/)

- Leaders: first instruction, jump targets, instructions after jumps.
- Local: constant folding, CSE (DAG), copy propagation, dead code, strength reduction.
- Loops: invariant code motion, induction variables, unrolling.
- Data flow: reaching definitions (forward), liveness (backward), available expressions (forward).
- Register allocation = colouring the interference graph; spill when $k$ colours are not enough.

## Top viva questions

1. What are the phases of a compiler? Trace a statement through them.
2. Compiler vs interpreter.
3. Token, lexeme and pattern; count the tokens in a statement.
4. Remove left recursion and compute FIRST and FOLLOW.
5. Build an LL(1) table; why can't an ambiguous grammar be LL(1)?
6. Build an SLR table for a small grammar; compare SLR, CLR and LALR.
7. What is a handle? What are shift-reduce and reduce-reduce conflicts?
8. Synthesized vs inherited attributes.
9. Write three-address code, quadruples and triples for an expression.
10. What is in an activation record? Static vs dynamic link.
11. Compare parameter-passing methods on an example.
12. Find basic blocks; explain loop-invariant code motion and register allocation by colouring.
