---
title: Memory and Programmable Logic
description: Memory organisation and address arithmetic, ROM types, static and dynamic RAM, building larger memories from smaller chips, and programmable logic - PROM, PLA, PAL and FPGA.
sidebar:
  label: "8. Memory and programmable logic"
  order: 8
lesson:
  module: Sequential logic
  prerequisites:
    - label: Combinational circuits
      link: /digital-logic-design/combinational-circuits/
  outcomes:
    - Work out address and data lines from a memory's size
    - Compare SRAM and DRAM, and the types of ROM
    - Build a larger memory from smaller chips using a decoder
    - Compare PROM, PLA, PAL and FPGA
  keyIdea: >-
    A $2^k \times n$ memory has $k$ address lines and $n$ data lines. Larger memories are built from smaller chips: more chips side by side widen the words, and a **decoder** on the high address bits selects among rows of chips to add more words. Programmable logic devices let one chip implement many different circuits.
---

## 1. Memory organisation

A memory of $2^k$ words, each $n$ bits, is written $2^k \times n$. It needs:

- $k$ **address** lines (to choose one of $2^k$ words)
- $n$ **data** lines
- control lines: read/write and chip select (or enable)

**Unit prefixes:** 1 K = $2^{10}$ = 1024, 1 M = $2^{20}$, 1 G = $2^{30}$.

**Examples.**

| Memory | Address lines | Data lines | Total bits |
|---|---|---|---|
| $1\text{K} \times 8$ | 10 | 8 | 8 K bits |
| $64\text{K} \times 16$ | 16 | 16 | 1 M bits |
| $4\text{M} \times 8$ | 22 | 8 | 32 M bits |

## 2. ROM

**Read-only memory** keeps its contents without power (it is **non-volatile**). Logically, a $2^k \times n$ ROM is a $k$-to-$2^k$ decoder followed by $n$ OR gates whose connections are fixed by the contents, so a ROM can implement any $n$ functions of $k$ variables, just like a truth table.

| Type | How it is programmed |
|---|---|
| Mask ROM | At the factory; cheapest in bulk |
| PROM | Once, by the user, by blowing fuses |
| EPROM | Electrically; erased with ultraviolet light |
| EEPROM | Electrically, byte by byte; erased electrically |
| **Flash** | Electrically, in blocks; used in SSDs, USB drives, phones |

## 3. RAM

**Random-access memory** can be read and written, and loses its contents without power (it is **volatile**).

| | SRAM (static) | DRAM (dynamic) |
|---|---|---|
| Storage cell | A latch of about 6 transistors | One transistor and one capacitor |
| Refresh needed? | No | Yes: the capacitor leaks, so every row is rewritten every few milliseconds |
| Speed | Fast | Slower |
| Density and cost per bit | Low density, expensive | High density, cheap |
| Used for | CPU **caches**, registers | **Main memory** |

DRAM chips multiplex the address: the row and column halves are sent one after the other (RAS then CAS), halving the number of address pins.

## 4. Building larger memories

**Wider words:** put chips **side by side** with the same address lines; each chip supplies some of the data bits. Two $1\text{K} \times 4$ chips make a $1\text{K} \times 8$ memory.

**More words:** put chips in **rows**; the low address bits go to every chip, and a **decoder** on the high address bits enables one row.

**Worked example.** Build $64\text{K} \times 8$ from $16\text{K} \times 8$ chips.

- Chips needed: $64\text{K} / 16\text{K} = 4$.
- $64\text{K}$ needs 16 address lines ($A_{15}$–$A_0$); each chip uses 14 ($A_{13}$–$A_0$).
- The top two bits $A_{15} A_{14}$ go into a **2-to-4 decoder**, whose outputs drive the four chips' chip-select inputs.

| $A_{15} A_{14}$ | Selected chip | Address range (hex) |
|---|---|---|
| 00 | Chip 0 | 0000–3FFF |
| 01 | Chip 1 | 4000–7FFF |
| 10 | Chip 2 | 8000–BFFF |
| 11 | Chip 3 | C000–FFFF |

**General rule:** to build an $A \times B$ memory from $a \times b$ chips, you need $(A / a) \times (B / b)$ chips, and a decoder with $A / a$ outputs.

## 5. Programmable logic devices

| Device | AND array | OR array | Notes |
|---|---|---|---|
| **PROM** | Fixed (a full decoder: every minterm) | Programmable | Implements any truth table; wasteful when functions are simple |
| **PLA** | Programmable | Programmable | Most flexible; product terms are shared between outputs |
| **PAL** | Programmable | Fixed | Simpler and faster than a PLA; each output has its own fixed set of product terms |

**Sizing a PLA:** count the number of **distinct product terms** across all outputs (after simplifying them together). A PLA is described by its inputs × product terms × outputs; for example, 3 inputs, 4 product terms and 2 outputs.

**CPLDs** combine several PAL-like blocks. **FPGAs** contain thousands to millions of small **lookup tables** (each a tiny RAM that can implement any function of 4–6 inputs), flip-flops and programmable routing. They are configured by loading a bitstream, and are used for prototyping chips, signal processing and hardware acceleration. Designs are written in a **hardware description language** such as Verilog or VHDL.

## Summary

- A $2^k \times n$ memory has $k$ address lines and $n$ data lines.
- ROMs are non-volatile (mask, PROM, EPROM, EEPROM, flash); a ROM is a decoder plus programmable OR gates.
- SRAM is fast and needs no refresh (caches); DRAM is dense and cheap but needs refresh (main memory).
- Widen words with chips side by side; add words with chips in rows selected by a decoder on the high address bits.
- PROM: fixed AND, programmable OR. PLA: both programmable. PAL: programmable AND, fixed OR. FPGAs use lookup tables.

## Check yourself

<details>
<summary>How many address and data lines does a 256K × 32 memory need?</summary>

$256\text{K} = 2^{18}$, so 18 address lines, and 32 data lines.
</details>

<details>
<summary>How many 4K × 4 chips are needed to build 16K × 8, and what decoder?</summary>

$(16/4) \times (8/4) = 4 \times 2 = 8$ chips, in 4 rows of 2. A 2-to-4 decoder on the top two address bits selects the row.
</details>

<details>
<summary>Why does DRAM need refreshing but SRAM does not?</summary>

DRAM stores each bit as charge on a tiny capacitor, which leaks away, so it must be read and rewritten periodically. SRAM stores each bit in a latch that holds its value as long as power is on.
</details>
