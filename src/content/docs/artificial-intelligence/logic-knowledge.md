---
title: Logic and Knowledge Representation
description: Knowledge-based agents, propositional logic for AI, entailment and inference, resolution with a worked proof, Horn clauses with forward and backward chaining, first-order logic, unification, and other representations (semantic networks, frames, rules).
sidebar:
  label: "6. Logic and knowledge"
  order: 6
lesson:
  module: Reasoning
  prerequisites:
    - label: Propositional logic (Discrete Math)
      link: /discrete-mathematics/propositional-logic/
  outcomes:
    - Explain entailment and the soundness and completeness of an inference procedure
    - Convert sentences to CNF and prove a query by resolution
    - Run forward and backward chaining on Horn clauses
    - Translate English sentences into first-order logic
  keyIdea: >-
    A **knowledge-based agent** keeps facts in a knowledge base and derives new ones by **inference**. **Resolution** proves a query by showing its negation leads to a contradiction, and is complete for propositional logic. For rule-based knowledge (Horn clauses), **forward chaining** (data-driven) and **backward chaining** (goal-driven) are efficient.
---

The logic itself (connectives, truth tables, equivalences, quantifiers) is covered in [Discrete Mathematics](/discrete-mathematics/propositional-logic/). This lesson covers how AI systems use it.

## 1. Knowledge-based agents

A **knowledge-based agent** has a **knowledge base (KB)** of sentences in a formal language. It repeatedly:

1. **TELLs** the KB what it perceives,
2. **ASKs** the KB what action to take (inference works this out),
3. TELLs the KB which action it took.

The **declarative** approach: describe what the agent knows, and let general-purpose inference work out what to do.

## 2. Entailment and inference

- $KB \models \alpha$ (**entailment**): $\alpha$ is true in **every** model (possible world) in which the KB is true.
- $KB \vdash_i \alpha$: an inference procedure $i$ **derives** $\alpha$ from the KB.

An inference procedure is:

- **Sound** if it derives only entailed sentences (it never derives falsehoods from truths).
- **Complete** if it can derive **every** entailed sentence.

**Model checking** (enumerating truth tables) is sound and complete but takes $O(2^n)$ time for $n$ symbols.

## 3. Resolution

**The resolution rule:** from two clauses containing complementary literals, derive a clause with the remaining literals:

$$
\frac{A \lor B \qquad \neg B \lor C}{A \lor C}
$$

**Resolution refutation** proves $KB \models \alpha$ by contradiction:

1. Convert $KB \land \neg\alpha$ to **conjunctive normal form** (CNF): a conjunction of clauses, each a disjunction of literals.
2. Repeatedly resolve pairs of clauses.
3. If the **empty clause** (a contradiction) appears, $\alpha$ is entailed.

**Converting to CNF:** eliminate $\leftrightarrow$ and $\to$ ($p \to q \equiv \neg p \lor q$); push $\neg$ inwards with De Morgan's laws; distribute $\lor$ over $\land$.

**Worked example.** KB: $P \to Q$, $Q \to R$, $P$. Prove $R$.

| Clause | Source |
|---|---|
| 1. $\neg P \lor Q$ | from $P \to Q$ |
| 2. $\neg Q \lor R$ | from $Q \to R$ |
| 3. $P$ | given |
| 4. $\neg R$ | negated goal |
| 5. $\neg Q$ | resolve 2 and 4 |
| 6. $\neg P$ | resolve 1 and 5 |
| 7. $\square$ (empty clause) | resolve 3 and 6 |

The contradiction proves $R$. Resolution is **sound and complete** (refutation-complete) for propositional logic.

## 4. Horn clauses, forward and backward chaining

A **Horn clause** has at most one positive literal. Most rule bases use **definite clauses**: exactly one positive literal, written as a rule $A_1 \land A_2 \land \dots \land A_k \to B$, or a fact $B$. Inference with them is linear in the size of the KB.

**Example KB:** $A$, $B$, $A \land B \to L$, $L \land B \to M$, $M \to Q$. Query: $Q$?

