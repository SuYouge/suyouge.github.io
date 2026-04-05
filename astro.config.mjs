// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import icon from 'astro-icon';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
	site: 'https://suyouge.github.io',
	image: {
		responsiveStyles: true,
		layout: 'constrained',
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson Hyperlegible Next',
			cssVariable: '--font-atkinson',
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/AtkinsonHyperlegibleNext-VariableFont_wght.ttf'],
						weight: '100 900',
						style: 'normal',
					},
					{
						src: ['./src/assets/fonts/AtkinsonHyperlegibleNext-Italic-VariableFont_wght.ttf'],
						weight: '100 900',
						style: 'italic',
					},
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: 'Atkinson Hyperlegible Mono',
			cssVariable: '--font-atkinson-mono',
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/AtkinsonHyperlegibleMono-VariableFont_wght.ttf'],
						weight: '100 900',
						style: 'normal',
					},
				],
			},
		},
	],
	integrations: [
		mdx({
			remarkPlugins: [remarkMath],
			rehypePlugins: [[
				rehypeKatex,
				{
					output: 'mathml'
				}
			]],
		},

		),
		sitemap(),
		icon({
			// Only include the small set of Iconify mdi icons we need
			include: {
				mdi: ['mastodon', 'linkedin', 'github', 'email', 'youtube', 'account', 'calendar', 'calendar-outline', 'account-outline', 'weather-sunny', 'weather-night', 'arrow-left'],
			},
		}),
	],
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [[
			rehypeKatex,
			{
				output: 'mathml'
			}
		]],
	},
});
