---
title: String Matching
description: Finding a pattern in a text with the naive algorithm, Rabin–Karp rolling hashes, and the Knuth–Morris–Pratt algorithm with a worked prefix-function example.
sidebar:
  label: "11. String matching"
  order: 11
lesson:
  module: Further topics
---

**Problem.** Find every position where a pattern $P$ of length $m$ occurs in a text $T$ of length $n$.

| Algorithm | Preprocessing | Matching (worst) | Matching (typical) |
|---|---|---|---|
| Naive | none | $O((n - m + 1)\,m)$ | $O(n)$ on random text |
| Rabin–Karp | $O(m)$ | $O((n - m + 1)\,m)$ | $O(n + m)$ |
| Finite automaton | $O(m \cdot \lvert\Sigma\rvert)$ | $O(n)$ | $O(n)$ |
| Knuth–Morris–Pratt | $O(m)$ | $O(n)$ | $O(n)$ |

## Naive algorithm

Try every shift $s$ from $0$ to $n - m$ and compare $P$ with $T[s..s+m-1]$ character by character.

```c
void naive_search(const char *T, const char *P) {
    int n = strlen(T), m = strlen(P);
    for (int s = 0; s <= n - m; s++) {
        int j = 0;
        while (j < m && T[s + j] == P[j]) j++;
        if (j == m) printf("Match at %d\n", s);
    }
}
```

The worst case is $T = $ `AAAA…A`, $P = $ `AA…AB`: every shift compares almost all of $P$. The waste is that information from a failed comparison is thrown away.

## Rabin–Karp

Compare **hash values** first, and only compare characters when the hashes match.

Treat each length-$m$ window as an $m$-digit number in base $d$ (the alphabet size), reduced modulo a prime $q$. The next window's hash is computed from the current one in $O(1)$ (a **rolling hash**): drop the leading character, shift, and add the new character.

$$
t_{s+1} = \big(d\,(t_s - T[s]\cdot h) + T[s+m]\big) \bmod q, \qquad h = d^{m-1} \bmod q
$$

When $t_s$ equals the pattern's hash, check the characters, because different strings can share a hash. A match of hashes but not characters is a **spurious hit**.

- Expected time $O(n + m)$ with a good prime $q$.
- Worst case $O(nm)$ if almost every window is a spurious hit.
- Easily extends to searching for **many patterns at once**, and to plagiarism detection.

**Example ($d = 10$, $q = 13$).** Pattern `31415` has hash $31415 \bmod 13 = 7$. Any text window whose value is $\equiv 7 \pmod{13}$ is checked character by character; for example the window `67399` also gives 7, which is a spurious hit.

## Knuth–Morris–Pratt (KMP)

When a mismatch happens after matching $j$ characters, KMP already knows what those characters were (they equal $P[0..j-1]$), so it never moves backwards in the text. It shifts the pattern using a precomputed table.

### The prefix function

$\pi[i]$ = the length of the longest **proper prefix** of $P[0..i]$ that is also a **suffix** of it.

**Example:** $P = $ `ABABCABAB`.

| $i$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| $P[i]$ | A | B | A | B | C | A | B | A | B |
| $\pi[i]$ | 0 | 0 | 1 | 2 | 0 | 1 | 2 | 3 | 4 |

For instance, $\pi[8] = 4$ because `ABAB` is both a prefix and a suffix of `ABABCABAB`. At $i = 4$, no prefix ends in `C`, so $\pi[4] = 0$.

```c
void prefix_function(const char *P, int m, int pi[]) {
    pi[0] = 0;
    int k = 0;                       // length of the current matched prefix
    for (int i = 1; i < m; i++) {
        while (k > 0 && P[i] != P[k]) k = pi[k - 1];   // fall back
        if (P[i] == P[k]) k++;
        pi[i] = k;
    }
}
```

### Searching

```c
void kmp_search(const char *T, const char *P) {
    int n = strlen(T), m = strlen(P), pi[m];
    prefix_function(P, m, pi);
    int q = 0;                        // characters matched so far
    for (int i = 0; i < n; i++) {
        while (q > 0 && T[i] != P[q]) q = pi[q - 1];
        if (T[i] == P[q]) q++;
        if (q == m) {
            printf("Match at %d\n", i - m + 1);
            q = pi[q - 1];            // look for the next match
        }
    }
}
```

With $T = $ `ABABDABACDABABCABAB` and the pattern above, KMP reports a match at index **10**.

**Why it is linear.** The text index $i$ only moves forward. Each fallback `q = pi[q-1]` decreases $q$, and $q$ increases by at most 1 per character, so the total number of fallbacks is at most $n$. Matching is $O(n)$ and building $\pi$ is $O(m)$: **$O(n + m)$** overall.

## Other string algorithms worth knowing

- **Boyer–Moore:** compares from the **right** end of the pattern and can skip large parts of the text; very fast in practice (used by `grep`).
- **Z-algorithm:** computes, for each position, the longest substring starting there that matches a prefix. Linear time, similar uses to KMP.
- **Aho–Corasick:** matches many patterns at once using a trie with failure links.
- **Suffix arrays and suffix trees:** preprocess the text so that any pattern can be searched in $O(m \log n)$ or $O(m)$.

## Viva questions

<details>
<summary>What does the KMP prefix function store?</summary>

For each position $i$ of the pattern, the length of the longest proper prefix of $P[0..i]$ that is also a suffix of it. On a mismatch it tells KMP how much of the pattern is already matched after shifting, so the text pointer never moves back.
</details>

<details>
<summary>What is a spurious hit in Rabin–Karp?</summary>

A text window whose hash equals the pattern's hash even though the strings differ. It is caught by comparing the characters, but many of them make Rabin–Karp slow, so $q$ should be a large prime.
</details>

<details>
<summary>Why is KMP O(n + m) when the naive algorithm is O(nm)?</summary>

The naive algorithm re-examines text characters after every shift. KMP never moves backwards in the text, and its fallbacks are paid for by earlier forward steps, so the total work is linear.
</details>
