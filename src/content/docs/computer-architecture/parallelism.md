---
title: Parallel Processors
description: Flynn's taxonomy, instruction-level parallelism (superscalar, out-of-order execution, register renaming, speculation), hardware multithreading, multicore and shared-memory multiprocessors, cache coherence with snooping and MESI, GPUs, and Amdahl vs Gustafson.
sidebar:
  label: "8. Parallelism"
  order: 8
lesson:
  module: Memory, I/O and parallelism
  prerequisites:
    - label: Pipelining
      link: /computer-architecture/pipelining/
    - label: Caches
      link: /computer-architecture/memory-hierarchy/
  outcomes:
    - Classify architectures with Flynn's taxonomy
    - Explain how superscalar and out-of-order processors exploit instruction-level parallelism
    - Explain the cache coherence problem and how MESI solves it
    - Contrast Amdahl's and Gustafson's views of parallel speed-up
  keyIdea: >-
    When clock speeds stopped rising, performance came from **parallelism**: several instructions per cycle (ILP), several threads per core, several cores per chip, and thousands of simple GPU cores. Parallel hardware brings new problems, chiefly keeping each core's **cache coherent** with the others.
---

## 1. Flynn's taxonomy

| Class | Instruction streams | Data streams | Example |
|---|---|---|---|
| **SISD** | Single | Single | A classic single-core processor |
| **SIMD** | Single | Multiple | Vector instructions (SSE, AVX, ARM NEON), GPUs (roughly) |
| MISD | Multiple | Single | Rare; some fault-tolerant systems |
| **MIMD** | Multiple | Multiple | Multicore processors, clusters |

## 2. Instruction-level parallelism (ILP)

Running several independent instructions from **one** program at the same time.

- **Superscalar:** fetch, decode and issue **several instructions per cycle** (4–8 in modern cores), with several ALUs. The ideal CPI drops below 1 (we then talk of IPC, instructions per cycle).
- **Out-of-order execution:** instructions wait in a buffer and run as soon as their operands are ready, not strictly in program order. A **reorder buffer** retires them **in order**, so the program still sees sequential results and exceptions stay precise.
- **Register renaming:** map the architectural registers onto a larger set of physical registers. This removes false (WAR and WAW) dependences, leaving only true (RAW) ones.
- **Speculation:** with [branch prediction](/computer-architecture/pipelining/#4-branch-prediction), execute instructions past a branch before knowing its outcome, and discard the results if the guess was wrong.
- **VLIW** (very long instruction word): the **compiler** groups independent operations into one wide instruction, keeping the hardware simple.

ILP is limited by true dependences, branch mispredictions and memory latency, which is why wider issue gives diminishing returns.

## 3. Hardware multithreading

Keep several threads' states (PC and registers) in one core, and switch between them to hide stalls such as cache misses.

| Type | Switches | Notes |
|---|---|---|
| Coarse-grained | On long stalls (such as a cache miss to memory) | Little hardware; doesn't hide short stalls |
| Fine-grained | Every cycle, round robin | Hides short stalls; slows each thread |
| **Simultaneous (SMT)** | Issues instructions from **several threads in the same cycle** on a superscalar core | Intel's Hyper-Threading; fills unused issue slots |

## 4. Multicore and multiprocessors

**Shared-memory multiprocessors** let all cores use one address space, communicating through ordinary loads and stores.

- **UMA** (uniform memory access): every core reaches memory in the same time.
- **NUMA** (non-uniform): each processor has nearby memory that is faster than other processors' memory; software should keep data near the core using it.

**Message passing** systems (clusters) have separate memories and communicate by sending messages over a network. Supercomputers and data centres are clusters.

## 5. Cache coherence

Each core has its own cache. If core 1 caches `X = 5` and core 2 writes `X = 7` into its own cache, core 1 keeps reading a **stale** value. A **coherence protocol** makes sure every core sees writes to the same location in a consistent order.

**Snooping:** every cache watches (snoops) a shared bus. **Write-invalidate** is most common: before writing, a core broadcasts an invalidate, and every other copy is discarded.

**MESI protocol.** Each cache line is in one of four states:

| State | Meaning | Memory up to date? | Other caches have it? |
|---|---|---|---|
| **M**odified | Only this cache has it, and it has been changed | No | No |
| **E**xclusive | Only this cache has it, unchanged | Yes | No |
| **S**hared | Possibly in several caches, unchanged | Yes | Maybe |
| **I**nvalid | Not usable | — | — |

Typical transitions: a read miss loads the line as E (if no one else has it) or S; a write to an S line broadcasts an invalidate and moves to M; when another core reads an M line, this cache supplies the data and both move to S.

Snooping does not scale to many cores, so large systems use **directory-based** coherence, where a directory tracks which caches hold each block.

**False sharing:** two cores repeatedly write **different** variables that happen to sit in the **same** cache line, so the line ping-pongs between their caches even though no data is actually shared. Padding data to separate lines fixes it.

## 6. GPUs

A **GPU** has thousands of simple cores organised for **data parallelism**: the same instruction on many data items (NVIDIA calls this SIMT, single instruction multiple threads). It hides memory latency by switching among huge numbers of threads, rather than with large caches. GPUs excel at graphics, matrix arithmetic and machine learning, and are programmed with CUDA or OpenCL.

## 7. How much speed-up?

**Amdahl's law** (fixed problem size): with a serial fraction $s$ and $N$ processors,

$$
\text{speed-up} = \frac{1}{s + \frac{1 - s}{N}} \le \frac{1}{s}
$$

**Gustafson's law** (problem size grows with $N$): if the parallel part scales with the machine,

$$
\text{scaled speed-up} = s + N(1 - s)
$$

Amdahl is pessimistic about speeding up a fixed job; Gustafson explains why big machines still pay off: people use them to solve **bigger** problems in the same time.

**Example.** With $s = 0.05$ and $N = 100$: Amdahl gives $1 / (0.05 + 0.95/100) \approx 16.8$; Gustafson gives $0.05 + 100 \times 0.95 = 95.05$.

## Summary

- Flynn: SISD, SIMD, MISD, MIMD; multicore is MIMD, vector units and GPUs are SIMD-like.
- ILP: superscalar issue, out-of-order execution with in-order retirement, register renaming, speculation.
- SMT runs several threads' instructions in the same cycle on one core.
- Private caches need a coherence protocol; MESI uses Modified, Exclusive, Shared and Invalid states with snooping invalidation.
- Amdahl limits fixed-size speed-up to $1/s$; Gustafson's scaled speed-up grows with $N$.

## Check yourself

<details>
<summary>What problem does register renaming solve?</summary>

False dependences (WAR and WAW) caused by reusing the same register names. Giving each new value its own physical register lets otherwise independent instructions run out of order.
</details>

<details>
<summary>A core writes to a line in state S. What happens under MESI?</summary>

It broadcasts an invalidate so all other copies become I, then it writes, and its copy moves to M.
</details>

<details>
<summary>What is false sharing?</summary>

Different cores writing different variables that share one cache line. Coherence treats it as sharing, so the line keeps bouncing between caches and performance drops.
</details>
