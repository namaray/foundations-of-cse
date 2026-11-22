---
title: Context-Free Grammars
description: CFG definition, derivations and parse trees, writing grammars for common languages, ambiguity and how to remove it, simplifying grammars, and Chomsky and Greibach normal forms.
sidebar:
  label: "5. Context-free grammars"
  order: 5
lesson:
  module: Context-free languages
  prerequisites:
    - label: Pumping lemma and minimization
      link: /theory-of-computation/regular-properties/
  outcomes:
    - Write a CFG for languages such as aⁿbⁿ, palindromes and balanced parentheses
    - Give leftmost and rightmost derivations and draw parse trees
    - Show a grammar is ambiguous and rewrite it unambiguously
    - Convert a grammar to Chomsky normal form
  keyIdea: >-
    A **context-free grammar** generates strings by repeatedly replacing a nonterminal with the right side of one of its rules. CFGs can count and match nested structure ($a^nb^n$, balanced brackets), which finite automata cannot, and they are how programming-language syntax is defined.
---

## 1. Definition

A **CFG** is a 4-tuple $G = (V, \Sigma, R, S)$:

| Part | Meaning |
|---|---|
| $V$ | Variables (nonterminals), usually capital letters |
| $\Sigma$ | Terminals (the alphabet) |
| $R$ | Rules (productions) of the form $A \to \alpha$, where $\alpha$ is any string of variables and terminals |
| $S$ | Start variable |

"Context-free" means a variable can be replaced regardless of what surrounds it. The **language** $L(G)$ is the set of terminal strings derivable from $S$.

**Example.** $S \to aSb \mid \varepsilon$ generates $\{a^n b^n : n \ge 0\}$:

$$
S \Rightarrow aSb \Rightarrow aaSbb \Rightarrow aaaSbbb \Rightarrow aaabbb
$$

So $\{a^nb^n\}$ is context-free but not regular: CFGs are strictly more powerful than regular expressions.

## 2. Writing grammars

| Language | Grammar |
|---|---|
| $\{a^n b^n : n \ge 0\}$ | $S \to aSb \mid \varepsilon$ |
| Palindromes over $\{a, b\}$ | $S \to aSa \mid bSb \mid a \mid b \mid \varepsilon$ |
| Balanced parentheses | $S \to (S) \mid SS \mid \varepsilon$ |
| $\{a^n b^m : n \ge m\}$ | $S \to aSb \mid aS \mid \varepsilon$ |
| $\{a^i b^j c^k : i = j \text{ or } j = k\}$ | $S \to S_1 C \mid A S_2$, $\;S_1 \to aS_1b \mid \varepsilon$, $\;S_2 \to bS_2c \mid \varepsilon$, $\;A \to aA \mid \varepsilon$, $\;C \to cC \mid \varepsilon$ |
| Equal numbers of $a$'s and $b$'s | $S \to aSbS \mid bSaS \mid \varepsilon$ |

The pattern: a rule like $S \to aSb$ adds matching symbols on both sides, which is how grammars "count".

## 3. Derivations and parse trees

A **leftmost derivation** always replaces the leftmost variable; a **rightmost derivation** the rightmost. A **parse tree** shows the derivation as a tree: the root is $S$, internal nodes are variables, and reading the leaves left to right gives the string (its **yield**).

**Example.** Grammar $E \to E + E \mid E * E \mid (E) \mid \text{id}$, string $\text{id} + \text{id} * \text{id}$. A leftmost derivation:

$$
E \Rightarrow E + E \Rightarrow \text{id} + E \Rightarrow \text{id} + E * E \Rightarrow \text{id} + \text{id} * E \Rightarrow \text{id} + \text{id} * \text{id}
$$

Each parse tree corresponds to exactly one leftmost derivation and one rightmost derivation.

## 4. Ambiguity

A grammar is **ambiguous** if some string has **two different parse trees** (equivalently, two leftmost derivations).

The expression grammar above is ambiguous: $\text{id} + \text{id} * \text{id}$ can also be derived starting $E \Rightarrow E * E$, grouping it as $(\text{id} + \text{id}) * \text{id}$.

```text
     E                      E
   / | \                  / | \
  E  +  E                E  *  E
  |   / | \            / | \   |
  id E  *  E          E  +  E  id
     |     |          |     |
     id    id         id    id
  id + (id * id)     (id + id) * id
```

In a compiler, the two trees mean different calculations, so ambiguity must be removed. Rewrite the grammar with one level per **precedence**, using left recursion for **left associativity**:

$$
\begin{aligned}
E &\to E + T \mid T \\
T &\to T * F \mid F \\
F &\to (E) \mid \text{id}
\end{aligned}
$$

Now `*` binds tighter than `+`, and $a - b - c$ style chains group to the left.

Some context-free languages are **inherently ambiguous**: every grammar for them is ambiguous. The standard example is $\{a^i b^j c^k : i = j \text{ or } j = k\}$, because strings with $i = j = k$ can always be derived both ways. Deciding whether an arbitrary CFG is ambiguous is **undecidable**.

## 5. Simplifying grammars

Before converting to a normal form, clean up the grammar, in this order:

1. **Remove ε-productions** ($A \to \varepsilon$): for every rule using a nullable variable, add versions with and without it. (Keep $S \to \varepsilon$ if $\varepsilon \in L$, using a new start variable.)
2. **Remove unit productions** ($A \to B$): replace them with $B$'s rules.
3. **Remove useless symbols:** variables that derive no terminal string, and symbols unreachable from $S$.

## 6. Normal forms

**Chomsky normal form (CNF):** every rule is

$$
A \to BC \qquad \text{or} \qquad A \to a
$$

(plus $S \to \varepsilon$ if needed). Convert by simplifying, then replacing terminals in long rules with new variables ($A \to aB$ becomes $A \to X_a B$, $X_a \to a$), then breaking long right-hand sides into pairs ($A \to BCD$ becomes $A \to BY$, $Y \to CD$).

In CNF, deriving a string of length $n \ge 1$ takes exactly $2n - 1$ steps, and parse trees are binary. The **CYK algorithm** uses CNF to decide membership in $O(n^3)$ time with dynamic programming.

**Greibach normal form (GNF):** every rule is $A \to a\alpha$ (a terminal followed by variables). Each step then produces one terminal, which helps when converting grammars to pushdown automata.

## Summary

- A CFG replaces variables using rules $A \to \alpha$, independent of context; CFLs include all regular languages and more, such as $\{a^nb^n\}$.
- Rules like $S \to aSb$ produce matched pairs; this is how grammars count and nest.
- A grammar is ambiguous if a string has two parse trees; precedence levels and left recursion remove ambiguity in expression grammars.
- Simplify (remove ε, unit and useless productions), then convert to CNF ($A \to BC \mid a$) for CYK parsing.

## Check yourself

<details>
<summary>Write a CFG for {aⁿb²ⁿ : n ≥ 0}.</summary>

$S \to aSbb \mid \varepsilon$.
</details>

<details>
<summary>How many steps does a CNF derivation of a string of length 6 take?</summary>

$2 \times 6 - 1 = 11$: five steps of the form $A \to BC$ and six of the form $A \to a$.
</details>

<details>
<summary>Is the grammar S → SS | a ambiguous?</summary>

Yes. The string $aaa$ has two parse trees: $(aa)a$ and $a(aa)$.
</details>
