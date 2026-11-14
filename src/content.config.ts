import { defineCollection } from "astro:content"
import { file, glob } from "astro/loaders"
import { z } from "astro/zod"

// "unfinished" marks books that were listed but never finished; the page hides them
const bookStatus = z.enum(["completed", "unfinished"])

const book = z.object({
	title: z.string(),
	author: z.string(),
	// Unfinished books were recorded with 0 pages, so 0 must be allowed
	pages: z.number().int().nonnegative(),
	status: bookStatus,
})

const books = defineCollection({
	loader: glob({ pattern: "*.json", base: "./src/content/books" }),
	schema: z.object({
		year: z.number().int(),
		books: z.array(book),
	}),
})

// Medium posts, merged in by `pnpm sync:writings`; each id is the post's URL slug
const writings = defineCollection({
	loader: file("./src/content/writings/posts.json"),
	schema: z.object({
		title: z.string(),
		// The Medium link without its ?source= tracking query
		url: z.url(),
		date: z.coerce.date(),
		tags: z.array(z.string()),
		/** Estimated minutes, from the word count */
		readingTime: z.number().int().positive(),
		/** Plain text from the first paragraph, cut to about 160 characters */
		excerpt: z.string(),
	}),
})

export const collections = { books, writings }
