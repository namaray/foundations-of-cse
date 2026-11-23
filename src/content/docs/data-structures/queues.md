---
title: Queues
description: Linear and circular queues, deques and priority queues, with array and linked-list implementations and their applications.
sidebar:
  label: "5. Queues"
  order: 5
lesson:
  module: Linear structures
  prerequisites:
    - label: Stacks
      link: /data-structures/stacks/
  outcomes:
    - Explain why a simple array queue wastes space
    - Implement a circular queue and tell full from empty
    - Implement a queue with a linked list
    - Describe deques and priority queues and their costs
  keyIdea: >-
    A queue inserts at the **rear** and removes from the **front**: first in, first out (**FIFO**). A plain array queue strands free slots at the front; a **circular queue** wraps the indices with modulo arithmetic to reuse them. A **priority queue** instead removes the highest-priority item first, usually with a heap.
---

A **queue** inserts at one end (the **rear**) and removes from the other (the **front**). The first item in is the first item out: **FIFO**. Think of a line at a ticket counter.

## 1. Operations

| Operation | Meaning | Cost |
|---|---|---|
| `enqueue(x)` | Add `x` at the rear | $O(1)$ |
| `dequeue()` | Remove and return the front item | $O(1)$ |
| `front()` | Look at the front item | $O(1)$ |
| `isEmpty()` / `isFull()` | Check the state | $O(1)$ |

## 2. The problem with a simple array queue

Keep two indices, `front` and `rear`. Enqueue increments `rear`; dequeue increments `front`. After some operations, `rear` reaches the end of the array even though there are free slots at the start that dequeued items left behind. The queue reports *full* while it is partly empty.

```text
index:   0   1   2   3   4
        [ ] [ ] [ ] [40][50]
                     ↑    ↑
                  front  rear = 4 = MAX-1  →  "full", but 3 slots are free
```

## 3. Circular queue

The fix is to wrap the indices around with modulo arithmetic, so the array behaves like a ring:

$$
\text{rear} = (\text{rear} + 1) \bmod N \qquad \text{front} = (\text{front} + 1) \bmod N
$$

To tell *full* from *empty*, a common convention leaves one slot unused:

- **Empty:** `front == rear`
- **Full:** `(rear + 1) % N == front`

The alternative is to keep a separate `count` of items.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 470 214" role="img" aria-labelledby="cq-t"><title id="cq-t">A circular queue of size 5 holding 30, 40 and 50 in slots 3, 4 and 0, with front at 3 and rear at 1.</title><defs><marker id="ah-cq" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-cq-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-cq-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line-a" x1="284" y1="44" x2="284" y2="66" marker-end="url(#ah-cq-a)"/><line class="dg-line-b" x1="156" y1="44" x2="156" y2="66" marker-end="url(#ah-cq-b)"/><path class="dg-line" d="M348.0,142 Q348.0,196 220.0,196 Q92.0,196 92.0,144" marker-end="url(#ah-cq)"/><rect class="dg-cell-a" x="60" y="70" width="64" height="44" rx="4"/><text class="dg-t-a" x="92" y="92" text-anchor="middle">50</text><text class="dg-t-muted" x="92" y="128" text-anchor="middle">0</text><rect class="dg-cell-dim" x="124" y="70" width="64" height="44" rx="4"/><text class="dg-t-muted" x="156" y="128" text-anchor="middle">1</text><rect class="dg-cell-dim" x="188" y="70" width="64" height="44" rx="4"/><text class="dg-t-muted" x="220" y="128" text-anchor="middle">2</text><rect class="dg-cell-a" x="252" y="70" width="64" height="44" rx="4"/><text class="dg-t-a" x="284" y="92" text-anchor="middle">30</text><text class="dg-t-muted" x="284" y="128" text-anchor="middle">3</text><rect class="dg-cell-a" x="316" y="70" width="64" height="44" rx="4"/><text class="dg-t-a" x="348" y="92" text-anchor="middle">40</text><text class="dg-t-muted" x="348" y="128" text-anchor="middle">4</text><text class="dg-t-a" x="284" y="34" text-anchor="middle">front = 3</text><text class="dg-t-b" x="156" y="34" text-anchor="middle">rear = 1</text><text class="dg-t-muted" x="220" y="182" text-anchor="middle">index 4 wraps round to 0</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>in the queue</li><li><span class="dg-swatch dim"></span>free</li></ul><figcaption>Items occupy slots 3, 4, 0 in order. The next enqueue goes into slot rear = 1, and rear becomes (1 + 1) mod 5 = 2. Slot 2 is the one left unused to tell full from empty.</figcaption></figure>

