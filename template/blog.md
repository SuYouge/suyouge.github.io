---
title: 日志标题
description: 一句话说明这篇日志的内容
pubDate: "{{date}}"
updatedDate: "{{date}}"
# Optional cover image:
# heroImage: ../../assets/example.webp
# heroImageAlt: 图片替代文本
tags:
  - Chinese
---

在这里开始写作。文章 URL 默认由 Markdown 文件名决定；若要使用 `my-note` 作为地址，请将文件命名为 `my-note.md`。

## 正文图片

将图片放在 `src/assets/`，再使用相对于当前文章的路径：

```markdown
![图片说明](../../assets/example.webp)
```

## 数学公式

行内公式使用 `$E = mc^2$`，块级公式使用：

```markdown
$$
E = mc^2
$$
```

## Excalidraw

将源文件放在 `src/assets/drawings/`，再使用 Eleventy shortcode：

```text
{% excalidraw "example.excalidraw" %}
```

## JavaScript

文章允许原生 HTML。一次性脚本可直接写 `<script>`；需要复用的脚本应放入 `src/js/`，然后这样引入：

```html
<script src="/js/example.js" defer></script>
```
