---
title: Fuzzy Logic
description: Crisp vs fuzzy sets, membership functions, fuzzy set operations, linguistic variables and hedges, fuzzy rules, and the Mamdani inference process with fuzzification, rule evaluation, aggregation and centroid defuzzification.
sidebar:
  label: "8. Fuzzy logic"
  order: 8
lesson:
  module: Reasoning
  prerequisites:
    - label: Uncertainty and Bayes
      link: /artificial-intelligence/uncertainty/
  outcomes:
    - Explain the difference between crisp and fuzzy sets
    - Compute fuzzy union, intersection and complement
    - Run the four steps of a Mamdani fuzzy inference system
    - Distinguish fuzziness from probability
  keyIdea: >-
    In fuzzy logic, membership is a matter of **degree** between 0 and 1 rather than yes or no, which suits vague concepts like "warm" or "fast". A fuzzy controller **fuzzifies** crisp inputs, applies IF–THEN rules, combines their outputs, and **defuzzifies** the result back into a crisp action.
---

## 1. Crisp and fuzzy sets

In a **crisp** (classical) set, an element is either in or out: membership is 0 or 1. "Tall = height ≥ 180 cm" means 179.9 cm is simply not tall.

In a **fuzzy** set, each element has a **degree of membership** $\mu(x) \in [0, 1]$. Someone 175 cm tall might be tall to degree 0.6.

**Fuzziness is not probability.** "The water is warm to degree 0.7" describes **vagueness** in the concept *warm*; "there is a 70% chance of rain" describes **uncertainty** about an event that either happens or not.

## 2. Membership functions

Common shapes:

- **Triangular:** defined by $(a, b, c)$, rising from 0 at $a$ to 1 at $b$ and falling back to 0 at $c$.
- **Trapezoidal:** defined by $(a, b, c, d)$, with a flat top between $b$ and $c$.
- **Gaussian** and **sigmoid** curves for smooth transitions.

**Triangular membership:**

$$
\mu(x) = \max\left(0, \min\left(\frac{x - a}{b - a}, \frac{c - x}{c - b}\right)\right)
$$

**Example.** "Warm" is triangular with $(15, 25, 35)$ °C. At 20 °C: $\mu = (20 - 15)/(25 - 15) = 0.5$. At 30 °C: $\mu = (35 - 30)/(35 - 25) = 0.5$. At 25 °C: $\mu = 1$.

## 3. Operations

The standard (Zadeh) operations:

| Operation | Definition |
|---|---|
| Union (OR) | $\mu_{A \cup B}(x) = \max(\mu_A(x), \mu_B(x))$ |
| Intersection (AND) | $\mu_{A \cap B}(x) = \min(\mu_A(x), \mu_B(x))$ |
| Complement (NOT) | $\mu_{\overline{A}}(x) = 1 - \mu_A(x)$ |

**Example.** If $\mu_{\text{tall}}(x) = 0.7$ and $\mu_{\text{heavy}}(x) = 0.4$: tall AND heavy = 0.4; tall OR heavy = 0.7; NOT tall = 0.3.

Unlike crisp sets, $A \cap \overline{A}$ need not be empty: with $\mu_A = 0.7$, $\min(0.7, 0.3) = 0.3$. The law of the excluded middle does not hold.

**Linguistic variables** take words as values: *temperature* ∈ {cold, warm, hot}, each a fuzzy set. **Hedges** modify them: "very" often squares the membership ($\mu^2$), and "somewhat" takes the square root ($\sqrt{\mu}$).

## 4. Fuzzy rules

Knowledge is written as IF–THEN rules using linguistic terms:

- IF temperature is **hot** AND humidity is **high** THEN fan speed is **fast**.
- IF temperature is **warm** THEN fan speed is **medium**.
- IF temperature is **cold** THEN fan speed is **slow**.

## 5. Mamdani fuzzy inference

**Step 1: Fuzzification.** Convert each crisp input into membership degrees. A temperature of 28 °C might be warm 0.7 and hot 0.3.

**Step 2: Rule evaluation.** Compute each rule's **firing strength**: AND uses min, OR uses max. Then **clip** (or scale) the rule's output fuzzy set at that strength. If "IF warm THEN medium" fires at 0.7, the *medium* fan-speed set is cut off at height 0.7.

**Step 3: Aggregation.** Combine all the clipped output sets into one fuzzy set, using max.

**Step 4: Defuzzification.** Turn the aggregated set into one crisp output. The most common method is the **centroid** (centre of gravity):

$$
y^* = \frac{\int y \, \mu(y)\, dy}{\int \mu(y)\, dy} \approx \frac{\sum_i y_i \, \mu(y_i)}{\sum_i \mu(y_i)}
$$

Other methods: mean of maxima, bisector.

**Small example (discrete).** The aggregated fan-speed set has memberships 0.2 at 20%, 0.7 at 50% and 0.3 at 80% speed:

$$
y^* = \frac{20(0.2) + 50(0.7) + 80(0.3)}{0.2 + 0.7 + 0.3} = \frac{4 + 35 + 24}{1.2} = 52.5\%
$$

A **Sugeno** system uses functions (often constants) as rule outputs and a weighted average instead of centroid defuzzification, which is cheaper to compute.

## 6. Applications

Fuzzy control is used where precise mathematical models are hard but human rules of thumb are available: washing machines (load and dirt level → wash time), air conditioners, camera autofocus, anti-lock brakes, train braking (the Sendai subway), and some decision-support systems.

## Summary

- Fuzzy sets allow partial membership in [0, 1]; fuzziness describes vagueness, not probability.
- Membership functions are often triangular or trapezoidal.
- Union = max, intersection = min, complement = 1 − μ; the excluded middle no longer holds.
- Mamdani inference: fuzzify inputs, evaluate rules (min for AND), aggregate outputs (max), defuzzify (centroid).

## Check yourself

<details>
<summary>μ_A(x) = 0.6 and μ_B(x) = 0.3. What are A AND B, A OR B, and NOT A?</summary>

AND = min = 0.3; OR = max = 0.6; NOT A = 1 − 0.6 = 0.4.
</details>

<details>
<summary>What does defuzzification do?</summary>

It converts the aggregated output fuzzy set into a single crisp value that can drive an actuator, for example by taking its centroid.
</details>

<details>
<summary>Is "70% chance of rain" a fuzzy statement?</summary>

No. It is probabilistic: rain either happens or it doesn't, and 70% expresses uncertainty about which. A fuzzy statement would be "it is drizzling to degree 0.7", describing a vague category.
</details>
