---
title: Classification Algorithms
description: k-nearest neighbours with distance measures and choosing k, the naive Bayes classifier with a worked example and smoothing, and support vector machines with margins, soft margins and kernels.
sidebar:
  label: "3. k-NN, naive Bayes and SVM"
  order: 3
lesson:
  module: Supervised learning
  prerequisites:
    - label: Regression
      link: /machine-learning/regression/
  outcomes:
    - Classify a point with k-NN and explain how k affects the result
    - Train and apply a naive Bayes classifier by counting
    - Explain the maximum-margin idea, support vectors and the kernel trick
    - Compare these classifiers' strengths and weaknesses
  keyIdea: >-
    **k-NN** classifies a point by majority vote of its $k$ nearest training points: no training, but slow predictions. **Naive Bayes** applies Bayes' theorem with an independence assumption: fast and strong on text. **SVMs** find the boundary with the widest margin between classes, and use **kernels** to separate data that isn't linearly separable.
---

## 1. k-nearest neighbours (k-NN)

To classify a new point: find the $k$ training points closest to it and take a **majority vote** of their labels (for regression, average their values).

**Distance measures:**

| Distance | Formula |
|---|---|
| **Euclidean** | $\sqrt{\sum (x_i - y_i)^2}$ |
| Manhattan | $\sum \lvert x_i - y_i \rvert$ |
| Minkowski | $\left(\sum \lvert x_i - y_i \rvert^p\right)^{1/p}$ ($p = 1$ Manhattan, $p = 2$ Euclidean) |

**Worked example.** Training points: A $(1, 1)$ red, B $(2, 1)$ red, C $(4, 4)$ blue, D $(5, 4)$ blue, E $(4, 5)$ blue. Classify $P = (2, 2)$ with $k = 3$.

| Point | Distance to $(2, 2)$ |
|---|---|
| A | $\sqrt{1 + 1} \approx 1.41$ |
| B | $\sqrt{0 + 1} = 1$ |
| C | $\sqrt{4 + 4} \approx 2.83$ |
| D | $\sqrt{9 + 4} \approx 3.61$ |
| E | $\sqrt{4 + 9} \approx 3.61$ |

The 3 nearest are B (red), A (red) and C (blue): **red** wins 2 to 1.

**Choosing $k$:** a small $k$ is sensitive to noise (overfits; $k = 1$ copies its nearest neighbour); a large $k$ blurs class boundaries (underfits). Pick $k$ by cross-validation; use an odd $k$ for two classes to avoid ties.

**Properties:**

- A **lazy learner**: "training" just stores the data; all work happens at prediction time, $O(nd)$ per query.
- **Feature scaling is essential**, or features with large ranges dominate the distance.
- Suffers from the **curse of dimensionality**: in many dimensions, all points look roughly equally far apart.

## 2. Naive Bayes

