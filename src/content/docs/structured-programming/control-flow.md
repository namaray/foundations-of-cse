---
title: Control Flow
description: if-else and nested conditions, the switch statement and fall-through, while, do-while and for loops, break and continue, nested loops and pattern printing, and common loop traps.
sidebar:
  label: "2. Control flow"
  order: 2
lesson:
  module: Fundamentals
  prerequisites:
    - label: C basics
      link: /structured-programming/c-basics/
  outcomes:
    - Choose between if-else, switch and the three loop forms
    - Predict the output of switch statements with fall-through
    - Trace nested loops, including pattern-printing programs
    - Spot common loop bugs
  keyIdea: >-
    Structured programming builds every program from three constructs: **sequence**, **selection** (if, switch) and **repetition** (while, do-while, for). A switch **falls through** to the next case unless you write `break`, and a do-while loop always runs at least once.
---

## 1. Selection

```c
if (marks >= 80)
    printf("A+\n");
else if (marks >= 70)
    printf("A\n");
else
    printf("Below A\n");
```

**The dangling else:** an `else` belongs to the **nearest** unmatched `if`. Use braces to make your intention clear.

```c
if (a > 0)
    if (b > 0)
        printf("both positive");
else                      // belongs to "if (b > 0)", despite the indentation
    printf("?");
```

**Conditional operator:** `max = (a > b) ? a : b;`

## 2. switch

```c
switch (grade) {
    case 'A': printf("Excellent\n"); break;
    case 'B':
    case 'C': printf("Good\n");      break;   // B and C share this code
    default:  printf("Try harder\n");
}
```

- The expression must be an **integer** type (including `char`); case labels must be **constants**.
- Without `break`, execution **falls through** into the next case.

**Output prediction:**

```c
int x = 2;
switch (x) {
    case 1: printf("one ");
    case 2: printf("two ");
    case 3: printf("three ");
    default: printf("other");
}
```

Prints `two three other`: it jumps to case 2, then falls through every later case.

## 3. Loops

| Loop | Condition checked | Runs at least once? | Typical use |
|---|---|---|---|
| `while (cond) { … }` | before each iteration | No | Unknown number of iterations |
| `do { … } while (cond);` | after each iteration | **Yes** | Menus, input validation |
| `for (init; cond; update) { … }` | before each iteration | No | Counting loops |

```c
// sum of digits of n
int sum = 0;
while (n > 0) {
    sum += n % 10;   // last digit
    n /= 10;         // remove it
}
```

```c
// keep asking until the input is valid
do {
    printf("Enter 1-5: ");
    scanf("%d", &choice);
} while (choice < 1 || choice > 5);
```

**break and continue:** `break` leaves the innermost loop (or switch) at once; `continue` skips the rest of this iteration and goes to the next (in a `for` loop, the update still runs).

```c
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) continue;   // skip even numbers
    if (i > 7) break;           // stop after 7
    printf("%d ", i);           // prints 1 3 5 7
}
```

## 4. Nested loops and patterns

The outer loop picks the **row**; the inner loop prints that row's contents.

```c
for (int i = 1; i <= 4; i++) {
    for (int j = 1; j <= i; j++)
        printf("* ");
    printf("\n");
}
```

```text
*
* *
* * *
* * * *
```

**Right-aligned pyramid:** print $n - i$ spaces, then $2i - 1$ stars on row $i$.

```c
for (int i = 1; i <= n; i++) {
    for (int s = 1; s <= n - i; s++) printf(" ");
    for (int k = 1; k <= 2 * i - 1; k++) printf("*");
    printf("\n");
}
```

Total work for nested loops multiplies: two nested loops of $n$ iterations each run the inner body $n^2$ times (see [complexity analysis](/data-structures/complexity-analysis/#3-counting-steps-in-code)).

## 5. Classic programs

- **Prime test:** check divisors from 2 up to $\sqrt{n}$; if none divides $n$, it is prime.
- **GCD** (Euclid): `while (b != 0) { int t = b; b = a % b; a = t; }`, and the answer is `a`.
- **Reverse a number:** `rev = rev * 10 + n % 10; n /= 10;` in a loop.
- **Fibonacci series:** keep the last two terms and add them.
- **Factorial:** multiply 1 × 2 × … × $n$ (use `long long`, since 13! overflows a 32-bit `int`).

## 6. Common traps

| Code | Problem |
|---|---|
| `for (i = 0; i < 10; i++);` | The `;` is an empty loop body: the block after it runs once |
| `while (i < 10) { … }` with no change to `i` | Infinite loop |
| `if (x = 0)` | Assigns 0, so the condition is always false |
| `for (i = 0; i <= n; i++)` over an array of size `n` | Off-by-one: reads past the end |
| `float f = 0.1; while (f != 1.0) f += 0.1;` | Never exactly 1.0, so it may never stop; compare floats with a tolerance |

## Summary

- Structured programs use only sequence, selection and repetition; `else` binds to the nearest `if`.
- `switch` works on integer expressions with constant cases and falls through without `break`.
- `while` and `for` check first; `do-while` checks last, so it runs at least once.
- `break` exits the loop; `continue` jumps to the next iteration.
- Nested loops: the outer loop chooses rows, the inner loop fills them.

## Check yourself

<details>
<summary>How many times does this loop run? for (int i = 0; i < 10; i += 3)</summary>

4 times: i = 0, 3, 6, 9.
</details>

<details>
<summary>What does this print? int i = 0; do { printf("%d ", i); } while (i++ < 2);</summary>

`0 1 2`. The test `i++ < 2` compares the old value (0, 1, then 2) before incrementing; when it compares 2 < 2 the loop stops.
</details>

<details>
<summary>Can a switch case use a range like case 1..5 in standard C?</summary>

No. Standard C needs one constant per case label; list several labels (`case 1: case 2: …`) or use if-else. (Ranges are a GCC extension.)
</details>
