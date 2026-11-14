import { getCollection, type CollectionEntry } from "astro:content"

export type Book = CollectionEntry<"books">["data"]["books"][number]

export interface BookYear {
	year: number
	books: Book[]
}

export interface BookStats {
	totalBooks: number
	totalPages: number
}

// Only finished books are shown, matching the legacy page
const isListed = (book: Book) => book.status === "completed"

/** Years sorted newest first, each with its listed books in source order. */
export async function getBooksByYear(): Promise<BookYear[]> {
	const entries = await getCollection("books")
	return entries
		.map(({ data }) => ({ year: data.year, books: data.books.filter(isListed) }))
		.sort((a, b) => b.year - a.year)
}

/** Totals across all years, counting only listed books. */
export async function getBookStats(): Promise<BookStats> {
	const years = await getBooksByYear()
	return years.reduce(
		(stats, { books }) => ({
			totalBooks: stats.totalBooks + books.length,
			totalPages: stats.totalPages + books.reduce((sum, book) => sum + book.pages, 0),
		}),
		{ totalBooks: 0, totalPages: 0 },
	)
}
