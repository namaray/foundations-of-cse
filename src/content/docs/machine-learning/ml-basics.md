---
title: Machine Learning Basics
description: What machine learning is, supervised, unsupervised and reinforcement learning, features and labels, training, validation and test sets, overfitting and underfitting, the bias–variance trade-off, cross-validation, and the typical ML workflow.
sidebar:
  label: "1. ML basics"
  order: 1
lesson:
  module: Foundations
  outcomes:
    - Classify a problem as supervised, unsupervised or reinforcement learning, and as classification or regression
    - Explain why data is split into training, validation and test sets
    - Diagnose overfitting and underfitting and say how to fix each
    - Explain the bias–variance trade-off and k-fold cross-validation
  keyIdea: >-
    A model learns from training data, but what matters is how well it **generalises** to new data. Too simple a model **underfits** (high bias); too complex a model memorises noise and **overfits** (high variance). Held-out validation and test data, and cross-validation, measure generalisation honestly.
---

## 1. What is machine learning?

Tom Mitchell's definition: a program **learns** from experience $E$ with respect to a task $T$ and performance measure $P$ if its performance at $T$, measured by $P$, improves with $E$.

**Example:** a spam filter. $T$ = classify emails, $P$ = the percentage classified correctly, $E$ = a set of emails labelled spam or not spam.

Use ML when the rules are too complex to write by hand (recognising faces), when they change (fraud patterns), or when the data is too large for people to analyse.

## 2. Types of learning

| Type | Data | Goal | Examples |
|---|---|---|---|
| **Supervised** | Inputs with known **labels** | Learn to predict the label of new inputs | Spam detection, house prices, diagnosis |
| **Unsupervised** | Inputs only, no labels | Find structure | Customer segmentation (clustering), dimensionality reduction, anomaly detection |
| **Reinforcement** | Rewards from interacting with an environment | Learn a policy that maximises long-term reward | Game playing, robotics |
| Semi-supervised | A few labelled and many unlabelled examples | Use both | Labelling large image collections |
| Self-supervised | Labels created from the data itself | Learn representations | Predicting the next word (language models) |

Supervised learning splits further:

- **Classification:** the label is a **category** (spam or not; digit 0–9).
- **Regression:** the label is a **number** (price, temperature).

## 3. Data vocabulary

- **Example / instance / sample:** one row of data.
- **Features (attributes, inputs) $x$:** the measured properties, such as size, location and age of a house.
- **Label (target, output) $y$:** what we want to predict, such as the price.
- **Model / hypothesis $h$:** the learned function from features to labels.
- **Feature engineering:** creating useful features; **feature scaling** (standardising to mean 0 and standard deviation 1, or min–max scaling to [0, 1]) matters for distance-based and gradient-based methods.

## 4. Training, validation and test sets

| Set | Typical share | Used to |
|---|---|---|
| **Training** | 60–80% | Fit the model's parameters |
| **Validation** | 10–20% | Choose **hyperparameters** (settings chosen before training, such as $k$ in k-NN or tree depth) and compare models |
| **Test** | 10–20% | Estimate final performance **once**, at the very end |

Using the test set to make decisions **leaks** information and gives an over-optimistic estimate. Data leakage of any kind (features that wouldn't be available at prediction time, or test data influencing training) is one of the most common mistakes in practice.

## 5. Overfitting and underfitting

| | Underfitting | Good fit | Overfitting |
|---|---|---|---|
| Training error | High | Low | **Very low** |
| Test error | High | Low | **High** |
| Model | Too simple | Right complexity | Too complex: memorises noise |
| Example | A straight line through curved data | A gentle curve | A wiggly curve through every point |

**Fixing overfitting:** get more data, use a simpler model, add **regularisation**, select fewer features, stop training earlier, use dropout (neural networks), or average many models (ensembles).

**Fixing underfitting:** use a more complex model, add features, reduce regularisation, train longer.

## 6. The bias–variance trade-off

The expected prediction error splits into

$$
\text{Error} = \text{Bias}^2 + \text{Variance} + \text{Irreducible noise}
$$

- **Bias:** error from wrong assumptions; the model is systematically off. High bias → underfitting.
- **Variance:** error from sensitivity to the particular training set; the model changes a lot with different data. High variance → overfitting.

Making a model more complex lowers bias but raises variance. The best model balances the two. More training data mainly helps reduce variance.

## 7. Cross-validation

With limited data, a single validation split is noisy. **$k$-fold cross-validation**:

1. Split the data into $k$ equal folds (often $k = 5$ or 10).
2. For each fold: train on the other $k - 1$ folds and validate on this one.
3. Average the $k$ validation scores.

Every example is used for validation exactly once. **Stratified** cross-validation keeps class proportions the same in each fold. **Leave-one-out** is the extreme case $k = n$.

## 8. The ML workflow

1. Define the problem and the success metric.
2. Collect and explore the data.
3. Clean it (missing values, outliers, duplicates) and engineer features.
4. Split it into training, validation and test sets.
5. Train candidate models; tune hyperparameters with validation or cross-validation.
6. Evaluate the final model on the test set ([evaluation metrics](/machine-learning/evaluation/)).
7. Deploy, monitor, and retrain as the data changes over time.

**No free lunch theorem:** no single algorithm is best for every problem, so try several.

## Summary

- Supervised learning uses labelled data (classification for categories, regression for numbers); unsupervised finds structure; reinforcement learns from rewards.
- Train on the training set, tune on the validation set, report once on the test set.
- Underfitting: high bias, poor even on training data. Overfitting: high variance, great on training but poor on test data.
- Error = bias² + variance + noise; complexity trades one for the other.
- $k$-fold cross-validation gives a more reliable estimate from limited data.

## Check yourself

<details>
<summary>Predicting tomorrow's temperature is which kind of problem? Grouping news articles by topic without labels?</summary>

Temperature: supervised regression. Grouping articles without labels: unsupervised clustering.
</details>

<details>
<summary>A model scores 99% on training data and 70% on test data. What is wrong, and what could you do?</summary>

It is overfitting (high variance). Simplify the model, regularise it, get more data, or use fewer features.
</details>

<details>
<summary>Why shouldn't you tune hyperparameters on the test set?</summary>

The test set would then influence the model, so its score would no longer be an unbiased estimate of performance on new data.
</details>
