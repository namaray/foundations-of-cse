---
title: C Programming Cheat Sheet
description: One-page revision of C types and operators, control flow, functions and storage classes, arrays and strings, pointers, structures and unions, dynamic memory, files, macros, and the classic output-prediction traps.
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

## [Basics](/structured-programming/c-basics/) and [control flow](/structured-programming/control-flow/)

- Preprocess → compile → assemble → link.
- `%d` int, `%ld` long, `%f` float/double in printf, `%lf` double in scanf, `%c`, `%s`, `%p`, `%x`, `%u`.
- `7 / 2` is 3; `-7 / 2` is −3; `-7 % 3` is −1; `(float)7 / 2` is 3.5.
- `a = i++` uses the old value; `a = ++i` the new. `i = i++ + ++i` is undefined.
- Relational and logical results are 0 or 1; `&&` and `||` short-circuit.
- `switch` falls through without `break`; `do-while` runs at least once; `else` binds to the nearest `if`.

## [Functions](/structured-programming/functions/)

- C passes arguments by value; pass addresses to modify the caller's variables.
- `static` local: keeps its value between calls, starts at 0. `extern`: declared here, defined elsewhere.
- Recursion needs a base case; print-before-recursing gives descending order, print-after gives ascending.

## [Arrays and strings](/structured-programming/arrays-strings/)

- Indexes 0 to n − 1, no bounds checking. 2-D arrays are row-major; parameters need every dimension but the first.
- Passing an array passes its address; inside the function `sizeof(arr)` is a pointer's size.
- `char s[] = "abc"`: `sizeof` 4, `strlen` 3. Compare with `strcmp`, copy with `strcpy`. Never use `gets`.

## [Pointers](/structured-programming/pointers/)

- `&x` address, `*p` value. `p + 1` advances `sizeof(*p)` bytes.
- `a[i] ≡ *(a + i)`. `*p++` = `*(p++)`; `(*p)++` increments the value.
- `const int *p`: can't change the value. `int *const p`: can't change the pointer.
- Don't modify string literals; don't return addresses of locals; check for NULL.

## [Structures](/structured-programming/structures-unions/) and [dynamic memory](/structured-programming/dynamic-memory/)

- `s.x` for a variable, `p->x` for a pointer (= `(*p).x`). Structures assign with `=` but don't compare with `==`.
- Padding: `sizeof(struct)` ≥ sum of members. Union size = largest member.
- `enum` values start at 0 and continue from the last given value.
- `malloc` (garbage), `calloc` (zeros), `realloc` (resize; use a temporary), `free` (once, then set to NULL).

## [Files](/structured-programming/file-handling/) and [preprocessor](/structured-programming/preprocessor/)

- `"r"` fails if missing; `"w"` erases; `"a"` appends; add `b` for binary.
- Read until the read function fails, not with `while (!feof(fp))`. Store `fgetc` in an `int`.
- `fread`/`fwrite` count items; `fseek(fp, n * sizeof rec, SEEK_SET)` for record $n$ (from 0).
- Macro rule: `#define SQ(x) ((x) * (x))`. `x * x` gives `SQ(2+3)` = 11.
- `argc` includes the program name; `argv` entries are strings.

## Top viva and exam questions

1. Explain the compilation process of a C program.
2. Predict outputs involving integer division, `i++`/`++i` and precedence.
3. `while` vs `do-while`; trace a `switch` without `break`.
4. Call by value vs passing pointers: write a working `swap`.
5. What does `static` do to a local variable?
6. Trace a recursive function and its output order.
7. Why is `a[i]` the same as `*(a + i)`? What is pointer arithmetic?
8. `sizeof` vs `strlen` for strings.
9. Structure vs union; why can `sizeof` a structure exceed its members' total?
10. `malloc` vs `calloc`; what is a memory leak or dangling pointer?
11. File opening modes; text vs binary files.
12. Macro vs function, and the macro parentheses trap.
