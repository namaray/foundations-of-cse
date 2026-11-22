---
title: Reasoning under Uncertainty
description: Why agents need probability, the basic rules, Bayes' theorem with worked examples, independence and conditional independence, the naive Bayes classifier, Bayesian networks and their inference, and Markov models.
sidebar:
  label: "7. Uncertainty and Bayes"
  order: 7
lesson:
  module: Reasoning
  prerequisites:
    - label: Logic and knowledge
      link: /artificial-intelligence/logic-knowledge/
  outcomes:
    - Apply Bayes' theorem to update beliefs from evidence
    - Explain conditional independence and why naive Bayes relies on it
    - Read a Bayesian network and compute a joint probability from it
    - Describe Markov chains and hidden Markov models
  keyIdea: >-
    Real agents rarely know things for certain, so they hold **degrees of belief** as probabilities and update them with **Bayes' theorem** when evidence arrives. **Bayesian networks** make this tractable by recording which variables directly influence which, so a huge joint distribution factors into small local tables.
---

## 1. Why probability?

Logic fails when rules have exceptions ("toothache implies cavity", except when it doesn't), when we are **lazy** (listing every exception is impractical) or **ignorant** (we don't know all the causes). Probability summarises that uncertainty as a **degree of belief** between 0 and 1, and **decision theory** combines it with utilities: choose the action with the highest **expected utility**.

## 2. Basic rules

- $0 \le P(A) \le 1$; $P(\text{true}) = 1$; $P(\neg A) = 1 - P(A)$.
- $P(A \lor B) = P(A) + P(B) - P(A \land B)$.
- **Conditional probability:** $P(A \mid B) = \dfrac{P(A \land B)}{P(B)}$.
- **Product rule:** $P(A \land B) = P(A \mid B)\, P(B)$.
- **Total probability:** $P(B) = P(B \mid A)P(A) + P(B \mid \neg A)P(\neg A)$.

## 3. Bayes' theorem

$$
P(H \mid E) = \frac{P(E \mid H)\, P(H)}{P(E)}
$$

- $P(H)$: the **prior** belief in hypothesis $H$.
- $P(E \mid H)$: the **likelihood** of the evidence if $H$ is true.
- $P(H \mid E)$: the **posterior** belief after seeing the evidence.

**Worked example: a medical test.** A disease affects 1% of people. The test detects it 99% of the time (sensitivity), but also gives a positive result for 5% of healthy people (false positives). If you test positive, how likely is it that you have the disease?

$$
P(D \mid +) = \frac{0.99 \times 0.01}{0.99 \times 0.01 + 0.05 \times 0.99} = \frac{0.0099}{0.0099 + 0.0495} \approx 0.167
$$

Only about **17%**. Because the disease is rare, most positive results come from the many healthy people. Ignoring the prior here is called the **base-rate fallacy**.

**Worked example: spam.** 30% of email is spam. The word "free" appears in 60% of spam and 5% of normal mail.

$$
P(\text{spam} \mid \text{free}) = \frac{0.6 \times 0.3}{0.6 \times 0.3 + 0.05 \times 0.7} = \frac{0.18}{0.215} \approx 0.84
$$

## 4. Independence

- $A$ and $B$ are **independent** if $P(A \land B) = P(A)\,P(B)$, equivalently $P(A \mid B) = P(A)$.
- $A$ and $B$ are **conditionally independent given $C$** if $P(A \land B \mid C) = P(A \mid C)\, P(B \mid C)$: once $C$ is known, learning $B$ tells you nothing more about $A$.

**Example.** A toothache and the dentist's probe catching are both caused by a cavity. They are dependent in general, but conditionally independent **given** whether there is a cavity.

Conditional independence is what makes probabilistic reasoning tractable: a full joint distribution over $n$ Boolean variables needs $2^n - 1$ numbers.

## 5. The naive Bayes classifier

Assume the features $x_1, \dots, x_n$ are conditionally independent given the class $C$. Then

$$
P(C \mid x_1, \dots, x_n) \propto P(C) \prod_{i=1}^{n} P(x_i \mid C)
$$

