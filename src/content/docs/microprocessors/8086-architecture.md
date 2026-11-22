---
title: 8086 Architecture
description: Features of the 8086, the bus interface unit and execution unit, the instruction queue, registers and flags, memory segmentation and physical address calculation, and the pin-level view including minimum and maximum modes.
sidebar:
  label: "1. 8086 architecture"
  order: 1
lesson:
  module: The 8086
  outcomes:
    - Describe the roles of the BIU and EU and how the instruction queue speeds things up
    - Name the 8086 registers and the purpose of each flag
    - Calculate a physical address from a segment and an offset
    - Explain how the 8086 accesses 16-bit words using two memory banks
  keyIdea: >-
    The 8086 is a 16-bit processor with a 20-bit address bus, so it reaches 1 MB of memory through **segmentation**: physical address = **segment × 10H + offset**. Its **bus interface unit** prefetches instructions into a 6-byte queue while the **execution unit** executes, an early form of pipelining.
---

## 1. Key features

| Feature | 8086 |
|---|---|
| Data bus / ALU | 16-bit |
| Address bus | **20-bit**: $2^{20}$ = **1 MB** of memory |
| I/O space | 64 K ports |
| Clock | 5, 8 or 10 MHz |
| Package | 40 pins, with multiplexed address and data lines |
| Instruction queue | 6 bytes |

The **8088** is the same processor with an 8-bit external data bus and a 4-byte queue; it powered the original IBM PC.

## 2. BIU and EU

The 8086 is split into two units that work **in parallel**:

| Unit | Contains | Does |
|---|---|---|
| **Bus interface unit (BIU)** | Segment registers (CS, DS, SS, ES), instruction pointer (IP), address adder, 6-byte **instruction queue** | All bus activity: fetches instructions, reads and writes operands, computes physical addresses |
| **Execution unit (EU)** | ALU, general-purpose registers, pointer and index registers, flags, control circuitry | Decodes and executes instructions taken from the queue |

While the EU executes one instruction, the BIU **prefetches** the next bytes into the queue whenever the bus is free. This **pipelining** means the EU rarely waits for a fetch. A jump or call empties (flushes) the queue, because the prefetched bytes are no longer the next instructions.

## 3. Registers

**General-purpose** (each splits into high and low bytes):

| Register | Halves | Special role |
|---|---|---|
| **AX** (accumulator) | AH, AL | Multiply, divide, I/O |
| **BX** (base) | BH, BL | Base address for memory access |
| **CX** (count) | CH, CL | Loop counter (`LOOP`), shift count (CL), string repeat count |
| **DX** (data) | DH, DL | High word in multiply and divide; I/O port address |

**Pointer and index:**

| Register | Role | Default segment |
|---|---|---|
| **SP** (stack pointer) | Top of the stack | SS |
| **BP** (base pointer) | Accessing data on the stack (procedure parameters) | SS |
| **SI** (source index) | Source in string operations; array index | DS |
| **DI** (destination index) | Destination in string operations | ES (for strings), DS otherwise |

**Segment registers:** CS (code), DS (data), SS (stack), ES (extra). **IP** holds the offset of the next instruction within the code segment.

## 4. Flags

The 16-bit flag register has **9** active flags:

| Flag | Name | Set when |
|---|---|---|
| **CF** | Carry | Unsigned overflow: a carry out of (or borrow into) the top bit |
| **PF** | Parity | The low byte of the result has an **even** number of 1s |
| **AF** | Auxiliary carry | A carry from bit 3 to bit 4 (used for BCD) |
| **ZF** | Zero | The result is zero |
| **SF** | Sign | The top bit of the result is 1 (negative) |
| **OF** | Overflow | Signed overflow |
| **TF** | Trap | (control) Single-step mode: interrupt after every instruction |
| **IF** | Interrupt enable | (control) Maskable interrupts are accepted |
| **DF** | Direction | (control) String operations go downward (decrement SI/DI) when 1 |

The first six are **status** flags set by results; the last three are **control** flags set by the programmer.

