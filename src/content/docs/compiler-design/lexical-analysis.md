---
title: Lexical Analysis
description: Tokens, lexemes and patterns, specifying tokens with regular expressions, recognising them with finite automata, the longest-match and priority rules, input buffering, lexical errors and the Lex/Flex tool.
sidebar:
  label: "2. Lexical analysis"
  order: 2
lesson:
  module: Front end
  prerequisites:
    - label: Compiler structure
      link: /compiler-design/compiler-structure/
    - label: Regular expressions (TOC)
      link: /theory-of-computation/regular-expressions/
  outcomes:
    - Distinguish tokens, lexemes and patterns
    - Write regular expressions for common token classes
    - Explain the longest-match and priority rules for resolving conflicts
    - Count the tokens in a line of code
  keyIdea: >-
    The scanner groups characters into **tokens** such as identifiers, keywords, numbers and operators. Each token class is described by a **regular expression**; these are combined into one NFA, converted to a DFA, and run with the **longest match** rule, breaking ties by **priority**.
---

## 1. Tokens, lexemes and patterns

| Term | Meaning | Example |
|---|---|---|
| **Token** | A category, passed to the parser (with an optional attribute) | `id`, `number`, `if`, `relop` |
| **Lexeme** | The actual characters matched | `count`, `3.14`, `if`, `<=` |
| **Pattern** | The rule describing a token's lexemes | letter followed by letters or digits |

The scanner also strips whitespace and comments, keeps track of line numbers for error messages, and enters identifiers into the symbol table.

**Counting tokens.** `printf("x = %d", x + 10);` has **9** tokens. A string literal is **one** token however many characters it holds, and punctuation such as `,` and `;` counts.

| # | Lexeme | Token |
|---|---|---|
| 1 | `printf` | id |
| 2 | `(` | lparen |
| 3 | `"x = %d"` | string |
| 4 | `,` | comma |
| 5 | `x` | id |
| 6 | `+` | plus |
| 7 | `10` | number |
| 8 | `)` | rparen |
| 9 | `;` | semicolon |

## 2. Specifying tokens with regular expressions

Using regular definitions (names for sub-expressions):

$$
\begin{aligned}
\textit{letter} &\to [\text{A-Za-z\_}] \\
\textit{digit} &\to [0\text{-}9] \\
\textit{id} &\to \textit{letter}\, (\textit{letter} \mid \textit{digit})^* \\
\textit{number} &\to \textit{digit}^+\, (.\, \textit{digit}^+)^?\, (\text{E}\, [+-]^?\, \textit{digit}^+)^? \\
\textit{relop} &\to\; < \;\mid\; <= \;\mid\; = \;\mid\; <> \;\mid\; > \;\mid\; >=
\end{aligned}
$$

Here $^?$ means optional. The number pattern matches `42`, `3.14` and `6.02E23`.

## 3. Recognising tokens

The standard pipeline, all from [Theory of Computation](/theory-of-computation/):

1. Write a regular expression for each token class.
2. Convert each to an NFA ([Thompson's construction](/theory-of-computation/regular-expressions/#4-expression--nfa-thompsons-construction)).
3. Combine them with a new start state and ε-moves to each.
4. Convert to a DFA ([subset construction](/theory-of-computation/nfa/#3-the-subset-construction-nfa--dfa)) and minimize it.
5. Run the DFA; each accepting state records which token it recognises.

### Resolving conflicts

- **Longest match (maximal munch):** keep reading as long as some token could still match, and take the **longest** lexeme. So `<=` is one token, not `<` then `=`; and `count1` is one identifier, not `count` then `1`.
- **Priority:** if the longest lexeme matches several patterns, choose the one listed **first**. Keywords are listed before identifiers, so `if` is the keyword, while `iffy` (longer) is an identifier.

Longest match sometimes needs **lookahead**: after reading `<`, the scanner must peek at the next character to decide between `<` and `<=`, then push back what it does not use.

## 4. Input buffering

Reading one character at a time from disk would be slow. Scanners use a **two-buffer scheme**: two halves of a buffer filled alternately, with two pointers (lexeme start and forward). A **sentinel** character (EOF) at the end of each half means only one test per character is needed to detect the end of a buffer.

## 5. Lexical errors

Few errors can be detected at this stage: an illegal character such as `@` in C, an unterminated string or comment, or a malformed number. **Panic-mode recovery** deletes characters until a valid token can start. Most mistakes (misspelled keywords, missing semicolons) only show up in the parser.

## 6. Lex and Flex

**Lex** (and its modern version **Flex**) generates a scanner in C from a specification:

```text
%{
#include "tokens.h"
%}
digit   [0-9]
letter  [A-Za-z_]
%%
"if"                        { return IF; }
{letter}({letter}|{digit})* { yylval = install_id(); return ID; }
{digit}+                    { yylval = atoi(yytext); return NUMBER; }
"<="                        { return LE; }
[ \t\n]+                    { /* skip whitespace */ }
.                           { error("illegal character"); }
%%
```

Lex applies longest match and first-rule priority automatically. The parser calls `yylex()` each time it needs the next token.

## Summary

- A token is a category, a lexeme is the matched text, a pattern is the rule.
- Token classes are regular expressions; the scanner is a DFA built from them.
- Longest match chooses the longest lexeme; priority (keywords first) breaks ties.
- Input buffering with sentinels makes scanning fast; few errors are lexical.
- Lex/Flex generates scanners from regular-expression specifications.

## Check yourself

<details>
<summary>How many tokens are in "int a = b + 25;"?</summary>

7: `int`, `a`, `=`, `b`, `+`, `25`, `;`.
</details>

<details>
<summary>Why is "ifx" scanned as an identifier and not as the keyword "if" followed by "x"?</summary>

Longest match: the identifier pattern matches all three characters, which is longer than the keyword's two.
</details>

<details>
<summary>Why is a scanner usually built from regular expressions rather than a context-free grammar?</summary>

Token patterns are regular, and finite automata recognise them very fast with no stack. Keeping the parser's grammar free of character-level detail also makes it simpler.
</details>