```c
#define N 5
int q[N];
int front = 0, rear = 0;      // empty when front == rear

int enqueue(int x) {
    if ((rear + 1) % N == front) return 0;   // full
    q[rear] = x;
    rear = (rear + 1) % N;
    return 1;
}

int dequeue(int *x) {
    if (front == rear) return 0;             // empty
    *x = q[front];
    front = (front + 1) % N;
    return 1;
}
```

With this convention a circular queue of size $N$ holds at most $N - 1$ items.

## 4. Linked-list queue

Keep pointers to both the **head** (front) and the **tail** (rear). Enqueue appends at the tail and dequeue removes from the head, both in $O(1)$, with no fixed capacity.

```c
typedef struct { Node *head, *tail; } Queue;

void enqueue(Queue *q, int x) {
    Node *n = new_node(x);
    if (q->tail) q->tail->next = n;
    else q->head = n;          // queue was empty
    q->tail = n;
}

int dequeue(Queue *q) {
    Node *t = q->head;
    int x = t->data;
    q->head = t->next;
    if (!q->head) q->tail = NULL;   // queue became empty
    free(t);
    return x;
}
```

## 5. Deque (double-ended queue)

A **deque** allows insertion and removal at **both** ends in $O(1)$. It can act as both a stack and a queue. Variants:

- **Input-restricted:** insert at one end only, delete at both.
- **Output-restricted:** delete at one end only, insert at both.

Deques power the *sliding window maximum* algorithm and are used for work-stealing schedulers.

## 6. Priority queue

A **priority queue** removes the item with the **highest priority** (or lowest key) first, regardless of arrival order.

| Implementation | Insert | Remove max/min |
|---|---|---|
| Unsorted array | $O(1)$ | $O(n)$ |
| Sorted array | $O(n)$ | $O(1)$ |
| **Binary heap** | $O(\log n)$ | $O(\log n)$ |

The binary heap is the standard choice. See [Heaps](/data-structures/heaps/).

## 7. Applications

- **CPU scheduling:** round-robin uses a circular queue.
- **Breadth-first search** of graphs and level-order traversal of trees.
- **Buffers:** keyboard input, printer spooling, network packets.
- **Simulations** of customers waiting for service.
- **Priority queues:** Dijkstra's shortest path, Huffman coding, event-driven simulation.

## Summary

- FIFO: enqueue at the rear, dequeue at the front, both $O(1)$.
- A linear array queue can report full while mostly empty; a circular queue fixes it with `(i + 1) % N`.
- Empty: `front == rear`. Full: `(rear + 1) % N == front` (one slot left unused), or keep a count.
- A linked-list queue keeps head and tail pointers; a deque allows both ends.
- Priority queue: a binary heap gives $O(\log n)$ insert and remove.

## Check yourself

<details>
<summary>Why do we need a circular queue?</summary>

In a linear array queue, slots freed at the front by dequeues can never be reused, so the queue can report full while it is mostly empty. Wrapping the indices with modulo arithmetic reuses those slots.
</details>

<details>
<summary>How do you distinguish a full circular queue from an empty one?</summary>

Either leave one slot unused (empty when `front == rear`, full when `(rear + 1) % N == front`), or keep a separate count of items.
</details>

<details>
<summary>Stack vs queue: give one real application of each.</summary>

Stack: the function call stack, or undo in an editor. Queue: print job spooling, or breadth-first search.
</details>
