---
title: Syntax-Directed Translation
description: Syntax-directed definitions, synthesized and inherited attributes, annotated parse trees with a worked example, dependency graphs, S-attributed and L-attributed definitions, translation schemes, and building syntax trees.
sidebar:
  label: "5. Syntax-directed translation"
  order: 5
lesson:
  module: Middle end
  prerequisites:
    - label: Bottom-up parsing
      link: /compiler-design/bottom-up-parsing/
  outcomes:
    - Distinguish synthesized and inherited attributes
    - Draw an annotated parse tree for an expression
    - Tell whether a definition is S-attributed or L-attributed
    - Write a translation scheme, such as infix to postfix
  keyIdea: >-
    Syntax-directed translation attaches **attributes** to grammar symbols and **semantic rules** to productions, so meaning is computed as the parse tree is built. **Synthesized** attributes flow up from children; **inherited** attributes flow down or sideways. S-attributed definitions fit naturally into bottom-up parsers.
---

## 1. Syntax-directed definitions

A **syntax-directed definition (SDD)** is a grammar where each symbol has **attributes** and each production has **semantic rules** for computing them.

**Example: evaluating expressions.** The attribute $\textit{val}$ holds a value.

| Production | Semantic rule |
|---|---|
| $L \to E\ \textbf{n}$ | print($E.\textit{val}$) |
| $E \to E_1 + T$ | $E.\textit{val} = E_1.\textit{val} + T.\textit{val}$ |
| $E \to T$ | $E.\textit{val} = T.\textit{val}$ |
| $T \to T_1 * F$ | $T.\textit{val} = T_1.\textit{val} \times F.\textit{val}$ |
| $T \to F$ | $T.\textit{val} = F.\textit{val}$ |
| $F \to (E)$ | $F.\textit{val} = E.\textit{val}$ |
| $F \to \textbf{digit}$ | $F.\textit{val} = \textbf{digit}.\textit{lexval}$ |

Subscripts like $E_1$ just distinguish two occurrences of the same symbol.

## 2. Synthesized and inherited attributes

- **Synthesized:** computed from the attributes of the node's **children** (information flows **up**). $\textit{val}$ above is synthesized.
- **Inherited:** computed from the node's **parent and siblings** (information flows **down or across**). Typical use: passing a declared type to a list of variables.

**Inherited example: declarations.** `int a, b, c`

| Production | Semantic rules |
|---|---|
| $D \to T\ L$ | $L.\textit{inh} = T.\textit{type}$ |
| $T \to \textbf{int}$ | $T.\textit{type} = \textit{integer}$ |
| $L \to L_1,\ \textbf{id}$ | $L_1.\textit{inh} = L.\textit{inh}$; $\;$ addType($\textbf{id}.\textit{entry}$, $L.\textit{inh}$) |
| $L \to \textbf{id}$ | addType($\textbf{id}.\textit{entry}$, $L.\textit{inh}$) |

The type flows from $T$ across to $L$ and down to each identifier.

## 3. Annotated parse trees

An **annotated parse tree** shows each node's attribute values.

**Example:** $3 * 5 + 4\ \textbf{n}$.

```text
                   L (prints 19)
                  /   \
           E.val = 19   n
          /    |    \
   E.val = 15  +   T.val = 4
        |              |
   T.val = 15      F.val = 4
    /   |   \          |
T.val=3 *  F.val=5  digit.lexval = 4
   |          |
F.val=3   digit.lexval = 5
   |
digit.lexval = 3
```

Values are computed bottom-up: $3$, then $3 \times 5 = 15$, then $15 + 4 = 19$.

A **dependency graph** has an edge from each attribute to the attributes computed from it. Attributes can be evaluated in any **topological order** of that graph; a cycle means the definition cannot be evaluated.

## 4. S-attributed and L-attributed definitions

| Kind | Rule | Evaluation |
|---|---|---|
| **S-attributed** | Only synthesized attributes | Bottom-up, in a postorder traversal; fits LR parsers directly (compute on each reduce) |
| **L-attributed** | Synthesized attributes, plus inherited attributes that depend only on the **parent** and on siblings to the **left** | One left-to-right depth-first traversal; fits LL parsers |

Every S-attributed definition is L-attributed. The expression evaluator is S-attributed; the declaration example is L-attributed.

## 5. Translation schemes

A **syntax-directed translation scheme (SDT)** embeds **actions** in braces inside right-hand sides; an action runs when the parser reaches that point.

**Infix to postfix:**

$$
\begin{aligned}
E &\to E + T \;\{\, \text{print('+')} \,\} \\
E &\to T \\
T &\to T * F \;\{\, \text{print('*')} \,\} \\
T &\to F \\
F &\to \textbf{digit} \;\{\, \text{print(digit.lexval)} \,\}
\end{aligned}
$$

Each operator is printed after both its operands, so `3*5+4` becomes `3 5 * 4 +`.

Actions placed only at the **end** of productions (**postfix SDTs**) suit bottom-up parsing; actions in the middle need care.

## 6. Building syntax trees

An SDD can build an **abstract syntax tree (AST)** instead of computing values: each rule creates a node.

| Production | Rule |
|---|---|
| $E \to E_1 + T$ | $E.\textit{node} = \text{new Node('+', } E_1.\textit{node}, T.\textit{node})$ |
| $E \to T$ | $E.\textit{node} = T.\textit{node}$ |
| $F \to \textbf{id}$ | $F.\textit{node} = \text{new Leaf(id, id.entry)}$ |

The AST keeps operators and operands but drops grammar details (such as $T \to F$ chains and parentheses), so later phases work on a simpler structure.

## Summary

- An SDD attaches attributes to symbols and rules to productions.
- Synthesized attributes come from children; inherited ones from the parent and siblings.
- Annotated parse trees show attribute values; evaluation follows a topological order of the dependency graph.
- S-attributed (only synthesized) suits bottom-up parsing; L-attributed suits a left-to-right depth-first pass.
- Translation schemes embed actions in productions, for example to convert infix to postfix or build an AST.

## Check yourself

<details>
<summary>Is an attribute computed from the parent synthesized or inherited?</summary>

Inherited. Synthesized attributes come only from a node's children (and its own lexical value).
</details>

<details>
<summary>What does the postfix translation scheme print for 2 + 3 * 4?</summary>

`2 3 4 * +`.
</details>

<details>
<summary>Why do S-attributed definitions fit LR parsers so well?</summary>

An LR parser reduces a production only after all its children have been built, which is exactly when the parent's synthesized attributes can be computed. The values can be kept on the parser's stack.
</details>
