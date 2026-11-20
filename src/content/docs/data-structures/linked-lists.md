---
title: Linked Lists
description: Singly, doubly and circular linked lists, their operations in C, classic problems like reversal and cycle detection, and a comparison with arrays.
sidebar:
  order: 3
---

A **linked list** is a sequence of **nodes**, where each node holds data and a pointer to the next node. Nodes can live anywhere in memory, so the list grows and shrinks one node at a time without moving the others.

```text
head
 │
 ▼
┌────┬───┐   ┌────┬───┐   ┌────┬──────┐
│ 10 │ ●─┼──▶│ 20 │ ●─┼──▶│ 30 │ NULL │
└────┴───┘   └────┴───┘   └────┴──────┘
```

```c
typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node *new_node(int x) {
    Node *n = malloc(sizeof(Node));
    n->data = x;
    n->next = NULL;
    return n;
}
```

## Types of linked list

| Type | Each node points to | Notes |
|---|---|---|
| Singly linked | Next node | Simplest; can only move forward |
| Doubly linked | Next **and** previous node | Moves both ways; deleting a known node is $O(1)$; extra pointer per node |
| Circular (singly) | Next; last node points back to the first | No `NULL`; useful for round-robin scheduling |
| Circular doubly | Next and previous; ends joined | Used for deques and LRU caches |

## Core operations (singly linked)

**Insert at the head**, $O(1)$:

```c
void push_front(Node **head, int x) {
    Node *n = new_node(x);
    n->next = *head;
    *head = n;
}
```

**Insert after a given node**, $O(1)$ once you have the node:

```c
void insert_after(Node *prev, int x) {
    Node *n = new_node(x);
    n->next = prev->next;   // 1. link the new node to the rest
    prev->next = n;         // 2. then link prev to the new node
}
```

:::caution[Order matters]
Always set the new node's `next` **before** changing `prev->next`. Doing it the other way round loses the rest of the list.
:::

**Delete the first node with a given key**, $O(n)$ to find it:

```c
void delete_key(Node **head, int key) {
    Node *cur = *head, *prev = NULL;
    while (cur && cur->data != key) {
        prev = cur;
        cur = cur->next;
    }
    if (!cur) return;                 // not found
    if (prev) prev->next = cur->next; // unlink from the middle or end
    else *head = cur->next;           // unlink the head
    free(cur);
}
```

**Traverse / search**, $O(n)$:

```c
for (Node *p = head; p != NULL; p = p->next)
    printf("%d ", p->data);
```

## Classic problems

### Reverse a list

Walk the list once, turning each `next` pointer around. $O(n)$ time, $O(1)$ space.

```c
Node *reverse(Node *head) {
    Node *prev = NULL, *cur = head;
    while (cur) {
        Node *next = cur->next;  // save the rest
        cur->next = prev;        // reverse this link
        prev = cur;
        cur = next;
    }
    return prev;                 // new head
}
```

### Detect a cycle (Floyd's tortoise and hare)

Move one pointer one step at a time and another two steps at a time. If there is a cycle they must meet; if the fast pointer reaches `NULL`, there is none. $O(n)$ time, $O(1)$ space.

```c
int has_cycle(Node *head) {
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return 1;
    }
    return 0;
}
```

### Find the middle node

Use the same two pointers: when the fast one reaches the end, the slow one is in the middle.

## Array vs linked list

| | Array | Linked list |
|---|---|---|
| Memory layout | Contiguous | Scattered nodes |
| Access by index | $O(1)$ | $O(n)$ |
| Insert/delete at front | $O(n)$ | $O(1)$ |
| Insert/delete in middle (position known) | $O(n)$ shifting | $O(1)$ relinking |
| Extra memory | None | One pointer per node (two if doubly linked) |
| Cache performance | Excellent | Poor (pointer chasing) |
| Size | Fixed, or resized by copying | Grows one node at a time |

## Applications

- Implementing [stacks](/data-structures/stacks/) and [queues](/data-structures/queues/)
- Adjacency lists for [graphs](/data-structures/graphs/)
- Chaining in [hash tables](/data-structures/hashing/)
- Polynomial arithmetic: each node stores a coefficient and an exponent
- Undo history, music playlists, and LRU caches (doubly linked list + hash map)

## Viva questions

<details>
<summary>Why can't we do binary search on a linked list efficiently?</summary>

Binary search needs to jump to the middle element in $O(1)$. In a linked list, reaching the middle takes $O(n)$ steps, so the whole search degrades to $O(n)$.
</details>

<details>
<summary>What is the advantage of a doubly linked list?</summary>

You can traverse backwards, and you can delete a node in $O(1)$ when you already have a pointer to it, because you can reach its predecessor directly. The cost is an extra pointer per node.
</details>

<details>
<summary>What is a header (sentinel) node?</summary>

A dummy node at the start of the list that holds no real data. It means the list is never empty, so insertion and deletion at the front need no special cases.
</details>

<details>
<summary>How would you find the k-th node from the end in one pass?</summary>

Move a first pointer $k$ steps ahead, then move both pointers together until the first reaches the end. The second pointer is then $k$ nodes from the end.
</details>
