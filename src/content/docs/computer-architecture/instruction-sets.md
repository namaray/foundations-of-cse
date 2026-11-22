---
title: Instruction Set Architecture
description: What an ISA defines, instruction formats and the number of addresses (0-, 1-, 2- and 3-address code), addressing modes with effective-address examples, RISC vs CISC, MIPS instruction formats, and endianness.
sidebar:
  label: "2. Instruction sets"
  order: 2
lesson:
  module: Foundations
  prerequisites:
    - label: Organisation and performance
      link: /computer-architecture/performance/
  outcomes:
    - Write a statement as 0-, 1-, 2- and 3-address code
    - Compute the effective address for each addressing mode
    - Compare RISC and CISC design philosophies
    - Decode the fields of MIPS R-, I- and J-type instructions
  keyIdea: >-
    The **instruction set architecture** is the contract between software and hardware: the instructions, registers, data types and addressing modes a program can use. **RISC** keeps instructions simple and uniform so they can be pipelined easily; **CISC** packs more work into each instruction.
---

## 1. What an ISA defines

The **ISA** is everything a machine-language programmer or compiler needs to know: the instructions and their encodings, the registers, the data types, the **addressing modes**, and how memory is organised. Different hardware (the **microarchitecture**) can implement the same ISA: an Intel and an AMD processor both run x86-64 programs.

An instruction contains an **opcode** (what to do) and **operands** (what to do it to).

## 2. Number of addresses

How many operands an instruction names explicitly affects code size and the hardware. For $X = (A + B) \times (C + D)$:

| Style | Code |
|---|---|
| **3-address** | `ADD R1, A, B` · `ADD R2, C, D` · `MUL X, R1, R2` |
| **2-address** (destination is also a source) | `MOV R1, A` · `ADD R1, B` · `MOV R2, C` · `ADD R2, D` · `MUL R1, R2` · `MOV X, R1` |
| **1-address** (accumulator machine) | `LOAD A` · `ADD B` · `STORE T` · `LOAD C` · `ADD D` · `MUL T` · `STORE X` |
| **0-address** (stack machine) | `PUSH A` · `PUSH B` · `ADD` · `PUSH C` · `PUSH D` · `ADD` · `MUL` · `POP X` |

Fewer addresses mean shorter instructions but more of them. Stack machines evaluate expressions in postfix order; the Java Virtual Machine is a stack machine.

**Load/store architecture** (RISC): only load and store instructions touch memory; arithmetic works on registers only.

## 3. Addressing modes

The **effective address (EA)** is where the operand actually is.

| Mode | Example | Operand / effective address | Typical use |
|---|---|---|---|
| **Immediate** | `ADD R1, #5` | the operand is the constant 5 itself | Constants |
| **Register** | `ADD R1, R2` | the operand is in R2 | Fast temporary values |
| **Direct** (absolute) | `LOAD R1, 500` | EA = 500 | Global variables |
| **Indirect** | `LOAD R1, (500)` | EA = M[500] | Pointers |
| **Register indirect** | `LOAD R1, (R2)` | EA = R2 | Pointers in registers |
| **Displacement** (base/indexed) | `LOAD R1, 100(R2)` | EA = R2 + 100 | Array elements, structure fields, stack frames |
| **Relative** | `BEQ label` | EA = PC + offset | Branches; position-independent code |
| Autoincrement | `LOAD R1, (R2)+` | EA = R2, then R2 = R2 + size | Walking through arrays |

**Worked example.** Memory holds M[500] = 800, M[600] = 900, M[800] = 300; register R2 = 600; an instruction's address field is 500.

| Mode | Effective address | Operand loaded |
|---|---|---|
| Immediate | — | 500 |
| Direct | 500 | 800 |
| Indirect | M[500] = 800 | 300 |
| Register (R2) | — | 600 |
| Register indirect (R2) | 600 | 900 |
| Displacement 200(R2) | 600 + 200 = 800 | 300 |

Indirect addressing needs **two** memory accesses: one for the address and one for the operand.

## 4. RISC vs CISC

| | RISC | CISC |
|---|---|---|
| Instructions | Few, simple | Many, some complex (string copy, multiply-accumulate with memory operands) |
| Instruction length | **Fixed** (for example, 32 bits) | **Variable** (x86: 1 to 15 bytes) |
| Memory access | Only loads and stores | Many instructions can use memory operands |
| Addressing modes | Few | Many |
| Registers | Many (32 or more) | Fewer (historically) |
| CPI | About 1, with pipelining | Varies widely |
| Control unit | Hardwired | Often microprogrammed |
| Examples | ARM, RISC-V, MIPS | x86, older VAX |

Modern x86 processors **translate** CISC instructions into RISC-like micro-operations internally, so the line has blurred. ARM (RISC) dominates phones and is spreading to laptops and servers.

## 5. MIPS instruction formats

MIPS (a classic teaching RISC) uses three 32-bit formats:

| Format | Fields (bits) | Example |
|---|---|---|
| **R-type** | op (6), rs (5), rt (5), rd (5), shamt (5), funct (6) | `add $t0, $s1, $s2` |
| **I-type** | op (6), rs (5), rt (5), immediate (16) | `lw $t0, 32($s3)`, `addi`, `beq` |
| **J-type** | op (6), address (26) | `j label` |

With 5-bit register fields, MIPS has $2^5 = 32$ registers. The 16-bit immediate limits constants and branch offsets; larger values need two instructions.

**Design principles behind it:** simplicity favours regularity (fixed length, few formats), smaller is faster (32 registers, not hundreds), and make the common case fast (immediates for small constants).

## 6. Endianness

How a multi-byte word is stored in byte-addressed memory. For the 32-bit value `0x12345678` at address 100:

| Address | 100 | 101 | 102 | 103 |
|---|---|---|---|---|
| **Big-endian** | 12 | 34 | 56 | 78 |
| **Little-endian** | 78 | 56 | 34 | 12 |

x86 and most ARM systems are little-endian; network protocols use big-endian ("network byte order").

## Summary

- The ISA is the hardware–software contract: instructions, registers, data types and addressing modes.
- 3-address code is short and clear; 0-address (stack) code uses postfix order and needs no register names.
- Effective address: immediate (none), direct (field), indirect (M[field]), register indirect (register), displacement (register + offset), relative (PC + offset).
- RISC: simple, fixed-length, load/store, easy to pipeline. CISC: complex, variable-length, memory operands.
- MIPS has R-, I- and J-type 32-bit formats.

## Check yourself

<details>
<summary>An instruction is 32 bits with an 8-bit opcode and two register fields. With 64 registers, how many bits remain for an immediate?</summary>

Each register field needs $\log_2 64 = 6$ bits: $32 - 8 - 6 - 6 = 12$ bits.
</details>

<details>
<summary>Which addressing mode is used for local variables in a stack frame?</summary>

Displacement (base plus offset): the frame or stack pointer register plus a fixed offset for each variable.
</details>

<details>
<summary>Why are fixed-length instructions easier to pipeline?</summary>

The hardware always knows where the next instruction starts and can decode the fields in fixed positions, so fetch and decode take a predictable, single step.
</details>
