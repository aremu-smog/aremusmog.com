import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

// Values copied verbatim from the legacy books.js. "" marks books that were
// listed but never finished (the legacy page hides them), and "Completed "
// with a trailing space appears on two 2024 entries.
const bookStatus = z.enum(["Completed", "Completed ", ""])

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

export const collections = { books }
