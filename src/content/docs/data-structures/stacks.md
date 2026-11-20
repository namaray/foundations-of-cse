---
title: Stacks
description: The stack ADT, array and linked-list implementations, and the classic applications - balanced brackets, infix to postfix conversion and postfix evaluation.
sidebar:
  order: 4
---

A **stack** is a collection where insertion and removal happen at the same end, called the **top**. The last item pushed is the first one popped: **LIFO** (last in, first out). Think of a pile of plates.

## Operations

| Operation | Meaning | Cost |
|---|---|---|
| `push(x)` | Put `x` on top | $O(1)$ |
| `pop()` | Remove and return the top item | $O(1)$ |
| `peek()` / `top()` | Return the top item without removing it | $O(1)$ |
| `isEmpty()` | Is the stack empty? | $O(1)$ |

Popping an empty stack is **underflow**; pushing onto a full array-based stack is **overflow**.

## Array implementation

```c
#define MAX 100
int stack[MAX];
int top = -1;            // -1 means empty

void push(int x) {
    if (top == MAX - 1) { printf("Overflow\n"); return; }
    stack[++top] = x;
}

int pop(void) {
    if (top == -1) { printf("Underflow\n"); return -1; }
    return stack[top--];
}
```

## Linked-list implementation

Push and pop at the **head** of the list, so both are $O(1)$ and the stack never overflows (until memory runs out).

```c
void push(Node **top, int x) {
    Node *n = new_node(x);
    n->next = *top;
    *top = n;
}

int pop(Node **top) {
    if (*top == NULL) return -1;     // underflow
    Node *t = *top;
    int x = t->data;
    *top = t->next;
    free(t);
    return x;
}
```

## Application 1: balanced brackets

Scan the string left to right. Push every opening bracket. On a closing bracket, the top of the stack must be the matching opener, so pop it. The string is balanced if every closer matches and the stack is empty at the end.

```text
Input: { [ ( ) ] }

Read  Action           Stack
{     push             {
[     push             { [
(     push             { [ (
)     pop, matches (   { [
]     pop, matches [   {
}     pop, matches {   (empty)  →  balanced
```

## Application 2: infix to postfix

People write **infix** (`A + B`). Computers evaluate **postfix** (`A B +`, also called reverse Polish notation) easily, because postfix needs no brackets and no precedence rules.

**Algorithm** (scan left to right):

1. **Operand:** write it to the output.
2. **`(`:** push it.
3. **`)`:** pop to the output until `(`; discard both brackets.
4. **Operator:** while the top of the stack is an operator with **higher or equal precedence** (for left-associative operators), pop it to the output. Then push the new operator.
5. At the end, pop everything left to the output.

Precedence: `^` highest (right-associative), then `* /`, then `+ -`.

**Worked example:** `A + B * C - D / E`

| Symbol | Stack | Output |
|---|---|---|
| A | | A |
| + | + | A |
| B | + | A B |
| * | + * | A B |
| C | + * | A B C |
| - | - | A B C * + |
| D | - | A B C * + D |
| / | - / | A B C * + D |
| E | - / | A B C * + D E |
| end | | A B C * + D E / - |

Result: **`A B C * + D E / -`**

At `-`, both `*` and `+` have higher or equal precedence, so both are popped before `-` is pushed.

**With brackets:** `(A + B) * (C - D) / E` becomes `A B + C D - * E /`.

:::tip[Prefix conversion]
To convert infix to **prefix**, reverse the infix expression (swapping `(` and `)`), convert to postfix, then reverse the result.
:::

## Application 3: evaluating postfix

Scan left to right. Push operands. On an operator, pop two operands, apply the operator (the **first** value popped is the **right** operand), and push the result.

**Example:** `5 3 + 8 2 - *`

| Symbol | Action | Stack |
|---|---|---|
| 5 | push | 5 |
| 3 | push | 5 3 |
| + | 5 + 3 = 8 | 8 |
| 8 | push | 8 8 |
| 2 | push | 8 8 2 |
| - | 8 − 2 = 6 | 8 6 |
| * | 8 × 6 = 48 | 48 |

Result: **48**.

## More applications

- **Function calls:** the call stack stores return addresses and local variables. Deep recursion causes a *stack overflow*.
- **Undo** in editors, and the browser **back** button.
- **Depth-first search** of a graph (iterative version).
- **Backtracking:** mazes, N-Queens.
- **Next greater element** and stock-span problems (monotonic stack).

## Viva questions

<details>
<summary>Why is postfix easier for a computer to evaluate than infix?</summary>

Postfix has no brackets and no precedence rules: operators appear in exactly the order they are applied. A single left-to-right scan with one stack evaluates it in $O(n)$.
</details>

<details>
<summary>How is recursion related to stacks?</summary>

Each recursive call pushes a stack frame (parameters, local variables, return address) onto the call stack, and each return pops one. Any recursive algorithm can be rewritten iteratively with an explicit stack.
</details>

<details>
<summary>How can you implement a queue using two stacks?</summary>

Push new items onto stack 1. To dequeue, if stack 2 is empty, pop everything from stack 1 onto stack 2 (reversing the order), then pop from stack 2. Each item moves at most twice, so operations are $O(1)$ amortized.
</details>
