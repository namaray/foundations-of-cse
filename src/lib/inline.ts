import katex from 'katex';

/**
 * Render a short frontmatter string as inline HTML.
 * Supports $math$ (KaTeX), `code` and **bold**. Everything else is escaped.
 */
export function inline(text: string): string {
	const escape = (s: string) =>
		s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	return text
		.split(/(\$[^$]+\$)/g)
		.map((part) => {
			if (part.length > 2 && part.startsWith('$') && part.endsWith('$')) {
				return katex.renderToString(part.slice(1, -1), { throwOnError: false });
			}
			return escape(part)
				.replace(/`([^`]+)`/g, '<code>$1</code>')
				.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
		})
		.join('');
}

/** Course title for a page id like "algorithms/sorting". */
export function courseSlug(id: string): string {
	return id.split('/')[0] ?? '';
}
