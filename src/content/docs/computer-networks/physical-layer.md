---
title: Physical Layer
description: Analog and digital signals, bandwidth, the Nyquist and Shannon capacity limits, line coding (NRZ, Manchester), transmission media, and multiplexing (FDM, TDM, WDM).
sidebar:
  label: "2. Physical layer"
  order: 2
lesson:
  module: Physical and data link layers
  prerequisites:
    - label: Models and performance
      link: /computer-networks/network-models/
  outcomes:
    - Compute channel capacity with the Nyquist and Shannon formulas
    - Encode a bit string with NRZ and Manchester coding
    - Compare guided and unguided media, and FDM with TDM
  keyIdea: >-
    The physical layer turns bits into signals. Two formulas set the limits. **Nyquist** gives the maximum bit rate of a noiseless channel from its bandwidth and number of signal levels, and **Shannon** gives the absolute maximum of a noisy channel from its bandwidth and signal-to-noise ratio.
---

## 1. Signals and bandwidth

- **Analog** signals vary continuously; **digital** signals take a few discrete levels.
- A periodic signal has a **frequency** $f$ (cycles per second, Hz) and **period** $T = 1/f$.
- **Bandwidth** has two meanings: in signals, the range of frequencies a channel passes (Hz); in networking, the data rate (bits per second).

Signals weaken (**attenuation**), change shape (**distortion**) and pick up **noise** as they travel. Signal strength ratios are measured in **decibels**: $\text{dB} = 10 \log_{10}(P_2 / P_1)$.

## 2. Channel capacity

**Nyquist (noiseless channel).** With bandwidth $B$ Hz and $L$ signal levels:

$$
C = 2B \log_2 L \text{ bits per second}
$$

**Example.** A 3,000 Hz channel with 4 levels: $2 \times 3000 \times \log_2 4 = 12{,}000$ bps.

More levels give more bits per signal, but levels closer together are harder to tell apart when there is noise.

**Shannon (noisy channel).** With signal-to-noise ratio $\text{SNR}$ (as a plain ratio, not dB):

$$
C = B \log_2 (1 + \text{SNR})
$$

**Example.** A 3,000 Hz line with SNR = 30 dB. First convert: $30 \text{ dB} = 10^{30/10} = 1000$. Then

$$
C = 3000 \log_2 (1001) \approx 3000 \times 9.97 \approx 29.9 \text{ kbps}
$$

No coding scheme can beat the Shannon limit. In practice, use Shannon to find the upper limit, then Nyquist to find how many levels are needed to approach it.

:::caution[Convert dB first]
$\text{SNR}_{\text{dB}} = 10 \log_{10} \text{SNR}$, so $\text{SNR} = 10^{\text{dB}/10}$. Putting 30 straight into Shannon's formula is the most common mistake.
:::

## 3. Line coding

Line coding represents bits as voltage levels on a wire.

| Scheme | Rule | Pros | Cons |
|---|---|---|---|
| **NRZ-L** | High = 1, low = 0 | Simple | Long runs of the same bit lose clock sync |
| **NRZ-I** | Invert the level at each 1; stay for 0 | Runs of 1s are fine | Runs of 0s still lose sync |
| **Manchester** | Every bit has a transition in the middle: low→high = 1, high→low = 0 (IEEE convention) | Self-clocking; used in 10 Mbps Ethernet | Needs twice the bandwidth |
| Differential Manchester | Always a mid-bit transition; a transition at the **start** means 0 | Self-clocking; polarity doesn't matter | Twice the bandwidth |

Faster links use block coding such as **4B/5B** (each 4 bits sent as 5, chosen so there are never long runs without a transition) together with simpler line codes.

## 4. Transmission media

| Medium | Type | Notes |
|---|---|---|
| Twisted pair (Cat 5e, Cat 6) | Guided | Cheap; twisting cancels interference; up to about 100 m per run |
| Coaxial cable | Guided | Better shielding; cable TV and older Ethernet |
| **Optical fibre** | Guided | Light pulses; huge bandwidth, very low loss, immune to electrical interference; single-mode for long distance, multimode for short |
| Radio and microwave | Unguided | Wi-Fi, cellular; line-of-sight for microwave |
| Satellite | Unguided | Wide coverage; geostationary satellites add about 250 ms of propagation delay each way |

## 5. Multiplexing

**Multiplexing** lets several signals share one link.

- **FDM (frequency division):** each signal gets its own frequency band, all transmitted at once. Radio and cable TV.
- **TDM (time division):** each signal gets the whole bandwidth in turns, in time slots. Synchronous TDM gives fixed slots even when idle; statistical TDM assigns slots on demand.
- **WDM (wavelength division):** FDM for light: different colours on one fibre.
- **CDMA (code division):** every user transmits on the same frequency at the same time, with a unique code to separate them. Used in older cellular networks.

## Summary

- Nyquist: $C = 2B \log_2 L$ for a noiseless channel. Shannon: $C = B \log_2(1 + \text{SNR})$, the hard limit for a noisy channel.
- Convert decibels to a ratio with $10^{\text{dB}/10}$ before using Shannon's formula.
- Manchester coding is self-clocking but doubles the bandwidth needed.
- Fibre offers the most bandwidth and the least interference; FDM splits frequency, TDM splits time.

## Check yourself

<details>
<summary>How many signal levels are needed to send 64 kbps over a noiseless 8 kHz channel?</summary>

$64000 = 2 \times 8000 \times \log_2 L$, so $\log_2 L = 4$ and $L = 16$.
</details>

<details>
<summary>What is the Shannon capacity of a 1 MHz channel with SNR = 63?</summary>

$10^6 \times \log_2 64 = 6$ Mbps.
</details>

<details>
<summary>Why does Manchester coding need twice the bandwidth of NRZ?</summary>

It can change level twice per bit (at the middle, and possibly at the boundary), so the signal changes up to twice as fast.
</details>
