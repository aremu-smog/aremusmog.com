import { getCollection, type CollectionEntry } from "astro:content"

export type ArchiveCategory = CollectionEntry<"archives">["data"]

/** Categories in page order. */
export async function getArchiveCategories(): Promise<ArchiveCategory[]> {
	const entries = await getCollection("archives")
	return entries.map(({ data }) => data).sort((a, b) => a.order - b.order)
}
