---
title: 日志模板
description: 一篇用于验证文字、图片、公式、脚注、Excalidraw 与 JavaScript 的示例日志。
pubDate: 2026-09-02
updatedDate: 2026-09-02
heroImage: ../../assets/Greek_philosopher_busts.jpg
heroImageAlt: 古希腊哲学家半身像
tags:
  - Template
  - Math
---

这篇文章是新日志的参考模板。复制本文件、修改文件名和上方元数据后即可开始写作。

## 基本文字

正文使用标准 Markdown，可以包含**粗体**、*斜体*、[链接](https://www.11ty.dev/)和列表：

- 第一项
- 第二项

> 引用内容也会继承当前主题样式。[^source]

## 正文图片

将图片放进 `src/assets/`，然后以文章文件为基准使用相对路径：

![拉斐尔的《雅典学院》](../../assets/The_School_of_Athens.jpg)

## 数学公式

行内公式使用单个美元符号，例如质能方程 $E = mc^2$。

块级公式使用两个美元符号：

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

## Excalidraw

图表源文件放在 `src/assets/drawings/`，shortcode 中只填写文件名：

{% excalidraw "test.excalidraw" %}

## JavaScript

Markdown 允许原生 HTML 和 JavaScript。下面的按钮脚本只作用于这篇文章：

<p>
  <button class="button-link" id="template-script-button" type="button">测试 JavaScript</button>
  <span id="template-script-result" aria-live="polite">尚未点击</span>
</p>

<script>
  document.querySelector("#template-script-button")?.addEventListener("click", () => {
    document.querySelector("#template-script-result").textContent = "JavaScript 已运行";
  });
</script>

如果脚本需要在多篇文章中复用，应将它保存到 `src/js/`，再通过 `<script src="/js/文件名.js" defer></script>` 引入。

[^source]: 这里是一条脚注示例。
