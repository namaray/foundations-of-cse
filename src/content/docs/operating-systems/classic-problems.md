---
title: Classic Synchronization Problems
description: The bounded-buffer (producer–consumer), readers–writers and dining-philosophers problems, with semaphore solutions and the pitfalls each one illustrates.
sidebar:
  label: "6. Classic problems"
  order: 6
lesson:
  module: Synchronization
  prerequisites:
    - label: Synchronization
      link: /operating-systems/synchronization/
  outcomes:
    - Write the semaphore solution to the bounded-buffer problem and explain each semaphore
    - Explain why the first readers–writers solution can starve writers
    - Show how the dining philosophers can deadlock and give two fixes
  keyIdea: >-
    Three standard problems test every synchronization idea. **Producer–consumer** uses counting semaphores for slots and items plus a mutex. **Readers–writers** lets many readers share but writers work alone. **Dining philosophers** shows how naive locking leads to deadlock.
---

These three problems appear in almost every OS exam. Learn the code, and be able to explain what each semaphore is for.

## 1. Bounded buffer (producer–consumer)

A **producer** puts items into a buffer of size $n$, and a **consumer** takes them out. The producer must wait when the buffer is full; the consumer must wait when it is empty.

```c
semaphore mutex = 1;   // mutual exclusion on the buffer
semaphore empty = n;   // number of empty slots
semaphore full  = 0;   // number of filled slots

// Producer
while (true) {
    item = produce();
    wait(empty);       // wait for a free slot
    wait(mutex);
    add item to buffer;
    signal(mutex);
    signal(full);      // one more item available
}

// Consumer
while (true) {
    wait(full);        // wait for an item
    wait(mutex);
    remove item from buffer;
    signal(mutex);
    signal(empty);     // one more free slot
    consume(item);
}
```

| Semaphore | Initial value | Purpose |
|---|---|---|
| `mutex` | 1 | Only one process touches the buffer at a time |
| `empty` | $n$ | Counts free slots; blocks the producer when the buffer is full |
| `full` | 0 | Counts items; blocks the consumer when the buffer is empty |

:::caution[Order matters]
If the producer did `wait(mutex)` **before** `wait(empty)`, a full buffer would deadlock: the producer would sleep holding the mutex, and the consumer could never get in to free a slot.
:::

## 2. Readers–writers

Many **readers** may read shared data at the same time, but a **writer** needs exclusive access.

**First readers–writers solution** (readers have priority):

```c
semaphore rw_mutex = 1;   // exclusive access for writers (and the first/last reader)
semaphore mutex = 1;      // protects read_count
int read_count = 0;

// Writer
wait(rw_mutex);
    /* write */
signal(rw_mutex);

// Reader
wait(mutex);
read_count++;
if (read_count == 1) wait(rw_mutex);   // first reader locks out writers
signal(mutex);
    /* read */
wait(mutex);
read_count--;
if (read_count == 0) signal(rw_mutex); // last reader lets writers in
signal(mutex);
```

**The catch:** as long as readers keep arriving, `read_count` never drops to 0, so writers **starve**. The *second* readers–writers problem gives writers priority instead, which can starve readers. Fair solutions queue both. Many systems provide **reader–writer locks** for this.

## 3. Dining philosophers

Five philosophers sit around a table with one chopstick between each pair. A philosopher needs **both** neighbouring chopsticks to eat.

```c
semaphore chopstick[5] = {1, 1, 1, 1, 1};

// Philosopher i
while (true) {
    wait(chopstick[i]);             // pick up left
    wait(chopstick[(i + 1) % 5]);   // pick up right
    /* eat */
    signal(chopstick[i]);
    signal(chopstick[(i + 1) % 5]);
    /* think */
}
```

**Deadlock:** if all five pick up their left chopstick at the same moment, each waits forever for the right one. All four [deadlock conditions](/operating-systems/deadlocks/#1-four-necessary-conditions) hold, including a circular wait.

**Fixes:**

- **Asymmetry:** odd-numbered philosophers pick up left first; even-numbered pick up right first. This breaks the circular wait.
- **Limit diners:** allow at most 4 philosophers to sit at once (a counting semaphore initialised to 4).
- **Both or nothing:** pick up both chopsticks only if both are free, inside a critical section or a monitor.

Even deadlock-free solutions must also avoid **starvation**: a philosopher whose neighbours take turns eating could wait forever.

## Summary

- Bounded buffer: `empty` (starts at $n$) and `full` (starts at 0) count slots and items; `mutex` protects the buffer; take the counting semaphore before the mutex.
- Readers–writers: the first solution lets readers share but can starve writers.
- Dining philosophers: everyone grabbing their left chopstick deadlocks; break the symmetry or limit the number of diners.

## Check yourself

<details>
<summary>In the bounded-buffer solution, what are the values of empty and full when the buffer holds 3 items and n = 10?</summary>

`empty` = 7 and `full` = 3 (when no process is in the middle of an operation).
</details>

<details>
<summary>In the first readers–writers solution, why does only the first reader wait on rw_mutex?</summary>

Once one reader holds `rw_mutex`, writers are locked out, so later readers can enter directly. Only the transition from zero readers to one needs to lock out writers, and only the transition back to zero releases it.
</details>

<details>
<summary>Which deadlock condition does the "odd picks left first, even picks right first" rule break?</summary>

Circular wait. The philosophers can no longer form a cycle where each holds one chopstick and waits for the next.
</details>
