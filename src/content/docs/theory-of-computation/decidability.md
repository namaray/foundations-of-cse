---
title: Decidability
description: Decidable and recognizable languages, decidable problems about automata and grammars, the undecidability of the acceptance and halting problems by diagonalization, unrecognizable languages, reductions, Rice's theorem and the Post correspondence problem.
sidebar:
  label: "9. Decidability"
  order: 9
lesson:
  module: Computability
  prerequisites:
    - label: Turing machines
      link: /theory-of-computation/turing-machines/
  outcomes:
    - Distinguish decidable, recognizable and unrecognizable languages
    - Prove that the halting problem is undecidable
    - Use a reduction to show another problem is undecidable
    - Apply Rice's theorem
  keyIdea: >-
    Some well-defined problems have **no algorithm at all**. The **halting problem**, deciding whether a program halts on an input, is undecidable: a diagonal argument shows any claimed solver can be turned against itself. **Reductions** then spread undecidability to many other problems, and **Rice's theorem** covers every non-trivial question about what programs compute.
---

## 1. Decidable and recognizable

| A language $L$ is | if some TM | Also called |
|---|---|---|
| **Decidable** | halts on **every** input, accepting exactly the strings in $L$ | recursive |
| **Recognizable** | accepts exactly the strings in $L$, but may **loop forever** on strings not in $L$ | recursively enumerable (RE) |

Every decidable language is recognizable. Key fact:

$$
L \text{ is decidable} \iff L \text{ and } \overline{L} \text{ are both recognizable}
$$

(Run the two recognisers in parallel; one of them must accept.)

## 2. Decidable problems

Questions about **finite automata and grammars** are mostly decidable:

| Problem | Decidable? |
|---|---|
| $A_{\text{DFA}}$: does DFA $B$ accept $w$? | Yes: simulate it |
| $E_{\text{DFA}}$: is $L(B) = \emptyset$? | Yes: is an accepting state reachable? |
| $EQ_{\text{DFA}}$: is $L(B_1) = L(B_2)$? | Yes: test whether the symmetric difference is empty |
| $A_{\text{CFG}}$: does CFG $G$ generate $w$? | Yes: CYK |
| $E_{\text{CFG}}$: is $L(G) = \emptyset$? | Yes |
| $EQ_{\text{CFG}}$: is $L(G_1) = L(G_2)$? | **No** |

## 3. The acceptance problem is undecidable

$$
A_{\text{TM}} = \{\langle M, w \rangle : M \text{ is a TM that accepts } w\}
$$

$A_{\text{TM}}$ is **recognizable**: the universal TM simulates $M$ on $w$ and accepts if $M$ does. But it is **not decidable**.

**Proof (diagonalization).** Suppose a decider $H$ for $A_{\text{TM}}$ exists: $H(\langle M, w \rangle)$ always halts, accepting if $M$ accepts $w$ and rejecting otherwise. Build a new machine $D$:

> $D$, on input $\langle M \rangle$: run $H$ on $\langle M, \langle M \rangle \rangle$, and do the **opposite**: accept if $H$ rejects, reject if $H$ accepts.

Now run $D$ on its own description $\langle D \rangle$:

- If $D$ accepts $\langle D \rangle$, then $H$ said "$D$ accepts $\langle D \rangle$", so $D$ rejects. Contradiction.
- If $D$ rejects $\langle D \rangle$, then $H$ said "$D$ does not accept $\langle D \rangle$", so $D$ accepts. Contradiction.

So $H$ cannot exist. This is the same diagonal idea Cantor used to show the real numbers are uncountable.

## 4. The halting problem

$$
\text{HALT}_{\text{TM}} = \{\langle M, w \rangle : M \text{ halts on } w\}
$$

