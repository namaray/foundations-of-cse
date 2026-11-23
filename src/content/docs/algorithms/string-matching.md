---
title: String Matching
description: Finding a pattern in a text with the naive algorithm, Rabin–Karp rolling hashes, and the Knuth–Morris–Pratt algorithm with a worked prefix-function example.
sidebar:
  label: "11. String matching"
  order: 11
lesson:
  module: Further topics
  prerequisites:
    - label: Searching
      link: /algorithms/searching/
    - label: Hashing
      link: /data-structures/hashing/
  outcomes:
    - Analyse the naive matcher and its worst case
    - Use rolling hashes in Rabin–Karp and explain spurious hits
    - Compute the KMP prefix function and use it to search in linear time
    - Name other string algorithms and their uses
  keyIdea: >-
    The naive matcher tries every shift, $O(nm)$. **Rabin–Karp** compares **rolling hashes** first and checks characters only on a hash match. **KMP** precomputes the **prefix function**, so after a mismatch it knows how much of the pattern is still matched and never moves backwards in the text: $O(n + m)$.
---

**Problem.** Find every position where a pattern $P$ of length $m$ occurs in a text $T$ of length $n$.

| Algorithm | Preprocessing | Matching (worst) | Matching (typical) |
|---|---|---|---|
| Naive | none | $O((n - m + 1)\,m)$ | $O(n)$ on random text |
| Rabin–Karp | $O(m)$ | $O((n - m + 1)\,m)$ | $O(n + m)$ |
| Finite automaton | $O(m \cdot \lvert\Sigma\rvert)$ | $O(n)$ | $O(n)$ |
| Knuth–Morris–Pratt | $O(m)$ | $O(n)$ | $O(n)$ |

## 1. Naive algorithm

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

## 2. Rabin–Karp

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

## 3. Knuth–Morris–Pratt (KMP)

When a mismatch happens after matching $j$ characters, KMP already knows what those characters were (they equal $P[0..j-1]$), so it never moves backwards in the text. It shifts the pattern using a precomputed table.

### The prefix function

$\pi[i]$ = the length of the longest **proper prefix** of $P[0..i]$ that is also a **suffix** of it.

**Example:** $P = $ `ABABCABAB`.

| $i$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| $P[i]$ | A | B | A | B | C | A | B | A | B |
| $\pi[i]$ | 0 | 0 | 1 | 2 | 0 | 1 | 2 | 3 | 4 |

