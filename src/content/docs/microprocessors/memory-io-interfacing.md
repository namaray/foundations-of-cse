---
title: Memory and I/O Interfacing
description: Address decoding (full and partial), interfacing memory to the 8086 with even and odd banks, memory maps, I/O-mapped vs memory-mapped I/O, port addressing, and the 8255 programmable peripheral interface with control word examples.
sidebar:
  label: "5. Memory and I/O interfacing"
  order: 5
lesson:
  module: Interfacing
  prerequisites:
    - label: 8086 architecture
      link: /microprocessors/8086-architecture/
  outcomes:
    - Design address decoding for memory chips and draw a memory map
    - Connect memory to the 8086's even and odd banks
    - Compare I/O-mapped and memory-mapped I/O
    - Write 8255 control words for a given port configuration
  keyIdea: >-
    Interfacing means connecting chips so each responds only to its own addresses. **Address decoding** uses the high address bits to select a chip and the low bits to select a location inside it. The **8255** gives the processor three programmable 8-bit ports, configured by a single **control word**.
---

## 1. Address decoding

A memory chip of $2^k$ locations uses the **low $k$ address lines** directly. The remaining **high** lines go to a **decoder** that activates the chip's chip-select (CS̅) only for its address range.

- **Full decoding:** every address line is used, so each location has exactly one address. No wasted or duplicated space.
- **Partial decoding:** some high lines are ignored. Cheaper, but each location appears at several addresses (**aliases** or foldback), wasting address space.

**Example.** An 8086 system (20-bit addresses) with a 32 KB EPROM at the top of memory, F8000H–FFFFFH, so that it contains the reset address FFFF0H.

- 32 KB = $2^{15}$, so the chip uses A0–A14.
- The remaining lines A15–A19 must all be 1 for this range (F8000H = 1111 1000 0000 0000 0000). A 5-input NAND (or a decoder output) on A15–A19 drives CS̅.

**Why at the top?** After reset, the 8086 starts at **FFFF0H** (CS = FFFFH, IP = 0000H), so ROM containing the startup code must be there. The interrupt vector table needs **RAM** at the bottom (00000H–003FFH).

## 2. The 8086's two banks

Because the 8086 has a 16-bit data bus, memory is arranged as an **even bank** (D0–D7) and an **odd bank** (D8–D15), each made of byte-wide chips (see [8086 architecture](/microprocessors/8086-architecture/#6-pins-and-bus-cycles)):

- Address lines **A1–A19** go to both banks (A0 is not used as an address inside the chips).
- The even bank is enabled when **A0 = 0**; the odd bank when **BHE̅ = 0**.

**Example: 64 KB of RAM at 00000H–0FFFFH from two 32K × 8 chips.**

- One chip for the even bank, one for the odd bank, each 32 KB.
- Inside each chip: A1–A15 (15 lines = 32K locations).
- Decoding: A16–A19 = 0000 selects this block; combined with A0 for the even chip and BHE̅ for the odd chip.

| Chip | Data lines | Enabled when |
|---|---|---|
| Even bank (32 KB) | D0–D7 | A19–A16 = 0000 and A0 = 0 |
| Odd bank (32 KB) | D8–D15 | A19–A16 = 0000 and BHE̅ = 0 |

## 3. I/O interfacing

| | I/O-mapped (isolated) | Memory-mapped |
|---|---|---|
| Address space | Separate: up to 64 K ports, selected by M/IO̅ = 0 | Part of the 1 MB memory space |
| Instructions | `IN` and `OUT` only, with AL or AX | Any memory instruction (`MOV`, `AND`, `TEST` …) |
| Port address | 8-bit direct (`IN AL, 80H`: ports 00H–FFH) or 16-bit in DX (`IN AL, DX`: all 64 K) | Full memory addressing modes |
| Decoding | Fewer address lines (8 or 16) | All 20 lines |
| Memory space lost | None | Yes |

## 4. The 8255 programmable peripheral interface

The **8255A PPI** provides three 8-bit ports, **A**, **B** and **C** (C can be split into an upper and a lower 4-bit half), plus a **control register**. Two address lines A1 and A0 choose among the four:

| A1 A0 | Selects |
|---|---|
| 00 | Port A |
| 01 | Port B |
| 10 | Port C |
| 11 | Control register |

**Operating modes:**

| Mode | Applies to | Behaviour |
|---|---|---|
| **Mode 0** | A, B, C | Simple input or output, no handshaking |
| **Mode 1** | A, B | Strobed I/O with **handshake** signals, using some bits of port C |
| **Mode 2** | A only | **Bidirectional** bus with handshaking |
| **BSR** (bit set/reset) | C only | Set or clear a single bit of port C |

### The I/O mode control word (D7 = 1)

| Bit | D7 | D6 D5 | D4 | D3 | D2 | D1 | D0 |
|---|---|---|---|---|---|---|---|
| Meaning | 1 = I/O mode | Port A mode (00 = mode 0, 01 = mode 1, 1X = mode 2) | Port A (1 = input) | Port C upper (1 = input) | Port B mode (0 = mode 0, 1 = mode 1) | Port B (1 = input) | Port C lower (1 = input) |

**Examples.**

| Configuration (all mode 0) | Control word |
|---|---|
| All ports output | 1000 0000 = **80H** |
| Port A input; B and C output | 1001 0000 = **90H** |
| Port A output; B input; C upper input, C lower output | 1000 1010 = **8AH** |

```text
; 8255 at ports 80H-83H: A input, B and C output
    MOV AL, 90H
    OUT 83H, AL      ; write the control word
    IN  AL, 80H      ; read port A
    OUT 81H, AL      ; copy it to port B
```

### BSR mode (D7 = 0)

D3–D1 choose the port C bit (0–7) and D0 sets (1) or resets (0) it. For example, to set PC5: 0000 101**1** = **0BH**.

## Summary

- Low address lines select a location inside a chip; high lines are decoded into chip selects. Full decoding avoids aliases.
- The 8086 starts at FFFF0H (ROM at the top) and needs RAM at 00000H for the vector table.
- The even bank (D0–D7) is enabled by A0 = 0 and the odd bank (D8–D15) by BHE̅ = 0; A1–A19 address both.
- I/O-mapped I/O uses IN/OUT and up to 64 K ports; memory-mapped I/O uses ordinary memory instructions.
- 8255: ports A, B, C and a control register; mode 0, 1, 2 and BSR; e.g. 80H makes all ports outputs.

## Check yourself

<details>
<summary>How many address lines does a 16K × 8 memory chip need, and how many remain for decoding on the 8086?</summary>

$16\text{K} = 2^{14}$, so 14 lines inside the chip; $20 - 14 = 6$ remain for decoding (fewer if A0 is used for bank selection).
</details>

<details>
<summary>Write the 8255 control word for port A output, port B input, and all of port C input, in mode 0.</summary>

1 00 0 1 0 1 1 = 1000 1011 = **8BH**.
</details>

<details>
<summary>What is the drawback of partial address decoding?</summary>

Each chip responds to several address ranges (aliases), so part of the address space is wasted and can't be used for other devices.
</details>
