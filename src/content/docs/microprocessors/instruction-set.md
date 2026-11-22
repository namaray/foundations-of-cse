---
title: 8086 Addressing Modes and Instructions
description: The 8086 addressing modes with effective-address examples, and the instruction groups - data transfer, arithmetic (including MUL and DIV), logic and shifts, branches and loops, string instructions, and processor control.
sidebar:
  label: "2. Addressing modes and instructions"
  order: 2
lesson:
  module: The 8086
  prerequisites:
    - label: 8086 architecture
      link: /microprocessors/8086-architecture/
  outcomes:
    - Name the addressing mode of an instruction and compute its physical address
    - Explain where MUL and DIV put their results
    - Choose the right conditional jump for signed and unsigned comparisons
    - Use string instructions with REP prefixes
  keyIdea: >-
    The 8086 offers many ways to name an operand, from constants and registers to memory addressed through base and index registers. Its instructions fall into groups: data transfer, arithmetic, logic, branches, strings and processor control. Signed and unsigned comparisons use **different** conditional jumps.
---

## 1. Addressing modes

Assume DS = 2000H, BX = 0100H, SI = 0020H, BP = 0200H, SS = 3000H.

| Mode | Example | Effective address (offset) | Physical address |
|---|---|---|---|
| Immediate | `MOV AX, 1234H` | — (operand in the instruction) | — |
| Register | `MOV AX, BX` | — (operand in a register) | — |
| Direct | `MOV AX, [0500H]` | 0500H | 20500H |
| Register indirect | `MOV AX, [BX]` | BX = 0100H | 20100H |
| Based | `MOV AX, [BX+08H]` | 0108H | 20108H |
| Indexed | `MOV AX, [SI+08H]` | 0028H | 20028H |
| Based indexed | `MOV AX, [BX+SI]` | 0120H | 20120H |
| Based indexed with displacement | `MOV AX, [BX+SI+10H]` | 0130H | 20130H |
| Based on BP | `MOV AX, [BP+04H]` | 0204H | **30204H** (BP uses **SS** by default) |
| String | `MOVSB` | SI (source in DS), DI (destination in ES) | |
| I/O port | `IN AL, 80H` / `IN AL, DX` | port 80H / port in DX | (I/O space) |
| Relative | `JMP label`, `JNZ label` | IP + displacement | |

A **segment override** changes the default: `MOV AX, ES:[BX]` uses ES instead of DS.

**Rules worth remembering:** memory-to-memory `MOV` is not allowed (one operand must be a register or immediate); you cannot load a segment register with an immediate (go through a general register); CS cannot be a `MOV` destination.

## 2. Data transfer

| Instruction | Example | Effect |
|---|---|---|
| `MOV` | `MOV AX, [BX]` | copy |
| `PUSH`, `POP` | `PUSH AX` | SP = SP − 2, store AX at SS:SP; `POP` reverses |
| `XCHG` | `XCHG AX, BX` | swap |
| `IN`, `OUT` | `OUT 80H, AL` | port input and output |
| `LEA` | `LEA SI, [BX+10H]` | load the **offset** (address), not the contents |
| `LDS`, `LES` | `LDS SI, [BX]` | load a 32-bit pointer into DS:SI |
| `XLAT` | `XLAT` | AL = DS:[BX + AL] (table lookup) |

The stack **grows downward** and works in 16-bit words.

## 3. Arithmetic

| Instruction | Effect |
|---|---|
| `ADD`, `ADC` | add; add with carry (for multi-word addition) |
| `SUB`, `SBB` | subtract; subtract with borrow |
| `INC`, `DEC` | add or subtract 1 (do **not** change CF) |
| `NEG` | two's-complement negate |
| `CMP` | subtract to set the flags, discarding the result |
| `MUL`, `IMUL` | unsigned / signed multiply |
| `DIV`, `IDIV` | unsigned / signed divide |
| `DAA`, `DAS` | decimal adjust after BCD addition / subtraction |
| `CBW`, `CWD` | sign-extend AL to AX / AX to DX:AX (before signed division) |

**MUL and DIV** use fixed registers:

| Operand size | `MUL src` | `DIV src` |
|---|---|---|
| 8-bit | AX = AL × src | AX ÷ src: quotient in **AL**, remainder in **AH** |
| 16-bit | DX:AX = AX × src | DX:AX ÷ src: quotient in **AX**, remainder in **DX** |

Dividing by zero, or getting a quotient too large for the destination, raises a **type 0 interrupt** (divide error).

