---
title: Top-Down Parsing
description: The role of the parser, eliminating left recursion and left factoring, recursive-descent parsing, FIRST and FOLLOW sets with a worked example, building an LL(1) parsing table and parsing with it, and syntax error recovery.
sidebar:
  label: "3. Top-down parsing"
  order: 3
lesson:
  module: Front end
  prerequisites:
    - label: Lexical analysis
      link: /compiler-design/lexical-analysis/
    - label: Context-free grammars (TOC)
      link: /theory-of-computation/context-free-grammars/
  outcomes:
    - Remove left recursion and left-factor a grammar
    - Compute FIRST and FOLLOW sets
    - Build an LL(1) parsing table and use it to parse a string
    - Tell whether a grammar is LL(1)
  keyIdea: >-
    A top-down parser builds the parse tree from the root, predicting which rule to use from the next input token. **LL(1)** parsers make that choice with a table built from **FIRST** and **FOLLOW** sets. The grammar must have no left recursion and no ambiguity in the choice, so it is often rewritten first.
---

## 1. The parser's job

The parser takes tokens from the scanner and checks they form a valid program according to a [context-free grammar](/theory-of-computation/context-free-grammars/), building a parse tree (or a more compact **abstract syntax tree**). Two strategies:

- **Top-down:** start from the start symbol and expand rules to match the input, producing a **leftmost derivation**. LL parsers, recursive descent.
- **Bottom-up:** start from the input and reduce it back to the start symbol, producing a **rightmost derivation in reverse**. LR parsers ([next lesson](/compiler-design/bottom-up-parsing/)).

## 2. Preparing the grammar

### Eliminating left recursion

A rule like $A \to A\alpha \mid \beta$ is **left-recursive**: a top-down parser expanding $A$ would expand $A$ again forever. Rewrite it as

$$
A \to \beta A' \qquad A' \to \alpha A' \mid \varepsilon
$$

**Example.** The expression grammar

$$
E \to E + T \mid T \qquad T \to T * F \mid F \qquad F \to (E) \mid \textbf{id}
$$

becomes

$$
\begin{aligned}
E &\to T E' & E' &\to + T E' \mid \varepsilon \\
T &\to F T' & T' &\to * F T' \mid \varepsilon \\
F &\to (E) \mid \textbf{id}
\end{aligned}
$$

### Left factoring

If two alternatives start with the same symbols, the parser cannot choose with one token of lookahead. Factor out the common prefix:

$$
A \to \alpha \beta_1 \mid \alpha \beta_2 \quad \Longrightarrow \quad A \to \alpha A', \quad A' \to \beta_1 \mid \beta_2
$$

**Example.** $S \to \textbf{if}\ E\ \textbf{then}\ S \mid \textbf{if}\ E\ \textbf{then}\ S\ \textbf{else}\ S$ becomes $S \to \textbf{if}\ E\ \textbf{then}\ S\ S'$ with $S' \to \textbf{else}\ S \mid \varepsilon$.

## 3. Recursive descent

Write one procedure per nonterminal; each one looks at the next token to choose an alternative and calls the procedures for the symbols on that rule's right side.

```c
void E()  { T(); Eprime(); }
void Eprime() {
    if (lookahead == '+') { match('+'); T(); Eprime(); }
    /* else ε: do nothing */
}
void T()  { F(); Tprime(); }
void Tprime() {
    if (lookahead == '*') { match('*'); F(); Tprime(); }
}
void F() {
    if (lookahead == '(') { match('('); E(); match(')'); }
    else if (lookahead == ID) match(ID);
    else error();
}
```

Simple and fast to write by hand; many production compilers (GCC and Clang for C and C++) use hand-written recursive descent. Without left recursion and with left-factoring, no backtracking is needed: this is a **predictive** parser.

## 4. FIRST and FOLLOW

- **FIRST($\alpha$):** the terminals that can **begin** a string derived from $\alpha$, plus $\varepsilon$ if $\alpha$ can derive $\varepsilon$.
- **FOLLOW($A$):** the terminals that can appear **immediately after** $A$ in some sentential form. $\text{\textdollar}$ (end of input) is in FOLLOW of the start symbol.

**Rules for FIRST:**

1. For a terminal $a$: FIRST($a$) = $\{a\}$.
2. For $A \to X_1 X_2 \dots X_k$: add FIRST($X_1$) without $\varepsilon$; if $X_1$ can derive $\varepsilon$, also add FIRST($X_2$), and so on. If all can derive $\varepsilon$, add $\varepsilon$.

**Rules for FOLLOW:**

1. Put $\text{\textdollar}$ in FOLLOW($S$).
2. For $A \to \alpha B \beta$: add FIRST($\beta$) without $\varepsilon$ to FOLLOW($B$).
3. For $A \to \alpha B$, or $A \to \alpha B \beta$ where $\beta$ can derive $\varepsilon$: add FOLLOW($A$) to FOLLOW($B$).