**HALT is undecidable**, by reduction from $A_{\text{TM}}$: if a decider $R$ for HALT existed, we could decide $A_{\text{TM}}$. On $\langle M, w \rangle$, ask $R$ whether $M$ halts on $w$; if not, reject; if so, simulate $M$ on $w$ (which is now safe, since it halts) and give the same answer. That would decide $A_{\text{TM}}$, which is impossible.

**Practical meaning:** no tool can perfectly detect infinite loops in every program. Real tools (compilers, static analysers) either give up on hard cases or report possible false alarms.

## 5. An unrecognizable language

$\overline{A_{\text{TM}}}$ (pairs where $M$ does **not** accept $w$) is **not even recognizable**. If it were, then $A_{\text{TM}}$ and its complement would both be recognizable, making $A_{\text{TM}}$ decidable. So there are languages beyond the reach of any Turing machine, even one allowed to loop.

There are also simply more languages than machines: Turing machines can be listed (they are finite strings), but the set of all languages is uncountable.

## 6. Reductions

$A$ **reduces** to $B$, written $A \le_m B$, if a computable function $f$ turns every instance $x$ of $A$ into an instance $f(x)$ of $B$ with the same answer: $x \in A \iff f(x) \in B$.

- If $B$ is decidable, so is $A$.
- If $A$ is **undecidable**, so is $B$.

To prove a new problem $B$ undecidable, **reduce a known undecidable problem (such as $A_{\text{TM}}$ or HALT) to $B$**.

**Example.** $E_{\text{TM}} = \{\langle M \rangle : L(M) = \emptyset\}$ is undecidable. Given $\langle M, w \rangle$, build $M'$ which ignores its own input and runs $M$ on $w$, accepting if $M$ accepts. Then $L(M')$ is empty exactly when $M$ does not accept $w$. A decider for $E_{\text{TM}}$ would therefore decide $A_{\text{TM}}$.

## 7. Rice's theorem

> Every **non-trivial** property of the **language** recognised by a Turing machine is undecidable.

"Non-trivial" means some TMs have the property and some don't. "Of the language" means it depends only on what the machine accepts, not on how it is built.

Undecidable by Rice's theorem: Is $L(M)$ empty? Finite? Regular? Does $M$ accept "hello"? Is $L(M) = \Sigma^*$?

Not covered (these are about the machine itself, not its language): Does $M$ have more than 5 states? Does $M$ ever move left? Some of these are decidable.

<details class="go-deeper">
<summary>Go deeper: the Post correspondence problem</summary>

Given dominoes, each with a string on top and a string on the bottom, is there a sequence of dominoes (repeats allowed) where the top and bottom strings read the same? **PCP is undecidable**, even though it involves no machines at all. Reductions from PCP prove many grammar questions undecidable, such as whether a CFG is ambiguous, or whether two CFGs have overlapping languages.
</details>

## Summary

- Decidable means a TM always halts with the right answer; recognizable means it accepts the members but may loop on the others.
- $L$ is decidable iff both $L$ and $\overline{L}$ are recognizable.
- $A_{\text{TM}}$ is recognizable but undecidable (diagonalization); HALT is undecidable; $\overline{A_{\text{TM}}}$ is not even recognizable.
- To show $B$ undecidable, reduce a known undecidable problem to $B$.
- Rice's theorem: every non-trivial property of a TM's language is undecidable.

## Check yourself

<details>
<summary>Is the halting problem recognizable?</summary>

Yes: simulate $M$ on $w$ and accept if it halts. It is not decidable, because the simulation never ends when $M$ loops.
</details>

<details>
<summary>Which direction must a reduction go to prove that problem B is undecidable?</summary>

From a known undecidable problem $A$ **to** $B$ ($A \le_m B$). Then a decider for $B$ would give a decider for $A$.
</details>

<details>
<summary>Is "does this TM accept at least one string?" decidable?</summary>

No. It is a non-trivial property of the TM's language (non-emptiness), so Rice's theorem makes it undecidable. It is recognizable, though: try all strings in parallel.
</details>
