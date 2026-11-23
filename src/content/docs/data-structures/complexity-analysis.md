---
title: Complexity Analysis
description: Asymptotic notation (Big-O, Omega, Theta), growth rates, best/worst/average case, amortized analysis and space complexity.
sidebar:
  label: "1. Complexity analysis"
  order: 1
lesson:
  module: Foundations
  outcomes:
    - Define $O$, $\Omega$ and $\Theta$ and prove a bound with explicit constants
    - Order the common growth rates from slowest to fastest
    - Find the running time of loops and nested loops
    - Explain best, worst, average and amortized cost
  keyIdea: >-
    We compare algorithms by how their cost **grows** with input size $n$, ignoring constants. $O$ is an upper bound, $\Omega$ a lower bound and $\Theta$ a tight bound. **Amortized** analysis averages a sequence of operations, which is why a dynamic array append is $O(1)$ even though resizing is expensive.
---

Complexity analysis measures how the **running time** or **memory** of an algorithm grows as the input size $n$ grows. We ignore constant factors and machine details and compare *growth rates*.

## 1. Asymptotic notation

Let $f(n)$ be the cost of an algorithm and $g(n)$ a simple comparison function.

| Notation | Meaning | Formal definition |
|---|---|---|
| $f(n) = O(g(n))$ | Upper bound: grows **no faster** than $g$ | $\exists\, c > 0, n_0$ such that $0 \le f(n) \le c\,g(n)$ for all $n \ge n_0$ |
| $f(n) = \Omega(g(n))$ | Lower bound: grows **at least as fast** as $g$ | $\exists\, c > 0, n_0$ such that $f(n) \ge c\,g(n) \ge 0$ for all $n \ge n_0$ |
| $f(n) = \Theta(g(n))$ | Tight bound: grows **at the same rate** | $f(n) = O(g(n))$ **and** $f(n) = \Omega(g(n))$ |
| $f(n) = o(g(n))$ | Strictly slower | $\lim_{n\to\infty} f(n)/g(n) = 0$ |
| $f(n) = \omega(g(n))$ | Strictly faster | $\lim_{n\to\infty} f(n)/g(n) = \infty$ |

**Worked example.** Show that $f(n) = 3n^2 + 5n + 2$ is $\Theta(n^2)$.

- Upper bound: for $n \ge 1$, $3n^2 + 5n + 2 \le 3n^2 + 5n^2 + 2n^2 = 10n^2$. So $c = 10$, $n_0 = 1$ gives $O(n^2)$.
- Lower bound: $3n^2 + 5n + 2 \ge 3n^2$ for all $n \ge 1$. So $c = 3$, $n_0 = 1$ gives $\Omega(n^2)$.

:::tip[Rule of thumb]
Keep the fastest-growing term and drop its coefficient: $7n^3 + 100n^2 \log n + 10^6 = \Theta(n^3)$.
:::

## 2. Common growth rates

From slowest to fastest growing:

