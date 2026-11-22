---
title: Clustering and Dimensionality Reduction
description: k-means with a worked example, choosing k (elbow method, silhouette), k-medoids, hierarchical clustering and dendrograms, DBSCAN, principal component analysis, and association rules with Apriori.
sidebar:
  label: "6. Unsupervised learning"
  order: 6
lesson:
  module: Unsupervised learning
  prerequisites:
    - label: ML basics
      link: /machine-learning/ml-basics/
  outcomes:
    - Run k-means by hand and explain its weaknesses
    - Choose k with the elbow method or silhouette score
    - Compare k-means, hierarchical clustering and DBSCAN
    - Explain what PCA does and how many components to keep
  keyIdea: >-
    Unsupervised learning finds structure in unlabelled data. **Clustering** groups similar points: k-means by nearest centroid, hierarchical clustering by repeatedly merging, DBSCAN by density. **PCA** compresses data onto the few directions that capture most of its variance.
---

## 1. k-means clustering

Partition the data into $k$ clusters, each represented by its **centroid** (mean).

1. Choose $k$ initial centroids (for example, $k$ random points).
2. **Assign** each point to its nearest centroid.
3. **Update** each centroid to the mean of the points assigned to it.
4. Repeat steps 2–3 until the assignments stop changing.

It minimises the **within-cluster sum of squares** (inertia): $\sum_{\text{clusters}} \sum_{x \in C_j} \lVert x - \mu_j \rVert^2$.

### Worked example

1-D points: **1, 2, 3, 8, 9, 10**, with $k = 2$ and initial centroids $c_1 = 1$, $c_2 = 2$.

| Iteration | Cluster 1 | Cluster 2 | New centroids |
|---|---|---|---|
| 1 | {1} (only 1 is nearer to 1 than to 2) | {2, 3, 8, 9, 10} | $c_1 = 1$, $c_2 = 32/5 = 6.4$ |
| 2 | {1, 2, 3} (each is nearer to 1 than to 6.4) | {8, 9, 10} | $c_1 = 2$, $c_2 = 9$ |
| 3 | {1, 2, 3} | {8, 9, 10} | unchanged: **converged** |

**Properties:**

- Fast: $O(nkdt)$ for $n$ points, $d$ dimensions and $t$ iterations.
- Always converges, but possibly to a **local** optimum that depends on the starting centroids. Run it several times, or use **k-means++** initialisation (spread the initial centroids apart).
- Assumes roughly **spherical**, similar-sized clusters; struggles with elongated or nested shapes.
- Sensitive to **outliers** (a mean is pulled by extreme values) and needs feature scaling.
- You must choose $k$.

**k-medoids (PAM)** uses actual data points (**medoids**) as cluster centres and can use any distance. It is more robust to outliers but slower.

## 2. Choosing k

- **Elbow method:** plot inertia against $k$. Inertia always falls as $k$ grows; pick the "elbow", where adding clusters stops helping much.
- **Silhouette score:** for each point, $s = \dfrac{b - a}{\max(a, b)}$, where $a$ is its average distance to points in its own cluster and $b$ its average distance to points in the nearest other cluster. $s$ ranges from −1 to 1; choose the $k$ with the highest average silhouette.

## 3. Hierarchical clustering

**Agglomerative** (bottom-up):

1. Start with every point as its own cluster.
2. Repeatedly **merge the two closest clusters**.
3. Stop when one cluster remains.

The result is a **dendrogram**, a tree of merges; cutting it at a chosen height gives any number of clusters, so $k$ doesn't need to be chosen in advance.

**Linkage** defines the distance between clusters:

| Linkage | Distance between clusters | Tends to give |
|---|---|---|
| **Single** | Closest pair of points | Long, chain-like clusters |
| **Complete** | Farthest pair of points | Compact clusters |
| **Average** | Average over all pairs | A compromise |
| **Ward** | Increase in within-cluster variance | Compact, similar-sized clusters |

Cost: $O(n^2)$ memory and at least $O(n^2)$ time, so it is suited to small and medium data sets. **Divisive** clustering works top-down instead.

## 4. DBSCAN

**Density-based** clustering with two parameters: a radius $\varepsilon$ and a minimum number of points **MinPts**.

