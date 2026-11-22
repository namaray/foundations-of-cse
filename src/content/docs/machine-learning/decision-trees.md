---
title: Decision Trees and Ensembles
description: How decision trees split data, entropy and information gain with a worked example, the Gini index, ID3, C4.5 and CART, overfitting and pruning, and ensemble methods - bagging, random forests and boosting.
sidebar:
  label: "4. Decision trees and ensembles"
  order: 4
lesson:
  module: Supervised learning
  prerequisites:
    - label: k-NN, naive Bayes and SVM
      link: /machine-learning/classification/
  outcomes:
    - Compute entropy and information gain to choose a split
    - Compare entropy, information gain ratio and the Gini index
    - Explain why trees overfit and how pruning helps
    - Explain bagging, random forests and boosting
  keyIdea: >-
    A decision tree asks a sequence of questions about features, choosing at each node the split that makes the groups **purest** (highest **information gain** or lowest **Gini impurity**). Single trees are easy to read but overfit; **ensembles** of many trees (random forests, boosting) are among the most accurate methods for tabular data.
---

## 1. How a tree classifies

Each **internal node** tests a feature ("Outlook?"), each **branch** is an outcome ("sunny"), and each **leaf** gives a class. To classify an example, follow the branches from the root to a leaf.

Trees are built **top-down** and **greedily**: at each node choose the best feature to split on, partition the data, and repeat on each part until the groups are pure (or another stopping rule applies).

## 2. Entropy and information gain

**Entropy** measures the impurity of a set $S$ with class proportions $p_i$:

$$
H(S) = -\sum_i p_i \log_2 p_i
$$

For two classes it is 0 when the set is pure and 1 when the split is 50/50.

**Information gain** is the reduction in entropy from splitting on attribute $A$:

$$
\text{Gain}(S, A) = H(S) - \sum_{v \in \text{values}(A)} \frac{\lvert S_v \rvert}{\lvert S \rvert} H(S_v)
$$

**ID3** chooses the attribute with the **highest information gain**.

### Worked example: the "play tennis" data

14 days: **9 yes, 5 no**.

$$
H(S) = -\tfrac{9}{14}\log_2\tfrac{9}{14} - \tfrac{5}{14}\log_2\tfrac{5}{14} \approx 0.940
$$

**Split on Outlook:**

| Outlook | Yes | No | Entropy |
|---|---|---|---|
| Sunny (5 days) | 2 | 3 | 0.971 |
| Overcast (4 days) | 4 | 0 | 0 (pure) |
| Rain (5 days) | 3 | 2 | 0.971 |

$$
\text{Gain}(\text{Outlook}) = 0.940 - \left(\tfrac{5}{14}(0.971) + \tfrac{4}{14}(0) + \tfrac{5}{14}(0.971)\right) \approx 0.940 - 0.694 = 0.247
$$

The same calculation for the other attributes gives Humidity ≈ 0.152 and Wind ≈ 0.048 (and Temperature ≈ 0.029), so **Outlook becomes the root**. The *overcast* branch is already pure (always "yes"); the other branches are split further using only their own days. (Many textbooks round the Outlook gain to 0.246.)

## 3. Other split criteria

- **Gain ratio (C4.5):** information gain favours attributes with many values (a unique ID would split perfectly but uselessly). Gain ratio divides the gain by the **split information**, $-\sum \frac{\lvert S_v \rvert}{\lvert S \rvert} \log_2 \frac{\lvert S_v \rvert}{\lvert S \rvert}$, to correct for this.
- **Gini index (CART):** $\text{Gini}(S) = 1 - \sum_i p_i^2$. For 9 yes and 5 no: $1 - (0.643^2 + 0.357^2) \approx 0.459$. CART chooses the split with the lowest weighted Gini; it is cheaper to compute than entropy and usually gives similar trees.

