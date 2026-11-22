---
title: Pointers
description: Addresses and pointer variables, dereferencing, pointer arithmetic, the relationship between pointers and arrays, pointers and strings, pointers to pointers, const with pointers, function pointers, and NULL, dangling and wild pointers.
sidebar:
  label: "5. Pointers"
  order: 5
lesson:
  module: Data and memory
  prerequisites:
    - label: Arrays and strings
      link: /structured-programming/arrays-strings/
  outcomes:
    - Declare pointers and use & and * correctly
    - Predict the result of pointer arithmetic
    - Explain why a[i] and *(a + i) are the same
    - Avoid NULL, dangling and wild pointer bugs
  keyIdea: >-
    A pointer is a variable that holds an **address**. `&x` gives the address of `x`, and `*p` gives the value at the address in `p`. Adding 1 to a pointer moves it by **one element**, not one byte, which is why `a[i]` is exactly `*(a + i)`.
---

## 1. Addresses and pointers

```c
int x = 10;
int *p = &x;          // p holds the address of x

printf("%d\n", x);    // 10
printf("%p\n", &x);   // the address, e.g. 0x7ffd5c
printf("%p\n", p);    // the same address
printf("%d\n", *p);   // 10: the value at that address (dereferencing)

*p = 20;              // changes x through the pointer
printf("%d\n", x);    // 20
```

| Expression | Meaning |
|---|---|
| `&x` | address of `x` |
| `p` | the address stored in `p` |
| `*p` | the value at that address |
| `&p` | the address of the pointer itself |

In a declaration, `*` means "pointer to": `int *p, q;` declares `p` as a pointer but `q` as a plain `int`.

## 2. Pointer arithmetic

Arithmetic on a pointer moves in units of the **pointed-to type**:

```c
int a[5] = {10, 20, 30, 40, 50};
int *p = a;            // same as &a[0]

printf("%d\n", *(p + 2));   // 30
p++;                         // now points to a[1]
printf("%d\n", *p);          // 20
```

If `p` holds address 1000 and `int` is 4 bytes, `p + 1` is **1004**. For a `char *` it would be 1001, for a `double *` 1008.

Allowed: pointer + integer, pointer − integer, pointer − pointer (within one array: gives the number of **elements** between them), and comparing pointers into the same array. Not allowed: adding two pointers, or multiplying them.

**Precedence traps:**

| Expression | Means |
|---|---|
| `*p++` | `*(p++)`: use the value, then move `p` |
| `(*p)++` | increment the value pointed to |
| `*++p` | move `p`, then use the new value |
| `++*p` | increment the value pointed to |

## 3. Pointers and arrays

An array name in an expression **decays** to a pointer to its first element. So:

$$
a[i] \equiv *(a + i) \qquad \&a[i] \equiv a + i
$$

(Indexing is defined this way, which is why even `i[a]` works, though no one should write it.)

Differences remain: an array name is not a variable, so `a++` or `a = p` is an error, and `sizeof(a)` gives the whole array's size, while `sizeof(p)` gives a pointer's size.

**Traversing with a pointer:**

```c
int sum = 0;
for (int *q = a; q < a + 5; q++)
    sum += *q;
```

## 4. Pointers and strings

```c
char s[] = "Hello";     // an array: its contents can be changed
char *t = "Hello";      // a pointer to a string literal: do not modify it

s[0] = 'J';             // fine: "Jello"
t[0] = 'J';             // undefined behaviour: literals may be read-only
```

**Counting length with pointers:**

```c
int length(const char *s) {
    const char *start = s;
    while (*s) s++;      // stop at '\0' (which is 0, i.e. false)
    return s - start;
}
```

## 5. Pointers to pointers and arrays of pointers

```c
int x = 5;
int *p = &x;
int **pp = &p;           // pointer to a pointer
printf("%d", **pp);      // 5
```

They are used for 2-D dynamic arrays, for functions that must change a caller's pointer, and for `char *argv[]` (an array of strings).

```c
char *days[] = {"Mon", "Tue", "Wed"};   // array of 3 pointers
printf("%s %c", days[1], days[1][0]);   // Tue T
```

## 6. const and pointers

Read the declaration from right to left:

| Declaration | Can change the value pointed to? | Can change the pointer? |
|---|---|---|
| `const int *p` (or `int const *p`) | No | Yes |
| `int *const p` | Yes | No |
| `const int *const p` | No | No |

Use `const` parameters (`const char *s`) to promise a function won't modify the data.

## 7. Function pointers

A pointer can hold the address of a function, so functions can be passed to other functions:

```c
int add(int a, int b) { return a + b; }
int (*op)(int, int) = add;     // pointer to a function taking (int, int) returning int
printf("%d", op(2, 3));        // 5
```

The standard library's `qsort` takes a comparison function this way.

## 8. Dangerous pointers

| Kind | What it is | Fix |
|---|---|---|
| **NULL pointer** | Holds `NULL` (address 0); dereferencing it crashes | Check `if (p != NULL)` before use |
| **Wild pointer** | Declared but never initialised: points anywhere | Always initialise, at least to `NULL` |
| **Dangling pointer** | Points to memory that has been freed, or to a local variable whose function has returned | Set pointers to `NULL` after `free`; never return the address of a local variable |
| **void pointer** | `void *` can hold any address but can't be dereferenced directly | Cast it to the right type first |

```c
int *bad(void) {
    int local = 5;
    return &local;      // dangling: local disappears when bad() returns
}
```

## Summary

- `&x` is the address of `x`; `*p` is the value at the address in `p`.
- `p + 1` moves by `sizeof(*p)` bytes; subtracting pointers gives a number of elements.
- `a[i]` is `*(a + i)`; an array name decays to a pointer but is not itself assignable.
- Don't modify string literals through `char *`; use a `char` array if you need to change it.
- `const int *p` protects the data, `int *const p` protects the pointer.
- Initialise pointers, check for NULL, and never use memory after it is freed or out of scope.

## Check yourself

<details>
<summary>int a[] = {5, 10, 15}; int *p = a; printf("%d", *p + 1); What is printed?</summary>

`6`. `*p` is 5 (dereference binds tighter than `+`), then 1 is added. `*(p + 1)` would give 10.
</details>

<details>
<summary>If p is an int pointer holding 2000 and int is 4 bytes, what does p + 3 hold?</summary>

$2000 + 3 \times 4 = 2012$.
</details>

<details>
<summary>What is a dangling pointer?</summary>

A pointer that still holds the address of memory that is no longer valid, because it was freed or because it belonged to a function that has returned.
</details>