Choose the class with the largest value. The probabilities are estimated by counting in training data.

Despite the "naive" assumption, it works well for **text classification** (spam filtering, sentiment) and is fast to train. **Laplace (add-one) smoothing** avoids zero probabilities for words never seen with a class. More on classifiers is in [Machine Learning](/machine-learning/classification/).

## 6. Bayesian networks

A **Bayesian network** is a directed acyclic graph:

- Each **node** is a random variable.
- An **edge** $X \to Y$ means $X$ directly influences $Y$.
- Each node has a **conditional probability table (CPT)**: $P(X \mid \text{Parents}(X))$.

The full joint distribution factors as

$$
P(x_1, \dots, x_n) = \prod_{i=1}^{n} P(x_i \mid \text{Parents}(X_i))
$$

**Example: the burglar alarm.**

```text
 Burglary     Earthquake
       \       /
        ▼     ▼
         Alarm
        /     \
       ▼       ▼
  JohnCalls   MaryCalls
```

With $P(B) = 0.001$, $P(E) = 0.002$, $P(A \mid \neg B, \neg E) = 0.001$, $P(J \mid A) = 0.90$ and $P(M \mid A) = 0.70$, the probability that the alarm sounds with no burglary or earthquake and both John and Mary call is

$$
P(J, M, A, \neg B, \neg E) = 0.90 \times 0.70 \times 0.001 \times 0.999 \times 0.998 \approx 0.00063
$$

Each node is conditionally independent of its non-descendants given its parents, so the network needs only 10 numbers here instead of $2^5 - 1 = 31$.

**Inference** computes the probability of a query given evidence, such as $P(\text{Burglary} \mid \text{JohnCalls}, \text{MaryCalls})$. **Exact inference** (enumeration, variable elimination) is NP-hard in general; **approximate inference** uses sampling (rejection sampling, likelihood weighting, Gibbs sampling).

## 7. Markov models

For processes that change over time:

- A **Markov chain** assumes the next state depends only on the current state (the **Markov property**). It is described by a **transition matrix** of probabilities $P(X_{t+1} \mid X_t)$.
- A **hidden Markov model (HMM)** has hidden states that produce observable outputs. Algorithms: **forward** (probability of an observation sequence), **Viterbi** (most likely sequence of hidden states), **Baum–Welch** (learn the parameters). Used in speech recognition, part-of-speech tagging and bioinformatics.

**Example.** Weather as a Markov chain: if today is sunny, tomorrow is sunny with probability 0.8, rainy with 0.2; if rainy, sunny 0.4, rainy 0.6. Starting sunny, the probability that the day after tomorrow is sunny is $0.8 \times 0.8 + 0.2 \times 0.4 = 0.72$.

## Summary

- Probabilities express degrees of belief; agents choose actions with the highest expected utility.
- Bayes: posterior ∝ likelihood × prior; rare hypotheses stay unlikely even after fairly reliable evidence.
- Conditional independence makes reasoning tractable; naive Bayes assumes features are independent given the class.
- Bayesian networks factor the joint distribution into local CPTs: $P(x_1, \dots, x_n) = \prod P(x_i \mid \text{parents})$.
- Markov chains model state changes over time; HMMs add hidden states with observable outputs.

## Check yourself

<details>
<summary>P(A) = 0.3, P(B | A) = 0.5, P(B | ¬A) = 0.2. What is P(A | B)?</summary>

$P(B) = 0.5 \times 0.3 + 0.2 \times 0.7 = 0.29$, so $P(A \mid B) = 0.15 / 0.29 \approx 0.52$.
</details>

<details>
<summary>Why is the naive Bayes assumption called naive?</summary>

It assumes every feature is independent of the others given the class, which is rarely true (words in a message are correlated). The classifier often works well anyway.
</details>

<details>
<summary>How many numbers does a Bayesian network node with two Boolean parents need in its CPT (for a Boolean variable)?</summary>

4: one probability for each of the $2^2$ combinations of parent values (the complementary probability is implied).
</details>