- A **core point** has at least MinPts points within distance $\varepsilon$.
- A **border point** is within $\varepsilon$ of a core point but is not core itself.
- A **noise point** is neither.

Clusters grow from core points through chains of neighbouring core points.

- **No need to choose $k$**; finds **arbitrarily shaped** clusters; marks outliers as noise.
- Struggles when clusters have very different densities, and is sensitive to $\varepsilon$ and MinPts.

| | k-means | Hierarchical | DBSCAN |
|---|---|---|---|
| Choose $k$? | Yes | No (cut the dendrogram) | No |
| Cluster shapes | Spherical | Depends on linkage | Arbitrary |
| Handles outliers | Poorly | Moderately | **Yes** (noise) |
| Scalability | Very good | Poor | Good with spatial indexes |

## 5. Principal component analysis (PCA)

High-dimensional data is hard to visualise, slow to process, and suffers from the curse of dimensionality. **PCA** projects the data onto a few new axes, the **principal components**, which:

- are directions of **maximum variance**,
- are **uncorrelated** (orthogonal) to one another,
- are ordered: the first captures the most variance, the second the most of what remains, and so on.

**Steps:**

1. **Standardise** each feature (mean 0, standard deviation 1).
2. Compute the **covariance matrix**.
3. Find its **eigenvectors** (the component directions) and **eigenvalues** (the variance along each). See [eigenvalues in linear algebra](/linear-algebra/).
4. Sort by eigenvalue and keep the top $k$ eigenvectors.
5. Project the data onto them.

**How many components?** Keep enough to explain, say, 95% of the total variance: the **explained variance ratio** of component $i$ is $\lambda_i / \sum_j \lambda_j$.

**Example.** If the eigenvalues are 4.0, 1.5, 0.3 and 0.2 (total 6.0), the first two components explain $(4.0 + 1.5)/6.0 \approx 92\%$ of the variance, so 4 features can be reduced to 2 with little loss.

PCA is linear and unsupervised (it ignores labels). **t-SNE** and **UMAP** are non-linear methods used mainly for visualisation.

## 6. Association rules

Find items that occur together, as in market-basket analysis ("customers who buy bread and butter often buy milk").

For a rule $A \Rightarrow B$:

$$
\text{support} = P(A \cup B) \qquad \text{confidence} = P(B \mid A) = \frac{\text{support}(A \cup B)}{\text{support}(A)} \qquad \text{lift} = \frac{\text{confidence}}{\text{support}(B)}
$$

(Here $A \cup B$ means transactions containing **all** items of $A$ and $B$.) A lift above 1 means the items occur together more than by chance.

The **Apriori** algorithm finds frequent itemsets using the **Apriori property**: every subset of a frequent itemset is also frequent, so candidates containing an infrequent subset are pruned. It generates candidates level by level (1 item, 2 items, …), then builds rules from the frequent itemsets that meet a minimum confidence.

## Summary

- k-means alternates assigning points to the nearest centroid and recomputing centroids; it needs $k$, likes spherical clusters, and depends on initialisation.
- Choose $k$ with the elbow method or the silhouette score.
- Agglomerative clustering merges the closest clusters and produces a dendrogram; linkage defines "closest".
- DBSCAN finds dense regions of any shape and labels outliers as noise.
- PCA keeps the top eigenvectors of the covariance matrix, the directions of greatest variance.
- Association rules use support, confidence and lift; Apriori prunes with the rule that subsets of frequent itemsets are frequent.

## Check yourself

<details>
<summary>Why might k-means give different results on different runs?</summary>

It starts from randomly chosen centroids and converges to a local optimum, which depends on that start. k-means++ initialisation and multiple restarts reduce the problem.
</details>

<details>
<summary>Which clustering method would you use for crescent-shaped clusters with some outliers?</summary>

DBSCAN: it follows dense regions of any shape and labels outliers as noise, whereas k-means assumes round clusters.
</details>

<details>
<summary>Why should data be standardised before PCA?</summary>

PCA looks for directions of maximum variance. Without standardising, features with large units (such as income in taka) dominate simply because their numbers are bigger.
</details>
