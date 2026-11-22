---
title: Bottom-Up Parsing
description: Shift-reduce parsing and handles, LR(0) items and the canonical collection, building an SLR parsing table (worked example), parsing a string with it, shift-reduce and reduce-reduce conflicts, CLR and LALR parsers, and Yacc.
sidebar:
  label: "4. Bottom-up parsing"
  order: 4
lesson:
  module: Front end
  prerequisites:
    - label: Top-down parsing
      link: /compiler-design/top-down-parsing/
  outcomes:
    - Run a shift-reduce parse and identify handles
    - Build the LR(0) item sets and an SLR parsing table
    - Parse a string with an LR table
    - Compare SLR, CLR and LALR parsers
  keyIdea: >-
    A bottom-up parser **shifts** tokens onto a stack and **reduces** the top of the stack (a **handle**) to a nonterminal whenever it matches a rule's right side, ending with the start symbol. **LR parsers** decide when to shift or reduce using a table built from **items**; they handle more grammars than LL parsers, including left-recursive ones.
---

## 1. Shift-reduce parsing

A bottom-up parser uses a stack and four actions:

- **Shift:** push the next input token.
- **Reduce:** the top of the stack matches the right side of a rule $A \to \beta$; replace $\beta$ with $A$.
- **Accept:** the stack holds just the start symbol and the input is used up.
- **Error.**

The substring that gets reduced is the **handle**: the right side of the rule applied at that point in the reversed rightmost derivation.

**Example** with $E \to E + E \mid \textbf{id}$ (an ambiguous grammar, used only to show the moves) on **id + id**:

| Stack | Input | Action |
|---|---|---|
| \$ | id + id \$ | shift |
| \$ id | + id \$ | reduce $E \to \textbf{id}$ |
| \$ E | + id \$ | shift |
| \$ E + | id \$ | shift |
| \$ E + id | \$ | reduce $E \to \textbf{id}$ |
| \$ E + E | \$ | reduce $E \to E + E$ |
| \$ E | \$ | accept |

The hard part is knowing **when** to shift and when to reduce, and by which rule. LR parsers answer this with a table.

## 2. LR(0) items

An **item** is a rule with a dot showing how much of it has been seen. $A \to X \cdot Y Z$ means "we have seen $X$ and expect $YZ$". An item with the dot at the end, $A \to XYZ \cdot$, means the parser can reduce.

**Augment** the grammar with a new start rule $S' \to S$.

Two operations build the parser's states:

- **closure($I$):** for every item $A \to \alpha \cdot B \beta$ in $I$, add $B \to \cdot \gamma$ for every rule of $B$. Repeat.
- **goto($I$, $X$):** move the dot past $X$ in every item of $I$ where $X$ follows the dot, then take the closure.

## 3. Worked example: an SLR parser

Grammar, with productions numbered:

$$
(1)\ S \to CC \qquad (2)\ C \to cC \qquad (3)\ C \to d
$$

Augmented with $(0)\ S' \to S$.

### The canonical collection of LR(0) item sets

| State | Items | Transitions |
|---|---|---|
| $I_0$ | $S' \to \cdot S$, $\;S \to \cdot CC$, $\;C \to \cdot cC$, $\;C \to \cdot d$ | $S \to I_1$, $C \to I_2$, $c \to I_3$, $d \to I_4$ |
| $I_1$ | $S' \to S \cdot$ | |
| $I_2$ | $S \to C \cdot C$, $\;C \to \cdot cC$, $\;C \to \cdot d$ | $C \to I_5$, $c \to I_3$, $d \to I_4$ |
| $I_3$ | $C \to c \cdot C$, $\;C \to \cdot cC$, $\;C \to \cdot d$ | $C \to I_6$, $c \to I_3$, $d \to I_4$ |
| $I_4$ | $C \to d \cdot$ | |
| $I_5$ | $S \to CC \cdot$ | |
| $I_6$ | $C \to cC \cdot$ | |

### The SLR table

- **Shift:** if goto($I_i$, $a$) $= I_j$ for a terminal $a$, set ACTION[$i$, $a$] = shift $j$ (written s$j$).
- **Reduce:** if $A \to \alpha \cdot$ is in $I_i$, set ACTION[$i$, $a$] = reduce by that rule for every $a$ in **FOLLOW($A$)**.
- **Accept:** if $S' \to S \cdot$ is in $I_i$, set ACTION[$i$, $\text{\textdollar}$] = accept.
- **GOTO** entries come from the transitions on nonterminals.

Here FOLLOW($S$) = $\{\text{\textdollar}\}$ and FOLLOW($C$) = $\{c, d, \text{\textdollar}\}$.

