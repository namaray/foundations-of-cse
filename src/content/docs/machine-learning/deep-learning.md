---
title: Deep Learning
description: Why depth helps, convolutional neural networks (convolution, padding, stride, pooling, output-size calculation), recurrent networks and LSTMs, attention and transformers, training techniques, transfer learning, and generative models.
sidebar:
  label: "8. Deep learning"
  order: 8
lesson:
  module: Neural networks
  prerequisites:
    - label: Neural networks
      link: /machine-learning/neural-networks/
  outcomes:
    - Compute the output size of a convolutional layer
    - Explain why CNNs suit images and RNNs suit sequences
    - Explain how attention and transformers work at a high level
    - Describe transfer learning and the main training techniques
  keyIdea: >-
    Deep learning uses networks with many layers that learn their own features from raw data. **CNNs** share small filters across an image to detect local patterns; **RNNs** and LSTMs carry a memory along a sequence; **transformers** use **attention** to relate every position to every other in parallel, and now power large language models.
---

## 1. Why deep?

Classical ML relies on hand-designed features. Deep networks **learn a hierarchy of features** from raw data: in images, early layers detect edges, middle layers detect textures and parts, and later layers detect whole objects. Deep learning took off around 2012 thanks to large data sets (ImageNet), GPUs, and better training techniques (ReLU, dropout, better initialisation).

## 2. Convolutional neural networks (CNNs)

A fully connected layer on a 224 × 224 × 3 image would need about 150,000 weights **per neuron**. CNNs instead use small **filters** (kernels, such as 3 × 3) that slide across the image:

- **Local connectivity:** each output looks only at a small patch.
- **Weight sharing:** the same filter is used at every position, so a pattern is detected wherever it appears (translation equivariance), with very few parameters.

### Convolution layer

A filter computes a weighted sum over each patch, producing a **feature map**. A layer with $K$ filters produces $K$ feature maps.

**Output size** for input width $W$, filter size $F$, padding $P$ and stride $S$:

$$
\text{output} = \left\lfloor \frac{W - F + 2P}{S} \right\rfloor + 1
$$

**Examples.**

- $32 \times 32$ input, $5 \times 5$ filter, no padding, stride 1: $(32 - 5)/1 + 1 = 28$, so $28 \times 28$.
- Same input with "same" padding $P = 2$: $(32 - 5 + 4)/1 + 1 = 32$, keeping the size.
- $224$ input, $7 \times 7$ filter, $P = 3$, stride 2: $\lfloor (224 - 7 + 6)/2 \rfloor + 1 = 112$.

**Parameters:** a conv layer with $K$ filters of size $F \times F$ on $C$ input channels has $K(F \cdot F \cdot C + 1)$ parameters. For 64 filters of $3 \times 3$ on 3 channels: $64 \times (27 + 1) = 1792$, far fewer than a dense layer.

### Pooling

**Max pooling** (typically $2 \times 2$, stride 2) keeps the largest value in each window, halving the width and height. It reduces computation and gives some tolerance to small shifts. **Average pooling** takes the mean; **global average pooling** collapses each feature map to one number before the classifier.

**Typical architecture:** [conv → ReLU → (conv → ReLU) → pool] repeated, then flatten → dense layers → softmax. Landmark CNNs: LeNet (1998), AlexNet (2012), VGG, GoogLeNet, **ResNet** (2015, whose **skip connections** made networks with 100+ layers trainable).

**Uses:** image classification, object detection (YOLO, Faster R-CNN), segmentation (U-Net), medical imaging, and also audio and some text tasks.

## 3. Recurrent neural networks (RNNs)

For **sequences** (text, speech, time series), an RNN processes one element at a time, keeping a **hidden state** that carries information forward:

$$
\mathbf{h}_t = \tanh(W_h \mathbf{h}_{t-1} + W_x \mathbf{x}_t + \mathbf{b})
$$

The same weights are used at every time step. Training uses **backpropagation through time**.

**Problem:** gradients vanish (or explode) over long sequences, so plain RNNs forget long-range dependencies.

**LSTM** (long short-term memory) adds a **cell state** with three **gates**: the **forget** gate (what to discard), the **input** gate (what new information to store) and the **output** gate (what to output). Information can flow along the cell state for many steps, solving the long-term dependency problem. **GRUs** are a simpler variant with two gates.

