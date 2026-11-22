---
title: Recurrence Relations
description: Modelling problems with recurrences, solving linear homogeneous recurrences with constant coefficients (distinct and repeated roots), particular solutions for the non-homogeneous case, and generating functions.
sidebar:
  label: "8. Recurrence relations"
  order: 8
lesson:
  module: Counting
  prerequisites:
    - label: Counting
      link: /discrete-mathematics/counting/
  outcomes:
    - Set up a recurrence from a counting problem
    - Solve a linear homogeneous recurrence with the characteristic equation
    - Find a particular solution for a non-homogeneous recurrence
  keyIdea: A recurrence defines each term from earlier ones. For $a_n = c_1 a_{n-1} + c_2 a_{n-2}$, guess $a_n = r^n$; the roots of $r^2 = c_1 r + c_2$ give the general solution, and the initial conditions fix the constants.
---

A **recurrence relation** defines $a_n$ in terms of earlier terms, together with **initial conditions**. Recurrences describe both counting problems and the running time of recursive algorithms (see [Algorithms: Recurrences](/algorithms/recurrences/) for divide-and-conquer recurrences).

## 1. Modelling with recurrences

**Fibonacci.** $f_n = f_{n-1} + f_{n-2}$, with $f_0 = 0$, $f_1 = 1$: $0, 1, 1, 2, 3, 5, 8, 13, \dots$

**Tower of Hanoi.** To move $n$ discs, move the top $n - 1$ aside, move the largest, then move the $n - 1$ back on top: $H_n = 2H_{n-1} + 1$, $H_1 = 1$. The solution is $H_n = 2^n - 1$.

**Bit strings with no two consecutive 0s.** Let $a_n$ count them. A valid string of length $n$ either ends in 1 (any valid string of length $n-1$, then 1) or ends in 10 (any valid string of length $n-2$, then 10):

$$
a_n = a_{n-1} + a_{n-2}, \qquad a_1 = 2,\; a_2 = 3
$$

So $a_3 = 5$, $a_4 = 8$: Fibonacci numbers again.

## 2. Linear homogeneous recurrences

A recurrence of the form

$$
a_n = c_1 a_{n-1} + c_2 a_{n-2} + \dots + c_k a_{n-k}
$$

with constant $c_i$ is **linear homogeneous of degree $k$ with constant coefficients**. Guessing $a_n = r^n$ and dividing by $r^{n-k}$ gives the **characteristic equation**

$$
r^k - c_1 r^{k-1} - \dots - c_k = 0
$$

For degree 2:

| Roots of $r^2 - c_1 r - c_2 = 0$ | General solution |
|---|---|
| Two distinct roots $r_1, r_2$ | $a_n = \alpha\, r_1^n + \beta\, r_2^n$ |
| One repeated root $r$ | $a_n = (\alpha + \beta n)\, r^n$ |

Find $\alpha$ and $\beta$ from the initial conditions.

### Worked example: distinct roots

Solve $a_n = 5a_{n-1} - 6a_{n-2}$ with $a_0 = 1$, $a_1 = 0$.

1. Characteristic equation: $r^2 - 5r + 6 = 0$, so $(r - 2)(r - 3) = 0$ and $r = 2, 3$.
2. General solution: $a_n = \alpha\, 2^n + \beta\, 3^n$.
3. Initial conditions: $\alpha + \beta = 1$ and $2\alpha + 3\beta = 0$. So $\alpha = 3$, $\beta = -2$.

$$
a_n = 3 \cdot 2^n - 2 \cdot 3^n
$$

Check: $a_2 = 5(0) - 6(1) = -6$, and the formula gives $12 - 18 = -6$.

### Worked example: repeated root

Solve $a_n = 6a_{n-1} - 9a_{n-2}$ with $a_0 = 1$, $a_1 = 6$.

1. $r^2 - 6r + 9 = (r - 3)^2 = 0$: repeated root $r = 3$.
2. General solution: $a_n = (\alpha + \beta n)\, 3^n$.
3. $a_0 = \alpha = 1$; $a_1 = 3(1 + \beta) = 6$, so $\beta = 1$.

