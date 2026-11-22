---
title: Linear and Logistic Regression
description: Simple and multiple linear regression with a worked least-squares fit, the mean squared error cost, gradient descent and the learning rate, polynomial regression, regularisation (ridge and lasso), and logistic regression with the sigmoid function and cross-entropy loss.
sidebar:
  label: "2. Regression"
  order: 2
lesson:
  module: Supervised learning
  prerequisites:
    - label: ML basics
      link: /machine-learning/ml-basics/
  outcomes:
    - Fit a simple linear regression line by least squares
    - Explain how gradient descent minimises a cost function, and the role of the learning rate
    - Explain how L1 and L2 regularisation reduce overfitting
    - Use logistic regression for binary classification
  keyIdea: >-
    Linear regression fits $\hat{y} = w x + b$ by minimising the **mean squared error**, either in closed form or with **gradient descent**, which repeatedly steps the parameters downhill. **Logistic regression** passes the same linear combination through a **sigmoid** to get a probability, turning it into a classifier.
---

## 1. Simple linear regression

Model a numeric target as a straight line:

$$
\hat{y} = w x + b
$$

Choose $w$ (slope) and $b$ (intercept) to minimise the **mean squared error**:

$$
J(w, b) = \frac{1}{n}\sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

**Least-squares solution:**

$$
w = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2} \qquad b = \bar{y} - w\bar{x}
$$

**Worked example.** Points $(1, 2)$, $(2, 3)$, $(3, 5)$.

- $\bar{x} = 2$, $\bar{y} = 10/3 \approx 3.33$.
- Numerator: $(-1)(-\tfrac{4}{3}) + (0)(-\tfrac{1}{3}) + (1)(\tfrac{5}{3}) = \tfrac{4}{3} + \tfrac{5}{3} = 3$.
- Denominator: $1 + 0 + 1 = 2$.
- $w = 3/2 = 1.5$, and $b = 10/3 - 1.5 \times 2 = 1/3 \approx 0.33$.

$$
\hat{y} = 1.5x + 0.33
$$

For $x = 4$ the model predicts $6.33$.

**Goodness of fit:** $R^2 = 1 - \dfrac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$, the fraction of variance explained (1 is perfect, 0 is no better than predicting the mean).

## 2. Multiple linear regression

With several features:

$$
\hat{y} = w_1 x_1 + w_2 x_2 + \dots + w_d x_d + b = \mathbf{w}^\top \mathbf{x} + b
$$

The closed-form solution is the **normal equation** $\mathbf{w} = (X^\top X)^{-1} X^\top \mathbf{y}$, which becomes slow when there are very many features ($O(d^3)$), so large problems use gradient descent.

## 3. Gradient descent

Start with some parameters and repeatedly move them a small step **against the gradient** (the direction of steepest increase of the cost):

$$
w \leftarrow w - \alpha \frac{\partial J}{\partial w} \qquad b \leftarrow b - \alpha \frac{\partial J}{\partial b}
$$

For MSE: $\dfrac{\partial J}{\partial w} = -\dfrac{2}{n}\sum (y_i - \hat{y}_i) x_i$ and $\dfrac{\partial J}{\partial b} = -\dfrac{2}{n}\sum (y_i - \hat{y}_i)$.

The **learning rate** $\alpha$ matters:

| $\alpha$ | Effect |
|---|---|
| Too small | Converges very slowly |
| Too large | Overshoots the minimum, oscillates or diverges |
| Well chosen | Converges steadily |

| Variant | Gradient computed from | Notes |
|---|---|---|
| **Batch** | All training examples | Smooth but slow per step |
| **Stochastic (SGD)** | One example at a time | Fast, noisy steps; can escape shallow minima |
| **Mini-batch** | Small batches (32–256) | The standard choice; efficient on GPUs |

MSE for linear regression is **convex** (bowl-shaped), so gradient descent finds the global minimum. Feature scaling makes it converge much faster.

## 4. Polynomial regression

Fit curves by adding powers of the features as new features: $\hat{y} = w_1 x + w_2 x^2 + w_3 x^3 + b$. The model is still **linear in the weights**, so the same methods apply. Higher degrees fit training data better but overfit more easily.

## 5. Regularisation

Add a penalty on large weights to the cost, which discourages overly complex models:

| Method | Penalty | Effect |
|---|---|---|
| **Ridge** (L2) | $\lambda \sum w_j^2$ | Shrinks all weights towards zero |
| **Lasso** (L1) | $\lambda \sum \lvert w_j \rvert$ | Can make some weights exactly zero, so it also **selects features** |
| Elastic net | Both | A mix |

The strength $\lambda$ is a hyperparameter: $\lambda = 0$ gives ordinary regression; a very large $\lambda$ forces underfitting. Choose it with cross-validation.

## 6. Logistic regression

For **binary classification** ($y \in \{0, 1\}$), pass the linear combination through the **sigmoid** function:

$$
\hat{p} = \sigma(z) = \frac{1}{1 + e^{-z}}, \qquad z = \mathbf{w}^\top \mathbf{x} + b
$$

The sigmoid maps any number to (0, 1), interpreted as $P(y = 1 \mid \mathbf{x})$. Predict class 1 if $\hat{p} \ge 0.5$, that is, if $z \ge 0$. So the **decision boundary** $\mathbf{w}^\top \mathbf{x} + b = 0$ is linear.

**Example.** With $z = 2x - 4$: at $x = 3$, $z = 2$ and $\hat{p} = 1/(1 + e^{-2}) \approx 0.88$, so predict class 1. The boundary is at $x = 2$.

**Cost: binary cross-entropy (log loss).**

$$
J = -\frac{1}{n}\sum_{i=1}^{n} \Big[ y_i \log \hat{p}_i + (1 - y_i)\log(1 - \hat{p}_i) \Big]
$$

It heavily penalises confident wrong predictions. MSE is not used, because with the sigmoid it is not convex. There is no closed form; train with gradient descent (the cost is convex).

**More than two classes:** **one-vs-rest** (one classifier per class) or **softmax** regression, which generalises the sigmoid to give a probability for each class.

Despite its name, logistic regression is a **classification** method.

## Summary

- Linear regression fits $\hat{y} = wx + b$ by minimising MSE; least squares gives $w = \sum(x - \bar{x})(y - \bar{y}) / \sum(x - \bar{x})^2$.
- Gradient descent updates $w \leftarrow w - \alpha\, \partial J/\partial w$; the learning rate must be neither too small nor too large; mini-batch is standard.
- Polynomial features allow curves; ridge (L2) and lasso (L1) regularisation reduce overfitting, and lasso also selects features.
- Logistic regression outputs $\sigma(\mathbf{w}^\top \mathbf{x} + b)$, has a linear decision boundary and is trained with cross-entropy.

## Check yourself

<details>
<summary>What happens if the learning rate is too large?</summary>

Each step overshoots the minimum, so the cost oscillates or even grows (diverges) instead of decreasing.
</details>

<details>
<summary>Which regularisation can remove features entirely, and why is that useful?</summary>

Lasso (L1). It can drive weights exactly to zero, producing a simpler, more interpretable model that uses only the most useful features.
</details>

<details>
<summary>Why is logistic regression called regression if it classifies?</summary>

It regresses (fits) the log-odds of the positive class as a linear function of the features; the resulting probability is then thresholded to classify.
</details>
