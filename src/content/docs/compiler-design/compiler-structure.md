---
title: Structure of a Compiler
description: Compilers vs interpreters, the phases of compilation with an example statement traced through each one, the symbol table, front end and back end, passes, and bootstrapping.
sidebar:
  label: "1. Compiler structure"
  order: 1
lesson:
  module: Front end
  outcomes:
    - Name the phases of a compiler and what each produces
    - Trace a simple statement through all the phases
    - Compare compilers and interpreters
    - Explain why compilers are split into a front end and a back end
  keyIdea: >-
    A compiler works in **phases**: lexical analysis (characters → tokens), syntax analysis (tokens → parse tree), semantic analysis (type checks), intermediate code generation, optimization, and code generation. A **symbol table** shared by all phases records what each name means.
---

## 1. Compilers and interpreters

| | Compiler | Interpreter |
|---|---|---|
| Works on | The whole program, ahead of time | One statement (or expression) at a time |
| Output | A target program (for example, machine code) | Results, directly |
| Execution speed | Fast (translation is done once) | Slower (translation repeated every run) |
| Error reporting | All errors before running | Stops at the first error, during the run |
| Examples | C, C++, Rust, Go | Python, early BASIC, shell scripts |

Many systems mix both. Java compiles to **bytecode**, which a virtual machine interprets or compiles **just in time** (JIT) to machine code while the program runs.

The **language-processing system** around a compiler: preprocessor (expands `#include` and macros) → compiler → **assembler** (assembly to object code) → **linker** (combines object files and libraries) → **loader** (puts the program in memory).

## 2. The phases

| Phase | Input → output | Checks or does |
|---|---|---|
| **Lexical analysis** (scanner) | Characters → **tokens** | Groups characters into words; removes whitespace and comments |
| **Syntax analysis** (parser) | Tokens → **parse tree** / syntax tree | Checks the grammar |
| **Semantic analysis** | Syntax tree → annotated tree | Types, declarations, scope |
| **Intermediate code generation** | Tree → **intermediate representation** (IR), such as three-address code | Machine-independent code |
| **Code optimization** | IR → better IR | Faster or smaller, same meaning |
| **Code generation** | IR → **target code** | Instruction selection, register allocation |

The **symbol table** stores every identifier with its attributes (type, scope, memory location), and every phase reads or updates it. Each phase also reports **errors** and tries to recover so it can find more.

## 3. One statement through every phase

Source: `position = initial + rate * 60`, where all three variables are floating point.

**1. Lexical analysis** produces tokens; identifiers point to symbol-table entries:

```text
⟨id, 1⟩ ⟨=⟩ ⟨id, 2⟩ ⟨+⟩ ⟨id, 3⟩ ⟨*⟩ ⟨number, 60⟩
```

**2. Syntax analysis** builds a tree following operator precedence (`*` before `+`):

```text
        =
      /   \
  id1      +
         /   \
      id2     *
            /   \
         id3     60
```

**3. Semantic analysis** finds that `rate` is a float but `60` is an integer, and inserts a conversion: `60` becomes `inttofloat(60)`.

**4. Intermediate code** (three-address code):

```text
t1 = inttofloat(60)
t2 = id3 * t1
t3 = id2 + t2
id1 = t3
```

**5. Optimization**: convert 60 to 60.0 at compile time, and remove unneeded temporaries:

```text
t1 = id3 * 60.0
id1 = id2 + t1
```

**6. Code generation** (registers R1, R2):

```text
LDF  R2, id3
MULF R2, R2, #60.0
LDF  R1, id2
ADDF R1, R1, R2
STF  id1, R1
```

## 4. Front end and back end

- **Front end** (analysis): lexical, syntax and semantic analysis and IR generation. Depends on the **source language**.
- **Back end** (synthesis): optimization and code generation. Depends on the **target machine**.

With a common IR, $m$ languages and $n$ machines need only $m + n$ components instead of $m \times n$ separate compilers. **LLVM** works this way: front ends for C, C++, Rust and Swift all produce LLVM IR, and back ends turn it into code for x86, ARM and others.

A **pass** reads the whole program (or IR) once. Several phases can share one pass; one-pass compilers are fast but limit optimization.

<details class="go-deeper">
<summary>Go deeper: bootstrapping and cross-compilers</summary>

A **cross-compiler** runs on one machine but produces code for another (for example, compiling on a laptop for a microcontroller). **Bootstrapping** writes a compiler in its own language: write a small compiler for a subset of language L in another language, use it to compile a fuller L compiler written in L, and repeat. T-diagrams show the source language, target language and implementation language of each compiler.
</details>

## Summary

- Compilers translate the whole program ahead of time; interpreters execute it directly, statement by statement.
- Phases: lexical (tokens), syntax (tree), semantic (types), intermediate code, optimization, code generation.
- The symbol table, used by every phase, records each identifier's type, scope and location.
- The front end depends on the source language and the back end on the target machine; a shared IR lets them be mixed.

## Check yourself

<details>
<summary>Which phase detects "int x = 3 +;"? And "int x = "hello";"?</summary>

The first is a syntax error, found by the parser. The second is a type error, found by semantic analysis.
</details>

<details>
<summary>Which phase detects a misspelled keyword such as "whlie (x)"?</summary>

The scanner just sees an ordinary identifier `whlie`. The parser then reports a syntax error, because an identifier followed by a parenthesised expression and then a statement does not fit the grammar.
</details>

<details>
<summary>Why do compilers use an intermediate representation?</summary>

It separates the source language from the target machine, so front ends and back ends can be reused in combinations, and it gives a convenient, machine-independent form for optimization.
</details>