**Worked example** (the left-recursion-free expression grammar):

| Nonterminal | FIRST | FOLLOW |
|---|---|---|
| $E$ | $\{ (, \textbf{id} \}$ | $\{ ), \text{\textdollar} \}$ |
| $E'$ | $\{ +, \varepsilon \}$ | $\{ ), \text{\textdollar} \}$ |
| $T$ | $\{ (, \textbf{id} \}$ | $\{ +, ), \text{\textdollar} \}$ |
| $T'$ | $\{ *, \varepsilon \}$ | $\{ +, ), \text{\textdollar} \}$ |
| $F$ | $\{ (, \textbf{id} \}$ | $\{ *, +, ), \text{\textdollar} \}$ |

For instance, FOLLOW($T$) gets FIRST($E'$) $-\ \{\varepsilon\} = \{+\}$ from $E \to TE'$, and since $E'$ can vanish, also FOLLOW($E$) $= \{), \text{\textdollar}\}$.

## 5. The LL(1) parsing table

For each rule $A \to \alpha$:

1. For each terminal $a$ in FIRST($\alpha$), put $A \to \alpha$ in $M[A, a]$.
2. If $\varepsilon \in$ FIRST($\alpha$), put $A \to \alpha$ in $M[A, b]$ for each $b$ in FOLLOW($A$).

Empty cells are errors.

| | **id** | + | * | ( | ) | \$ |
|---|---|---|---|---|---|---|
| $E$ | $E \to TE'$ | | | $E \to TE'$ | | |
| $E'$ | | $E' \to +TE'$ | | | $E' \to \varepsilon$ | $E' \to \varepsilon$ |
| $T$ | $T \to FT'$ | | | $T \to FT'$ | | |
| $T'$ | | $T' \to \varepsilon$ | $T' \to *FT'$ | | $T' \to \varepsilon$ | $T' \to \varepsilon$ |
| $F$ | $F \to \textbf{id}$ | | | $F \to (E)$ | | |

A grammar is **LL(1)** if no cell has more than one entry. Left-recursive and ambiguous grammars are never LL(1).

### Parsing with the table

Keep a stack, starting with `$ E` (end marker below the start symbol). Repeatedly: if the top is a terminal matching the input, pop it and advance; if it is a nonterminal, replace it with the rule from the table (right side pushed in reverse).

Parsing **id + id**:

| Stack (top at right) | Input | Action |
|---|---|---|
| \$ E | id + id \$ | $E \to TE'$ |
| \$ E' T | id + id \$ | $T \to FT'$ |
| \$ E' T' F | id + id \$ | $F \to \textbf{id}$ |
| \$ E' T' id | id + id \$ | match id |
| \$ E' T' | + id \$ | $T' \to \varepsilon$ |
| \$ E' | + id \$ | $E' \to +TE'$ |
| \$ E' T + | + id \$ | match + |
| \$ E' T | id \$ | $T \to FT'$ |
| \$ E' T' F | id \$ | $F \to \textbf{id}$ |
| \$ E' T' id | id \$ | match id |
| \$ E' T' | \$ | $T' \to \varepsilon$ |
| \$ E' | \$ | $E' \to \varepsilon$ |
| \$ | \$ | **accept** |

## 6. Error recovery

- **Panic mode:** on an error, skip input tokens until one in a **synchronising set** (often FOLLOW of the current nonterminal, or a statement terminator like `;`) appears, then continue.
- **Phrase-level:** make a local fix, such as inserting a missing `;`.
- **Error productions:** add grammar rules for common mistakes, so the parser can give a precise message.

## Summary

- Top-down parsers build a leftmost derivation from the root, predicting rules from lookahead.
- Remove left recursion ($A \to A\alpha \mid \beta$ becomes $A \to \beta A'$, $A' \to \alpha A' \mid \varepsilon$) and left-factor common prefixes first.
- FIRST($\alpha$) is what $\alpha$ can start with; FOLLOW($A$) is what can come after $A$.
- LL(1) table: $M[A, a]$ gets $A \to \alpha$ for $a \in$ FIRST($\alpha$), and for $a \in$ FOLLOW($A$) if $\alpha$ can be empty. One entry per cell means LL(1).

## Check yourself

<details>
<summary>Remove the left recursion from S → Sa | b.</summary>

$S \to bS'$ and $S' \to aS' \mid \varepsilon$. Both generate $ba^*$.
</details>

<details>
<summary>For S → aSb | ε, what are FIRST(S) and FOLLOW(S)?</summary>

FIRST($S$) = $\{a, \varepsilon\}$. FOLLOW($S$) = $\{b, \text{\textdollar}\}$: $\text{\textdollar}$ because $S$ is the start symbol, and $b$ from $S \to aSb$.
</details>

<details>
<summary>Why can't an ambiguous grammar be LL(1)?</summary>

Some string has two leftmost derivations, so at some step two different rules both lead to a valid parse with the same lookahead. Both rules end up in the same table cell.
</details>
