---
title: Computer Organisation and Performance
description: The von Neumann and Harvard architectures, the stored-program concept, the CPU performance equation, CPI for an instruction mix, MIPS and its pitfalls, Amdahl's law, and benchmarks.
sidebar:
  label: "1. Organisation and performance"
  order: 1
lesson:
  module: Foundations
  outcomes:
    - Describe the von Neumann architecture and its bottleneck
    - Compute CPU time from instruction count, CPI and clock rate
    - Compute the average CPI for an instruction mix
    - Apply Amdahl's law to estimate overall speed-up
  keyIdea: >-
    Execution time = **instruction count × cycles per instruction × clock period**. Every design decision trades off these three. **Amdahl's law** limits the benefit of speeding up any one part: the parts you don't improve come to dominate.
---

## 1. The von Neumann architecture

Almost every computer follows the **stored-program** idea: instructions and data are both stored in memory as numbers, so a program can be loaded like data.

The main components:

- **CPU:** the **control unit** (fetches and decodes instructions) and the **datapath** (ALU and registers, which carry them out).
- **Memory:** holds both instructions and data.
- **Input/output** devices.
- **Buses** connecting them: address, data and control.

The CPU repeats the **instruction cycle**: **fetch** the instruction at the address in the program counter (PC), **decode** it, **execute** it, and update the PC.

**The von Neumann bottleneck:** instructions and data share one path to memory, so the CPU often waits for memory. Caches and the Harvard idea ease this.

| | Von Neumann | Harvard |
|---|---|---|
| Memory for instructions and data | Shared | Separate |
| Fetch an instruction and data at once | No | Yes |
| Used in | General-purpose computers (main memory) | Microcontrollers, DSPs; and inside modern CPUs as separate L1 instruction and data caches |

## 2. The CPU performance equation

$$
\text{CPU time} = \text{Instruction count} \times \text{CPI} \times \text{Clock cycle time} = \frac{\text{IC} \times \text{CPI}}{\text{Clock rate}}
$$

| Factor | Affected by |
|---|---|
| Instruction count (IC) | Algorithm, compiler, instruction set |
| Cycles per instruction (CPI) | Instruction set, hardware organisation (pipelining, caches) |
| Clock cycle time (or clock rate) | Hardware technology, organisation |

**Example.** A program executes $10^9$ instructions with CPI = 2 on a 2 GHz processor:

$$
\text{CPU time} = \frac{10^9 \times 2}{2 \times 10^9} = 1 \text{ second}
$$

### CPI for an instruction mix

$$
\text{CPI} = \sum_i \text{CPI}_i \times \text{fraction}_i
$$

| Class | Fraction | CPI | Contribution |
|---|---|---|---|
| ALU | 50% | 1 | 0.5 |
| Load | 20% | 5 | 1.0 |
| Store | 10% | 3 | 0.3 |
| Branch | 20% | 2 | 0.4 |
| | | **Average** | **2.2** |

### Comparing machines

**Performance** = 1 / execution time. "A is $n$ times faster than B" means

$$
n = \frac{\text{Performance}_A}{\text{Performance}_B} = \frac{\text{Time}_B}{\text{Time}_A}
$$

**Example.** Machine A runs a program in 10 s and B in 15 s: A is 1.5 times faster.

## 3. MIPS and its pitfalls

$$
\text{MIPS} = \frac{\text{Instruction count}}{\text{Execution time} \times 10^6} = \frac{\text{Clock rate}}{\text{CPI} \times 10^6}
$$

With the mix above at 2 GHz: $2000 / 2.2 \approx 909$ MIPS.

MIPS can **mislead**: it ignores how much work each instruction does. A machine with simple instructions may need many more of them, giving a high MIPS rating yet a longer run time. **Execution time on real programs is the only reliable measure.** Similarly, a faster clock does not help if CPI rises.

## 4. Amdahl's law

If a fraction $f$ of execution time is sped up by a factor $s$:

$$
\text{Overall speedup} = \frac{1}{(1 - f) + \dfrac{f}{s}}
$$

**Example.** Multiplication takes 80% of the time. How much faster must multiplication get to make the whole program 4 times faster?

$$
4 = \frac{1}{0.2 + 0.8/s} \implies 0.2 + \frac{0.8}{s} = 0.25 \implies s = 16
$$

To get 5 times faster you would need $0.2 + 0.8/s = 0.2$, which is impossible: the unimproved 20% caps the speed-up at $1/0.2 = 5$, approached only as $s \to \infty$.

**Lesson:** make the **common case fast**, but remember that what you don't improve limits you. The same law limits [parallel speed-up](/computer-architecture/parallelism/).

## 5. Benchmarks and power

- **Benchmarks** are standard programs for comparing machines; **SPEC CPU** is the best known. Results are summarised with the **geometric mean** of speed ratios, so the choice of reference machine does not change the ranking.
- **Power wall:** dynamic power $\propto C V^2 f$. Clock rates stopped rising around 2005 because chips became too hot, so the industry turned to **multiple cores** instead.

## Summary

- Stored-program (von Neumann) machines keep instructions and data in one memory; the shared path is the bottleneck.
- CPU time = IC × CPI × cycle time = IC × CPI / clock rate.
- Average CPI = Σ (CPI of class × fraction of class).
- MIPS ignores work per instruction; compare execution times instead.
- Amdahl: speedup = $1 / ((1 - f) + f/s)$, capped at $1/(1 - f)$.

## Check yourself

<details>
<summary>A program has 2 × 10⁹ instructions, CPI 1.5, on a 3 GHz CPU. What is the CPU time?</summary>

$2 \times 10^9 \times 1.5 / (3 \times 10^9) = 1$ second.
</details>

<details>
<summary>Can a machine with a higher MIPS rating be slower?</summary>

Yes. If its instructions do less work, it may need many more of them to run the same program, taking longer overall despite the higher MIPS figure.
</details>

<details>
<summary>If 60% of a program can be made infinitely fast, what is the maximum speed-up?</summary>

$1 / (1 - 0.6) = 2.5$.
</details>
