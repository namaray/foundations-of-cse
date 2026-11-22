---
title: Computer Architecture Cheat Sheet
description: One-page revision of performance equations, instruction sets and addressing modes, datapath and control, pipelining, caches, computer arithmetic, I/O and parallelism.
sidebar:
  label: "9. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [Performance](/computer-architecture/performance/)

- CPU time = IC × CPI × cycle time = IC × CPI / clock rate.
- Average CPI = Σ CPIᵢ × fractionᵢ. MIPS = clock rate / (CPI × 10⁶), but compare execution times, not MIPS.
- Amdahl: speedup = $1 / ((1 - f) + f/s)$, at most $1/(1 - f)$.

## [Instruction sets](/computer-architecture/instruction-sets/)

- 3-, 2-, 1- (accumulator) and 0-address (stack) code for the same expression.
- EA: immediate (operand itself), direct (field), indirect (M[field]), register indirect (Rn), displacement (Rn + offset), relative (PC + offset).
- RISC: fixed-length, load/store, many registers, hardwired control. CISC: variable-length, memory operands, microcode.
- MIPS formats: R (op rs rt rd shamt funct), I (op rs rt imm16), J (op addr26).

## [Datapath](/computer-architecture/datapath-control/) and [pipelining](/computer-architecture/pipelining/)

- Single-cycle clock = slowest instruction (load). Multi-cycle: load 5, R-type and store 4, branch 3 cycles.
- Hardwired control is fast; microprogrammed is flexible.
- Pipeline: $(k + n - 1)$ cycles; speedup $nk/(k + n - 1) \to k$. Clock = slowest stage + register overhead.
- Hazards: structural (duplicate resources), data/RAW (forwarding; load-use still needs 1 stall), control (predict, flush).
- 2-bit predictor: one misprediction per loop exit.

## [Arithmetic](/computer-architecture/computer-arithmetic/)

- Booth: $Q_0Q_{-1}$ = 10 → $A - M$; 01 → $A + M$; then arithmetic shift right.
- IEEE 754 single: 1 | 8 (bias 127) | 23, value $(-1)^s \times 1.f \times 2^{E-127}$. Double: 1 | 11 (bias 1023) | 52.
- E = 0: zero or denormal. E = 255: infinity (f = 0) or NaN (f ≠ 0). $-6.75$ = `C0D80000`.

## [Caches](/computer-architecture/memory-hierarchy/)

- Offset = $\log_2$ block size; index = $\log_2$ sets; tag = the rest. Sets = lines / associativity.
- AMAT = hit time + miss rate × miss penalty. Two levels: $t_1 + m_1(t_2 + m_2 t_{\text{mem}})$.
- CPI = base + (I-miss rate × penalty) + (memory-op fraction × D-miss rate × penalty).
- Write-through vs write-back (dirty bit). Misses: compulsory, capacity, conflict.

## [I/O](/computer-architecture/input-output/) and [parallelism](/computer-architecture/parallelism/)

- Polling (busy wait) → interrupts (per word) → DMA (per block, one interrupt).
- Memory-mapped I/O uses loads and stores; isolated I/O uses IN/OUT.
- Flynn: SISD, SIMD, MISD, MIMD. ILP: superscalar, out-of-order, renaming, speculation.
- MESI: Modified, Exclusive, Shared, Invalid. Gustafson: scaled speedup $= s + N(1 - s)$.

## Top viva questions

1. Von Neumann vs Harvard architecture.
2. Compute CPU time and average CPI for an instruction mix.
3. Why is MIPS a misleading metric?
4. Apply Amdahl's law.
5. RISC vs CISC.
6. Explain the addressing modes with effective-address examples.
7. Hardwired vs microprogrammed control.
8. Compute pipeline speed-up; explain the three kinds of hazard and their fixes.
9. Multiply with Booth's algorithm; represent a number in IEEE 754.
10. Split an address into tag, index and offset; compute AMAT.
11. Write-through vs write-back caches.
12. Polling vs interrupts vs DMA.
13. What is cache coherence, and how does MESI work?
