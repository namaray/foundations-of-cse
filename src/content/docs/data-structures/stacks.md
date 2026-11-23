---
title: Stacks
description: The stack ADT, array and linked-list implementations, and the classic applications - balanced brackets, infix to postfix conversion and postfix evaluation.
sidebar:
  label: "4. Stacks"
  order: 4
lesson:
  module: Linear structures
  prerequisites:
    - label: Linked lists
      link: /data-structures/linked-lists/
  outcomes:
    - Implement a stack with an array or a linked list
    - Check balanced brackets with a stack
    - Convert infix to postfix and evaluate postfix expressions
    - Explain how the call stack supports recursion
  keyIdea: >-
    A stack adds and removes at one end only, the **top**, so the last item in is the first out (**LIFO**). Every operation is $O(1)$. That simple rule handles brackets, expression conversion and evaluation, undo, backtracking and every function call your program makes.
---

A **stack** is a collection where insertion and removal happen at the same end, called the **top**. The last item pushed is the first one popped: **LIFO** (last in, first out). Think of a pile of plates.

## 1. Operations

| Operation | Meaning | Cost |
|---|---|---|
| `push(x)` | Put `x` on top | $O(1)$ |
| `pop()` | Remove and return the top item | $O(1)$ |
| `peek()` / `top()` | Return the top item without removing it | $O(1)$ |
| `isEmpty()` | Is the stack empty? | $O(1)$ |

Popping an empty stack is **underflow**; pushing onto a full array-based stack is **overflow**.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 560 250" role="img" aria-labelledby="stack-t"><title id="stack-t">A stack holding 5 and 3: pushing 8 puts it on top, and popping removes 8 again.</title><defs><marker id="ah-stack" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-stack-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-stack-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="12" y1="202" x2="98" y2="202"/><line class="dg-line-b" x1="150" y1="120" x2="214" y2="120" marker-end="url(#ah-stack-b)"/><line class="dg-line" x1="214" y1="202" x2="300" y2="202"/><line class="dg-line-a" x1="352" y1="120" x2="416" y2="120" marker-end="url(#ah-stack-a)"/><line class="dg-line" x1="416" y1="202" x2="502" y2="202"/><rect class="dg-cell" x="20" y="160" width="70" height="38" rx="4"/><text x="55" y="179" text-anchor="middle">5</text><rect class="dg-cell" x="20" y="120" width="70" height="38" rx="4"/><text x="55" y="139" text-anchor="middle">3</text><text class="dg-t-muted" x="104" y="139" style="font-size:13px">← top</text><text class="dg-t-muted" x="55" y="224" text-anchor="middle">start</text><text class="dg-t-b" x="184" y="104" text-anchor="middle">push(8)</text><rect class="dg-cell" x="222" y="160" width="70" height="38" rx="4"/><text x="257" y="179" text-anchor="middle">5</text><rect class="dg-cell" x="222" y="120" width="70" height="38" rx="4"/><text x="257" y="139" text-anchor="middle">3</text><rect class="dg-cell-b" x="222" y="80" width="70" height="38" rx="4"/><text class="dg-t-b" x="257" y="99" text-anchor="middle">8</text><text class="dg-t-muted" x="306" y="99" style="font-size:13px">← top</text><text class="dg-t-muted" x="257" y="224" text-anchor="middle">after push</text><text class="dg-t-a" x="386" y="104" text-anchor="middle">pop() → 8</text><rect class="dg-cell" x="424" y="160" width="70" height="38" rx="4"/><text x="459" y="179" text-anchor="middle">5</text><rect class="dg-cell" x="424" y="120" width="70" height="38" rx="4"/><text x="459" y="139" text-anchor="middle">3</text><text class="dg-t-muted" x="508" y="139" style="font-size:13px">← top</text><text class="dg-t-muted" x="459" y="224" text-anchor="middle">after pop</text></svg><ul class="dg-legend"><li><span class="dg-swatch b"></span>just pushed</li></ul><figcaption>Both operations happen at the top, so the last item pushed is the first popped (LIFO). Each takes O(1) time.</figcaption></figure>

## 2. Array implementation

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

## 3. Linked-list implementation

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

## 4. Balanced brackets

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

## 5. Infix to postfix

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

## 6. Evaluating postfix

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

## 7. More applications

- **Function calls:** the call stack stores return addresses and local variables. Deep recursion causes a *stack overflow*.
- **Undo** in editors, and the browser **back** button.
- **Depth-first search** of a graph (iterative version).
- **Backtracking:** mazes, N-Queens.
- **Next greater element** and stock-span problems (monotonic stack).

## Summary

- LIFO: push, pop and peek all work at the top in $O(1)$.
- Underflow = pop from empty; overflow = push onto a full array stack.
- Balanced brackets: push openers, pop and match on closers, and the stack must end empty.
- Infix to postfix: operands go out; pop operators of higher or equal precedence before pushing (`^` is right-associative).
- Evaluate postfix: push operands; an operator pops two (the first popped is the right operand).
- Recursion uses the call stack; any recursive algorithm can use an explicit stack instead.

## Check yourself

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
