---
title: Queues
description: Linear and circular queues, deques and priority queues, with array and linked-list implementations and their applications.
sidebar:
  order: 5
---

A **queue** inserts at one end (the **rear**) and removes from the other (the **front**). The first item in is the first item out: **FIFO**. Think of a line at a ticket counter.

## Operations

| Operation | Meaning | Cost |
|---|---|---|
| `enqueue(x)` | Add `x` at the rear | $O(1)$ |
| `dequeue()` | Remove and return the front item | $O(1)$ |
| `front()` | Look at the front item | $O(1)$ |
| `isEmpty()` / `isFull()` | Check the state | $O(1)$ |

## The problem with a simple array queue

Keep two indices, `front` and `rear`. Enqueue increments `rear`; dequeue increments `front`. After some operations, `rear` reaches the end of the array even though there are free slots at the start that dequeued items left behind. The queue reports *full* while it is partly empty.

```text
index:   0   1   2   3   4
        [ ] [ ] [ ] [40][50]
                     ↑    ↑
                  front  rear = 4 = MAX-1  →  "full", but 3 slots are free
```

## Circular queue

The fix is to wrap the indices around with modulo arithmetic, so the array behaves like a ring:

$$
\text{rear} = (\text{rear} + 1) \bmod N \qquad \text{front} = (\text{front} + 1) \bmod N
$$

To tell *full* from *empty*, a common convention leaves one slot unused:

- **Empty:** `front == rear`
- **Full:** `(rear + 1) % N == front`

The alternative is to keep a separate `count` of items.

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

## Linked-list queue

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

## Deque (double-ended queue)

A **deque** allows insertion and removal at **both** ends in $O(1)$. It can act as both a stack and a queue. Variants:

- **Input-restricted:** insert at one end only, delete at both.
- **Output-restricted:** delete at one end only, insert at both.

Deques power the *sliding window maximum* algorithm and are used for work-stealing schedulers.

## Priority queue

A **priority queue** removes the item with the **highest priority** (or lowest key) first, regardless of arrival order.

| Implementation | Insert | Remove max/min |
|---|---|---|
| Unsorted array | $O(1)$ | $O(n)$ |
| Sorted array | $O(n)$ | $O(1)$ |
| **Binary heap** | $O(\log n)$ | $O(\log n)$ |

The binary heap is the standard choice. See [Heaps](/data-structures/heaps/).

## Applications

- **CPU scheduling:** round-robin uses a circular queue.
- **Breadth-first search** of graphs and level-order traversal of trees.
- **Buffers:** keyboard input, printer spooling, network packets.
- **Simulations** of customers waiting for service.
- **Priority queues:** Dijkstra's shortest path, Huffman coding, event-driven simulation.

## Viva questions

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
