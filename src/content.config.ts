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

export const collections = { books }
