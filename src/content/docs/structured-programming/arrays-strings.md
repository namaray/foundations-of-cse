---
title: Arrays and Strings
description: One- and two-dimensional arrays, initialisation, bounds, passing arrays to functions, strings as null-terminated character arrays, string.h functions, and classic array and string programs.
sidebar:
  label: "4. Arrays and strings"
  order: 4
lesson:
  module: Data and memory
  prerequisites:
    - label: Functions and recursion
      link: /structured-programming/functions/
  outcomes:
    - Declare, initialise and traverse 1-D and 2-D arrays
    - Pass arrays to functions and explain why the function can modify them
    - Explain how strings are stored and why the null terminator matters
    - Use the common string.h functions and write their equivalents
  keyIdea: >-
    An array is a fixed-size block of same-type elements in **contiguous** memory, indexed from **0**. C does **no bounds checking**. A string is just a `char` array ending with the **null character** `'\0'`, which is how every string function knows where the string stops.
---

## 1. One-dimensional arrays

```c
int marks[5];                       // 5 ints, indexes 0..4, contents garbage
int a[5] = {10, 20, 30};            // a[3] and a[4] become 0
int b[] = {1, 2, 3, 4};             // size inferred: 4
int zeros[100] = {0};               // all zero

for (int i = 0; i < 5; i++)
    printf("%d ", a[i]);            // 10 20 30 0 0
```

- Indexes run from **0 to size − 1**.
- **No bounds checking:** `a[5]` or `a[-1]` compiles but reads or writes memory outside the array: **undefined behaviour**, a common source of crashes and security holes (buffer overflows).
- Number of elements: `sizeof(a) / sizeof(a[0])`, which works only where the array itself (not a pointer to it) is in scope.
- The address of `a[i]` is `base + i * sizeof(element)`, which is why access takes $O(1)$ (see [Arrays in Data Structures](/data-structures/arrays/)).

## 2. Two-dimensional arrays

```c
int m[2][3] = { {1, 2, 3},
                {4, 5, 6} };        // 2 rows, 3 columns

for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 3; j++)
        printf("%d ", m[i][j]);
    printf("\n");
}
```

C stores 2-D arrays in **row-major order**: the whole first row, then the second. `m[1][0]` is the 4th element in memory.

**Matrix multiplication** ($A$ is $p \times q$, $B$ is $q \times r$):

```c
for (int i = 0; i < p; i++)
    for (int j = 0; j < r; j++) {
        C[i][j] = 0;
        for (int k = 0; k < q; k++)
            C[i][j] += A[i][k] * B[k][j];
    }
```

## 3. Arrays and functions

An array argument passes the **address of its first element**, not a copy. The function can therefore change the caller's array, and it doesn't know the size, so pass the size separately.

```c
void double_all(int arr[], int n) {   // int arr[] means int *arr here
    for (int i = 0; i < n; i++)
        arr[i] *= 2;
}

int a[3] = {1, 2, 3};
double_all(a, 3);                     // a is now {2, 4, 6}
```

For 2-D arrays, every dimension except the first must be given: `void print(int m[][3], int rows)`.

Inside the function, `sizeof(arr)` gives the size of a **pointer**, not the array.

## 4. Strings

A string is a `char` array terminated by `'\0'` (the byte 0).

```c
char s1[] = "Hello";        // 6 bytes: H e l l o \0
char s2[10] = "Hi";         // H i \0, and the rest are zeros
char s3[] = {'O', 'K', '\0'};
```

| Expression | Value | Why |
|---|---|---|
| `sizeof(s1)` | 6 | includes the `'\0'` |
| `strlen(s1)` | 5 | counts characters before `'\0'` |

**Reading strings:**

```c
char name[50];
scanf("%49s", name);        // stops at whitespace; no & (an array is already an address)
fgets(name, 50, stdin);     // reads a whole line, including spaces (and keeps the '\n')
```

Never use `gets`: it cannot limit the input length, so it overflows the buffer, and it was removed from the C standard.

### string.h functions

| Function | Does |
|---|---|
| `strlen(s)` | Length, not counting `'\0'` |
| `strcpy(dest, src)` | Copy `src` into `dest` (`dest` must be big enough) |
| `strcat(dest, src)` | Append `src` to `dest` |
| `strcmp(a, b)` | 0 if equal, negative if `a` sorts first, positive otherwise |
| `strncpy`, `strncat`, `strncmp` | Versions limited to `n` characters |
| `strchr(s, c)`, `strstr(s, t)` | Find a character / substring; return a pointer or NULL |

You **cannot** copy or compare strings with `=` and `==`: `s1 == s2` compares addresses. Use `strcpy` and `strcmp`.

**Writing strlen yourself:**

```c
int my_strlen(const char s[]) {
    int i = 0;
    while (s[i] != '\0') i++;
    return i;
}
```

## 5. Classic programs

**Reverse a string in place:**

```c
int n = strlen(s);
for (int i = 0, j = n - 1; i < j; i++, j--) {
    char t = s[i]; s[i] = s[j]; s[j] = t;
}
```

**Palindrome check:** compare `s[i]` with `s[n - 1 - i]` for `i` up to `n / 2`.

**Count vowels:** loop until `'\0'` and test each character with `strchr("aeiouAEIOU", c)`.

**Character tricks:** `c - '0'` turns a digit character into its value; `c - 'a' + 'A'` turns a lowercase letter into uppercase (or use `toupper` from `ctype.h`).

**Linear search, binary search and sorting** on arrays are covered in [Algorithms](/algorithms/searching/).

## Summary

- Arrays are contiguous, fixed-size, indexed from 0, and never bounds-checked.
- 2-D arrays are stored row by row; function parameters must give every dimension except the first.
- Passing an array passes its address, so functions can modify it; pass the size separately.
- Strings end with `'\0'`; `sizeof` counts it, `strlen` doesn't.
- Use `strcpy`, `strcmp` and friends; `=` and `==` don't work on strings. Avoid `gets`.

## Check yourself

<details>
<summary>char s[] = "CSE"; What are sizeof(s) and strlen(s)?</summary>

`sizeof(s)` is 4 (three letters plus `'\0'`); `strlen(s)` is 3.
</details>

<details>
<summary>int a[5] = {1, 2}; What are a[2] and a[4]?</summary>

Both 0: elements not given in a partial initialiser are set to zero.
</details>

<details>
<summary>Why does if (s1 == s2) not compare two strings?</summary>

The array names decay to pointers to their first characters, so it compares two addresses. Use `strcmp(s1, s2) == 0`.
</details>
