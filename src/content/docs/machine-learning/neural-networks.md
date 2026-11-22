---
title: Neural Networks
description: The perceptron and its learning rule, linear separability and XOR, activation functions, multilayer networks and forward propagation, loss functions, backpropagation and gradient descent, and practical training issues.
sidebar:
  label: "7. Neural networks"
  order: 7
lesson:
  module: Neural networks
  prerequisites:
    - label: Regression
      link: /machine-learning/regression/
  outcomes:
    - Compute a perceptron's output and apply the perceptron learning rule
    - Explain why a single perceptron can't learn XOR and how hidden layers fix it
    - Compare the common activation functions
    - Describe forward propagation and backpropagation
  keyIdea: >-
    A neuron computes a weighted sum of its inputs and passes it through an **activation function**. A single perceptron can only draw a straight line, so it cannot learn XOR; stacking neurons in **hidden layers** with non-linear activations lets a network approximate almost any function. **Backpropagation** computes the gradients that gradient descent needs to train it.
---

## 1. The perceptron

A **perceptron** (Rosenblatt, 1958) computes

$$
y = \begin{cases} 1 & \text{if } \sum_i w_i x_i + b \ge 0 \\ 0 & \text{otherwise} \end{cases}
$$

It draws a straight line (a hyperplane) through the input space.

**Logic gates.** With $w_1 = w_2 = 1$:

| Gate | Bias $b$ | Fires when |
|---|---|---|
| AND | −1.5 | $x_1 + x_2 \ge 1.5$: both inputs are 1 |
| OR | −0.5 | $x_1 + x_2 \ge 0.5$: at least one input is 1 |

### The perceptron learning rule

For each training example with target $t$ and output $y$:

$$
w_i \leftarrow w_i + \eta\,(t - y)\,x_i \qquad b \leftarrow b + \eta\,(t - y)
$$

where $\eta$ is the learning rate. If the prediction is right, $t - y = 0$ and nothing changes; if it is wrong, the weights move towards the correct answer.

**Example step.** Weights $w_1 = 0$, $w_2 = 0$, $b = 0$, $\eta = 1$. Training on input $(1, 1)$ with target 0 for some function: output $y = 1$ (since $0 \ge 0$), error $t - y = -1$, so $w_1 = -1$, $w_2 = -1$, $b = -1$.

**Perceptron convergence theorem:** if the data is **linearly separable**, the rule finds a separating line in a finite number of steps.

### The XOR problem

XOR outputs 1 when exactly one input is 1: points $(0, 1)$ and $(1, 0)$ are class 1; $(0, 0)$ and $(1, 1)$ are class 0. **No single straight line separates them**, so no single perceptron can learn XOR (Minsky and Papert, 1969). This contributed to the first "AI winter".

**The fix:** a hidden layer. For example, XOR = AND(OR($x_1$, $x_2$), NAND($x_1$, $x_2$)): two hidden neurons (OR and NAND) feeding an AND output neuron.

## 2. Activation functions

Without a non-linear activation, any stack of layers is just one linear function. Common choices:

| Activation | Formula | Range | Notes |
|---|---|---|---|
| Step | 1 if $z \ge 0$, else 0 | {0, 1} | Original perceptron; no useful gradient |
| **Sigmoid** | $\dfrac{1}{1 + e^{-z}}$ | (0, 1) | Probabilities (binary output); saturates, causing vanishing gradients |
| tanh | $\dfrac{e^z - e^{-z}}{e^z + e^{-z}}$ | (−1, 1) | Zero-centred; still saturates |
| **ReLU** | $\max(0, z)$ | [0, ∞) | **Default for hidden layers**: fast, avoids saturation for $z > 0$; neurons can "die" at 0 |
| Leaky ReLU | $\max(0.01z, z)$ | (−∞, ∞) | Fixes dying ReLUs |
| **Softmax** | $\dfrac{e^{z_i}}{\sum_j e^{z_j}}$ | (0, 1), summing to 1 | Output layer for multi-class classification |

## 3. Multilayer networks

A **multilayer perceptron (MLP)** has an **input layer**, one or more **hidden layers** and an **output layer**; every neuron in one layer connects to every neuron in the next (**fully connected**, or dense).

