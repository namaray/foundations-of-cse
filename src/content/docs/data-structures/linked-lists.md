---
title: Linked Lists
description: Singly, doubly and circular linked lists, their operations in C, classic problems like reversal and cycle detection, and a comparison with arrays.
sidebar:
  label: "3. Linked lists"
  order: 3
lesson:
  module: Linear structures
  prerequisites:
    - label: Arrays
      link: /data-structures/arrays/
  outcomes:
    - Compare singly, doubly and circular linked lists
    - Insert and delete nodes in the correct pointer order
    - Reverse a list and detect a cycle with two pointers
    - Choose between an array and a linked list for a task
  keyIdea: >-
    A linked list chains **nodes** through pointers, so it grows one node at a time and inserts or deletes in $O(1)$ once you hold the right node. You lose $O(1)$ indexing: reaching the $k$-th item takes $O(k)$ steps. Many list problems are solved by walking **two pointers** at different speeds.
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

## 1. Types of linked list

| Type | Each node points to | Notes |
|---|---|---|
| Singly linked | Next node | Simplest; can only move forward |
| Doubly linked | Next **and** previous node | Moves both ways; deleting a known node is $O(1)$; extra pointer per node |
| Circular (singly) | Next; last node points back to the first | No `NULL`; useful for round-robin scheduling |
| Circular doubly | Next and previous; ends joined | Used for deques and LRU caches |

## 2. Core operations (singly linked)

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

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 520 220" role="img" aria-labelledby="llins-t"><title id="llins-t">Inserting 25 after 20 in the list 10, 20, 30: first point the new node at 30, then point 20 at the new node.</title><defs><marker id="ah-llins" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-llins-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-llins-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="30" y1="46" x2="30" y2="72" marker-end="url(#ah-llins)"/><line class="dg-line" x1="70" y1="95" x2="140" y2="95" marker-end="url(#ah-llins)"/><line class="dg-line" x1="200" y1="95" x2="270" y2="95" marker-end="url(#ah-llins)" stroke-dasharray="5 4"/><line class="dg-line" x1="330" y1="95" x2="352" y2="95"/><path class="dg-line-b" d="M248,179 Q300,190 300,118" marker-end="url(#ah-llins-b)"/><path class="dg-line-a" d="M200,95 Q190,140 200,156" marker-end="url(#ah-llins-a)"/><text class="dg-t-muted" x="30" y="36" text-anchor="middle">head</text><rect class="dg-cell" x="12" y="76" width="46" height="38" rx="4"/><text x="35" y="95" text-anchor="middle">10</text><rect class="dg-cell" x="58" y="76" width="24" height="38" rx="4"/><circle class="dg-cell" cx="70" cy="95" r="3"/><rect class="dg-cell-a" x="142" y="76" width="46" height="38" rx="4"/><text class="dg-t-a" x="165" y="95" text-anchor="middle">20</text><rect class="dg-cell-a" x="188" y="76" width="24" height="38" rx="4"/><circle class="dg-cell" cx="200" cy="95" r="3"/><rect class="dg-cell" x="272" y="76" width="46" height="38" rx="4"/><text x="295" y="95" text-anchor="middle">30</text><rect class="dg-cell" x="318" y="76" width="24" height="38" rx="4"/><circle class="dg-cell" cx="330" cy="95" r="3"/><rect class="dg-cell" x="272" y="76" width="46" height="38" rx="4"/><text x="295" y="95" text-anchor="middle">30</text><rect class="dg-cell" x="318" y="76" width="24" height="38" rx="4"/><circle class="dg-cell" cx="330" cy="95" r="3"/><text class="dg-t-muted" x="356" y="95" style="font-size:13px">NULL</text><rect class="dg-cell-b" x="190" y="160" width="46" height="38" rx="4"/><text class="dg-t-b" x="213" y="179" text-anchor="middle">25</text><rect class="dg-cell-b" x="236" y="160" width="24" height="38" rx="4"/><circle class="dg-cell-b" cx="248" cy="179" r="3"/><text class="dg-t-b" x="318" y="176" style="font-size:13px">① new-&gt;next = prev-&gt;next</text><text class="dg-t-a" x="18" y="150" style="font-size:13px">② prev-&gt;next = new</text><text class="dg-t-a" x="165" y="60" text-anchor="middle" style="font-size:13px">prev</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>prev</li><li><span class="dg-swatch b"></span>new node</li></ul><figcaption>Insert after prev in two steps, in this order. Step ① links the new node to the rest of the list; only then does step ② replace the old link (dashed). Reversing the steps loses everything after prev.</figcaption></figure>

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

## 3. Classic problems

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

## 4. Array vs linked list

| | Array | Linked list |
|---|---|---|
| Memory layout | Contiguous | Scattered nodes |
| Access by index | $O(1)$ | $O(n)$ |
| Insert/delete at front | $O(n)$ | $O(1)$ |
| Insert/delete in middle (position known) | $O(n)$ shifting | $O(1)$ relinking |
| Extra memory | None | One pointer per node (two if doubly linked) |
| Cache performance | Excellent | Poor (pointer chasing) |
| Size | Fixed, or resized by copying | Grows one node at a time |

## 5. Applications

- Implementing [stacks](/data-structures/stacks/) and [queues](/data-structures/queues/)
- Adjacency lists for [graphs](/data-structures/graphs/)
- Chaining in [hash tables](/data-structures/hashing/)
- Polynomial arithmetic: each node stores a coefficient and an exponent
- Undo history, music playlists, and LRU caches (doubly linked list + hash map)

## Summary

- Singly linked: next only. Doubly: next and previous, $O(1)$ delete of a known node. Circular: the last node links back to the first.
- Insert at the head and after a known node are $O(1)$; set the new node's `next` before relinking.
- Search and access by position are $O(n)$; binary search doesn't help.
- Reverse in one pass by turning pointers around; detect cycles with Floyd's fast and slow pointers.
- Arrays win on indexing and cache use; lists win on frequent insertion and deletion.

## Check yourself

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
