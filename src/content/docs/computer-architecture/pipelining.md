---
title: Pipelining
description: The five-stage pipeline, pipeline timing and speedup formulas, structural, data and control hazards, forwarding and stalls, the load-use hazard, branch prediction, and timing diagrams.
sidebar:
  label: "4. Pipelining"
  order: 4
lesson:
  module: Processor design
  prerequisites:
    - label: Datapath and control
      link: /computer-architecture/datapath-control/
  outcomes:
    - Compute the time and speed-up of a pipeline for n instructions
    - Identify structural, data and control hazards in a code sequence
    - Explain how forwarding removes most data hazards, and why load-use still stalls
    - Describe static and dynamic branch prediction
  keyIdea: >-
    Pipelining overlaps instructions like an assembly line: while one instruction executes, the next is being decoded and the one after is being fetched. A $k$-stage pipeline approaches $k$ times the throughput, but **hazards** (resource clashes, data dependences and branches) force stalls that eat into the gain.
---

## 1. The idea

Laundry analogy: washing, drying and folding one load at a time takes 3 hours per load. Starting the next wash while the first load dries finishes a load every hour once the pipeline is full. Each load still takes 3 hours (**latency** is unchanged), but **throughput** triples.

**The classic five-stage RISC pipeline:**

| Stage | Name | Does |
|---|---|---|
| IF | Instruction fetch | Read the instruction; PC + 4 |
| ID | Instruction decode | Decode; read registers |
| EX | Execute | ALU operation or address calculation |
| MEM | Memory access | Load or store |
| WB | Write back | Write the result to a register |

```text
Cycle:     1    2    3    4    5    6    7
Instr 1:   IF   ID   EX   MEM  WB
Instr 2:        IF   ID   EX   MEM  WB
Instr 3:             IF   ID   EX   MEM  WB
```

Once full, one instruction completes **every cycle**. Registers between stages (pipeline registers) hold each instruction's intermediate values.

## 2. Timing and speed-up

With $k$ stages, $n$ instructions, cycle time $t$ and no stalls:

$$
\text{Pipelined time} = (k + n - 1)\, t \qquad \text{Non-pipelined time} = n \cdot k \cdot t
$$

$$
\text{Speed-up} = \frac{nk}{k + n - 1} \;\to\; k \text{ as } n \to \infty
$$

The first instruction takes $k$ cycles to fill the pipeline; each later one adds one cycle.

**Example.** $k = 5$, $n = 100$: pipelined $104$ cycles, non-pipelined $500$, speed-up $500 / 104 \approx 4.8$.

**Unequal stages:** the cycle time is set by the **slowest stage** plus the pipeline-register overhead. With stages of 200, 100, 200, 200 and 100 ps and 20 ps overhead, the cycle is 220 ps, not the 160 ps average. Balancing stages matters.

With stalls: $\text{CPI}_{\text{pipelined}} = 1 + \text{average stall cycles per instruction}$.

## 3. Hazards

A **hazard** stops the next instruction from executing in its planned cycle.

### Structural hazards

Two instructions need the same hardware in the same cycle. For example, with a single memory, one instruction's MEM stage and a later one's IF stage clash. **Fix:** separate instruction and data memories (split L1 caches), or duplicate the resource.

### Data hazards

An instruction needs a result that an earlier one has not yet written.

```text
add $s0, $t0, $t1     ; writes $s0 in WB (cycle 5)
sub $t2, $s0, $t3     ; wants $s0 in ID (cycle 3)
```

| Type | Meaning | In a simple in-order pipeline |
|---|---|---|
| **RAW** (read after write) | true dependence: read a value before it is written | Occurs; the main problem |
| WAR (write after read) | anti-dependence | Only with out-of-order execution |
| WAW (write after write) | output dependence | Only with out-of-order execution |

**Fixes:**

- **Stall** (insert bubbles) until the value is written. Without other help, the `sub` above waits 2 cycles (with register write in the first half of a cycle and read in the second half).
- **Forwarding (bypassing):** send the ALU result straight from the EX/MEM pipeline register to the ALU input of the next instruction. The `add` result exists at the end of cycle 3, just in time for `sub`'s EX in cycle 4. **No stall.**

**The load-use hazard.** A load's data is only available after MEM:

```text
lw  $s0, 20($t1)      ; data ready at end of MEM (cycle 4)
sub $t2, $s0, $t3     ; needs it at start of EX (cycle 4)
```

Even with forwarding, **one stall cycle** is needed. Compilers reduce these by **scheduling**: moving an independent instruction into the slot after the load.

### Control hazards

A branch's outcome is not known until it is evaluated, but the pipeline has already fetched the following instructions.

**Fixes:**

- **Stall** until the branch resolves (costly: branches are about 15–20% of instructions).
- **Resolve earlier:** compare registers in ID, reducing the penalty to 1 cycle.
- **Predict not taken:** keep fetching sequentially; if the branch is taken, **flush** the wrongly fetched instructions.
- **Delayed branch:** the instruction right after the branch always executes, and the compiler fills that slot with useful work (used in MIPS; out of favour now).
- **Dynamic branch prediction:** learn from history.

## 4. Branch prediction

**Static:** a fixed rule. "Backward branches taken, forward branches not taken" works well, because backward branches are usually loops.

**Dynamic:** a **branch history table** indexed by the branch address.

- **1-bit predictor:** predict what happened last time. A loop branch is mispredicted **twice** per loop (on the exit, and again on re-entry).
- **2-bit saturating counter:** the prediction changes only after **two** consecutive mispredictions. A loop branch is mispredicted only once per loop.

```text
 Strongly taken ⇄ Weakly taken ⇄ Weakly not taken ⇄ Strongly not taken
       (11)            (10)             (01)                (00)
   taken moves left (towards strongly taken); not taken moves right
```

A **branch target buffer** caches the target address too, so the fetch can redirect immediately. Modern predictors (correlating, tournament, TAGE) exceed 95% accuracy.

## 5. Beyond the basic pipeline

Deeper pipelines (more, shorter stages) allow faster clocks but larger misprediction penalties. **Superscalar** processors issue several instructions per cycle, and **out-of-order execution** runs instructions as soon as their operands are ready; see [Parallelism](/computer-architecture/parallelism/).

## Summary

- A $k$-stage pipeline takes $(k + n - 1)$ cycles for $n$ instructions; speed-up approaches $k$.
- The slowest stage sets the clock; latency per instruction does not improve.
- Structural hazards: resource clashes (fix: duplicate resources). Data hazards: RAW dependences (fix: forwarding, plus one stall for load-use). Control hazards: branches (fix: early resolution, prediction).
- A 2-bit predictor mispredicts a loop branch once per loop; a 1-bit predictor twice.

## Check yourself

<details>
<summary>A 4-stage pipeline with a 10 ns cycle runs 20 instructions. How long does it take?</summary>

$(4 + 20 - 1) \times 10 = 230$ ns.
</details>

<details>
<summary>Why does a load followed by an instruction using its result still stall with forwarding?</summary>

The loaded data is available only at the end of the MEM stage, but the next instruction needs it at the start of its EX stage in the same cycle. The value cannot be forwarded backwards in time, so one bubble is needed.
</details>

<details>
<summary>Why are WAR and WAW hazards not a problem in a simple 5-stage in-order pipeline?</summary>

Registers are read in ID and written in WB, always in program order, so a later instruction can never write a register before an earlier one reads or writes it.
</details>