**Example.** `MOV AL, 25` then `MOV BL, 4` then `MUL BL` gives AX = 100 (0064H).

## 4. Logic, shifts and rotates

- `AND`, `OR`, `XOR`, `NOT`, `TEST` (AND that only sets flags). Masking: `AND AL, 0FH` keeps the low 4 bits; `OR AL, 30H` turns the digit 0–9 into its ASCII code; `XOR AX, AX` clears AX.
- **Shifts:** `SHL`/`SAL` (shift left, multiply by 2), `SHR` (logical right, unsigned divide by 2, inserting 0), `SAR` (arithmetic right, signed divide by 2, copying the sign bit). The bit shifted out goes into CF. The count is 1 or CL.
- **Rotates:** `ROL`, `ROR` (bits wrap around); `RCL`, `RCR` (rotate through the carry flag).

## 5. Branches and loops

- `JMP`: unconditional (short, near within the segment, or far to another segment).
- `CALL` pushes the return address and jumps; `RET` pops it.
- `LOOP label`: decrement CX and jump if CX ≠ 0. `LOOPE`/`LOOPZ` and `LOOPNE`/`LOOPNZ` also test ZF. `JCXZ` jumps if CX = 0.

**Conditional jumps** after `CMP A, B`:

| Condition | Unsigned | Signed |
|---|---|---|
| A = B | `JE` / `JZ` | `JE` / `JZ` |
| A ≠ B | `JNE` / `JNZ` | `JNE` / `JNZ` |
| A > B | `JA` (above) | `JG` (greater) |
| A ≥ B | `JAE` / `JNC` | `JGE` |
| A < B | `JB` / `JC` (below) | `JL` (less) |
| A ≤ B | `JBE` | `JLE` |

Memory aid: **above/below** for unsigned, **greater/less** for signed. Also `JS`/`JNS` (sign), `JO`/`JNO` (overflow), `JP`/`JNP` (parity).

## 6. String instructions

They work on bytes (`B`) or words (`W`), using DS:SI as the source and ES:DI as the destination, and then advance SI and DI by 1 or 2 (or decrement them if DF = 1).

| Instruction | Effect |
|---|---|
| `MOVSB` / `MOVSW` | copy ES:[DI] ← DS:[SI] |
| `LODSB` / `LODSW` | AL/AX ← DS:[SI] |
| `STOSB` / `STOSW` | ES:[DI] ← AL/AX |
| `CMPSB` / `CMPSW` | compare DS:[SI] with ES:[DI] |
| `SCASB` / `SCASW` | compare AL/AX with ES:[DI] |

**Repeat prefixes:** `REP` repeats CX times; `REPE`/`REPZ` repeats while equal (and CX ≠ 0); `REPNE`/`REPNZ` repeats while not equal. Use `CLD` (DF = 0, increment) or `STD` (decrement) first.

```text
; copy 100 bytes from DS:SI to ES:DI
        CLD
        MOV CX, 100
        REP MOVSB
```

## 7. Processor control

`CLC`, `STC`, `CMC` (clear, set or complement CF); `CLD`, `STD` (direction flag); `CLI`, `STI` (disable or enable maskable interrupts); `HLT` (halt until an interrupt); `NOP`; `WAIT`; `LOCK` (bus lock prefix, for multiprocessor systems).

## Summary

- Memory addressing modes combine a base (BX or BP), an index (SI or DI) and a displacement; BP-based modes default to SS, others to DS.
- One `MOV` operand must be a register or immediate; segment registers can't be loaded with immediates.
- 8-bit MUL puts the product in AX; 8-bit DIV puts the quotient in AL and remainder in AH (16-bit: DX:AX, AX and DX).
- Use JA/JB for unsigned comparisons and JG/JL for signed ones.
- String instructions use DS:SI and ES:DI, step by DF, and repeat with REP prefixes and CX.

## Check yourself

<details>
<summary>What is the difference between MOV SI, [BX] and LEA SI, [BX]?</summary>

`MOV SI, [BX]` loads the word stored at address DS:BX. `LEA SI, [BX]` loads the address itself (the value of BX) into SI.
</details>

<details>
<summary>AX = 0103H, BL = 10H. What does DIV BL leave in AL and AH?</summary>

$0103\text{H} = 259$ and $10\text{H} = 16$: quotient 16 (10H) in AL, remainder 3 in AH.
</details>

<details>
<summary>After CMP AL, BL with AL = 80H and BL = 01H, does JA jump? Does JG?</summary>

JA treats them as unsigned (128 > 1), so it jumps. JG treats them as signed (−128 < 1), so it does not.
</details>
