---
title: Regular Expressions
description: Regular expression syntax and precedence, writing expressions for common languages, algebraic identities, converting expressions to NFAs (Thompson's construction), and automata to expressions (state elimination, Arden's theorem).
sidebar:
  label: "3. Regular expressions"
  order: 3
lesson:
  module: Regular languages
  prerequisites:
    - label: NFA and subset construction
      link: /theory-of-computation/nfa/
  outcomes:
    - Write a regular expression for a described language, and describe the language of a given expression
    - Simplify expressions with algebraic identities
    - Convert between regular expressions and finite automata
  keyIdea: >-
    A regular expression describes a language with three operations: **union** (+), **concatenation** and **Kleene star** (*). **Kleene's theorem** says regular expressions and finite automata describe exactly the same languages, and there are mechanical conversions both ways.
---

## 1. Syntax

Regular expressions over $\Sigma$ are built from:

| Expression | Language |
|---|---|
| $\emptyset$ | the empty language |
| $\varepsilon$ | $\{\varepsilon\}$ |
| $a$ (for $a \in \Sigma$) | $\{a\}$ |
| $R + S$ (also written $R \mid S$) | $L(R) \cup L(S)$ |
| $RS$ | concatenation: $\{xy : x \in L(R), y \in L(S)\}$ |
| $R^*$ | zero or more copies from $L(R)$ |

Also $R^+ = RR^*$ (one or more). **Precedence**, highest first: star, then concatenation, then union. So $ab^* + c$ means $(a(b^*)) + c$.

## 2. Writing expressions

Over $\Sigma = \{a, b\}$ unless stated:

| Language | Regular expression |
|---|---|
| All strings | $(a + b)^*$ |
| At least one $a$ | $(a + b)^* a (a + b)^*$ |
| Ends in $ab$ | $(a + b)^* ab$ |
| Starts and ends with the same symbol | $a(a+b)^*a + b(a+b)^*b + a + b$ |
| Even number of $a$'s | $(b^* a b^* a)^* b^*$ |
| Length divisible by 3 | $((a + b)(a + b)(a + b))^*$ |
| Exactly two $a$'s | $b^* a b^* a b^*$ |
| No two consecutive $b$'s | $(a + ba)^* (\varepsilon + b)$ |
| Binary strings with no "11" (over $\{0,1\}$) | $(0 + 10)^* (\varepsilon + 1)$ |

:::tip[Check both directions]
Make sure the expression generates **every** string in the language and **only** those. Test the edge cases: $\varepsilon$, single symbols, and strings that nearly fit.
:::

## 3. Identities

| Identity | |
|---|---|
| $\emptyset + R = R$ | $\emptyset R = R\emptyset = \emptyset$ |
| $\varepsilon R = R \varepsilon = R$ | $\emptyset^* = \varepsilon$, $\;\varepsilon^* = \varepsilon$ |
| $R + R = R$ | $(R^*)^* = R^*$ |
| $R^* R^* = R^*$ | $\varepsilon + RR^* = R^*$ |
| $(R + S)^* = (R^* S^*)^*$ | $(RS)^*R = R(SR)^*$ |
| $R(S + T) = RS + RT$ | Concatenation is **not** commutative: $ab \ne ba$ |

**Arden's theorem.** If $P$ does not contain $\varepsilon$, the equation $R = Q + RP$ has the unique solution

$$
R = QP^*
$$

## 4. Expression → NFA (Thompson's construction)

Build an ε-NFA by structural induction, with one start and one accepting state for each part:

| Expression | NFA fragment |
|---|---|
| $a$ | start $\xrightarrow{a}$ accept |
| $R + S$ | new start with ε-moves to the starts of $R$ and $S$; ε-moves from both accepts to a new accept |
| $RS$ | ε-move from $R$'s accept to $S$'s start |
| $R^*$ | new start and accept; ε-moves start → $R$'s start, $R$'s accept → $R$'s start (repeat), start → accept (zero times) and $R$'s accept → accept |

The result has at most about twice as many states as the expression has symbols. Then the [subset construction](/theory-of-computation/nfa/#3-the-subset-construction-nfa--dfa) turns it into a DFA. This is how **lexical analysers** are built (see [Compiler Design: lexical analysis](/compiler-design/lexical-analysis/)).

## 5. Automaton → expression

### State elimination

1. Add a new start state with an ε-move to the old one, and a new single accepting state with ε-moves from the old accepting states.
2. Remove states one at a time. When removing state $q$ with a self-loop $S$, for every path $p \xrightarrow{R} q \xrightarrow{T} r$ add the edge $p \xrightarrow{RS^*T} r$ (combining with any existing $p \to r$ edge by $+$).
3. When only the start and accept states remain, the label on the edge between them is the answer.

### Arden's method

Write one equation per state: the expression for the strings that reach it. Then solve with Arden's theorem.

**Example.** The DFA for "ends in 01" with states $A$ (start), $B$, $C$ (accepting):

$$
\begin{aligned}
A &= \varepsilon + A1 + C1 \\
B &= A0 + B0 + C0 \\
C &= B1
\end{aligned}
$$

Substituting $C = B1$: $B = A0 + B0 + B10 = A0 + B(0 + 10)$, so by Arden, $B = A0(0 + 10)^*$. Then $A = \varepsilon + A1 + A0(0 + 10)^*11 = \varepsilon + A(1 + 0(0+10)^*11)$, so $A = (1 + 0(0+10)^*11)^*$. Finally

$$
C = B1 = (1 + 0(0+10)^*11)^*\, 0(0+10)^*1
$$

which is equivalent to the much simpler $(0+1)^*01$. Automatic conversions are correct but often not the neatest form.

## 6. Kleene's theorem

**A language is regular if and only if it is described by a regular expression.** So these all describe the same class of languages:

DFA ⟺ NFA ⟺ ε-NFA ⟺ regular expression ⟺ regular grammar

<details class="go-deeper">
<summary>Go deeper: regular grammars and practical regex</summary>

A **right-linear grammar** has rules $A \to aB$ or $A \to a$ (or $A \to \varepsilon$). Each nonterminal is a state, so such grammars generate exactly the regular languages.

Practical regex engines (grep, Python's `re`) add features such as `[a-z]`, `\d`, `?` and `{3,5}`, which are all shorthand. **Backreferences** like `(a*)b\1` are different: they can match non-regular languages, and make matching NP-hard in general.
</details>

## Summary

- Regular expressions use union, concatenation and star, with star binding tightest.
- Identities such as $(R^*)^* = R^*$ and Arden's $R = Q + RP \Rightarrow R = QP^*$ simplify and solve expressions.
- Thompson's construction turns an expression into an ε-NFA; state elimination or Arden's method turns an automaton into an expression.
- Kleene's theorem: regular expressions and finite automata describe the same languages.

## Check yourself

<details>
<summary>Describe the language of (a + b)*abb.</summary>

All strings over $\{a, b\}$ that end in $abb$.
</details>

<details>
<summary>Is (a + b)* equal to (a* b*)*?</summary>

Yes. Both describe all strings over $\{a, b\}$; this is the identity $(R + S)^* = (R^* S^*)^*$.
</details>

<details>
<summary>Write a regular expression for binary strings containing at least two 1s.</summary>

$(0 + 1)^* 1 (0 + 1)^* 1 (0 + 1)^*$, or more tightly $0^* 1 0^* 1 (0 + 1)^*$.
</details>
