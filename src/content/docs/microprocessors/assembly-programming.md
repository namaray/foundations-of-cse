---
title: 8086 Assembly Programming
description: Program structure with segments and assembler directives, DOS INT 21H services, and worked programs - sum of an array, largest number, counting ones, string reversal and procedures with the stack.
sidebar:
  label: "3. Assembly programming"
  order: 3
lesson:
  module: The 8086
  prerequisites:
    - label: Addressing modes and instructions
      link: /microprocessors/instruction-set/
  outcomes:
    - Write a complete 8086 program with data and code segments
    - Use DOS INT 21H to read and display characters and strings
    - Write loops over arrays and procedures that use the stack
  keyIdea: >-
    An assembly program declares its **data** and **code** segments with assembler directives, initialises DS, and then works mostly with registers, loops (CX with LOOP) and conditional jumps. DOS services through **INT 21H**, chosen by the value in AH, handle input and output.
---

## 1. Program structure

```text
.MODEL SMALL
.STACK 100H

.DATA
    msg   DB 'Hello, World!$'     ; '$' ends a string for DOS function 09H
    nums  DB 12, 45, 7, 89, 23
    count EQU 5
    total DW ?                     ; reserve an uninitialised word

.CODE
MAIN PROC
    MOV AX, @DATA                  ; DS cannot be loaded with an immediate,
    MOV DS, AX                     ; so go through AX

    MOV AH, 09H                    ; DOS: display string at DS:DX
    LEA DX, msg
    INT 21H

    MOV AH, 4CH                    ; DOS: exit to the operating system
    INT 21H
MAIN ENDP
END MAIN
```

**Assembler directives** (instructions to the assembler, not the CPU):

| Directive | Meaning |
|---|---|
| `DB`, `DW`, `DD` | Define byte, word (2 bytes), doubleword (4 bytes) |
| `DUP` | Repeat: `arr DB 10 DUP(0)` makes ten zero bytes |
| `EQU` | Named constant (no storage) |
| `.MODEL`, `.STACK`, `.DATA`, `.CODE` | Memory model and segments (simplified directives) |
| `PROC` / `ENDP` | Start and end of a procedure |
| `ORG` | Set the location counter |
| `OFFSET` | `MOV DX, OFFSET msg` is equivalent to `LEA DX, msg` |

## 2. DOS INT 21H services

Put the function number in **AH**, then execute `INT 21H`:

| AH | Function | Input / output |
|---|---|---|
| 01H | Read a character with echo | Returns the character in AL |
| 02H | Display a character | Character in DL |
| 09H | Display a string | DS:DX points to a string ending in `'$'` |
| 0AH | Read a string into a buffer | DS:DX points to the buffer |
| 4CH | Terminate the program | AL = return code |

To print a newline, display carriage return (0DH) and line feed (0AH) with function 02H.

## 3. Worked programs

### Sum of an array

```text
    LEA  SI, nums        ; SI points to the first element
    MOV  CX, count       ; loop counter
    XOR  AX, AX          ; AX = 0 (running sum)
next:
    ADD  AL, [SI]        ; add the current byte
    ADC  AH, 0           ; keep any carry in AH (sum may exceed 255)
    INC  SI
    LOOP next            ; CX = CX - 1; repeat while CX != 0
    MOV  total, AX
```

With `nums = 12, 45, 7, 89, 23`, `total` = 176.

### Largest number in an array

```text
    LEA  SI, nums
    MOV  CX, count
    MOV  AL, [SI]        ; assume the first is largest
    DEC  CX
again:
    INC  SI
    CMP  AL, [SI]
    JAE  skip            ; unsigned: keep AL if AL >= [SI]
    MOV  AL, [SI]        ; found a larger one
skip:
    LOOP again
                         ; AL = 89
```

For signed numbers, use `JGE` instead of `JAE`.

### Count the 1 bits in a byte

```text
    MOV  AL, 10110110B
    MOV  CX, 8
    XOR  BL, BL          ; BL = count
shift:
    SHL  AL, 1           ; top bit goes into CF
    JNC  zero
    INC  BL
zero:
    LOOP shift           ; BL = 5
```

### Display a single digit

```text
    MOV  DL, 7
    ADD  DL, 30H         ; convert 7 to the ASCII code for '7'
    MOV  AH, 02H
    INT  21H
```

### Reverse a string using the stack

```text
    LEA  SI, str         ; str DB 'ABCDE'
    MOV  CX, 5
push_loop:
    MOV  AL, [SI]
    XOR  AH, AH
    PUSH AX              ; the stack holds words, so push AX
    INC  SI
    LOOP push_loop

    MOV  CX, 5
pop_loop:
    POP  DX              ; DL = next character, last pushed first
    MOV  AH, 02H
    INT  21H             ; prints EDCBA
    LOOP pop_loop
```

## 4. Procedures and the stack

```text
SQUARE PROC              ; input AL, output AX = AL * AL
    PUSH BX              ; save registers the procedure uses
    MOV  BL, AL
    MUL  BL
    POP  BX              ; restore in reverse order
    RET
SQUARE ENDP

    MOV  AL, 9
    CALL SQUARE          ; AX = 81
```

`CALL` pushes the return address (IP, and CS too for a far call); `RET` pops it. Every `PUSH` must be matched by a `POP` before `RET`, or the procedure returns to the wrong place.

**Passing parameters:** in registers (fast, limited), in memory variables, or on the **stack**, where the procedure reads them with BP: `PUSH BP`, `MOV BP, SP`, then the parameters are at `[BP+4]`, `[BP+6]`, and so on (for a near call).

**Macros** (`MACRO`/`ENDM`) are expanded inline wherever used: faster than a procedure call but larger code.

## Summary

- Programs declare segments, define data with DB/DW/DUP/EQU, and must load DS through another register.
- INT 21H: AH = 01H reads a character, 02H displays DL, 09H displays a `$`-terminated string at DS:DX, 4CH exits.
- Loops use CX with LOOP; comparisons use CMP plus the correct signed or unsigned jump.
- Procedures save the registers they use with PUSH/POP and return with RET; parameters can be passed on the stack and read via BP.

## Check yourself

<details>
<summary>Why can't you write MOV DS, @DATA directly?</summary>

The 8086 cannot load a segment register with an immediate value. Load the value into a general register first (`MOV AX, @DATA`), then `MOV DS, AX`.
</details>

<details>
<summary>What does arr DW 5 DUP(?) reserve?</summary>

Five uninitialised words: 10 bytes.
</details>

<details>
<summary>Why is ADD DL, 30H used before displaying a digit?</summary>

DOS function 02H displays the character whose ASCII code is in DL. The digits '0'–'9' have codes 30H–39H, so adding 30H converts a value 0–9 into its character.
</details>
