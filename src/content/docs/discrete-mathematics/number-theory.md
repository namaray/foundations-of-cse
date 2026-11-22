---
title: Number Theory
description: Divisibility and the division algorithm, primes and factorisation, gcd and the Euclidean algorithm, Bézout's identity, modular arithmetic and inverses, Fermat's little theorem, the Chinese remainder theorem, and RSA.
sidebar:
  label: "9. Number theory"
  order: 9
lesson:
  module: Number theory
  prerequisites:
    - label: Proof techniques
      link: /discrete-mathematics/proof-techniques/
  outcomes:
    - Compute a gcd with the Euclidean algorithm and express it as a linear combination
    - Do arithmetic modulo n and find modular inverses
    - Solve a system of congruences with the Chinese remainder theorem
    - Walk through a small RSA example
  keyIdea: Integers can be studied by their **remainders**. The **Euclidean algorithm** finds gcds quickly, a number has an inverse modulo $n$ exactly when it shares no factor with $n$, and these facts are the whole basis of RSA encryption.
---

## 1. Divisibility

$a$ **divides** $b$, written $a \mid b$, if $b = ak$ for some integer $k$. For example, $3 \mid 12$ but $5 \nmid 12$.

- If $a \mid b$ and $a \mid c$, then $a \mid (mb + nc)$ for any integers $m, n$.
- If $a \mid b$ and $b \mid c$, then $a \mid c$.

**Division algorithm.** For any integer $a$ and positive integer $d$, there are unique integers $q$ (quotient) and $r$ (remainder) with

$$
a = dq + r, \qquad 0 \le r < d
$$

We write $q = a \operatorname{div} d$ and $r = a \bmod d$. Note $-11 \bmod 3 = 1$, since $-11 = 3(-4) + 1$.

## 2. Primes

A **prime** is an integer $p > 1$ whose only positive divisors are 1 and $p$. Others greater than 1 are **composite**.