$$
1 < \log n < \sqrt{n} < n < n \log n < n^2 < n^3 < 2^n < n! < n^n
$$

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 500 310" role="img" aria-labelledby="growth-t"><title id="growth-t">Growth of log n, n, n log n, n squared and 2 to the n for n from 1 to 16: 2 to the n and n squared shoot up first.</title><defs><marker id="ah-growth" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-growth-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-growth-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="60" y1="270" x2="470" y2="270"/><line class="dg-line" x1="60" y1="270" x2="60" y2="20"/><line class="dg-line" x1="60" y1="210" x2="460" y2="210" stroke-dasharray="5 4"/><line class="dg-line" x1="60" y1="150" x2="460" y2="150" stroke-dasharray="5 4"/><line class="dg-line" x1="60" y1="90" x2="460" y2="90" stroke-dasharray="5 4"/><line class="dg-line" x1="60" y1="30" x2="460" y2="30" stroke-dasharray="5 4"/><path class="dg-line" d="M85.0,270.0 L86.2,269.7 L87.5,269.5 L88.8,269.2 L90.0,269.0 L91.2,268.8 L92.5,268.6 L93.8,268.4 L95.0,268.2 L96.2,268.0 L97.5,267.8 L98.8,267.6 L100.0,267.5 L101.3,267.3 L102.5,267.1 L103.8,267.0 L105.0,266.8 L106.3,266.7 L107.5,266.5 L108.8,266.4 L110.0,266.2 L111.3,266.1 L112.5,266.0 L113.8,265.9 L115.0,265.7 L116.2,265.6 L117.5,265.5 L118.8,265.4 L120.0,265.3 L121.2,265.2 L122.5,265.0 L123.7,264.9 L125.0,264.8 L126.2,264.7 L127.5,264.6 L128.7,264.5 L130.0,264.4 L131.2,264.3 L132.5,264.2 L133.7,264.1 L135.0,264.1 L136.2,264.0 L137.5,263.9 L138.7,263.8 L140.0,263.7 L141.2,263.6 L142.5,263.5 L143.7,263.5 L145.0,263.4 L146.2,263.3 L147.5,263.2 L148.7,263.1 L150.0,263.1 L151.2,263.0 L152.5,262.9 L153.7,262.8 L155.0,262.8 L156.2,262.7 L157.5,262.6 L158.7,262.6 L160.0,262.5 L161.2,262.4 L162.5,262.4 L163.7,262.3 L165.0,262.2 L166.2,262.2 L167.5,262.1 L168.7,262.0 L170.0,262.0 L171.2,261.9 L172.5,261.9 L173.7,261.8 L175.0,261.7 L176.2,261.7 L177.5,261.6 L178.7,261.6 L180.0,261.5 L181.2,261.5 L182.5,261.4 L183.7,261.3 L185.0,261.3 L186.2,261.2 L187.5,261.2 L188.7,261.1 L190.0,261.1 L191.2,261.0 L192.5,261.0 L193.7,260.9 L195.0,260.9 L196.2,260.8 L197.5,260.8 L198.7,260.7 L200.0,260.7 L201.2,260.6 L202.5,260.6 L203.7,260.5 L205.0,260.5 L206.2,260.4 L207.5,260.4 L208.7,260.4 L210.0,260.3 L211.2,260.3 L212.5,260.2 L213.7,260.2 L215.0,260.1 L216.2,260.1 L217.5,260.0 L218.7,260.0 L220.0,260.0 L221.2,259.9 L222.5,259.9 L223.7,259.8 L225.0,259.8 L226.2,259.7 L227.5,259.7 L228.7,259.7 L230.0,259.6 L231.2,259.6 L232.5,259.6 L233.7,259.5 L235.0,259.5 L236.2,259.4 L237.5,259.4 L238.7,259.4 L240.0,259.3 L241.2,259.3 L242.5,259.2 L243.7,259.2 L245.0,259.2 L246.2,259.1 L247.5,259.1 L248.7,259.1 L250.0,259.0 L251.2,259.0 L252.5,259.0 L253.7,258.9 L255.0,258.9 L256.2,258.9 L257.5,258.8 L258.7,258.8 L260.0,258.8 L261.2,258.7 L262.5,258.7 L263.7,258.6 L265.0,258.6 L266.2,258.6 L267.5,258.6 L268.7,258.5 L270.0,258.5 L271.2,258.5 L272.5,258.4 L273.7,258.4 L275.0,258.4 L276.2,258.3 L277.5,258.3 L278.7,258.3 L280.0,258.2 L281.2,258.2 L282.5,258.2 L283.7,258.1 L285.0,258.1 L286.2,258.1 L287.5,258.1 L288.7,258.0 L290.0,258.0 L291.2,258.0 L292.5,257.9 L293.7,257.9 L295.0,257.9 L296.2,257.8 L297.5,257.8 L298.8,257.8 L300.0,257.8 L301.3,257.7 L302.5,257.7 L303.8,257.7 L305.0,257.7 L306.3,257.6 L307.5,257.6 L308.8,257.6 L310.0,257.5 L311.3,257.5 L312.5,257.5 L313.8,257.5 L315.0,257.4 L316.3,257.4 L317.5,257.4 L318.8,257.4 L320.0,257.3 L321.3,257.3 L322.5,257.3 L323.8,257.3 L325.0,257.2 L326.3,257.2 L327.5,257.2 L328.8,257.2 L330.0,257.1 L331.3,257.1 L332.5,257.1 L333.8,257.1 L335.0,257.0 L336.3,257.0 L337.5,257.0 L338.8,257.0 L340.0,256.9 L341.3,256.9 L342.5,256.9 L343.8,256.9 L345.0,256.8 L346.3,256.8 L347.5,256.8 L348.8,256.8 L350.0,256.7 L351.3,256.7 L352.5,256.7 L353.8,256.7 L355.0,256.6 L356.3,256.6 L357.5,256.6 L358.8,256.6 L360.0,256.6 L361.3,256.5 L362.5,256.5 L363.8,256.5 L365.0,256.5 L366.3,256.4 L367.5,256.4 L368.8,256.4 L370.0,256.4 L371.3,256.4 L372.5,256.3 L373.8,256.3 L375.0,256.3 L376.3,256.3 L377.5,256.2 L378.8,256.2 L380.0,256.2 L381.3,256.2 L382.5,256.2 L383.8,256.1 L385.0,256.1 L386.3,256.1 L387.5,256.1 L388.8,256.1 L390.0,256.0 L391.3,256.0 L392.5,256.0 L393.8,256.0 L395.0,256.0 L396.3,255.9 L397.5,255.9 L398.8,255.9 L400.0,255.9 L401.3,255.9 L402.5,255.8 L403.8,255.8 L405.0,255.8 L406.3,255.8 L407.5,255.8 L408.8,255.7 L410.0,255.7 L411.3,255.7 L412.5,255.7 L413.8,255.7 L415.0,255.6 L416.3,255.6 L417.5,255.6 L418.8,255.6 L420.0,255.6 L421.3,255.6 L422.5,255.5 L423.8,255.5 L425.0,255.5 L426.3,255.5 L427.5,255.5 L428.8,255.4 L430.0,255.4 L431.3,255.4 L432.5,255.4 L433.8,255.4 L435.0,255.3 L436.3,255.3 L437.5,255.3 L438.8,255.3 L440.0,255.3 L441.3,255.3 L442.5,255.2 L443.8,255.2 L445.0,255.2 L446.3,255.2 L447.5,255.2 L448.8,255.2 L450.0,255.1 L451.3,255.1 L452.5,255.1 L453.8,255.1 L455.0,255.1 L456.3,255.1 L457.5,255.0 L458.8,255.0 L460.0,255.0"/><path class="dg-line" d="M85.0,266.2 L86.2,266.1 L87.5,265.9 L88.8,265.7 L90.0,265.5 L91.2,265.3 L92.5,265.1 L93.8,264.9 L95.0,264.8 L96.2,264.6 L97.5,264.4 L98.8,264.2 L100.0,264.0 L101.3,263.8 L102.5,263.6 L103.8,263.4 L105.0,263.2 L106.3,263.1 L107.5,262.9 L108.8,262.7 L110.0,262.5 L111.3,262.3 L112.5,262.1 L113.8,261.9 L115.0,261.8 L116.2,261.6 L117.5,261.4 L118.8,261.2 L120.0,261.0 L121.2,260.8 L122.5,260.6 L123.7,260.4 L125.0,260.2 L126.2,260.1 L127.5,259.9 L128.7,259.7 L130.0,259.5 L131.2,259.3 L132.5,259.1 L133.7,258.9 L135.0,258.8 L136.2,258.6 L137.5,258.4 L138.7,258.2 L140.0,258.0 L141.2,257.8 L142.5,257.6 L143.7,257.4 L145.0,257.2 L146.2,257.1 L147.5,256.9 L148.7,256.7 L150.0,256.5 L151.2,256.3 L152.5,256.1 L153.7,255.9 L155.0,255.8 L156.2,255.6 L157.5,255.4 L158.7,255.2 L160.0,255.0 L161.2,254.8 L162.5,254.6 L163.7,254.4 L165.0,254.3 L166.2,254.1 L167.5,253.9 L168.7,253.7 L170.0,253.5 L171.2,253.3 L172.5,253.1 L173.7,252.9 L175.0,252.8 L176.2,252.6 L177.5,252.4 L178.7,252.2 L180.0,252.0 L181.2,251.8 L182.5,251.6 L183.7,251.4 L185.0,251.3 L186.2,251.1 L187.5,250.9 L188.7,250.7 L190.0,250.5 L191.2,250.3 L192.5,250.1 L193.7,249.9 L195.0,249.8 L196.2,249.6 L197.5,249.4 L198.7,249.2 L200.0,249.0 L201.2,248.8 L202.5,248.6 L203.7,248.4 L205.0,248.3 L206.2,248.1 L207.5,247.9 L208.7,247.7 L210.0,247.5 L211.2,247.3 L212.5,247.1 L213.7,246.9 L215.0,246.8 L216.2,246.6 L217.5,246.4 L218.7,246.2 L220.0,246.0 L221.2,245.8 L222.5,245.6 L223.7,245.4 L225.0,245.3 L226.2,245.1 L227.5,244.9 L228.7,244.7 L230.0,244.5 L231.2,244.3 L232.5,244.1 L233.7,243.9 L235.0,243.8 L236.2,243.6 L237.5,243.4 L238.7,243.2 L240.0,243.0 L241.2,242.8 L242.5,242.6 L243.7,242.4 L245.0,242.3 L246.2,242.1 L247.5,241.9 L248.7,241.7 L250.0,241.5 L251.2,241.3 L252.5,241.1 L253.7,240.9 L255.0,240.8 L256.2,240.6 L257.5,240.4 L258.7,240.2 L260.0,240.0 L261.2,239.8 L262.5,239.6 L263.7,239.4 L265.0,239.3 L266.2,239.1 L267.5,238.9 L268.7,238.7 L270.0,238.5 L271.2,238.3 L272.5,238.1 L273.7,237.9 L275.0,237.8 L276.2,237.6 L277.5,237.4 L278.7,237.2 L280.0,237.0 L281.2,236.8 L282.5,236.6 L283.7,236.4 L285.0,236.3 L286.2,236.1 L287.5,235.9 L288.7,235.7 L290.0,235.5 L291.2,235.3 L292.5,235.1 L293.7,234.9 L295.0,234.8 L296.2,234.6 L297.5,234.4 L298.8,234.2 L300.0,234.0 L301.3,233.8 L302.5,233.6 L303.8,233.4 L305.0,233.2 L306.3,233.1 L307.5,232.9 L308.8,232.7 L310.0,232.5 L311.3,232.3 L312.5,232.1 L313.8,231.9 L315.0,231.7 L316.3,231.6 L317.5,231.4 L318.8,231.2 L320.0,231.0 L321.3,230.8 L322.5,230.6 L323.8,230.4 L325.0,230.2 L326.3,230.1 L327.5,229.9 L328.8,229.7 L330.0,229.5 L331.3,229.3 L332.5,229.1 L333.8,228.9 L335.0,228.7 L336.3,228.6 L337.5,228.4 L338.8,228.2 L340.0,228.0 L341.3,227.8 L342.5,227.6 L343.8,227.4 L345.0,227.2 L346.3,227.1 L347.5,226.9 L348.8,226.7 L350.0,226.5 L351.3,226.3 L352.5,226.1 L353.8,225.9 L355.0,225.7 L356.3,225.6 L357.5,225.4 L358.8,225.2 L360.0,225.0 L361.3,224.8 L362.5,224.6 L363.8,224.4 L365.0,224.2 L366.3,224.1 L367.5,223.9 L368.8,223.7 L370.0,223.5 L371.3,223.3 L372.5,223.1 L373.8,222.9 L375.0,222.7 L376.3,222.6 L377.5,222.4 L378.8,222.2 L380.0,222.0 L381.3,221.8 L382.5,221.6 L383.8,221.4 L385.0,221.2 L386.3,221.1 L387.5,220.9 L388.8,220.7 L390.0,220.5 L391.3,220.3 L392.5,220.1 L393.8,219.9 L395.0,219.7 L396.3,219.6 L397.5,219.4 L398.8,219.2 L400.0,219.0 L401.3,218.8 L402.5,218.6 L403.8,218.4 L405.0,218.2 L406.3,218.1 L407.5,217.9 L408.8,217.7 L410.0,217.5 L411.3,217.3 L412.5,217.1 L413.8,216.9 L415.0,216.7 L416.3,216.6 L417.5,216.4 L418.8,216.2 L420.0,216.0 L421.3,215.8 L422.5,215.6 L423.8,215.4 L425.0,215.2 L426.3,215.1 L427.5,214.9 L428.8,214.7 L430.0,214.5 L431.3,214.3 L432.5,214.1 L433.8,213.9 L435.0,213.7 L436.3,213.6 L437.5,213.4 L438.8,213.2 L440.0,213.0 L441.3,212.8 L442.5,212.6 L443.8,212.4 L445.0,212.2 L446.3,212.1 L447.5,211.9 L448.8,211.7 L450.0,211.5 L451.3,211.3 L452.5,211.1 L453.8,210.9 L455.0,210.7 L456.3,210.6 L457.5,210.4 L458.8,210.2 L460.0,210.0" stroke-dasharray="5 4"/><path class="dg-line-a" d="M85.0,270.0 L86.2,269.7 L87.5,269.4 L88.8,269.1 L90.0,268.8 L91.2,268.5 L92.5,268.2 L93.8,267.8 L95.0,267.5 L96.2,267.1 L97.5,266.7 L98.8,266.3 L100.0,265.9 L101.3,265.5 L102.5,265.1 L103.8,264.7 L105.0,264.3 L106.3,263.8 L107.5,263.4 L108.8,263.0 L110.0,262.5 L111.3,262.0 L112.5,261.6 L113.8,261.1 L115.0,260.6 L116.2,260.1 L117.5,259.6 L118.8,259.1 L120.0,258.6 L121.2,258.1 L122.5,257.6 L123.7,257.1 L125.0,256.6 L126.2,256.0 L127.5,255.5 L128.7,254.9 L130.0,254.4 L131.2,253.9 L132.5,253.3 L133.7,252.7 L135.0,252.2 L136.2,251.6 L137.5,251.0 L138.7,250.4 L140.0,249.9 L141.2,249.3 L142.5,248.7 L143.7,248.1 L145.0,247.5 L146.2,246.9 L147.5,246.3 L148.7,245.7 L150.0,245.1 L151.2,244.4 L152.5,243.8 L153.7,243.2 L155.0,242.6 L156.2,241.9 L157.5,241.3 L158.7,240.6 L160.0,240.0 L161.2,239.4 L162.5,238.7 L163.7,238.0 L165.0,237.4 L166.2,236.7 L167.5,236.1 L168.7,235.4 L170.0,234.7 L171.2,234.1 L172.5,233.4 L173.7,232.7 L175.0,232.0 L176.2,231.3 L177.5,230.6 L178.7,230.0 L180.0,229.3 L181.2,228.6 L182.5,227.9 L183.7,227.2 L185.0,226.5 L186.2,225.8 L187.5,225.0 L188.7,224.3 L190.0,223.6 L191.2,222.9 L192.5,222.2 L193.7,221.5 L195.0,220.7 L196.2,220.0 L197.5,219.3 L198.7,218.5 L200.0,217.8 L201.2,217.1 L202.5,216.3 L203.7,215.6 L205.0,214.8 L206.2,214.1 L207.5,213.3 L208.7,212.6 L210.0,211.8 L211.2,211.1 L212.5,210.3 L213.7,209.6 L215.0,208.8 L216.2,208.0 L217.5,207.3 L218.7,206.5 L220.0,205.7 L221.2,205.0 L222.5,204.2 L223.7,203.4 L225.0,202.6 L226.2,201.8 L227.5,201.1 L228.7,200.3 L230.0,199.5 L231.2,198.7 L232.5,197.9 L233.7,197.1 L235.0,196.3 L236.2,195.5 L237.5,194.7 L238.7,193.9 L240.0,193.1 L241.2,192.3 L242.5,191.5 L243.7,190.7 L245.0,189.9 L246.2,189.1 L247.5,188.2 L248.7,187.4 L250.0,186.6 L251.2,185.8 L252.5,185.0 L253.7,184.1 L255.0,183.3 L256.2,182.5 L257.5,181.7 L258.7,180.8 L260.0,180.0 L261.2,179.2 L262.5,178.3 L263.7,177.5 L265.0,176.7 L266.2,175.8 L267.5,175.0 L268.7,174.1 L270.0,173.3 L271.2,172.4 L272.5,171.6 L273.7,170.7 L275.0,169.9 L276.2,169.0 L277.5,168.2 L278.7,167.3 L280.0,166.5 L281.2,165.6 L282.5,164.7 L283.7,163.9 L285.0,163.0 L286.2,162.1 L287.5,161.3 L288.7,160.4 L290.0,159.5 L291.2,158.7 L292.5,157.8 L293.7,156.9 L295.0,156.0 L296.2,155.2 L297.5,154.3 L298.8,153.4 L300.0,152.5 L301.3,151.6 L302.5,150.8 L303.8,149.9 L305.0,149.0 L306.3,148.1 L307.5,147.2 L308.8,146.3 L310.0,145.4 L311.3,144.5 L312.5,143.6 L313.8,142.7 L315.0,141.8 L316.3,140.9 L317.5,140.0 L318.8,139.1 L320.0,138.2 L321.3,137.3 L322.5,136.4 L323.8,135.5 L325.0,134.6 L326.3,133.7 L327.5,132.8 L328.8,131.9 L330.0,131.0 L331.3,130.1 L332.5,129.1 L333.8,128.2 L335.0,127.3 L336.3,126.4 L337.5,125.5 L338.8,124.5 L340.0,123.6 L341.3,122.7 L342.5,121.8 L343.8,120.8 L345.0,119.9 L346.3,119.0 L347.5,118.0 L348.8,117.1 L350.0,116.2 L351.3,115.2 L352.5,114.3 L353.8,113.4 L355.0,112.4 L356.3,111.5 L357.5,110.6 L358.8,109.6 L360.0,108.7 L361.3,107.7 L362.5,106.8 L363.8,105.8 L365.0,104.9 L366.3,103.9 L367.5,103.0 L368.8,102.1 L370.0,101.1 L371.3,100.1 L372.5,99.2 L373.8,98.2 L375.0,97.3 L376.3,96.3 L377.5,95.4 L378.8,94.4 L380.0,93.5 L381.3,92.5 L382.5,91.5 L383.8,90.6 L385.0,89.6 L386.3,88.6 L387.5,87.7 L388.8,86.7 L390.0,85.7 L391.3,84.8 L392.5,83.8 L393.8,82.8 L395.0,81.9 L396.3,80.9 L397.5,79.9 L398.8,78.9 L400.0,78.0 L401.3,77.0 L402.5,76.0 L403.8,75.0 L405.0,74.0 L406.3,73.1 L407.5,72.1 L408.8,71.1 L410.0,70.1 L411.3,69.1 L412.5,68.1 L413.8,67.2 L415.0,66.2 L416.3,65.2 L417.5,64.2 L418.8,63.2 L420.0,62.2 L421.3,61.2 L422.5,60.2 L423.8,59.2 L425.0,58.2 L426.3,57.2 L427.5,56.2 L428.8,55.2 L430.0,54.2 L431.3,53.2 L432.5,52.2 L433.8,51.2 L435.0,50.2 L436.3,49.2 L437.5,48.2 L438.8,47.2 L440.0,46.2 L441.3,45.2 L442.5,44.2 L443.8,43.2 L445.0,42.2 L446.3,41.2 L447.5,40.2 L448.8,39.1 L450.0,38.1 L451.3,37.1 L452.5,36.1 L453.8,35.1 L455.0,34.1 L456.3,33.1 L457.5,32.0 L458.8,31.0 L460.0,30.0"/><path class="dg-line-b" d="M85.0,266.2 L86.2,265.9 L87.5,265.5 L88.8,265.0 L90.0,264.6 L91.2,264.1 L92.5,263.7 L93.8,263.2 L95.0,262.6 L96.2,262.1 L97.5,261.6 L98.8,261.0 L100.0,260.4 L101.3,259.8 L102.5,259.2 L103.8,258.5 L105.0,257.8 L106.3,257.2 L107.5,256.5 L108.8,255.7 L110.0,255.0 L111.3,254.2 L112.5,253.5 L113.8,252.7 L115.0,251.8 L116.2,251.0 L117.5,250.2 L118.8,249.3 L120.0,248.4 L121.2,247.5 L122.5,246.6 L123.7,245.6 L125.0,244.7 L126.2,243.7 L127.5,242.7 L128.7,241.6 L130.0,240.6 L131.2,239.5 L132.5,238.5 L133.7,237.4 L135.0,236.3 L136.2,235.1 L137.5,234.0 L138.7,232.8 L140.0,231.6 L141.2,230.4 L142.5,229.2 L143.7,227.9 L145.0,226.7 L146.2,225.4 L147.5,224.1 L148.7,222.7 L150.0,221.4 L151.2,220.0 L152.5,218.7 L153.7,217.3 L155.0,215.9 L156.2,214.4 L157.5,213.0 L158.7,211.5 L160.0,210.0 L161.2,208.5 L162.5,207.0 L163.7,205.4 L165.0,203.9 L166.2,202.3 L167.5,200.7 L168.7,199.0 L170.0,197.4 L171.2,195.7 L172.5,194.1 L173.7,192.4 L175.0,190.7 L176.2,188.9 L177.5,187.2 L178.7,185.4 L180.0,183.6 L181.2,181.8 L182.5,180.0 L183.7,178.1 L185.0,176.3 L186.2,174.4 L187.5,172.5 L188.7,170.5 L190.0,168.6 L191.2,166.6 L192.5,164.7 L193.7,162.7 L195.0,160.7 L196.2,158.6 L197.5,156.6 L198.7,154.5 L200.0,152.4 L201.2,150.3 L202.5,148.2 L203.7,146.0 L205.0,143.9 L206.2,141.7 L207.5,139.5 L208.7,137.2 L210.0,135.0 L211.2,132.7 L212.5,130.5 L213.7,128.2 L215.0,125.9 L216.2,123.5 L217.5,121.2 L218.7,118.8 L220.0,116.4 L221.2,114.0 L222.5,111.6 L223.7,109.1 L225.0,106.7 L226.2,104.2 L227.5,101.7 L228.7,99.1 L230.0,96.6 L231.2,94.0 L232.5,91.5 L233.7,88.9 L235.0,86.3 L236.2,83.6 L237.5,81.0 L238.7,78.3 L240.0,75.6 L241.2,72.9 L242.5,70.2 L243.7,67.4 L245.0,64.7 L246.2,61.9 L247.5,59.1 L248.7,56.2 L250.0,53.4 L251.2,50.5 L252.5,47.7 L253.7,44.8 L255.0,41.9 L256.2,38.9 L257.5,36.0 L258.7,33.0 L260.0,30.0 L260.0,30.0"/><path class="dg-line-b" d="M85.0,262.5 L86.2,262.2 L87.5,262.0 L88.8,261.7 L90.0,261.4 L91.2,261.1 L92.5,260.8 L93.8,260.4 L95.0,260.1 L96.2,259.8 L97.5,259.4 L98.8,259.0 L100.0,258.6 L101.3,258.2 L102.5,257.8 L103.8,257.4 L105.0,256.9 L106.3,256.5 L107.5,256.0 L108.8,255.5 L110.0,255.0 L111.3,254.5 L112.5,253.9 L113.8,253.4 L115.0,252.8 L116.2,252.2 L117.5,251.5 L118.8,250.9 L120.0,250.2 L121.2,249.5 L122.5,248.8 L123.7,248.0 L125.0,247.3 L126.2,246.5 L127.5,245.6 L128.7,244.8 L130.0,243.9 L131.2,243.0 L132.5,242.0 L133.7,241.0 L135.0,240.0 L136.2,238.9 L137.5,237.8 L138.7,236.7 L140.0,235.5 L141.2,234.3 L142.5,233.1 L143.7,231.8 L145.0,230.4 L146.2,229.0 L147.5,227.6 L148.7,226.1 L150.0,224.5 L151.2,222.9 L152.5,221.3 L153.7,219.5 L155.0,217.8 L156.2,215.9 L157.5,214.0 L158.7,212.0 L160.0,210.0 L161.2,207.9 L162.5,205.7 L163.7,203.4 L165.0,201.1 L166.2,198.6 L167.5,196.1 L168.7,193.5 L170.0,190.8 L171.2,188.0 L172.5,185.1 L173.7,182.2 L175.0,179.1 L176.2,175.8 L177.5,172.5 L178.7,169.1 L180.0,165.5 L181.2,161.8 L182.5,158.0 L183.7,154.1 L185.0,150.0 L186.2,145.8 L187.5,141.4 L188.7,136.9 L190.0,132.2 L191.2,127.3 L192.5,122.3 L193.7,117.1 L195.0,111.7 L196.2,106.1 L197.5,100.3 L198.7,94.3 L200.0,88.1 L201.2,81.7 L202.5,75.1 L203.7,68.2 L205.0,61.1 L206.2,53.7 L207.5,46.1 L208.7,38.2 L210.0,30.0 L210.0,30.0" stroke-dasharray="5 4"/><text class="dg-t-muted" x="50" y="270" text-anchor="end">0</text><text class="dg-t-muted" x="50" y="210" text-anchor="end">16</text><text class="dg-t-muted" x="50" y="150" text-anchor="end">32</text><text class="dg-t-muted" x="50" y="90" text-anchor="end">48</text><text class="dg-t-muted" x="50" y="30" text-anchor="end">64</text><text class="dg-t-muted" x="85" y="286" text-anchor="middle">1</text><text class="dg-t-muted" x="160" y="286" text-anchor="middle">4</text><text class="dg-t-muted" x="260" y="286" text-anchor="middle">8</text><text class="dg-t-muted" x="360" y="286" text-anchor="middle">12</text><text class="dg-t-muted" x="460" y="286" text-anchor="middle">16</text><text class="dg-t-muted" x="260" y="304" text-anchor="middle">input size n</text><text class="dg-t-muted" x="60" y="10">steps</text><text class="dg-t-muted" x="468" y="255">log n</text><text class="dg-t-muted" x="468" y="210">n</text><text class="dg-t-a" x="460" y="20" text-anchor="middle">n log n</text><text class="dg-t-b" x="260" y="20" text-anchor="middle">n²</text><text class="dg-t-b" x="210" y="20" text-anchor="middle">2ⁿ</text></svg><figcaption>Steps against input size. Even at n = 16, 2ⁿ and n² have left the chart while n log n has only reached 64 and log n is still 4.</figcaption></figure>