Using [Bayes' theorem](/artificial-intelligence/uncertainty/#3-bayes-theorem) and assuming the features are **independent given the class**:

$$
P(C \mid x_1, \dots, x_n) \propto P(C) \prod_{i} P(x_i \mid C)
$$

Choose the class with the largest product. All the probabilities are estimated by **counting** in the training data.

**Worked example.** Should we play outside? Training counts: 9 "yes" and 5 "no" days.

| Feature value | Count with yes | Count with no |
|---|---|---|
| Outlook = sunny | 2 | 3 |
| Wind = strong | 3 | 3 |

New day: sunny and strong wind.

$$
\begin{aligned}
\text{yes:}&\quad \tfrac{9}{14} \times \tfrac{2}{9} \times \tfrac{3}{9} = 0.643 \times 0.222 \times 0.333 \approx 0.0476 \\
\text{no:}&\quad \tfrac{5}{14} \times \tfrac{3}{5} \times \tfrac{3}{5} = 0.357 \times 0.6 \times 0.6 \approx 0.1286
\end{aligned}
$$

**No** wins. (Normalising, $P(\text{no}) \approx 0.1286 / (0.1286 + 0.0476) \approx 0.73$.)

**Laplace smoothing:** if a feature value never appears with a class, its count is 0 and wipes out the whole product. Add 1 to every count (and the number of possible values to the denominator).

**Variants:** **Gaussian** naive Bayes for continuous features; **multinomial** for word counts (text); **Bernoulli** for binary features.

**Properties:** very fast to train and predict, works with little data, excellent for text classification (spam, sentiment), but its probability estimates are often poorly calibrated because the independence assumption rarely holds.

## 3. Support vector machines (SVM)

For two linearly separable classes, many lines separate them. An SVM picks the one with the **maximum margin**: the widest gap to the nearest points of either class.

- The **decision boundary** is the hyperplane $\mathbf{w}^\top \mathbf{x} + b = 0$.
- **Support vectors** are the training points lying on the margin. Only they determine the boundary; moving other points (without crossing the margin) changes nothing.
- The margin width is $2 / \lVert \mathbf{w} \rVert$, so maximising the margin means minimising $\lVert \mathbf{w} \rVert^2$ subject to every point being on the correct side: a convex optimisation problem with a unique solution.

A wide margin tends to **generalise** better.

### Soft margin

Real data is noisy and overlapping. A **soft-margin** SVM allows some points inside the margin or on the wrong side, with a penalty controlled by the hyperparameter $C$:

- **Large $C$:** few violations allowed → narrow margin, risk of overfitting.
- **Small $C$:** more violations allowed → wider margin, more regularisation.

### The kernel trick

If the classes are not linearly separable, map the data into a higher-dimensional space where they are. A **kernel** $K(\mathbf{x}, \mathbf{z})$ computes dot products in that space without ever computing the mapping explicitly.

| Kernel | $K(\mathbf{x}, \mathbf{z})$ | Notes |
|---|---|---|
| Linear | $\mathbf{x}^\top \mathbf{z}$ | Text and other high-dimensional data |
| Polynomial | $(\mathbf{x}^\top \mathbf{z} + c)^d$ | Feature interactions |
| **RBF (Gaussian)** | $\exp(-\gamma \lVert \mathbf{x} - \mathbf{z} \rVert^2)$ | The common default; very flexible |

**Example:** points inside a circle (one class) and outside it (the other) cannot be split by a line in 2-D, but adding the feature $x_1^2 + x_2^2$ makes them separable by a plane.

## 4. Comparison

| | k-NN | Naive Bayes | SVM | Logistic regression | Decision tree |
|---|---|---|---|---|---|
| Training cost | None | Very low | High for large $n$ | Low | Low |
| Prediction cost | High | Very low | Low (depends on support vectors) | Very low | Very low |
| Needs feature scaling | **Yes** | No | **Yes** | Helps | No |
| Non-linear boundaries | Yes | Limited | Yes (kernels) | No (without extra features) | Yes |
| Interpretability | Moderate | Moderate | Low (with kernels) | High | **High** |
| Good for | Small, low-dimensional data | Text | Medium-sized, high-dimensional data | Baselines, probabilities | Mixed feature types |

[Decision trees and ensembles](/machine-learning/decision-trees/) are covered in the next lesson.

## Summary

- k-NN votes among the $k$ nearest points; scale features; choose $k$ by cross-validation; slow at prediction time.
- Naive Bayes multiplies the prior by per-feature likelihoods counted from data; use Laplace smoothing for zero counts.
- SVMs maximise the margin; support vectors define the boundary; $C$ trades margin width for errors; kernels give non-linear boundaries.

## Check yourself

<details>
<summary>Why must features be scaled before using k-NN?</summary>

Distances are dominated by features with large numeric ranges. Without scaling, a feature measured in thousands (income) would swamp one measured in units (number of children).
</details>

<details>
<summary>What problem does Laplace smoothing solve in naive Bayes?</summary>

A feature value never seen with a class gives a zero probability, which makes the whole product zero regardless of the other evidence. Adding 1 to every count avoids that.
</details>

<details>
<summary>What are support vectors?</summary>

The training points closest to the decision boundary, lying on the margin. They alone determine where the SVM's boundary is.
</details>
