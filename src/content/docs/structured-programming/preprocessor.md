---
title: Preprocessor and Program Organisation
description: File inclusion, object-like and function-like macros and their pitfalls, conditional compilation and header guards, splitting programs across files, and command-line arguments with argc and argv.
sidebar:
  label: "9. Preprocessor and multi-file programs"
  order: 9
lesson:
  module: Programs and files
  prerequisites:
    - label: Functions and recursion
      link: /structured-programming/functions/
  outcomes:
    - Predict the expansion of a macro, including precedence pitfalls
    - Use conditional compilation and header guards
    - Split a program into header and source files
    - Read command-line arguments with argc and argv
  keyIdea: >-
    The preprocessor runs before the compiler and only manipulates **text**: it pastes in headers, replaces macros and keeps or drops code. Because a macro is pure text substitution, every parameter and the whole body need **parentheses**, or precedence will surprise you.
---

## 1. File inclusion

```c
#include <stdio.h>      // standard header: searched in the system directories
#include "student.h"    // your own header: searched in the current directory first
```

`#include` literally pastes the file's contents in place.

## 2. Macros

**Object-like macros** name constants:

```c
#define PI     3.14159
#define MAX    100
```

**Function-like macros** take parameters:

```c
#define SQUARE(x)   ((x) * (x))
#define MAX2(a, b)  ((a) > (b) ? (a) : (b))
```

### The parentheses trap

```c
#define SQ_BAD(x)  x * x

SQ_BAD(2 + 3)   // expands to 2 + 3 * 2 + 3  =  11, not 25
SQUARE(2 + 3)   // expands to ((2 + 3) * (2 + 3))  =  25
```

```c
#define DOUBLE_BAD(x)  (x) + (x)

10 * DOUBLE_BAD(3)   // 10 * (3) + (3)  =  33, not 60
```

**Rule:** put parentheses around **each parameter** and around the **whole body**.

### The side-effect trap

```c
int i = 3;
int r = SQUARE(i++);   // ((i++) * (i++)): i modified twice, undefined behaviour
```

A function would evaluate its argument once; a macro pastes the expression wherever the parameter appears.

### Macros vs functions

| | Macro | Function |
|---|---|---|
| Processed by | Preprocessor (text substitution) | Compiler |
| Type checking | None | Yes |
| Speed | No call overhead | Call overhead (unless inlined) |
| Code size | Grows with each use | One copy |
| Arguments evaluated | Possibly several times | Exactly once |
| Debugging | Hard (you never see the expanded code) | Easy |

Modern C prefers `const` variables and `inline` functions for most of what macros used to do.

**Special operators:** `#x` turns a parameter into a string (`#define STR(x) #x`, so `STR(hello)` gives `"hello"`); `a ## b` pastes two tokens together.

## 3. Conditional compilation

```c
#define DEBUG

#ifdef DEBUG
    printf("x = %d\n", x);      // compiled only when DEBUG is defined
#endif

#if MAX > 50
    /* ... */
#elif MAX > 10
    /* ... */
#else
    /* ... */
#endif
```

Uses: debugging output, platform-specific code (`#ifdef _WIN32`), and **header guards**.

### Header guards

Stop a header's contents being included twice (which would cause "redefinition" errors):

```c
// student.h
#ifndef STUDENT_H
#define STUDENT_H

struct Student { int id; char name[50]; };
void print_student(const struct Student *s);

#endif
```

`#pragma once` does the same thing on most compilers.

## 4. Multi-file programs

Put **declarations** in a header (`.h`) and **definitions** in a source file (`.c`):

```c
// student.c
#include <stdio.h>
#include "student.h"

void print_student(const struct Student *s) {
    printf("%d %s\n", s->id, s->name);
}
```

```c
// main.c
#include "student.h"

int main(void) {
    struct Student s = {101, "Rina"};
    print_student(&s);
    return 0;
}
```

Compile and link together: `gcc main.c student.c -o app`. Each `.c` file is compiled separately into an object file; the **linker** joins them, matching calls to definitions.

- To share a **global variable**, define it in one `.c` file (`int count = 0;`) and declare it everywhere else with `extern int count;` (usually in the header).
- Mark helper functions and globals that other files shouldn't see as `static`.

## 5. Command-line arguments

```c
int main(int argc, char *argv[]) {
    printf("Program: %s\n", argv[0]);
    for (int i = 1; i < argc; i++)
        printf("Argument %d: %s\n", i, argv[i]);
    return 0;
}
```

Running `./app hello 42`:

| | Value |
|---|---|
| `argc` | 3 |
| `argv[0]` | `"./app"` (the program name) |
| `argv[1]` | `"hello"` |
| `argv[2]` | `"42"`, a **string**: convert with `atoi(argv[2])` or `strtol` |
| `argv[3]` | `NULL` |

## Summary

- The preprocessor handles `#include`, `#define` and conditional compilation before compilation, working purely on text.
- Parenthesise every macro parameter and the whole body; avoid arguments with side effects.
- Macros have no type checking and may evaluate arguments more than once; prefer `const` and `inline` functions.
- Header guards (`#ifndef … #define … #endif`) prevent double inclusion.
- Declarations go in headers, definitions in `.c` files; share globals with `extern`.
- `argc` counts the arguments including the program name; `argv` holds them as strings.

## Check yourself

<details>
<summary>#define CUBE(x) x*x*x — what is CUBE(1+1)?</summary>

It expands to `1+1*1+1*1+1`, which is 4, not 8.
</details>

<details>
<summary>What is the purpose of a header guard?</summary>

To make sure a header's contents are processed only once per source file, even if it is included several times directly or indirectly, avoiding redefinition errors.
</details>

<details>
<summary>The command ./calc 5 + 3 is run. What is argc, and what type is argv[1]?</summary>

`argc` is 4 (`./calc`, `5`, `+`, `3`). `argv[1]` is the string `"5"` (a `char *`), not a number.
</details>