| Class | Name | Typical example |
|---|---|---|
| $O(1)$ | Constant | Array access `a[i]`, push onto a stack |
| $O(\log n)$ | Logarithmic | Binary search, balanced BST search |
| $O(n)$ | Linear | Linear search, traversing a list |
| $O(n \log n)$ | Linearithmic | Merge sort, heapsort |
| $O(n^2)$ | Quadratic | Bubble sort, comparing all pairs |
| $O(2^n)$ | Exponential | All subsets of a set |
| $O(n!)$ | Factorial | All permutations (brute-force TSP) |

## 3. Counting steps in code

```c
// O(n): the loop body runs n times
for (int i = 0; i < n; i++) sum += a[i];

// O(n^2): n iterations of an O(n) loop
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++) count++;

// O(log n): i doubles each time, so about log2(n) iterations
for (int i = 1; i < n; i *= 2) count++;

// O(n log n): the outer loop runs n times, the inner loop log n times
for (int i = 0; i < n; i++)
    for (int j = 1; j < n; j *= 2) count++;
```

A nested loop where the inner bound depends on the outer index still gives $O(n^2)$:

$$
\sum_{i=0}^{n-1} i = \frac{n(n-1)}{2} = \Theta(n^2)
$$

## 4. Best, worst and average case

The same algorithm can cost different amounts on different inputs of the same size. For **linear search** in an array of $n$ items:

