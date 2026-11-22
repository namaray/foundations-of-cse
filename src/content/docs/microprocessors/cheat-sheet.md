---
title: Microprocessors Cheat Sheet
description: One-page revision of the 8086 architecture, segmentation, addressing modes, instructions, assembly, interrupts, interfacing and peripheral chips.
sidebar:
  label: "7. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [8086 architecture](/microprocessors/8086-architecture/)

- 16-bit data, 20-bit address (1 MB), 6-byte queue (8088: 8-bit bus, 4-byte queue).
- BIU: segment registers, IP, address adder, queue. EU: ALU, registers, flags.
- Physical address = segment × 10H + offset. Segment ≤ 64 KB. Reset address FFFF0H.
- Flags: CF PF AF ZF SF OF (status), TF IF DF (control).
- Even bank D0–D7 (A0 = 0), odd bank D8–D15 (BHE̅ = 0). Odd-address words take two bus cycles.

## [Addressing and instructions](/microprocessors/instruction-set/)

- Default segments: BX/SI/DI → DS; BP/SP → SS; string destination DI → ES; IP → CS.
- No memory-to-memory MOV; no immediate into a segment register.
- MUL 8-bit: AX = AL × src. DIV 8-bit: AL = quotient, AH = remainder. 16-bit: DX:AX, AX, DX.
- Unsigned jumps: JA, JAE, JB, JBE. Signed: JG, JGE, JL, JLE.
- String: DS:SI → ES:DI, step set by DF (CLD/STD), repeat CX times with REP.

## [Assembly](/microprocessors/assembly-programming/)

- `MOV AX, @DATA` / `MOV DS, AX` first.
- INT 21H: AH = 01H read char (AL), 02H print DL, 09H print string at DS:DX ending in `$`, 4CH exit.
- `LOOP` decrements CX; PUSH/POP in matching reverse order before RET.

## [Interrupts](/microprocessors/interrupts/)

- 256 types; vector table 00000H–003FFH; type $n$ at $4n$ (IP, then CS).
- Type 0 divide error, 1 single step, 2 NMI, 3 breakpoint, 4 overflow.
- Response: push flags, clear IF and TF, push CS, push IP, load vector. Return with IRET.
- 8259: 8 inputs per chip, up to 64 with cascading; masks and priorities; send EOI.

## [Interfacing](/microprocessors/memory-io-interfacing/) and [peripherals](/microprocessors/peripherals-microcontrollers/)

- Chip of $2^k$ locations uses $k$ low address lines; decode the rest. Partial decoding creates aliases.
- I/O-mapped: IN/OUT, 64 K ports (direct 8-bit or via DX). Memory-mapped: ordinary instructions.
- 8255: A1A0 = 00 A, 01 B, 10 C, 11 control. All outputs mode 0 = 80H; A input, B and C output = 90H.
- 8254: three 16-bit counters, six modes; $N = f_{\text{clock}} / f_{\text{out}}$; mode 3 square wave.
- 8237 DMA (4 channels), 8251 USART (serial). 8051: 4 KB ROM, 128 B RAM, 4 ports, 2 timers, UART.

## Top viva questions

1. Describe the BIU and EU. How does the queue speed up execution?
2. Calculate a physical address from a segment and an offset. Why segmentation?
3. Explain the 8086 flags with an example.
4. Identify addressing modes and compute effective addresses.
5. Where do MUL and DIV put their results?
6. Write a program to find the largest number in an array.
7. Signed vs unsigned conditional jumps.
8. Where is the vector for INT n stored? What happens when an interrupt occurs?
9. NMI vs INTR.
10. Explain the even and odd memory banks.
11. Write an 8255 control word.
12. Microprocessor vs microcontroller.
