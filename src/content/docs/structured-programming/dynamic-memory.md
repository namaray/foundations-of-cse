---
title: Dynamic Memory Allocation
description: Stack vs heap memory, malloc, calloc, realloc and free, dynamic arrays and 2-D arrays, building linked-list nodes, and common errors - leaks, dangling pointers, double free and buffer overruns.
sidebar:
  label: "7. Dynamic memory"
  order: 7
lesson:
  module: Data and memory
  prerequisites:
    - label: Pointers
      link: /structured-programming/pointers/
  outcomes:
    - Explain the difference between stack and heap allocation
    - Use malloc, calloc, realloc and free correctly
    - Allocate a dynamic array whose size is known only at run time
    - Recognise memory leaks, dangling pointers and double frees
  keyIdea: >-
    Local variables live on the **stack** and disappear when their function returns. Memory from **malloc** and friends lives on the **heap** until you call **free**. Every allocation must be checked for NULL and freed exactly once.
---

## 1. Stack vs heap

| | Stack | Heap |
|---|---|---|
| Holds | Local variables, parameters, return addresses | Memory requested with `malloc`, `calloc`, `realloc` |
| Size decided | At compile time | At **run time** |
| Lifetime | Until the function returns | Until `free` is called |
| Managed by | Automatically | **The programmer** |
| Speed | Very fast | Slower |
| Typical size limit | Small (a few MB) | Large (most of RAM) |

Use the heap when the amount of data isn't known in advance, when data must outlive the function that creates it, or when it is too big for the stack.

## 2. The four functions

All are declared in `<stdlib.h>`.

| Function | Does | Initial contents |
|---|---|---|
| `malloc(bytes)` | Allocates a block of `bytes` bytes | **Garbage** |
| `calloc(n, size)` | Allocates `n` elements of `size` bytes | **All zero** |
| `realloc(ptr, new_bytes)` | Resizes a block, possibly moving it; keeps the old contents | New part is garbage |
| `free(ptr)` | Releases the block | — |

They return `void *` (which converts to any pointer type in C) or **NULL** if there is not enough memory.

```c
int n;
scanf("%d", &n);

int *arr = malloc(n * sizeof(int));     // room for n ints
if (arr == NULL) {
    printf("Out of memory\n");
    return 1;
}

for (int i = 0; i < n; i++)
    arr[i] = i * i;                     // use it like an ordinary array

free(arr);                              // give it back
arr = NULL;                             // avoid a dangling pointer
```

Always write `n * sizeof(int)`, never a hard-coded `4`, so the code works on any machine.

### Growing an array with realloc

```c
int *tmp = realloc(arr, 2 * n * sizeof(int));
if (tmp != NULL) {
    arr = tmp;                          // use the (possibly moved) block
    n = 2 * n;
}                                       // on failure, arr is still valid
```

Assigning `arr = realloc(arr, …)` directly loses the original block if `realloc` fails and returns NULL: a leak.

## 3. Dynamic 2-D arrays

An array of row pointers, each pointing to its own row:

```c
int **m = malloc(rows * sizeof(int *));
for (int i = 0; i < rows; i++)
    m[i] = malloc(cols * sizeof(int));

m[1][2] = 7;                            // ordinary indexing works

for (int i = 0; i < rows; i++)          // free in reverse order of allocation
    free(m[i]);
free(m);
```

## 4. Linked-list nodes

Dynamic memory is how linked structures grow one node at a time:

```c
typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node *create(int value) {
    Node *n = malloc(sizeof(Node));
    if (n == NULL) return NULL;
    n->data = value;
    n->next = NULL;
    return n;                           // valid after return: it's on the heap
}
```

The full set of linked-list operations is in [Data Structures: linked lists](/data-structures/linked-lists/).

## 5. Common errors

| Error | Example | Consequence |
|---|---|---|
| **Memory leak** | Allocating in a loop without freeing; losing the only pointer to a block | Memory use grows until the program (or system) runs out |
| **Dangling pointer** | Using `p` after `free(p)` | Undefined behaviour; corrupts data |
| **Double free** | Calling `free(p)` twice | Undefined behaviour; can corrupt the heap |
| **Not checking NULL** | Using the result of `malloc` without a check | Crash when memory runs out |
| **Buffer overrun** | Writing `n + 1` elements into space for `n` | Corrupts neighbouring memory |
| **Freeing non-heap memory** | `free` on a local array or a string literal | Undefined behaviour |

Tools such as **Valgrind** and AddressSanitizer (`gcc -fsanitize=address`) find these errors automatically.

## Summary

- Stack memory is automatic and short-lived; heap memory is requested and released by the programmer.
- `malloc` gives uninitialised memory, `calloc` zeroed memory, `realloc` resizes, `free` releases.
- Check every allocation for NULL; size it with `sizeof`; keep `realloc`'s result in a temporary first.
- Free every block exactly once, then set the pointer to NULL.
- Leaks, dangling pointers, double frees and overruns are the classic heap bugs.

## Check yourself

<details>
<summary>What is the difference between malloc(10 * sizeof(int)) and calloc(10, sizeof(int))?</summary>

Both allocate space for 10 ints. `calloc` also sets every byte to zero; `malloc` leaves the contents uninitialised.
</details>

<details>
<summary>Why is it safe to return a pointer to malloc'd memory from a function, but not a pointer to a local variable?</summary>

Heap memory lasts until it is freed, so it is still valid after the function returns. A local variable lives on the stack and is destroyed when the function returns, leaving a dangling pointer.
</details>

<details>
<summary>What is a memory leak?</summary>

Heap memory that is no longer reachable (no pointer to it remains) but was never freed, so it cannot be used again until the program ends.
</details>