- **Fundamental theorem of arithmetic:** every integer $n > 1$ is a product of primes in exactly one way, apart from order. $360 = 2^3 \cdot 3^2 \cdot 5$.
- **Trial division:** if $n$ is composite, it has a prime factor $\le \sqrt n$. So to test 101, check 2, 3, 5, 7 only.
- There are infinitely many primes (proof in [Proof techniques](/discrete-mathematics/proof-techniques/#3-proof-by-contradiction)).
- The **sieve of Eratosthenes** lists all primes up to $n$ by crossing out multiples of each prime in turn.

## 3. gcd and the Euclidean algorithm

$\gcd(a, b)$ is the largest integer dividing both; $\operatorname{lcm}(a, b)$ is the smallest positive integer both divide. From prime factorisations, take the minimum exponents for gcd and the maximum for lcm. Always

$$
\gcd(a, b) \cdot \operatorname{lcm}(a, b) = a \cdot b
$$

$a$ and $b$ are **relatively prime** (coprime) if $\gcd(a, b) = 1$.

**The Euclidean algorithm** uses $\gcd(a, b) = \gcd(b, a \bmod b)$ and stops when the remainder is 0.

**Example:** $\gcd(252, 198)$.

$$
\begin{aligned}
252 &= 1 \cdot 198 + 54 \\
198 &= 3 \cdot 54 + 36 \\
54 &= 1 \cdot 36 + 18 \\
36 &= 2 \cdot 18 + 0
\end{aligned}
$$

The last non-zero remainder is $\gcd(252, 198) = 18$. The algorithm takes $O(\log \min(a, b))$ steps.

### Bézout's identity

There are always integers $s, t$ with $\gcd(a, b) = sa + tb$. Find them by working back up the Euclidean steps (the **extended Euclidean algorithm**):

$$
\begin{aligned}
18 &= 54 - 1 \cdot 36 \\
&= 54 - (198 - 3 \cdot 54) = 4 \cdot 54 - 198 \\
&= 4 \cdot (252 - 198) - 198 = 4 \cdot 252 - 5 \cdot 198
\end{aligned}
$$

So $s = 4$, $t = -5$. Check: $1008 - 990 = 18$.

## 4. Modular arithmetic

$a \equiv b \pmod m$ means $m \mid (a - b)$: $a$ and $b$ leave the same remainder when divided by $m$. For example, $17 \equiv 5 \pmod{12}$, which is clock arithmetic.

You can add, subtract and multiply congruences, and reduce at any step:

$$
(a + b) \bmod m = ((a \bmod m) + (b \bmod m)) \bmod m, \qquad (ab) \bmod m = ((a \bmod m)(b \bmod m)) \bmod m
$$

**Fast exponentiation.** $3^{100} \bmod 7$: since $3^6 \equiv 1 \pmod 7$ (see Fermat below) and $100 = 6 \cdot 16 + 4$, we get $3^{100} \equiv 3^4 = 81 \equiv 4 \pmod 7$.

### Modular inverses

An **inverse** of $a$ modulo $m$ is a number $\bar a$ with $a \bar a \equiv 1 \pmod m$. It exists **exactly when $\gcd(a, m) = 1$**, and Bézout's identity finds it: if $sa + tm = 1$, then $s$ is the inverse.

**Example.** The inverse of 3 modulo 7 is 5, because $3 \cdot 5 = 15 \equiv 1 \pmod 7$. So $3x \equiv 4 \pmod 7$ has solution $x \equiv 5 \cdot 4 = 20 \equiv 6 \pmod 7$.

Division is not allowed in general: $2 \cdot 3 \equiv 2 \cdot 6 \pmod 6$, but $3 \not\equiv 6 \pmod 6$, because 2 has no inverse modulo 6.

## 5. Fermat's little theorem

If $p$ is prime and $p \nmid a$, then

$$
a^{p-1} \equiv 1 \pmod p
$$

This simplifies large powers and underlies primality tests. **Euler's theorem** generalises it: if $\gcd(a, n) = 1$ then $a^{\varphi(n)} \equiv 1 \pmod n$, where $\varphi(n)$ counts the integers from 1 to $n$ that are coprime to $n$. For a prime $p$, $\varphi(p) = p - 1$; for distinct primes, $\varphi(pq) = (p-1)(q-1)$.

## 6. The Chinese remainder theorem

If $m_1, \dots, m_k$ are pairwise coprime, the system $x \equiv a_i \pmod{m_i}$ has exactly one solution modulo $M = m_1 m_2 \cdots m_k$.

**Example.** $x \equiv 2 \pmod 3$, $x \equiv 3 \pmod 5$, $x \equiv 2 \pmod 7$. Here $M = 105$.

| $i$ | $a_i$ | $m_i$ | $M_i = M/m_i$ | $y_i = M_i^{-1} \bmod m_i$ | $a_i M_i y_i$ |
|---|---|---|---|---|---|
| 1 | 2 | 3 | 35 | 2 (since $35 \equiv 2$, and $2 \cdot 2 \equiv 1$) | 140 |
| 2 | 3 | 5 | 21 | 1 (since $21 \equiv 1$) | 63 |
| 3 | 2 | 7 | 15 | 1 (since $15 \equiv 1$) | 30 |

$x \equiv 140 + 63 + 30 = 233 \equiv 23 \pmod{105}$. Check: $23 = 3 \cdot 7 + 2 = 5 \cdot 4 + 3 = 7 \cdot 3 + 2$.

## 7. RSA in miniature

RSA public-key encryption is number theory in action:

1. Choose primes $p, q$; let $n = pq$ and $\varphi = (p-1)(q-1)$.
2. Choose $e$ coprime to $\varphi$. The **public key** is $(n, e)$.
3. Compute $d = e^{-1} \bmod \varphi$. The **private key** is $d$.
4. Encrypt: $c = m^e \bmod n$. Decrypt: $m = c^d \bmod n$.

**Example.** $p = 3$, $q = 11$: $n = 33$, $\varphi = 20$. Take $e = 3$; then $d = 7$, because $3 \cdot 7 = 21 \equiv 1 \pmod{20}$.

- Encrypt $m = 4$: $c = 4^3 = 64 \equiv 31 \pmod{33}$.
- Decrypt: $31^7 \bmod 33$. Since $31 \equiv -2$, this is $(-2)^7 = -128 \equiv 4 \pmod{33}$. The message is recovered.

Security rests on the difficulty of factoring $n$: knowing $p$ and $q$ gives $\varphi$, and then $d$. See [Cryptography & Security](/information-security/) for more.

## Summary

- $a = dq + r$ with $0 \le r < d$; every integer factors uniquely into primes.
- The Euclidean algorithm computes $\gcd(a, b)$ in $O(\log)$ steps, and running it backwards gives $\gcd = sa + tb$.
- $a$ has an inverse modulo $m$ exactly when $\gcd(a, m) = 1$.
- Fermat: $a^{p-1} \equiv 1 \pmod p$. The Chinese remainder theorem solves systems with coprime moduli.
- RSA encrypts with $m^e \bmod n$ and decrypts with $c^d \bmod n$, where $ed \equiv 1 \pmod{\varphi(n)}$.

## Check yourself

<details>
<summary>Find gcd(84, 36) and lcm(84, 36).</summary>

$84 = 2 \cdot 36 + 12$, $36 = 3 \cdot 12$, so the gcd is 12. The lcm is $84 \cdot 36 / 12 = 252$.
</details>

<details>
<summary>Does 4 have an inverse modulo 10? Does 3?</summary>

4 does not, since $\gcd(4, 10) = 2$. 3 does: $3 \cdot 7 = 21 \equiv 1 \pmod{10}$, so the inverse is 7.
</details>

<details>
<summary>Compute 2^50 mod 7.</summary>

$2^3 = 8 \equiv 1 \pmod 7$, and $50 = 3 \cdot 16 + 2$, so $2^{50} \equiv 2^2 = 4 \pmod 7$.
</details>
