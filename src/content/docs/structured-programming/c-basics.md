---
title: C Basics
description: Structure of a C program and how it is compiled, data types and their sizes, variables and constants, printf and scanf format specifiers, operators and precedence, and type conversion, with the classic output-prediction traps.
sidebar:
  label: "1. C basics"
  order: 1
lesson:
  module: Fundamentals
  outcomes:
    - Describe the steps from C source code to a running program
    - Choose suitable data types and format specifiers
    - Evaluate expressions using precedence, associativity and integer arithmetic rules
    - Predict the output of programs using increment operators and type conversion
  keyIdea: >-
    A C program is a set of functions starting at **main**, translated by the preprocessor, compiler, assembler and linker into an executable. Most beginner bugs come from three things: **integer division**, **operator precedence**, and the difference between **i++** and **++i**.
---

## 1. Program structure

```c
#include <stdio.h>          // preprocessor: include the standard I/O header

int main(void) {            // execution starts here
    int age = 20;           // declaration with initialisation
    printf("Age: %d\n", age);
    return 0;               // 0 tells the operating system "success"
}
```

**From source to executable:**

| Step | Tool | Output |
|---|---|---|
| Preprocessing | Preprocessor | Expands `#include` and `#define`, removes comments (`.i`) |
| Compilation | Compiler | Assembly code (`.s`); syntax and type errors are found here |
| Assembly | Assembler | Object code (`.o` / `.obj`) |
| Linking | Linker | Executable, combining object files and library code such as `printf` |

`gcc hello.c -o hello` does all four steps.

## 2. Data types

| Type | Typical size | Typical range | Format specifier |
|---|---|---|---|
| `char` | 1 byte | −128 to 127 (or 0 to 255) | `%c` (character), `%d` (number) |
| `short` | 2 bytes | −32,768 to 32,767 | `%hd` |
| `int` | 4 bytes | about ±2.1 × 10⁹ | `%d` |
| `long` | 4 or 8 bytes | | `%ld` |
| `long long` | 8 bytes | about ±9.2 × 10¹⁸ | `%lld` |
| `float` | 4 bytes | about 7 significant digits | `%f` |
| `double` | 8 bytes | about 15 significant digits | `%lf` in `scanf`, `%f` in `printf` |
| unsigned versions | same | 0 upwards | `%u` |

Sizes are **implementation-defined**; C only guarantees minimums (for example, `int` is at least 16 bits). Use `sizeof` to check: `printf("%zu", sizeof(int));`.

Other useful specifiers: `%x` (hex), `%o` (octal), `%e` (scientific), `%s` (string), `%p` (pointer), `%%` (a literal %). Width and precision: `%5d` (width 5), `%.2f` (2 decimal places), `%-10s` (left-justified).

## 3. Variables and constants

- A **variable** is a named memory location; it must be **declared** before use.
- An uninitialised local variable holds **garbage** (whatever was in that memory).
- Names may contain letters, digits and `_`, cannot start with a digit, are case-sensitive, and cannot be keywords.

Constants: `const int MAX = 100;` (a read-only variable), `#define PI 3.14159` (text replacement by the preprocessor), and literals such as `42`, `3.14f`, `'A'`, `"text"`, `0x1F` (hex), `017` (octal: **15**, not 17).

## 4. Input and output

```c
int n;
float x;
scanf("%d %f", &n, &x);     // & passes the variable's address
printf("n = %d, x = %.2f\n", n, x);
```

Forgetting `&` in `scanf` is a classic bug (except for strings, since an array name is already an address). `scanf("%c", ...)` reads the leftover newline from a previous input; `scanf(" %c", ...)` with a space skips it.

## 5. Operators and precedence

| Precedence (high to low) | Operators | Associativity |
|---|---|---|
| 1 | `()` `[]` `->` `.` postfix `++` `--` | left to right |
| 2 | unary `+ -` `!` `~` prefix `++ --` `*` (dereference) `&` (address) `sizeof` casts | **right to left** |
| 3 | `*` `/` `%` | left to right |
| 4 | `+` `-` | left to right |
| 5 | `<<` `>>` | left to right |
| 6 | `<` `<=` `>` `>=` | left to right |
| 7 | `==` `!=` | left to right |
| 8–10 | `&`, then `^`, then `\|` (bitwise) | left to right |
| 11–12 | `&&`, then `\|\|` | left to right |
| 13 | `?:` | **right to left** |
| 14 | `=` `+=` `-=` etc. | **right to left** |
| 15 | `,` | left to right |

**Key facts:**

- **Integer division truncates** towards zero: `7 / 2` is `3`, and `-7 / 2` is `-3`. `%` gives the remainder with the sign of the left operand: `-7 % 3` is `-1`.
- **Relational and logical operators give 1 or 0.** `5 > 3` is 1.
- **Short-circuit evaluation:** in `a && b`, `b` is not evaluated if `a` is false; in `a || b`, not if `a` is true.
- `=` is assignment; `==` is comparison. `if (x = 5)` assigns 5 and is always true.
- Bitwise operators work on individual bits: `5 & 3` is `1`, `5 | 3` is `7`, `5 ^ 3` is `6`, `1 << 3` is `8`.

## 6. Increment and decrement

```c
int i = 5;
int a = i++;   // a = 5 (old value used), then i = 6
int b = ++i;   // i = 7 first, then b = 7
```

**Undefined behaviour:** modifying a variable twice in one expression without a sequence point, such as `i = i++ + ++i;` or `printf("%d %d", i++, i++);`, has **no defined result**. Different compilers give different answers. In an exam, say it is undefined.

## 7. Type conversion

**Implicit (usual arithmetic conversions):** in a mixed expression, the narrower operand is converted to the wider type: `char`/`short` → `int` → `long` → `float` → `double`.

```c
int a = 5, b = 2;
float r1 = a / b;            // 2.000000: integer division happens first
float r2 = (float)a / b;     // 2.500000: cast makes the division floating point
float r3 = a / 2.0;          // 2.500000
int   t  = 3.99;             // 3: conversion to int truncates
char  c  = 'A' + 2;          // 'C' (65 + 2 = 67)
```

**Explicit (casting):** `(type) expression`.

Assigning a value out of range for an unsigned type wraps around (modulo $2^n$); signed overflow is undefined behaviour.

## Summary

- Preprocess → compile → assemble → link; `main` is the entry point and returns 0 on success.
- Know the types, their usual sizes and format specifiers; `scanf` needs `&` for non-array variables.
- Integer division truncates; `%` takes the sign of the left operand; relational operators give 0 or 1.
- Postfix `i++` uses the old value, prefix `++i` the new one; modifying a variable twice in one expression is undefined.
- Mixed arithmetic promotes to the wider type; casting before dividing avoids integer division.

## Check yourself

<details>
<summary>What does printf("%d", 10 / 3 * 3); print?</summary>

`9`. Left to right: `10 / 3` is `3` (integer division), then `3 * 3` is 9.
</details>

<details>
<summary>int x = 10; printf("%d %d", x++, x); — is the output defined?</summary>

No. The order in which function arguments are evaluated is unspecified, and `x` is both modified and read without a sequence point, so the behaviour is undefined.
</details>

<details>
<summary>What is the value of 017 + 1?</summary>

16. A leading 0 makes `017` an octal literal, which is 15 in decimal.
</details>
