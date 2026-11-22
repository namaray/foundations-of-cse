---
title: Functions and Recursion
description: Declaring, defining and calling functions, call by value, scope and lifetime, storage classes (auto, static, extern, register), recursion with worked traces, and recursion vs iteration.
sidebar:
  label: "3. Functions and recursion"
  order: 3
lesson:
  module: Fundamentals
  prerequisites:
    - label: Control flow
      link: /structured-programming/control-flow/
  outcomes:
    - Write function prototypes, definitions and calls
    - Explain why C passes arguments by value
    - Predict the effect of static and global variables
    - Trace recursive functions, including the order of output
  keyIdea: >-
    Functions break a program into named, reusable pieces. C passes every argument **by value** (the function gets a copy), so to change a caller's variable you pass its **address**. A **static** local variable keeps its value between calls. A recursive function calls itself on a smaller problem and must have a **base case**.
---

## 1. Declaring and defining functions

```c
int square(int x);              // prototype (declaration): tells the compiler the signature

int main(void) {
    printf("%d\n", square(5));  // call: prints 25
    return 0;
}

int square(int x) {             // definition
    return x * x;
}
```

- The **prototype** lets you call a function before its definition and lets the compiler check argument types.
- `void` as the return type means nothing is returned; `f(void)` means no parameters.
- **Parameters** (formal arguments) are the names in the definition; **arguments** (actual arguments) are the values passed in a call.

## 2. Call by value

C copies each argument into the parameter, so changes inside the function don't affect the caller.

```c
void swap(int a, int b) {       // swaps the copies only
    int t = a; a = b; b = t;
}

int x = 1, y = 2;
swap(x, y);                     // x is still 1, y still 2
```

To modify the caller's variables, pass **pointers** (often called call by reference, though C is really passing addresses by value):

```c
void swap(int *a, int *b) {
    int t = *a; *a = *b; *b = t;
}
swap(&x, &y);                   // now x = 2, y = 1
```

Arrays are an exception in practice: passing an array passes the **address of its first element**, so the function can change the elements. See [Arrays](/structured-programming/arrays-strings/).

## 3. Scope, lifetime and storage classes

- **Scope:** where a name can be used. Local variables are visible only inside their block; global variables from their declaration to the end of the file.
- **Lifetime:** how long the storage exists.
- An inner variable with the same name **shadows** an outer one.

| Storage class | Scope | Lifetime | Default value | Notes |
|---|---|---|---|---|
| `auto` (default for locals) | Block | Until the block ends | Garbage | Stored on the stack |
| `register` | Block | Until the block ends | Garbage | A hint to keep it in a register; its address can't be taken |
| `static` (local) | Block | **Whole program** | 0 | Keeps its value between calls |
| `static` (global) | **This file only** | Whole program | 0 | Hides the name from other files |
| `extern` | Declares a global defined elsewhere | Whole program | 0 | Shares a variable between files |

**static in action:**

```c
void counter(void) {
    static int count = 0;       // initialised once only
    count++;
    printf("%d ", count);
}

counter(); counter(); counter();   // prints 1 2 3
```

Without `static`, it would print `1 1 1`.

## 4. Recursion

A **recursive** function calls itself. It needs:

1. A **base case** that returns without recursing.
2. A **recursive case** that moves towards the base case.

Missing the base case causes infinite recursion and a **stack overflow**.

```c
long long factorial(int n) {
    if (n <= 1) return 1;              // base case
    return n * factorial(n - 1);       // recursive case
}
```

**Trace of factorial(4):** `4 * factorial(3)` → `4 * 3 * factorial(2)` → `4 * 3 * 2 * factorial(1)` → `4 * 3 * 2 * 1` = 24. Each pending call waits on the **call stack** with its own `n`.

### Output order

Whether you print **before** or **after** the recursive call decides the order:

```c
void down(int n) {
    if (n == 0) return;
    printf("%d ", n);       // print, then recurse
    down(n - 1);
}

void up(int n) {
    if (n == 0) return;
    up(n - 1);              // recurse, then print
    printf("%d ", n);
}

down(3);   // 3 2 1
up(3);     // 1 2 3
```

### More examples

```c
int fib(int n) {                       // 0 1 1 2 3 5 8 ...
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);    // two calls: exponential time
}

int sum_digits(int n) {
    if (n == 0) return 0;
    return n % 10 + sum_digits(n / 10);
}

void hanoi(int n, char from, char to, char via) {
    if (n == 0) return;
    hanoi(n - 1, from, via, to);
    printf("Move disc %d from %c to %c\n", n, from, to);
    hanoi(n - 1, via, to, from);
}                                      // 2^n - 1 moves
```

Naive `fib` recomputes the same values repeatedly and takes exponential time; [dynamic programming](/algorithms/dynamic-programming/#why-storing-answers-matters) fixes this.

## 5. Recursion vs iteration

| | Recursion | Iteration |
|---|---|---|
| Code | Often shorter and closer to the mathematical definition | Can be longer |
| Memory | A stack frame per call | Constant |
| Speed | Function-call overhead | Usually faster |
| Risk | Stack overflow if too deep | Infinite loop if the condition is wrong |
| Natural for | Trees, divide and conquer, backtracking | Simple counting and accumulation |

Any recursion can be rewritten iteratively, using an explicit stack if necessary.

## Summary

- Declare functions with prototypes; parameters receive copies of the arguments (call by value).
- To change a caller's variable, pass its address and use a pointer parameter.
- Local `static` variables keep their value between calls and default to 0; global `static` limits visibility to the file; `extern` shares globals across files.
- Recursion needs a base case and progress towards it; printing before or after the recursive call reverses the output order.

## Check yourself

<details>
<summary>What does this print? int f(int n) { return n == 0 ? 0 : n + f(n - 1); } … printf("%d", f(4));</summary>

`10`: 4 + 3 + 2 + 1 + 0.
</details>

<details>
<summary>Why does swap(int a, int b) fail to swap the caller's variables?</summary>

C passes copies. The function swaps its own local copies, which are discarded when it returns.
</details>

<details>
<summary>What is the default initial value of a static local variable?</summary>

0 (all static-storage variables are zero-initialised). An automatic local variable starts with garbage.
</details>
