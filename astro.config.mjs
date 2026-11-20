// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { syllabus } from './src/syllabus.mjs';

const REPO = 'https://github.com/namaray/foundations-of-cse';

// Build the sidebar from the course map: one group per area, one collapsible
// sub-group per course, with every note in the course folder listed automatically.
const sidebar = syllabus.map((area) =>
	area.courses.length === 1 && area.courses[0].title === area.label
		? {
				label: area.label,
				collapsed: true,
				items: [{ autogenerate: { directory: area.courses[0].slug } }],
			}
		: {
				label: area.label,
				// Starlight opens the group that contains the current page,
				// so only the course you're in is expanded.
				collapsed: true,
				items: area.courses.map((course) => ({
					label: course.title,
					collapsed: true,
					items: [{ autogenerate: { directory: course.slug } }],
				})),
			},
);

// https://astro.build/config
export default defineConfig({
	site: 'https://foundations-of-cse.vercel.app',
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
	},
	integrations: [
		starlight({
			title: 'Foundations of CSE by Namare',
			description:
				'Complete notes covering the undergraduate Computer Science & Engineering curriculum, for lecturer interviews and master’s admission exams.',
			social: [{ icon: 'github', label: 'GitHub', href: REPO }],
			editLink: { baseUrl: `${REPO}/edit/main/` },
			lastUpdated: true,
			customCss: [
				'@fontsource-variable/atkinson-hyperlegible-next',
				'@fontsource-variable/jetbrains-mono',
				'katex/dist/katex.min.css',
				'./src/styles/custom.css',
			],
			components: {
				ThemeProvider: './src/components/ThemeProvider.astro',
				PageTitle: './src/components/PageTitle.astro',
				Pagination: './src/components/Pagination.astro',
			},
			sidebar,
		}),
	],
});
