---
title: Memory Hierarchy and Caches
description: Locality, the memory hierarchy, direct-mapped, set-associative and fully associative caches, splitting an address into tag, index and offset, tracing cache accesses, average memory access time and CPI with misses, replacement and write policies, and the three Cs of misses.
sidebar:
  label: "6. Caches"
  order: 6
lesson:
  module: Memory, I/O and parallelism
  prerequisites:
    - label: Pipelining
      link: /computer-architecture/pipelining/
  outcomes:
    - Explain temporal and spatial locality
    - Split an address into tag, index and offset for any cache organisation
    - Trace a sequence of accesses through a direct-mapped cache
    - Compute average memory access time and the effect of misses on CPI
  keyIdea: >-
    Programs reuse recent data (**temporal locality**) and use nearby data (**spatial locality**), so a small, fast **cache** holding recently used blocks satisfies most accesses. An address splits into **tag | index | offset**; the organisation (direct-mapped, set-associative, fully associative) decides where a block may go. **AMAT = hit time + miss rate × miss penalty.**
---

## 1. Locality and the hierarchy

| Locality | Meaning | Example |
|---|---|---|
| **Temporal** | Recently used items are likely to be used again soon | Loop counters, a function called repeatedly |
| **Spatial** | Items near recently used ones are likely to be used soon | Array elements in order, sequential instructions |

So computers use a **hierarchy**: small, fast, expensive memory near the CPU, and large, slow, cheap memory further away.

| Level | Typical size | Typical access time |
|---|---|---|
| Registers | under 1 KB | under 1 ns |
| L1 cache (SRAM) | 32–64 KB | about 1 ns |
| L2 cache | 256 KB – 2 MB | 3–10 ns |
| L3 cache | several MB to tens of MB | 10–20 ns |
| Main memory (DRAM) | GBs | 50–100 ns |
| SSD / disk | TBs | microseconds / milliseconds |

Data moves between levels in **blocks** (cache lines, typically 64 bytes), which exploits spatial locality.

**Terms:** a **hit** finds the data in the cache; a **miss** does not, and the block must be fetched from the level below. **Hit rate** + **miss rate** = 1. The **miss penalty** is the time to fetch the block.

## 2. Cache organisations

| Organisation | A block can go | Search | Conflicts |
|---|---|---|---|
| **Direct-mapped** | exactly **one** line: index = block number mod number of lines | one comparison | Two blocks mapping to the same line evict each other |
| **$n$-way set-associative** | any of the $n$ lines in **one set**: set = block number mod number of sets | $n$ comparisons in parallel | Fewer |
| **Fully associative** | **any** line | compare with every tag | None (only capacity misses) |

Direct-mapped is 1-way set-associative; fully associative is one set containing every line.

## 3. Splitting an address

$$
\text{address} = \underbrace{\text{tag}}_{\text{the rest}} \;|\; \underbrace{\text{index}}_{\log_2(\text{number of sets})} \;|\; \underbrace{\text{offset}}_{\log_2(\text{block size in bytes})}
$$

**Worked example.** 32-bit addresses, a 64 KB cache, 64-byte blocks.

- Offset: $\log_2 64 = 6$ bits.
- Number of lines: $64\text{K} / 64 = 1024$.

| Organisation | Sets | Index bits | Tag bits |
|---|---|---|---|
| Direct-mapped | 1024 | 10 | $32 - 10 - 6 = 16$ |
| 4-way set-associative | $1024 / 4 = 256$ | 8 | 18 |
| Fully associative | 1 | 0 | 26 |

More associativity means fewer index bits and longer tags.

**Total storage, including overhead.** A direct-mapped cache with 16 KB of data, 16-byte blocks and 32-bit addresses has 1024 lines, a 4-bit offset, a 10-bit index and an 18-bit tag. Each line stores $128$ data bits + 18 tag bits + 1 valid bit = 147 bits, so the cache needs $1024 \times 147 = 150{,}528$ bits, about 18.4 KB for 16 KB of data.

## 4. Tracing accesses

A direct-mapped cache with **8 lines** and one-word blocks. Word addresses accessed: 22, 26, 22, 26, 16, 3, 16, 18. The line is address mod 8.

