---
title: Machine Learning Cheat Sheet
description: One-page revision of ML basics, regression, classifiers, decision trees and ensembles, evaluation metrics, clustering, PCA, neural networks and deep learning.
sidebar:
  label: "9. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [Basics](/machine-learning/ml-basics/)

- Supervised (labels: classification or regression), unsupervised (structure), reinforcement (rewards).
- Train / validation (tune hyperparameters) / test (report once). k-fold cross-validation.
- Underfitting = high bias; overfitting = high variance. Error = bias² + variance + noise.

## [Regression](/machine-learning/regression/)

- Least squares: $w = \sum(x - \bar{x})(y - \bar{y}) / \sum(x - \bar{x})^2$, $b = \bar{y} - w\bar{x}$.
- Gradient descent: $w \leftarrow w - \alpha\, \partial J / \partial w$; mini-batch is standard.
- Ridge (L2) shrinks weights; lasso (L1) zeroes some (feature selection).
- Logistic regression: $\hat{p} = \sigma(\mathbf{w}^\top\mathbf{x} + b)$, linear boundary, cross-entropy loss.

## [Classifiers](/machine-learning/classification/) and [trees](/machine-learning/decision-trees/)

- k-NN: majority of $k$ nearest; scale features; small $k$ overfits.
- Naive Bayes: $P(C)\prod P(x_i \mid C)$; Laplace smoothing.
- SVM: maximum margin; support vectors; $C$ controls the soft margin; kernels (RBF) for non-linear boundaries.
- Entropy $H = -\sum p\log_2 p$ (9 yes / 5 no → 0.940); gain = $H$(parent) − weighted $H$(children). Gini $= 1 - \sum p^2$.
- Random forest: bagging + random feature subsets (reduces variance). Boosting: sequential, fixes errors (reduces bias).

## [Evaluation](/machine-learning/evaluation/)

- Precision = TP/(TP + FP); recall = TP/(TP + FN); F1 = 2PR/(P + R).
- Imbalanced data: accuracy misleads; use precision, recall, F1, AUC.
- ROC: TPR vs FPR across thresholds; AUC 0.5 random, 1.0 perfect.
- Regression: MAE, MSE, RMSE, $R^2$.

## [Unsupervised learning](/machine-learning/unsupervised-learning/)

- k-means: assign to the nearest centroid, recompute means, repeat; needs $k$ (elbow, silhouette).
- Hierarchical: merge the closest clusters → dendrogram; single, complete, average or Ward linkage.
- DBSCAN: core, border and noise points; any shape; no $k$.
- PCA: standardise → covariance → top eigenvectors; keep about 95% of the variance.
- Apriori: support, confidence $= \text{supp}(A \cup B)/\text{supp}(A)$, lift.

## [Neural networks](/machine-learning/neural-networks/) and [deep learning](/machine-learning/deep-learning/)

- Perceptron rule: $w \leftarrow w + \eta(t - y)x$. XOR needs a hidden layer.
- ReLU for hidden layers; sigmoid (binary) or softmax (multi-class) at the output.
- Backpropagation = chain rule backwards. Vanishing gradients → ReLU, good initialisation, batch norm, residuals.
- Conv output $= \lfloor (W - F + 2P)/S \rfloor + 1$; parameters $= K(F^2C + 1)$.
- LSTM gates: forget, input, output. Attention: $\text{softmax}(QK^\top/\sqrt{d_k})V$.

## Top viva questions

1. Supervised vs unsupervised learning, with examples.
2. What are overfitting and underfitting, and how do you fix each?
3. Explain the bias–variance trade-off.
4. Why do we need validation and test sets? What is cross-validation?
5. How does gradient descent work? What does the learning rate do?
6. L1 vs L2 regularisation.
7. Compute information gain for a split.
8. Bagging vs boosting.
9. Precision vs recall: when does each matter? Why is accuracy misleading?
10. Explain k-means and its weaknesses.
11. Why can't a perceptron learn XOR? What does backpropagation do?
12. Why are CNNs good for images? What is attention?