**Forward chaining** (data-driven): start from known facts and fire every rule whose premises are all known, adding its conclusion, until the query appears or nothing new can be added.

- Known: $A$, $B$ → fire $A \land B \to L$: add $L$ → fire $L \land B \to M$: add $M$ → fire $M \to Q$: add $Q$. ✓

**Backward chaining** (goal-driven): start from the query and work backwards, finding rules that conclude it and trying to prove their premises.

- Goal $Q$ ← needs $M$ ← needs $L$ and $B$ ← $L$ needs $A$ and $B$, both facts. ✓

| | Forward chaining | Backward chaining |
|---|---|---|
| Direction | From facts to conclusions | From goal to facts |
| Good when | Many conclusions are needed; reacting to new data | Answering specific queries |
| Risk | Derives many irrelevant facts | Can repeat work (fixed by caching) |
| Used in | Production systems, monitoring | Prolog, expert systems' diagnosis |

## 5. First-order logic

Propositional logic can't say "all students have an ID" without one symbol per student. **First-order logic (FOL)** adds **objects**, **relations**, **functions** and **quantifiers**.

| English | First-order logic |
|---|---|
| All students study. | $\forall x\, (\text{Student}(x) \to \text{Studies}(x))$ |
| Some student loves AI. | $\exists x\, (\text{Student}(x) \land \text{Loves}(x, \text{AI}))$ |
| Everyone loves someone. | $\forall x\, \exists y\, \text{Loves}(x, y)$ |
| No one likes exams. | $\forall x\, \neg \text{Likes}(x, \text{Exams})$, or $\neg \exists x\, \text{Likes}(x, \text{Exams})$ |
| Rina's father is a teacher. | $\text{Teacher}(\text{Father}(\text{Rina}))$ |

**Unification** finds a substitution that makes two expressions identical: $\text{Knows}(\text{John}, x)$ and $\text{Knows}(y, \text{Mother}(y))$ unify with $\{y / \text{John},\; x / \text{Mother}(\text{John})\}$.

**Generalised modus ponens** combines unification with modus ponens, so forward and backward chaining work in FOL; resolution extends to FOL too (after converting to clause form, with **Skolem functions** replacing existential quantifiers).

Inference in FOL is **semi-decidable**: if a sentence is entailed, a complete procedure will eventually prove it, but if not, it may run forever.

## 6. Other representations

| Representation | Idea | Example |
|---|---|---|
| **Semantic network** | A graph: nodes are concepts, labelled edges are relations (is-a, has-part); properties are inherited along is-a links | Canary —is-a→ Bird —can→ Fly |
| **Frames** | Structured records with **slots** (attributes) and default values, organised in inheritance hierarchies | A *Room* frame with slots for walls, door, windows |
| **Production rules** | IF condition THEN action | IF temperature > 38 THEN suspect fever |
| **Ontologies** | Formal vocabularies of categories and relations, shared between systems | Medical ontologies, the semantic web |

**Expert systems** combine a knowledge base of rules (from human experts) with an **inference engine** and an explanation facility, as in the classic medical system MYCIN.

## Summary

- Knowledge-based agents TELL facts to a KB and ASK it what to do; inference must be sound and ideally complete.
- Resolution refutation: convert $KB \land \neg\alpha$ to CNF and resolve until the empty clause appears.
- Horn clauses allow efficient forward chaining (from facts) and backward chaining (from the goal).
- First-order logic adds objects, relations, functions and quantifiers; unification matches expressions.
- Semantic networks, frames and production rules are alternative knowledge representations.

## Check yourself

<details>
<summary>What does it mean for an inference procedure to be sound?</summary>

It only derives sentences that are actually entailed by the knowledge base, so it never produces a false conclusion from true premises.
</details>

<details>
<summary>Why do we add the negation of the goal in resolution refutation?</summary>

If the KB entails the goal, then KB together with the goal's negation is unsatisfiable. Deriving the empty clause shows that contradiction, proving the goal.
</details>

<details>
<summary>Translate "Every student who studies passes" into first-order logic.</summary>

$\forall x\, (\text{Student}(x) \land \text{Studies}(x) \to \text{Passes}(x))$.
</details>