- **Best case:** the key is first. $\Theta(1)$.
- **Worst case:** the key is last or missing. $\Theta(n)$.
- **Average case:** if the key is equally likely to be anywhere, about $n/2$ comparisons. $\Theta(n)$.

Worst-case analysis is the default because it is a guarantee.

:::caution[Common mistake]
Big-O is not the same thing as "worst case". Big-O is a bound on a function; worst case is a choice of input. You can give a Big-O bound for the best case, too.
:::

## 5. Amortized analysis

Amortized analysis averages the cost of a **sequence** of operations, even when a single operation is occasionally expensive. No probability is involved.

**Example: dynamic array append.** When the array is full, allocate double the space and copy everything. Most appends cost 1; an append that triggers a resize costs $k$ copies. Over $n$ appends, the total copying is at most

$$
1 + 2 + 4 + \dots + n < 2n
$$

so the total cost is $O(n)$ and each append is **$O(1)$ amortized**.

The three standard methods are the **aggregate** method (total cost ÷ number of operations, as above), the **accounting** method (overcharge cheap operations and save credit) and the **potential** method (define a potential function on the data structure's state).

## 6. Space complexity

Space complexity counts the **extra** memory an algorithm uses beyond its input.

- Iterative sum of an array: $O(1)$ extra space.
- Merge sort: $O(n)$ for the temporary array.
- Recursive algorithms use stack space proportional to the **recursion depth**. Recursive factorial uses $O(n)$; recursive binary search uses $O(\log n)$.

## Summary

- $O$ = upper bound, $\Omega$ = lower bound, $\Theta$ = both; prove them with constants $c$ and $n_0$.
- Keep the fastest-growing term and drop its coefficient.
- $1 < \log n < \sqrt n < n < n \log n < n^2 < n^3 < 2^n < n!$.
- Worst case is the default guarantee; Big-O is a bound, not a case.
- Amortized cost averages a sequence: doubling a dynamic array gives $O(1)$ per append.
- Space complexity counts extra memory, including the recursion stack.

## Check yourself

<details>
<summary>What is the difference between O, Ω and Θ?</summary>

O is an upper bound, Ω is a lower bound, and Θ is both at once (a tight bound). Saying binary search is $O(n)$ is true but loose; $\Theta(\log n)$ is precise for its worst case.
</details>

<details>
<summary>Why do we ignore constants in asymptotic analysis?</summary>

Constants depend on the machine, compiler and implementation. For large $n$ the growth rate dominates: a $100n$ algorithm beats a $n^2$ one once $n > 100$.
</details>

<details>
<summary>Is an O(n log n) algorithm always faster than an O(n²) one?</summary>

No. Only for large enough $n$. For small inputs, a simple $O(n^2)$ algorithm like insertion sort is often faster because of smaller constants, which is why real sorting libraries switch to insertion sort for small subarrays.
</details>

<details>
<summary>What does amortized O(1) mean?</summary>

Any sequence of $n$ operations costs $O(n)$ in total, so the average per operation is constant, even though a single operation may occasionally cost more.
</details>
