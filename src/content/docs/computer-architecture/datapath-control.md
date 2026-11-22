---
title: Datapath and Control
description: Register transfer notation, the components of a datapath, executing instructions on a single-cycle datapath, multi-cycle implementation, and hardwired vs microprogrammed control units.
sidebar:
  label: "3. Datapath and control"
  order: 3
lesson:
  module: Processor design
  prerequisites:
    - label: Instruction sets
      link: /computer-architecture/instruction-sets/
  outcomes:
    - Describe the instruction cycle in register transfer notation
    - Trace an R-type, load and branch instruction through a single-cycle datapath
    - Explain why single-cycle designs are inefficient
    - Compare hardwired and microprogrammed control
  keyIdea: >-
    The **datapath** (registers, ALU, memories, multiplexers) moves and transforms data; the **control unit** sets the multiplexers and functions for each instruction. A single-cycle design is simple but its clock must fit the slowest instruction, which motivates multi-cycle and pipelined designs.
---

## 1. Register transfer notation

**Register transfer language (RTL)** describes what happens to data between registers:

- `R1 ← R2 + R3` puts the sum of R2 and R3 into R1.
- `MAR ← PC` copies the program counter to the memory address register.
- `MDR ← M[MAR]` reads memory.

**The instruction cycle** in RTL, using the classic registers PC, IR (instruction register), MAR (memory address register) and MDR (memory data register):

```text
Fetch:    MAR ← PC
          MDR ← M[MAR],  PC ← PC + 1
          IR  ← MDR
Decode:   identify the opcode and operands in IR
Execute:  depends on the instruction, e.g. for ADD R1, X:
          MAR ← address part of IR
          MDR ← M[MAR]
          R1  ← R1 + MDR
```

Between instructions the CPU checks for **interrupts**; if one is pending, it saves the PC and jumps to the handler.

## 2. Datapath components

| Component | Job |
|---|---|
| Program counter (PC) | Holds the address of the next instruction |
| Instruction memory | Supplies the instruction at the PC |
| **Register file** | The CPU's registers, typically with two read ports and one write port |
| **ALU** | Arithmetic and logic; also outputs a **zero** flag used by branches |
| Data memory | Loads and stores |
| Sign extender | Widens a 16-bit immediate to 32 bits |
| Adders | PC + 4, and PC + branch offset |
| **Multiplexers** | Choose between sources (for example, register or immediate as the ALU's second input) |

## 3. Single-cycle execution

Every instruction finishes in **one** (long) clock cycle. How three instruction types use the datapath:

| Step | R-type `add rd, rs, rt` | Load `lw rt, off(rs)` | Branch `beq rs, rt, off` |
|---|---|---|---|
| Fetch | instruction memory at PC; PC + 4 | same | same |
| Read registers | rs, rt | rs | rs, rt |
| ALU | rs + rt | rs + sign-extended offset (the address) | rs − rt (are they equal?) |
| Memory | — | read data memory | — |
| Write back | result → rd | memory data → rt | — |
| Next PC | PC + 4 | PC + 4 | PC + 4 + (offset × 4) if zero, else PC + 4 |

The **control unit** looks at the opcode and sets the control signals, for example: `RegWrite` (write a register?), `ALUSrc` (second ALU input from a register or the immediate?), `MemRead`, `MemWrite`, `MemtoReg` (write back the ALU result or memory data?), `Branch`, and the ALU operation.

### Why single-cycle is inefficient

The clock period must fit the **slowest** instruction, the load: instruction memory + register read + ALU + data memory + register write. Every other instruction then wastes part of the cycle.

**Example.** With instruction memory 200 ps, register read 100 ps, ALU 200 ps, data memory 200 ps and register write 100 ps, a load takes 800 ps, so the clock period is 800 ps, even though an R-type instruction needs only 600 ps.

## 4. Multi-cycle implementation

Break each instruction into steps of one functional unit each (for example: fetch, decode/register read, execute, memory, write back), each taking one **short** cycle. Simple instructions use fewer cycles:

| Instruction | Cycles |
|---|---|
| Load | 5 |
| Store, R-type | 4 |
| Branch | 3 |

Units such as the ALU can be **reused** in different cycles, saving hardware. The control unit becomes a **finite state machine** stepping through the cycles. [Pipelining](/computer-architecture/pipelining/) goes further by overlapping the steps of different instructions.

## 5. Hardwired vs microprogrammed control

| | Hardwired | Microprogrammed |
|---|---|---|
| How signals are generated | Combinational logic (or an FSM) built directly from gates | Each machine instruction runs a small **microprogram** of **microinstructions** stored in a **control memory** (ROM) |
| Speed | Fast | Slower (a control-memory read per step) |
| Changing or adding instructions | Hard (redesign the logic) | Easy (edit the microcode) |
| Suits | RISC, simple instruction sets | CISC, complex instructions |

A **microinstruction** holds the control signals for one step plus how to find the next microinstruction (sequencing). **Horizontal** microcode has one bit per control signal (wide, fast, parallel); **vertical** microcode encodes signals in fields (narrow, needs decoding).

Modern x86 processors use hardwired decoding for common instructions and microcode only for rare, complex ones.

## Summary

- RTL describes data movement; the instruction cycle is fetch, decode, execute (plus an interrupt check).
- The datapath has a PC, instruction and data memory, a register file, an ALU, sign extension, adders and multiplexers; control signals steer it.
- Single-cycle: every instruction takes one cycle as long as the slowest (the load).
- Multi-cycle: short cycles, different instructions take different numbers of cycles, hardware can be reused.
- Hardwired control is fast; microprogrammed control is flexible and suits complex instruction sets.

## Check yourself

<details>
<summary>Why does the load instruction set the single-cycle clock period?</summary>

It uses the most units in sequence: instruction memory, register file, ALU, data memory and register write. Its path is the longest, and every instruction gets the same cycle length.
</details>

<details>
<summary>In a multi-cycle design with a 200 ps cycle, how long does a branch take?</summary>

3 cycles × 200 ps = 600 ps.
</details>

<details>
<summary>Why is microprogrammed control associated with CISC?</summary>

CISC has many complex, multi-step instructions. Writing a microprogram for each is far easier than designing gate logic for all of them, and the microcode can be fixed or extended later.
</details>
