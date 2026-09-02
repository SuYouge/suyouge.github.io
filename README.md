# Low Tech Land

A lightweight personal blog built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

The visual system is adapted from the **Main Stage** stylesheet of [Style Stage](https://stylestage.dev/) by Stephanie Eckles. See [STYLE-ATTRIBUTION.md](./STYLE-ATTRIBUTION.md) for licensing and attribution.

## Local development

Requirements: Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Eleventy serves the local site at `http://localhost:8080/` and rebuilds when source files change.

To create a production build:

```bash
npm run build
```

The generated site is written to `dist/`.

## Project structure

```text
├── eleventy.config.js          # Eleventy, Markdown, KaTeX and Excalidraw setup
├── public/                     # Files copied directly to the site root
├── src/
│   ├── _data/                  # Global site metadata
│   ├── _includes/              # Nunjucks layouts and partials
│   ├── assets/                 # Images, fonts and Excalidraw sources
│   ├── content/blog/           # Markdown blog posts
│   ├── css/                    # Main Stage-derived stylesheet
│   ├── js/                     # Small progressive-enhancement scripts
│   ├── blog/                   # Blog listing page
│   ├── tags/                   # Tag index and generated tag pages
│   ├── index.njk               # Home page
│   ├── rss.xml.njk             # RSS feed
│   └── sitemap.xml.njk         # Sitemap
└── template/blog.md            # Obsidian-friendly post template
```

## Writing posts

Create a `.md` file in `src/content/blog/`:

```yaml
---
title: 文章标题
description: 简短描述
pubDate: 2026-09-02
heroImage: ../../assets/example.webp
heroImageAlt: 图片描述
tags:
  - Chinese
  - Notes
---
```

`heroImage` and `heroImageAlt` are optional. The filename becomes the public URL, for example `my-post.md` becomes `/blog/my-post/`.

When this repository is opened as an Obsidian vault, pasted attachments are configured to go to `src/assets/`, links are stored as relative Markdown links, and the authoring template is available from `template/blog.md`.

Markdown images can continue to use paths relative to the article:

```markdown
![图片说明](../../assets/example.webp)
```

Place Excalidraw source files in `src/assets/drawings/` and embed them with:

```text
{% excalidraw "example.excalidraw" %}
```

The drawing is converted to inline SVG at build time. The resulting figure supports click-to-zoom and keyboard interaction without shipping the Excalidraw application to readers.

Math is rendered with KaTeX. Use `$E = mc^2$` for inline math and `$$ ... $$` for display math.

Raw HTML and JavaScript are enabled in Markdown. Small one-off scripts may use an inline `<script>` block. Reusable scripts should be stored in `src/js/` and referenced as `/js/filename.js`.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. GitHub Actions installs dependencies, builds `dist/`, uploads the Pages artifact, and deploys it to <https://suyouge.github.io/>.

Before publishing, run:

```bash
npm run build
```