| Algorithm | Criterion | Splits | Handles |
|---|---|---|---|
| ID3 | Information gain | Multi-way | Categorical features |
| C4.5 | Gain ratio | Multi-way | Continuous features (thresholds), missing values, pruning |
| CART | Gini (classification), MSE (regression) | **Binary** | Classification and regression |

**Continuous features** are split with thresholds ("Temperature ≤ 22.5?"), trying the midpoints between sorted values.

## 4. Overfitting and pruning

A tree grown until every leaf is pure fits noise in the training data. Controls:

- **Pre-pruning (early stopping):** limit the maximum depth, require a minimum number of samples to split or per leaf, or stop when the gain is too small.
- **Post-pruning:** grow the full tree, then cut back subtrees that don't improve accuracy on validation data (reduced-error pruning) or that aren't worth their complexity (cost-complexity pruning in CART).

**Strengths of trees:** easy to understand and explain, little data preparation (no scaling), handle numeric and categorical features, capture interactions. **Weaknesses:** overfit easily, and are **unstable** (small changes in the data can produce a very different tree).

## 5. Ensembles

An **ensemble** combines many models so that their errors partly cancel out.

### Bagging and random forests

**Bagging** (bootstrap aggregating): train many models, each on a **bootstrap sample** (drawn with replacement, the same size as the training set), then **vote** (classification) or **average** (regression). It mainly reduces **variance**.

A **random forest** is bagging with decision trees, plus extra randomness: at each split, consider only a **random subset of features** (often $\sqrt{d}$ of the $d$ features). This makes the trees less correlated, so averaging helps more.

- Very accurate on tabular data with little tuning; robust to overfitting as more trees are added.
- About a third of the examples are left out of each bootstrap sample (**out-of-bag** examples), giving a free validation estimate.
- Provides **feature importance** scores.

### Boosting

**Boosting** trains models **sequentially**, each focusing on the mistakes of those before it, and combines them with weights. It mainly reduces **bias**.

- **AdaBoost:** after each round, increase the weights of misclassified examples so the next weak learner (often a one-split "stump") concentrates on them.
- **Gradient boosting:** each new tree fits the **residual errors** (the negative gradient of the loss) of the current ensemble. **XGBoost**, **LightGBM** and **CatBoost** are fast, highly tuned implementations that win many competitions on tabular data.

| | Bagging / random forest | Boosting |
|---|---|---|
| Training | Parallel, independent models | Sequential, each corrects the last |
| Mainly reduces | Variance | Bias |
| Overfitting risk | Low | Higher: needs careful tuning (learning rate, number of trees) |
| Sensitivity to noise | Low | Higher |

**Stacking** combines different kinds of models by training a meta-model on their predictions.

## Summary

- Trees split greedily on the feature giving the purest children; entropy $H = -\sum p \log_2 p$, gain = parent entropy − weighted child entropy.
- For the play-tennis data, Outlook has the highest gain (≈ 0.247) and becomes the root.
- C4.5 uses gain ratio to avoid favouring many-valued attributes; CART uses the Gini index and binary splits.
- Trees overfit; limit depth or prune.
- Random forests average many decorrelated trees (reducing variance); boosting adds trees that fix earlier errors (reducing bias).

## Check yourself

<details>
<summary>What is the entropy of a set with 8 positive and 8 negative examples? With 16 positive and 0 negative?</summary>

1 for the 50/50 set (maximum impurity); 0 for the pure set.
</details>

<details>
<summary>Why would information gain favour splitting on a "Student ID" attribute, and how does C4.5 fix that?</summary>

Each ID value identifies one example, so every child is pure and the gain is maximal, but the split is useless for new data. C4.5's gain ratio divides by the split information, which is very large for such an attribute.
</details>

<details>
<summary>How does a random forest differ from plain bagging of decision trees?</summary>

At each split it considers only a random subset of the features, which makes the individual trees more different from one another, so averaging them reduces variance more.
</details>
