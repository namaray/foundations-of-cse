import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/**
 * Optional lesson metadata. When a page has `lesson:` in its frontmatter it
 * gets the lesson header (prerequisites, outcomes, key idea)
 * and the lesson footer (mark as done, previous/next), and it appears on its
 * course's study path.
 *
 * Text fields accept **bold**, `code` and $math$.
 */
const lesson = z.object({
	/** Module heading on the course study path, e.g. "Foundations". */
	module: z.string(),
	/** Lessons to read first. */
	prerequisites: z.array(z.object({ label: z.string(), link: z.string() })).optional(),
	/** "By the end you can…" outcomes, 3–5 short phrases. */
	outcomes: z.array(z.string()).optional(),
	/** The whole lesson in two or three sentences. */
	keyIdea: z.string().optional(),
});

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({ extend: z.object({ lesson: lesson.optional() }) }),
	}),
};
