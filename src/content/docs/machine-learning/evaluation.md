---
title: Model Evaluation
description: The confusion matrix, accuracy, precision, recall, specificity and F1 with a worked example, why accuracy misleads on imbalanced data, ROC curves and AUC, precision–recall trade-offs and thresholds, and regression metrics.
sidebar:
  label: "5. Evaluation"
  order: 5
lesson:
  module: Supervised learning
  prerequisites:
    - label: ML basics
      link: /machine-learning/ml-basics/
  outcomes:
    - Build a confusion matrix and compute accuracy, precision, recall and F1
    - Explain why accuracy is misleading for imbalanced classes
    - Read an ROC curve and interpret AUC
    - Choose regression metrics such as MAE, RMSE and R²
  keyIdea: >-
    A single accuracy number hides what kind of mistakes a model makes. The **confusion matrix** separates false positives from false negatives; **precision** asks "of what I flagged, how much was right?", **recall** asks "of what was there, how much did I find?", and **F1** balances the two. Which matters more depends on the cost of each mistake.
---

## 1. The confusion matrix

For a binary classifier ("positive" is the class of interest, such as *has the disease* or *is spam*):

| | Predicted positive | Predicted negative |
|---|---|---|
| **Actually positive** | **TP** (true positive) | **FN** (false negative), a "miss" |
| **Actually negative** | **FP** (false positive), a "false alarm" | **TN** (true negative) |

## 2. Metrics

| Metric | Formula | Question it answers |
|---|---|---|
| **Accuracy** | $\dfrac{TP + TN}{TP + TN + FP + FN}$ | What fraction of all predictions were correct? |
| **Precision** | $\dfrac{TP}{TP + FP}$ | Of the items predicted positive, how many really are? |
| **Recall** (sensitivity, true positive rate) | $\dfrac{TP}{TP + FN}$ | Of the real positives, how many did we find? |
| **Specificity** (true negative rate) | $\dfrac{TN}{TN + FP}$ | Of the real negatives, how many did we correctly reject? |
| **F1 score** | $\dfrac{2 \cdot \text{precision} \cdot \text{recall}}{\text{precision} + \text{recall}}$ | The harmonic mean of precision and recall |

**Worked example.** A classifier tested on 100 cases gives TP = 40, FP = 10, FN = 20, TN = 30.

| Metric | Calculation | Value |
|---|---|---|
| Accuracy | $(40 + 30)/100$ | 0.70 |
| Precision | $40/(40 + 10)$ | 0.80 |
| Recall | $40/(40 + 20)$ | 0.667 |
| Specificity | $30/(30 + 10)$ | 0.75 |
| F1 | $2(0.8)(0.667)/(0.8 + 0.667)$ | 0.727 |

The harmonic mean punishes imbalance: a model with precision 1.0 and recall 0.1 has F1 ≈ 0.18, not the 0.55 an ordinary average would suggest.

## 3. Which metric matters?

| Situation | Costly mistake | Prioritise |
|---|---|---|
| Cancer screening | Missing a sick patient (FN) | **Recall** |
| Spam filter | Losing a real email in spam (FP) | **Precision** |
| Fraud detection | Both, with rare positives | Recall at an acceptable precision; F1 or PR-AUC |
| Search results | Irrelevant results at the top | Precision (at the top $k$) |

### The accuracy trap

If 1% of transactions are fraudulent, a model that **always** says "not fraud" is **99% accurate** and completely useless: its recall is 0. With **imbalanced classes**, report precision, recall, F1 or AUC instead. Remedies for imbalance include resampling (oversampling the minority class, for example with SMOTE, or undersampling the majority), class weights, and choosing a suitable threshold.

## 4. Thresholds, ROC and AUC

Most classifiers output a score or probability; a **threshold** turns it into a class. Lowering the threshold catches more positives (higher recall) but raises more false alarms (lower precision). This is the **precision–recall trade-off**.

The **ROC curve** plots the **true positive rate** (recall) against the **false positive rate** ($FP / (FP + TN) = 1 -$ specificity) for every threshold.

- A random classifier lies on the diagonal.
- A perfect classifier goes straight up the left side to the top-left corner.

**AUC** (area under the ROC curve) summarises it: 1.0 is perfect, 0.5 is random guessing. It equals the probability that the model scores a random positive higher than a random negative, and it doesn't depend on any one threshold.

For heavily imbalanced data, the **precision–recall curve** and its area are often more informative than ROC.

## 5. Multi-class problems

Build a $k \times k$ confusion matrix, compute precision and recall **per class** (that class against the rest), then average:

- **Macro average:** the simple mean over classes (every class counts equally).
- **Weighted average:** weighted by each class's size.
- **Micro average:** pool all TP, FP and FN first (for single-label problems this equals accuracy).

## 6. Regression metrics

| Metric | Formula | Notes |
|---|---|---|
| **MAE** | $\frac{1}{n}\sum \lvert y_i - \hat{y}_i \rvert$ | Average error in the target's units; robust to outliers |
| **MSE** | $\frac{1}{n}\sum (y_i - \hat{y}_i)^2$ | Penalises large errors heavily |
| **RMSE** | $\sqrt{\text{MSE}}$ | In the target's units, but still sensitive to large errors |
| **$R^2$** | $1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$ | Fraction of variance explained; 1 is perfect, 0 means no better than the mean |

**Example.** Predictions 3, 5, 8 for true values 2, 5, 10: errors 1, 0, −2. MAE = 1.0; MSE = $(1 + 0 + 4)/3 \approx 1.67$; RMSE ≈ 1.29.

## Summary

- Confusion matrix: TP, FP (false alarm), FN (miss), TN.
- Precision = TP/(TP + FP); recall = TP/(TP + FN); F1 = harmonic mean of the two.
- Accuracy misleads on imbalanced data; choose the metric by which mistake costs more.
- The ROC curve plots TPR against FPR across thresholds; AUC 1.0 is perfect, 0.5 random.
- Regression: MAE, MSE, RMSE and $R^2$.

## Check yourself

<details>
<summary>A disease test has 90 TP, 10 FN, 50 FP and 850 TN. What are its recall and precision?</summary>

Recall = 90/100 = 0.90. Precision = 90/140 ≈ 0.64.
</details>

<details>
<summary>Why use the harmonic mean for F1 instead of the ordinary average?</summary>

The harmonic mean stays low if either precision or recall is low, so a model can't hide a terrible recall behind a perfect precision (or vice versa).
</details>

<details>
<summary>What does an AUC of 0.5 mean?</summary>

The model ranks positives and negatives no better than random guessing.
</details>
