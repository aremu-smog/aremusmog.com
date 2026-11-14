import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
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

// The categories linked from the archives page. A category is shown as
// "Coming soon" until its subpage exists and `live` is set to true
const archives = defineCollection({
	loader: glob({ pattern: "*.json", base: "./src/content/archives" }),
	schema: z.object({
		title: z.string(),
		// The subpage lives at /archives/<slug>
		slug: z.string().regex(/^[a-z0-9-]+$/),
		blurb: z.string(),
		// Position on the archives page, lowest first
		order: z.number().int(),
		live: z.boolean(),
	}),
})

export const collections = { books, archives }
