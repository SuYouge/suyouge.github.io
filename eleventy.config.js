import path from "node:path";
import fs from "node:fs/promises";
import { TextDecoder, TextEncoder } from "node:util";
import { JSDOM } from "jsdom";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { footnote } from "@mdit/plugin-footnote";
import { katex } from "@mdit/plugin-katex";
import pluginRss from "@11ty/eleventy-plugin-rss";

const DRAWINGS_DIR = path.resolve("src/assets/drawings");

function slugify(value = "") {
  return String(value)
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{Letter}\p{Number}_-]+/gu, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function toDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? new Date(0) : date;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

let excalidrawRuntime;

async function getExcalidrawRuntime() {
  if (excalidrawRuntime) return excalidrawRuntime;

  const dom = new JSDOM("<!doctype html><html><body></body></html>");
  const { window } = dom;
  const safeGlobalSet = (key, value) => {
    try {
      globalThis[key] = value;
    } catch {
      Object.defineProperty(globalThis, key, {
        configurable: true,
        value,
        writable: true,
      });
    }
  };

  safeGlobalSet("window", window);
  safeGlobalSet("document", window.document);
  safeGlobalSet("Node", window.Node);
  safeGlobalSet("Element", window.Element);
  safeGlobalSet("SVGElement", window.SVGElement);
  safeGlobalSet("TextEncoder", TextEncoder);
  safeGlobalSet("TextDecoder", TextDecoder);
  safeGlobalSet("devicePixelRatio", 1);
  safeGlobalSet("navigator", window.navigator);
  safeGlobalSet("FontFace", class FontFace {
    load() {
      return Promise.resolve(this);
    }
  });

  if (!window.document.fonts) {
    Object.defineProperty(window.document, "fonts", {
      configurable: true,
      value: {
        add: () => {},
        check: () => true,
        load: () => Promise.resolve([]),
      },
    });
  }

  excalidrawRuntime = import("@excalidraw/utils");
  return excalidrawRuntime;
}

async function renderExcalidraw(source, className = "") {
  const fileName = path.basename(String(source));
  const safeClassName = String(className)
    .split(/\s+/)
    .filter((name) => /^[a-zA-Z0-9_-]+$/.test(name))
    .join(" ");

  if (!fileName || fileName !== source) {
    return '<p class="notice notice-error">Excalidraw 文件路径无效。</p>';
  }

  try {
    const rawContent = await fs.readFile(path.join(DRAWINGS_DIR, fileName), "utf8");
    const sceneData = JSON.parse(rawContent);
    const { exportToSvg } = await getExcalidrawRuntime();
    const elements = (sceneData.elements ?? []).map((element) =>
      element.type === "text" ? { ...element, fontFamily: 2 } : element,
    );
    const svg = await exportToSvg({
      appState: {
        ...sceneData.appState,
        exportBackground: false,
        exportWithSymbol: false,
      },
      elements,
      files: sceneData.files ?? {},
    });
    const svgMarkup = svg.outerHTML
      .replace(/font-family="[^"]*"/g, "")
      .replace(/<svg ([^>]+)>/, '<svg $1 width="100%" height="auto" style="display:block;max-width:100%">');

    return `<figure class="excalidraw-paper ${safeClassName}" data-excalidraw-zoom tabindex="0" role="button" aria-label="点击放大图表"><div class="excalidraw-content">${svgMarkup}</div><figcaption>点击图表放大，按 Esc 退出</figcaption></figure>`;
  } catch (error) {
    return `<p class="notice notice-error">Excalidraw 渲染失败：${escapeHtml(error.message)}</p>`;
  }
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPassthroughCopy({ public: "." });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/katex/dist/katex.min.css": "css/katex.min.css",
    "node_modules/katex/dist/fonts": "css/fonts",
  });
  eleventyConfig.ignores.add("src/assets/**");
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  const markdownLibrary = markdownIt({
    breaks: false,
    html: true,
    linkify: true,
    typographer: false,
  })
    .use(markdownItAnchor, {
      level: [1, 2, 3, 4],
      slugify,
    })
    .use(footnote)
    .use(katex, { delimiters: "dollars" });

  const defaultImageRule = markdownLibrary.renderer.rules.image;
  markdownLibrary.renderer.rules.image = (tokens, index, options, environment, renderer) => {
    tokens[index].attrSet("loading", "lazy");
    tokens[index].attrSet("decoding", "async");
    return defaultImageRule(tokens, index, options, environment, renderer);
  };
  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addAsyncShortcode("excalidraw", renderExcalidraw);
  eleventyConfig.addFilter("slugify", slugify);
  eleventyConfig.addFilter("assetUrl", (value) => {
    if (!value) return "";
    return String(value).replace(/^\.\.\/\.\.\/assets\//, "/assets/");
  });
  eleventyConfig.addFilter("dateDisplay", (value) =>
    new Intl.DateTimeFormat("zh-CN", {
      day: "numeric",
      month: "long",
      timeZone: "UTC",
      year: "numeric",
    }).format(toDate(value)),
  );
  eleventyConfig.addFilter("dateIso", (value) => toDate(value).toISOString());
  eleventyConfig.addFilter("dateRfc2822", (value) => toDate(value).toUTCString());
  eleventyConfig.addFilter("head", (values, length) => (values ?? []).slice(0, length));
  eleventyConfig.addFilter("postsForTag", (posts, tag) =>
    (posts ?? []).filter((post) => (post.data.tags ?? []).includes(tag)),
  );

  eleventyConfig.addCollection("blogPosts", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/content/blog/**/*.md")
      .sort((left, right) => toDate(right.data.pubDate) - toDate(left.data.pubDate)),
  );
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    for (const post of collectionApi.getFilteredByGlob("src/content/blog/**/*.md")) {
      for (const tag of post.data.tags ?? []) tags.add(tag);
    }
    return [...tags].sort((left, right) => left.localeCompare(right));
  });

  return {
    dir: {
      data: "_data",
      includes: "_includes",
      input: "src",
      output: "dist",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/",
    templateFormats: ["md", "njk", "11ty.js"],
  };
}
