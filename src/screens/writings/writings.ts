import { getCollection, type CollectionEntry } from "astro:content"

export type Post = CollectionEntry<"writings">["data"]

/** Every post, newest first. */
export async function getPosts(): Promise<Post[]> {
	const entries = await getCollection("writings")
	return entries.map(({ data }) => data).sort((a, b) => b.date.getTime() - a.date.getTime())
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone: "UTC",
})

/** e.g. "4 Oct 2026" */
export const formatDate = (date: Date) => dateFormat.format(date)