| State | c | d | \$ | GOTO S | GOTO C |
|---|---|---|---|---|---|
| 0 | s3 | s4 | | 1 | 2 |
| 1 | | | accept | | |
| 2 | s3 | s4 | | | 5 |
| 3 | s3 | s4 | | | 6 |
| 4 | r3 | r3 | r3 | | |
| 5 | | | r1 | | |
| 6 | r2 | r2 | r2 | | |

### Parsing **c d d**

The stack holds states (and the symbols between them, shown for readability). To reduce by $A \to \beta$, pop $|\beta|$ states, then push GOTO[top, $A$].

| Stack | Input | Action |
|---|---|---|
| 0 | c d d \$ | s3 |
| 0 c 3 | d d \$ | s4 |
| 0 c 3 d 4 | d \$ | r3 ($C \to d$): pop 1, GOTO[3, C] = 6 |
| 0 c 3 C 6 | d \$ | r2 ($C \to cC$): pop 2, GOTO[0, C] = 2 |
| 0 C 2 | d \$ | s4 |
| 0 C 2 d 4 | \$ | r3 ($C \to d$): pop 1, GOTO[2, C] = 5 |
| 0 C 2 C 5 | \$ | r1 ($S \to CC$): pop 2, GOTO[0, S] = 1 |
| 0 S 1 | \$ | **accept** |

## 4. Conflicts

If a table cell gets two entries, the grammar is not SLR:

- **Shift-reduce conflict:** both shift and reduce are possible. The classic case is the **dangling else**: after `if E then S`, seeing `else`, should the parser shift it or reduce the shorter `if`? Parser generators resolve it by preferring **shift**, which attaches `else` to the nearest `if`.
- **Reduce-reduce conflict:** two different rules could be reduced. Usually a sign the grammar needs rethinking.

Ambiguous grammars always cause conflicts. Tools let you resolve expression ambiguity with **precedence and associativity declarations** instead of rewriting the grammar.

## 5. The LR family

| Parser | Items | Reduce on | Power | Table size |
|---|---|---|---|---|
| LR(0) | LR(0) | every terminal | weakest | small |
| **SLR** | LR(0) | FOLLOW($A$) | more | small |
| **CLR** (canonical LR(1)) | LR(1): an item plus a **lookahead** terminal | that item's lookahead | most | large (often thousands of states) |
| **LALR** | LR(1) items, merging states with the same core | merged lookaheads | almost as powerful as CLR | same as SLR |

$$
\text{LR(0)} \subset \text{SLR} \subset \text{LALR} \subset \text{CLR}
$$

**LALR** is the practical choice: nearly CLR's power with SLR's table size. Merging can introduce reduce-reduce conflicts (never shift-reduce ones) that CLR would not have. **Yacc** and **Bison** generate LALR parsers.

Every LL(1) grammar is LR(1), but not the other way round: LR parsers handle left recursion and delay their decisions until they have seen a whole right-hand side.

## 6. Yacc and Bison

A Yacc specification lists grammar rules with C actions, plus precedence declarations:

```text
%token NUM
%left '+' '-'
%left '*' '/'
%%
expr : expr '+' expr   { $$ = $1 + $3; }
     | expr '*' expr   { $$ = $1 * $3; }
     | '(' expr ')'    { $$ = $2; }
     | NUM             { $$ = $1; }
     ;
%%
```

`%left` makes the operators left-associative, and later lines bind tighter, which resolves the conflicts of this ambiguous grammar. Yacc works with a Lex-generated scanner.

## Summary

- Shift-reduce parsers shift tokens and reduce handles, producing a rightmost derivation in reverse.
- LR(0) items record progress through a rule; closure and goto build the parser's states.
- SLR reduces $A \to \alpha\cdot$ only on lookaheads in FOLLOW($A$).
- Shift-reduce and reduce-reduce conflicts mean the grammar is not in the class; dangling else is resolved by shifting.
- LALR (Yacc/Bison) gives nearly CLR power with SLR-sized tables.

## Check yourself

<details>
<summary>What is a handle?</summary>

The substring on top of the stack that matches a rule's right side and whose reduction is a step of the rightmost derivation in reverse. Reducing anything else would not lead to the start symbol.
</details>

<details>
<summary>How does SLR decide where to place reduce entries?</summary>

For a completed item $A \to \alpha\cdot$ in state $i$, it places "reduce $A \to \alpha$" in row $i$ under every terminal in FOLLOW($A$).
</details>

<details>
<summary>Can LALR merging create shift-reduce conflicts that CLR does not have?</summary>

No. Merging states with the same core can only create new reduce-reduce conflicts, because shift actions depend only on the core.
</details>
