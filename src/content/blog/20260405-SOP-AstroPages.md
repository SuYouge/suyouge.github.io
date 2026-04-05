---
title: Astro 部署
description: Astro 页面部署的 SOP
pubDate: 2026-04-05
slug: 20260405-SOP-AstroPages
heroImage: ../../assets/20260405-SOP-AstroPages-1775378946015.webp
heroImageAlt: SOP-Astro
tags:
  - Chinese
  - SOP
---
# 1. 基本操作
## 1. node环境准备
1. 在 macos 上准备`fnm`工具，在 Windows 或者 Linux 上可以用`nvm`进行控制
2. 安装`Astro`官方推荐的 node 版本，例如`22.12.10`
3. 切换当前`node`版本
## 2. git clone
1. 如果是从头开始构建 blog，找到好看的主题git 仓库后进行下一步即可
2. 如果是从github 上获取之前创建的日志记录，则通过`git clone xxxx.github.io`类似的指令来获取当前仓库
## 3.  npm install
1. 构建环境时需要注意有些主题默认支持的包管理器不是`npm`，而是`pnpm`或其他，需要调整，尽量选择`npm`的会节约时间，我还没有尝试过修改包管理器。此外如果遇到`npm audit fix`的提示大概也不要紧，只要后续部署成功可以忽略此处的安全隐患，因为我们用的实际上是静态页面。
2. 执行`npm install`后创建好环境即可`npm run dev`或者`npm run build & npm run preview`。
## 4. Obsidian配置
1. 将`git clone`下来的文件夹作为`obsidian`的`vault`打开
2. 修改内链风格以及相对路径模式，支持图片的粘贴自动移动到`assets`目录下；为减小仓库空间还可以引入`Image Converter`插件。
3. （可选）配置插件`Excalidraw`和`mdx as md`
4. （可选）配置`Excalidraw`插件以支持同步保存`.excalidraw`文件

# 2. 进阶操作
## 1. 增加 katex 支持
1. 首先安装两个新的库，`remark-math`和`rehype-katex`，其中`remark-math`负责识别。`markdown`中的数学语法，`rehype-katex`负责将其转换为`katex`的`html`。
2. 如果用到了`mdx`还需要对`mdx`也进行相应配置，类似对`markdown`的配置。
3. 在`astro.config.mjs`中引入这两个库，并设置仅输出`mathml`。
4. 将相应的资源插入在`blog`的模板中，类似`BlogPost.astro`。

## 2. Excalidraw支持
1. 按照`Gemini`的建议构建了[`Excalidraw.astro`](https://github.com/SuYouge/suyouge.github.io/blob/main/src/components/Excalidraw.astro)。
2. 在`mdx`中引用即可，格式在[这里](https://github.com/SuYouge/suyouge.github.io/blob/main/src/content/blog/excalidraw.mdx)，记得查看源码，否则组件标签会不显示。
3. 在本地的`obsidian`环境中安装`Excalidraw`插件，并配置同步生成`.excalidraw`文件，即可实现所见即所得（大概）的修改。
4. **TODO**: 后续将引入`skill`系统来自动生成`excalidraw`文件，类似[这个](https://www.youtube.com/watch?v=m3fqyXZ4k4I)视频里所做的。
## 3. obsidian模板配置
1. 创建一个`template`文件夹，并创建`blog.md`文件作为模板
2. 在`obsidian`中配置模板目录即可
3. 使用流程为：创建一个空白文件，`ctrl+p`插入模板