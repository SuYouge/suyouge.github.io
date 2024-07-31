---
title: isogeometric_element_01
date: 2024-07-31 18:23:01
tags:
mathjax: true
---

# 等参单元思想

## 1. 资源

1. [Tongji-civil engineering任老师的slide](http://www.renxiaodan.com/userfiles/files/course/FEM/Lecture%205.pdf)
2. [ETH-Institute of Structural Engineering的slide](https://ethz.ch/content/dam/ethz/special-interest/baug/ibk/structural-mechanics-dam/education/femI/lecture4.pdf)

## 2. 要点

* 目标是**将局部坐标系下的规则单元同整体坐标系下的网格划分通过坐标变换联系起来**，这个变换被称为**shape function**

* 同时也要考虑geometric node和displacement representation之间的变换，这个变换同样用**shape function**表示
  * sub parametric representations（几何表示的节点数量少于位移表示）
  * isoparametric representations（几何表示的节点数量等于位移表示）
  * super parametric representations（几何表示的节点数量多于位移表示）

## 3. 其他

ETH的教程里有两个例子

1. 1D，Bar element
   1. geometric：$x = \frac{1}{2} (1-r)x_1 + \frac{1}{2} (1+r)x_2$
   2. displacement：$u = \frac{1}{2} (1-r)\hat{u}_1 + \frac{1}{2} (1+r)\hat{u}_2$

2. 2D，Triangular element

## 4. Shape Function的选择

一般形式如下
$$
u(x) = \sum_iH_i(x)u_i=\boldsymbol{H}u
$$
其中

- $u(x)$为待研究的变量，例如此处的displacement field
- $\boldsymbol{H}(x)$为shape function matrix

在FEM中通常这个函数是多项式形式的，一般有一下三种

1. Lagrange
2. Serendipity
3. Hermitian