**Sequence-to-sequence** models (an encoder RNN reads the input, a decoder RNN writes the output) were used for machine translation.

## 4. Attention and transformers

**Attention** lets a model look directly at **every** position of the input when producing each output, weighting the relevant ones, instead of squeezing everything through one hidden state.

**Scaled dot-product attention:** each position produces a **query** $Q$, a **key** $K$ and a **value** $V$:

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V
$$

Each output is a weighted average of the values, with weights given by how well the query matches each key.

The **transformer** ("Attention Is All You Need", 2017) uses **self-attention** (every position attends to every other in the same sequence) with **multiple heads**, plus feed-forward layers, residual connections, layer normalisation and **positional encodings** (since attention itself ignores order).

| | RNN / LSTM | Transformer |
|---|---|---|
| Processing | Sequential, one step at a time | **All positions in parallel** |
| Long-range dependencies | Hard (information passes through many steps) | Direct (any two positions are one step apart) |
| Training speed on GPUs | Slow | Fast |
| Cost in sequence length $n$ | $O(n)$ steps | $O(n^2)$ attention |

Transformers underlie **BERT** (an encoder, for understanding tasks), **GPT** and Claude (decoders, generating text one token at a time), and **Vision Transformers** for images.

## 5. Training techniques

- **Batch normalisation:** normalise each layer's inputs over the mini-batch; speeds up and stabilises training. (**Layer normalisation** is used in transformers.)
- **Dropout:** randomly switch off a fraction of neurons during training, so the network can't rely on any single one; a strong regulariser.
- **Data augmentation:** create varied training examples by flipping, cropping, rotating or recolouring images.
- **Optimisers:** SGD with momentum, and **Adam** (adaptive learning rates per parameter), the usual default.
- **Early stopping:** stop when validation loss stops improving.

## 6. Transfer learning

Train a large model on a huge data set (such as ImageNet, or a large text corpus), then **reuse** it for a new task with little data:

- **Feature extraction:** freeze the pretrained layers and train only a new output layer.
- **Fine-tuning:** also continue training some or all of the pretrained layers with a small learning rate.

This is how most practical deep learning is done today: start from a pretrained model rather than from scratch.

## 7. Generative models

- **Autoencoders:** compress the input to a small code and reconstruct it; used for dimensionality reduction, denoising and anomaly detection. **Variational autoencoders** (VAEs) can generate new samples.
- **GANs** (generative adversarial networks): a **generator** creates fake samples and a **discriminator** tries to tell them from real ones; they improve by competing.
- **Diffusion models:** learn to reverse a gradual noising process; they power modern image generators.
- **Large language models:** transformers trained to predict the next token on vast text, then fine-tuned (for example with reinforcement learning from human feedback) to follow instructions.

## Summary

- Deep networks learn hierarchical features from raw data.
- CNNs use shared filters and pooling; output size $= \lfloor (W - F + 2P)/S \rfloor + 1$; parameters $= K(F^2C + 1)$.
- RNNs carry a hidden state through sequences but suffer vanishing gradients; LSTMs fix this with gates.
- Transformers use self-attention, $\text{softmax}(QK^\top/\sqrt{d_k})V$, processing all positions in parallel; they power modern language models.
- Batch normalisation, dropout, augmentation and Adam make training work; transfer learning reuses pretrained models.

## Check yourself

<details>
<summary>A 64 × 64 input passes through a 3 × 3 convolution with padding 1 and stride 1, then 2 × 2 max pooling with stride 2. What is the output size?</summary>

Convolution: $(64 - 3 + 2)/1 + 1 = 64$. Pooling halves it: $32 \times 32$.
</details>

<details>
<summary>Why are CNNs better than fully connected networks for images?</summary>

Weight sharing and local connectivity use far fewer parameters, and detect the same pattern anywhere in the image, matching the spatial structure of images.
</details>

<details>
<summary>What advantage do transformers have over RNNs?</summary>

They process all positions of a sequence in parallel (much faster training on GPUs) and connect any two positions directly through attention, so long-range dependencies are easier to learn.
</details>
