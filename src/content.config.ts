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
		/** The post's first image on Medium's CDN, or null when it has none */
		cover: z.url().nullable(),
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

// Pieces on /archives/motion. Each id names its video in
// public/assets/video/motion and its poster in src/assets/images/motion
const motion = defineCollection({
	loader: file("./src/content/motion/pieces.json"),
	schema: z.object({
		title: z.string(),
		// What the piece is, e.g. "Logo animation"
		kind: z.string(),
		// Position on the page, lowest first
		order: z.number().int(),
		// The encoded video's size, used for its aspect ratio
		width: z.number().int().positive(),
		height: z.number().int().positive(),
		// Pieces with sound get the volume control; the rest play muted
		sound: z.boolean(),
	}),
})

export const collections = { books, writings, archives, motion }