| Address | Binary | Line | Result | Cache change |
|---|---|---|---|---|
| 22 | 10110 | 110 = 6 | miss | line 6 ← 22 |
| 26 | 11010 | 010 = 2 | miss | line 2 ← 26 |
| 22 | 10110 | 6 | **hit** | |
| 26 | 11010 | 2 | **hit** | |
| 16 | 10000 | 000 = 0 | miss | line 0 ← 16 |
| 3 | 00011 | 011 = 3 | miss | line 3 ← 3 |
| 16 | 10000 | 0 | **hit** | |
| 18 | 10010 | 010 = 2 | miss | line 2 ← 18 (**evicts 26**) |

5 misses, 3 hits. The last miss is a **conflict** miss: 18 and 26 share line 2.

## 5. Performance

**Average memory access time:**

$$
\text{AMAT} = \text{hit time} + \text{miss rate} \times \text{miss penalty}
$$

**Example.** Hit time 1 cycle, miss rate 5%, miss penalty 100 cycles: $\text{AMAT} = 1 + 0.05 \times 100 = 6$ cycles.

**Two levels:** the L1 miss penalty is the L2 access time:

$$
\text{AMAT} = t_{L1} + m_{L1} \times (t_{L2} + m_{L2} \times t_{\text{mem}})
$$

With $t_{L1} = 1$, $m_{L1} = 10\%$, $t_{L2} = 10$, local $m_{L2} = 20\%$, $t_{\text{mem}} = 100$: $1 + 0.1 \times (10 + 0.2 \times 100) = 4$ cycles.

**Effect on CPI.** Base CPI 1; instruction-cache miss rate 2%; data-cache miss rate 4%; 36% of instructions are loads or stores; miss penalty 100 cycles.

$$
\text{memory stalls per instruction} = 0.02 \times 100 + 0.36 \times 0.04 \times 100 = 2 + 1.44 = 3.44
$$

So the real CPI is $1 + 3.44 = 4.44$: the processor spends more time waiting for memory than computing.

## 6. Policies

**Replacement** (for associative caches): **LRU** (evict the least recently used line; exact LRU is costly beyond 4–8 ways, so pseudo-LRU is used), random, or FIFO.

**Writes:**

| On a write hit | Behaviour |
|---|---|
| **Write-through** | Update the cache **and** memory every time. Simple, memory always current; a **write buffer** hides the delay |
| **Write-back** | Update only the cache and mark the line **dirty**; write it to memory when evicted. Less memory traffic |

| On a write miss | Behaviour |
|---|---|
| **Write-allocate** | Load the block into the cache, then write (usually paired with write-back) |
| **No-write-allocate** | Write straight to memory (usually paired with write-through) |

## 7. The three Cs of misses

| Miss type | Cause | Reduced by |
|---|---|---|
| **Compulsory** (cold) | First access to a block | Larger blocks, prefetching |
| **Capacity** | The cache is too small for the working set | A larger cache |
| **Conflict** | Too many blocks map to the same set | Higher associativity |

Larger blocks exploit spatial locality but, past a point, raise the miss penalty and cause more conflicts in a cache of fixed size.

Virtual memory and the TLB, which apply the same caching ideas to pages, are covered in [Operating Systems: memory management](/operating-systems/memory-management/#4-the-tlb).

## Summary

- Temporal and spatial locality make small caches effective; data moves in blocks.
- Direct-mapped: one place per block. $n$-way: $n$ places in a set. Fully associative: anywhere.
- Offset = $\log_2$(block size); index = $\log_2$(number of sets); tag = the remaining bits.
- AMAT = hit time + miss rate × miss penalty; memory stalls add directly to CPI.
- Write-through vs write-back (dirty bit); write-allocate vs no-write-allocate.
- Misses are compulsory, capacity or conflict.

## Check yourself

<details>
<summary>A 2-way set-associative cache of 32 KB with 32-byte blocks uses 32-bit addresses. Give the tag, index and offset sizes.</summary>

Offset 5 bits; lines = 32K / 32 = 1024; sets = 512, so index = 9 bits; tag = 32 − 9 − 5 = 18 bits.
</details>

<details>
<summary>Which kind of miss does increasing associativity reduce?</summary>

Conflict misses. It does not help compulsory misses, and does not help capacity misses because the cache size is unchanged.
</details>

<details>
<summary>Hit time is 2 cycles and the miss penalty 50 cycles. What miss rate gives an AMAT of 4 cycles?</summary>

$4 = 2 + m \times 50$, so $m = 0.04$ (4%).
</details>
