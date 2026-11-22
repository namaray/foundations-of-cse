---
title: Digital Logic Design Cheat Sheet
description: One-page revision of number systems, gates, K-maps, adders and multiplexers, flip-flops, counters, state machines and memory.
sidebar:
  label: "9. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [Number systems](/digital-logic-design/number-systems/)

- Decimal → base $r$: divide repeatedly, read remainders upwards. Fractions: multiply, read integer parts downwards.
- Octal = groups of 3 bits; hex = groups of 4.
- Two's complement: flip and add 1. Range $-2^{n-1}$ to $2^{n-1} - 1$. Overflow: $V = C_n \oplus C_{n-1}$.
- Binary → Gray: $g_i = b_{i+1} \oplus b_i$ (first bit kept). BCD: 4 bits per decimal digit.

## [Gates](/digital-logic-design/logic-gates/) and [K-maps](/digital-logic-design/karnaugh-maps/)

- NAND and NOR are universal. XOR = 1 for an odd number of 1s.
- SOP: OR of minterms where $F = 1$. POS: AND of maxterms where $F = 0$.
- K-map order 00, 01, 11, 10; edges wrap. Groups of $2^k$ drop $k$ variables. Don't-cares are used only if they help.
- Essential prime implicant: covers a 1 no other prime implicant covers.

## [Combinational circuits](/digital-logic-design/combinational-circuits/)

- Full adder: $S = A \oplus B \oplus C_{\text{in}}$, $C_{\text{out}} = AB + C_{\text{in}}(A \oplus B)$.
- Carry lookahead: $G = AB$, $P = A \oplus B$, $C_{i+1} = G_i + P_i C_i$.
- A $2^n$:1 MUX implements any function of $n + 1$ variables. Decoder + OR implements any function of its inputs.
- Priority encoder outputs the highest active input and a valid bit.

## [Flip-flops](/digital-logic-design/flip-flops/)

| | Equation | 0→0 | 0→1 | 1→0 | 1→1 |
|---|---|---|---|---|---|
| SR | $Q^+ = S + \overline{R}Q$ | 0X | 10 | 01 | X0 |
| JK | $Q^+ = J\overline{Q} + \overline{K}Q$ | 0X | 1X | X1 | X0 |
| D | $Q^+ = D$ | 0 | 1 | 0 | 1 |
| T | $Q^+ = T \oplus Q$ | 0 | 1 | 1 | 0 |

Latch = level-triggered; flip-flop = edge-triggered. Race-around is fixed by master–slave or edge triggering.

## [Counters](/digital-logic-design/counters/) and [state machines](/digital-logic-design/state-machines/)

- Mod-N needs $\lceil \log_2 N \rceil$ flip-flops. Ripple counters halve the frequency per stage but are slow.
- Synchronous binary up counter (T): $T_0 = 1$, $T_i = Q_0 Q_1 \cdots Q_{i-1}$.
- Ring counter: $n$ states. Johnson counter: $2n$ states.
- Moore: output from state. Mealy: output from state and input (fewer states). "101" detector: 3 Mealy states, 4 Moore states.

## [Memory](/digital-logic-design/memory-and-pld/)

- $2^k \times n$ memory: $k$ address lines, $n$ data lines.
- SRAM: fast, no refresh, caches. DRAM: dense, needs refresh, main memory.
- Chips needed: $(A/a) \times (B/b)$; a decoder on the high address bits picks the row.
- PROM: fixed AND, programmable OR. PLA: both programmable. PAL: programmable AND, fixed OR.

## Top viva questions

1. Represent −45 in 8-bit two's complement. Why is two's complement preferred?
2. When does overflow occur in two's-complement addition?
3. Why are NAND and NOR called universal gates?
4. Simplify a 4-variable function with a K-map, with and without don't-cares.
5. Design a full adder. Why is carry lookahead faster than ripple carry?
6. Implement a function using a multiplexer.
7. Latch vs flip-flop. What is the race-around condition?
8. Give the characteristic and excitation tables of a JK flip-flop.
9. Design a synchronous mod-N counter.
10. Moore vs Mealy; design a sequence detector.
11. SRAM vs DRAM.
12. Build a larger memory from smaller chips.