**Forward propagation:** for each layer $l$,

$$
\mathbf{z}^{(l)} = W^{(l)} \mathbf{a}^{(l-1)} + \mathbf{b}^{(l)} \qquad \mathbf{a}^{(l)} = g(\mathbf{z}^{(l)})
$$

where $\mathbf{a}^{(0)}$ is the input and $g$ the activation function.

**Universal approximation theorem:** a network with one hidden layer of enough neurons can approximate any continuous function as closely as desired. Deeper networks often need far fewer neurons to represent the same function.

**Counting parameters.** A layer with 784 inputs and 128 neurons has $784 \times 128$ weights plus 128 biases = 100,480 parameters.

## 4. Loss functions

| Task | Output layer | Loss |
|---|---|---|
| Regression | Linear (no activation) | Mean squared error |
| Binary classification | Sigmoid | Binary cross-entropy |
| Multi-class classification | Softmax | Categorical cross-entropy: $-\sum_c y_c \log \hat{y}_c$ |

## 5. Backpropagation

Training minimises the loss with [gradient descent](/machine-learning/regression/#3-gradient-descent). **Backpropagation** computes the gradient of the loss with respect to **every** weight efficiently, using the **chain rule**:

1. **Forward pass:** compute every layer's outputs and the loss.
2. **Backward pass:** starting at the output, compute each layer's error term $\delta$, passing it back through the weights to the previous layer. For the output layer, $\delta = \frac{\partial L}{\partial a} \cdot g'(z)$; for a hidden layer, $\delta^{(l)} = (W^{(l+1)})^\top \delta^{(l+1)} \odot g'(\mathbf{z}^{(l)})$.
3. **Gradients:** $\dfrac{\partial L}{\partial W^{(l)}} = \delta^{(l)} (\mathbf{a}^{(l-1)})^\top$.
4. **Update:** $W \leftarrow W - \eta \dfrac{\partial L}{\partial W}$.

One pass over the whole training set is an **epoch**; training usually takes many epochs, using mini-batches.

## 6. Training problems and fixes

| Problem | Cause | Fixes |
|---|---|---|
| **Vanishing gradients** | Gradients shrink as they pass back through many layers (especially with sigmoid/tanh) | ReLU, careful initialisation (He, Xavier), batch normalisation, residual connections |
| Exploding gradients | Gradients grow without bound | Gradient clipping, careful initialisation |
| **Overfitting** | Too many parameters for the data | Dropout, L2 regularisation (weight decay), early stopping, data augmentation, more data |
| Slow or unstable convergence | Poor learning rate, badly scaled inputs | Normalise inputs; adaptive optimisers (momentum, RMSProp, **Adam**); learning-rate schedules |

**Weights must not all start equal**: identical neurons would get identical gradients and stay identical (the symmetry problem), so they are initialised with small random values.

## Summary

- A perceptron thresholds a weighted sum; its learning rule $w \leftarrow w + \eta(t - y)x$ converges on linearly separable data.
- XOR is not linearly separable, so it needs a hidden layer.
- Non-linear activations (ReLU in hidden layers; sigmoid or softmax at the output) give networks their power.
- Forward propagation computes $\mathbf{a}^{(l)} = g(W^{(l)}\mathbf{a}^{(l-1)} + \mathbf{b}^{(l)})$; backpropagation applies the chain rule backwards to get every gradient.
- Fix vanishing gradients with ReLU and good initialisation, and overfitting with dropout, regularisation and early stopping.

## Check yourself

<details>
<summary>Why can't a single-layer perceptron learn XOR?</summary>

A single perceptron's decision boundary is a straight line, and XOR's positive points (0,1) and (1,0) can't be separated from (0,0) and (1,1) by any straight line.
</details>

<details>
<summary>Why do neural networks need non-linear activation functions?</summary>

Composing linear functions gives another linear function, so without non-linearities a deep network would be no more powerful than a single linear layer.
</details>

<details>
<summary>How many parameters does a dense layer with 100 inputs and 10 outputs have?</summary>

$100 \times 10 = 1000$ weights plus 10 biases: 1010.
</details>