**Example.** `ADD AL, BL` with AL = 7FH and BL = 01H gives AL = 80H:

| CF | PF | AF | ZF | SF | OF |
|---|---|---|---|---|---|
| 0 | 0 (one 1 bit: odd) | 1 (F + 1 carries out of bit 3) | 0 | 1 | **1** (positive + positive gave negative) |

## 5. Segmentation and physical addresses

Registers are 16 bits, but addresses are 20 bits. A memory address is a **segment:offset** pair (the **logical address**):

$$
\text{Physical address} = \text{Segment} \times 10\text{H} + \text{Offset}
$$

(Shift the segment left by one hex digit, then add.)

**Example.** CS = 1234H, IP = 0010H:

$$
12340\text{H} + 0010\text{H} = 12350\text{H}
$$

**Example.** DS = 2000H, BX = 0100H, SI = 0020H; the operand of `MOV AX, [BX+SI+10H]` is at offset $0100 + 0020 + 0010 = 0130\text{H}$, physical address $20000\text{H} + 0130\text{H} = 20130\text{H}$.

- Each segment is up to **64 KB** (a 16-bit offset) and starts at an address divisible by 16 (a **paragraph** boundary).
- Segments can **overlap**, and different segment:offset pairs can name the same physical address: 1000H:0020H and 1002H:0000H are both 10020H.

**Why segment?** It lets a 16-bit processor address 1 MB, separates code, data and stack, and makes programs **relocatable**: change the segment register and the same code runs elsewhere.

## 6. Pins and bus cycles

- **AD0–AD15** are **multiplexed**: they carry the address at the start of a bus cycle, then data. **ALE** (address latch enable) tells external latches to capture the address.
- **A16–A19** carry the top address bits (multiplexed with status signals).
- **BHE̅** (bus high enable) together with **A0** selects which bytes are transferred.
- **M/IO̅** distinguishes memory from I/O; **RD̅** and **WR̅** are read and write strobes; **READY** lets slow devices add wait states.

A basic **bus cycle** takes 4 clock states, T1 to T4 (address in T1, data in T3–T4).

**Memory banks.** 1 MB is split into an **even bank** (even addresses, data lines D0–D7, selected by A0 = 0) and an **odd bank** (odd addresses, D8–D15, selected by BHE̅ = 0):

| BHE̅ | A0 | Transfer |
|---|---|---|
| 0 | 0 | Whole word (both banks) |
| 0 | 1 | Upper byte (odd address) |
| 1 | 0 | Lower byte (even address) |
| 1 | 1 | None |

A word at an **even** address takes **one** bus cycle; a word at an **odd** address (unaligned) takes **two**.

**Minimum vs maximum mode** (set by the MN/MX̅ pin): in minimum mode the 8086 generates all bus control signals itself, for small single-processor systems; in maximum mode an **8288 bus controller** generates them, freeing pins for multiprocessor and coprocessor (8087 floating-point) support.

## Summary

- 16-bit data, 20-bit address (1 MB), 6-byte queue; the BIU fetches while the EU executes.
- Registers: AX, BX, CX, DX (with byte halves), SP, BP, SI, DI, segment registers CS, DS, SS, ES, and IP.
- Flags: CF, PF, AF, ZF, SF, OF (status) and TF, IF, DF (control).
- Physical address = segment × 10H + offset; segments are up to 64 KB.
- Even and odd memory banks are selected by A0 and BHE̅; aligned words take one bus cycle.

## Check yourself

<details>
<summary>SS = 3000H and SP = FFFEH. What physical address is the top of the stack?</summary>

$30000\text{H} + \text{FFFEH} = 3\text{FFFEH}$.
</details>

<details>
<summary>Why does the 8086 flush its instruction queue on a jump?</summary>

The queue holds bytes that followed the jump instruction in memory. After a jump, execution continues elsewhere, so those prefetched bytes are not the next instructions.
</details>

<details>
<summary>After SUB AL, AL, which flags are set?</summary>

The result is 0, so ZF = 1 and PF = 1 (zero 1-bits counts as even); CF, SF and OF are 0.
</details>