$$
a_n = (1 + n)\, 3^n
$$

### Fibonacci's closed form

$r^2 = r + 1$ has roots $\varphi = \frac{1 + \sqrt 5}{2}$ and $\psi = \frac{1 - \sqrt 5}{2}$. With $f_0 = 0$, $f_1 = 1$:

$$
f_n = \frac{\varphi^n - \psi^n}{\sqrt 5}
$$

Since $|\psi| < 1$, $f_n$ grows like $\varphi^n \approx 1.618^n$, which is why naive recursive Fibonacci takes exponential time.

## 3. Non-homogeneous recurrences

For $a_n = c_1 a_{n-1} + c_2 a_{n-2} + F(n)$, the solution is

$$
a_n = a_n^{(h)} + a_n^{(p)}
$$

where $a_n^{(h)}$ solves the homogeneous part and $a_n^{(p)}$ is any **particular solution**. Guess $a_n^{(p)}$ with the same shape as $F(n)$:

| $F(n)$ | Try |
|---|---|
| constant $c$ | constant $A$ |
| polynomial of degree $d$ | polynomial of degree $d$ |
| $s^n$ | $A\, s^n$ (multiply by $n$ if $s$ is a characteristic root) |

**Example.** $a_n = 2a_{n-1} + 1$, $a_1 = 1$ (Tower of Hanoi).

- Homogeneous: $a_n^{(h)} = \alpha\, 2^n$.
- Particular: try $A$. Then $A = 2A + 1$, so $A = -1$.
- General: $a_n = \alpha\, 2^n - 1$. From $a_1 = 1$: $2\alpha - 1 = 1$, so $\alpha = 1$.

$$
a_n = 2^n - 1
$$

<details class="go-deeper">
<summary>Go deeper: generating functions</summary>

The **generating function** of a sequence $a_0, a_1, a_2, \dots$ is the power series $G(x) = \sum_{n \ge 0} a_n x^n$. Operations on sequences become algebra on series.

Key series: $\dfrac{1}{1 - x} = 1 + x + x^2 + \dots$ and $\dfrac{1}{(1 - x)^k} = \sum_{n \ge 0} \binom{n + k - 1}{n} x^n$.

**Counting with them.** The number of solutions of $x_1 + x_2 + x_3 = 10$ with $x_i \ge 0$ is the coefficient of $x^{10}$ in $(1 + x + x^2 + \dots)^3 = \frac{1}{(1-x)^3}$, which is $\binom{12}{10} = 66$, matching stars and bars.

**Solving recurrences.** Multiply the recurrence by $x^n$, sum over $n$, solve for $G(x)$, then split it into partial fractions and read off the coefficients.
</details>

## Summary

- Set up a recurrence by asking how a size-$n$ object is built from smaller ones.
- For a linear homogeneous recurrence, solve the characteristic equation: distinct roots give $\alpha r_1^n + \beta r_2^n$, a repeated root gives $(\alpha + \beta n) r^n$.
- For a non-homogeneous recurrence, add a particular solution shaped like $F(n)$.
- Always use the initial conditions last, and check one term.

## Check yourself

<details>
<summary>Solve a_n = a_{n-1} + 2a_{n-2}, a_0 = 2, a_1 = 7.</summary>

$r^2 - r - 2 = 0$ gives $r = 2, -1$. Then $\alpha + \beta = 2$ and $2\alpha - \beta = 7$, so $\alpha = 3$, $\beta = -1$: $a_n = 3 \cdot 2^n - (-1)^n$.
</details>

<details>
<summary>What is the general solution when the characteristic equation is (r − 2)²(r − 5) = 0?</summary>

$a_n = (\alpha + \beta n)\, 2^n + \gamma\, 5^n$.
</details>

<details>
<summary>Write a recurrence for the number of ways to climb n stairs taking 1 or 2 steps at a time.</summary>

The last move is 1 step or 2 steps: $s_n = s_{n-1} + s_{n-2}$, with $s_1 = 1$, $s_2 = 2$.
</details>