For instance, $\pi[8] = 4$ because `ABAB` is both a prefix and a suffix of `ABABCABAB`. At $i = 4$, no prefix ends in `C`, so $\pi[4] = 0$.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 520 190" role="img" aria-labelledby="kmppi-t"><title id="kmppi-t">The prefix function of ABABCABAB is 0 0 1 2 0 1 2 3 4; at the last position ABAB is both a prefix and a suffix.</title><defs><marker id="ah-kmppi" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-kmppi-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-kmppi-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><path class="dg-line-a" d="M54.0,36 Q146.0,8 238.0,36"/><path class="dg-line" d="M294.0,36 Q386.0,8 478.0,36"/><text class="dg-t-strong" x="26" y="60" text-anchor="middle">P</text><text class="dg-t-strong" x="26" y="130" text-anchor="middle">π</text><rect class="dg-cell-a" x="50" y="42" width="48" height="36" rx="4"/><text class="dg-t-a" x="74" y="60" text-anchor="middle">A</text><text class="dg-t-muted" x="74" y="92" text-anchor="middle">0</text><rect class="dg-cell-a" x="98" y="42" width="48" height="36" rx="4"/><text class="dg-t-a" x="122" y="60" text-anchor="middle">B</text><text class="dg-t-muted" x="122" y="92" text-anchor="middle">1</text><rect class="dg-cell-a" x="146" y="42" width="48" height="36" rx="4"/><text class="dg-t-a" x="170" y="60" text-anchor="middle">A</text><text class="dg-t-muted" x="170" y="92" text-anchor="middle">2</text><rect class="dg-cell-a" x="194" y="42" width="48" height="36" rx="4"/><text class="dg-t-a" x="218" y="60" text-anchor="middle">B</text><text class="dg-t-muted" x="218" y="92" text-anchor="middle">3</text><rect class="dg-cell" x="242" y="42" width="48" height="36" rx="4"/><text x="266" y="60" text-anchor="middle">C</text><text class="dg-t-muted" x="266" y="92" text-anchor="middle">4</text><rect class="dg-cell-c" x="290" y="42" width="48" height="36" rx="4"/><text class="dg-t-c" x="314" y="60" text-anchor="middle">A</text><text class="dg-t-muted" x="314" y="92" text-anchor="middle">5</text><rect class="dg-cell-c" x="338" y="42" width="48" height="36" rx="4"/><text class="dg-t-c" x="362" y="60" text-anchor="middle">B</text><text class="dg-t-muted" x="362" y="92" text-anchor="middle">6</text><rect class="dg-cell-c" x="386" y="42" width="48" height="36" rx="4"/><text class="dg-t-c" x="410" y="60" text-anchor="middle">A</text><text class="dg-t-muted" x="410" y="92" text-anchor="middle">7</text><rect class="dg-cell-c" x="434" y="42" width="48" height="36" rx="4"/><text class="dg-t-c" x="458" y="60" text-anchor="middle">B</text><text class="dg-t-muted" x="458" y="92" text-anchor="middle">8</text><rect class="dg-cell" x="50" y="112" width="48" height="36" rx="4"/><text x="74" y="130" text-anchor="middle">0</text><rect class="dg-cell" x="98" y="112" width="48" height="36" rx="4"/><text x="122" y="130" text-anchor="middle">0</text><rect class="dg-cell" x="146" y="112" width="48" height="36" rx="4"/><text x="170" y="130" text-anchor="middle">1</text><rect class="dg-cell" x="194" y="112" width="48" height="36" rx="4"/><text x="218" y="130" text-anchor="middle">2</text><rect class="dg-cell" x="242" y="112" width="48" height="36" rx="4"/><text x="266" y="130" text-anchor="middle">0</text><rect class="dg-cell" x="290" y="112" width="48" height="36" rx="4"/><text x="314" y="130" text-anchor="middle">1</text><rect class="dg-cell" x="338" y="112" width="48" height="36" rx="4"/><text x="362" y="130" text-anchor="middle">2</text><rect class="dg-cell" x="386" y="112" width="48" height="36" rx="4"/><text x="410" y="130" text-anchor="middle">3</text><rect class="dg-cell-b" x="434" y="112" width="48" height="36" rx="4"/><text class="dg-t-b" x="458" y="130" text-anchor="middle">4</text><text class="dg-t-a" x="146" y="12" text-anchor="middle" style="font-size:13px">prefix ABAB</text><text class="dg-t-c" x="386" y="12" text-anchor="middle" style="font-size:13px">suffix ABAB</text><text class="dg-t-b" x="458" y="172" text-anchor="middle" style="font-size:13px">π[8] = 4</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>prefix</li><li><span class="dg-swatch c"></span>matching suffix</li></ul><figcaption>π[8] = 4 because the 4-letter prefix ABAB also ends the pattern. After a mismatch past position 8, KMP keeps those 4 matched letters instead of starting over.</figcaption></figure>

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

## 4. Other string algorithms worth knowing

- **Boyer–Moore:** compares from the **right** end of the pattern and can skip large parts of the text; very fast in practice (used by `grep`).
- **Z-algorithm:** computes, for each position, the longest substring starting there that matches a prefix. Linear time, similar uses to KMP.
- **Aho–Corasick:** matches many patterns at once using a trie with failure links.
- **Suffix arrays and suffix trees:** preprocess the text so that any pattern can be searched in $O(m \log n)$ or $O(m)$.

## Summary

- Naive: $O((n - m + 1)m)$; worst case on repetitive text.
- Rabin–Karp: rolling hash mod a prime; expected $O(n + m)$, worst $O(nm)$ with many spurious hits.
- Prefix function $\pi[i]$: longest proper prefix of $P[0..i]$ that is also its suffix; computed in $O(m)$.
- KMP search: on mismatch fall back to $\pi[q - 1]$; the text index never decreases; $O(n + m)$.
- Boyer–Moore (fast in practice), Z-algorithm, Aho–Corasick (many patterns), suffix arrays and trees.

## Check yourself

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
