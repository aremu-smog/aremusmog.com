import { getCollection, type CollectionEntry } from "astro:content"

export type Post = CollectionEntry<"writings">["data"]

export interface PostYear {
	year: number
	posts: Post[]
}

/** Years newest first, each with its posts newest first. */
export async function getPostsByYear(): Promise<PostYear[]> {
	const entries = await getCollection("writings")
	const posts = entries.map(({ data }) => data).sort((a, b) => b.date.getTime() - a.date.getTime())

	const years = new Map<number, Post[]>()
	for (const post of posts) {
		const year = post.date.getUTCFullYear()
		years.set(year, [...(years.get(year) ?? []), post])
	}
	return [...years].map(([year, posts]) => ({ year, posts }))
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
	day: "numeric",
	month: "short",
	timeZone: "UTC",
})

/** e.g. "4 Oct": the year is already the group heading */
export const formatDate = (date: Date) => dateFormat.format(date)
