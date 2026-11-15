import type { ImageMetadata } from "astro"
import { getCollection, type CollectionEntry } from "astro:content"

export type MotionPiece = CollectionEntry<"motion">["data"] & {
	id: string
	/** Served from public/, so it is not fingerprinted */
	video: string
	poster: ImageMetadata
}

const posters = import.meta.glob<{ default: ImageMetadata }>(
	"../../assets/images/motion/*.jpg",
	{ eager: true },
)

/** Pieces in page order, each with its video URL and poster. */
export async function getMotionPieces(): Promise<MotionPiece[]> {
	const entries = await getCollection("motion")
	return entries
		.map(({ id, data }) => {
			const poster = posters[`../../assets/images/motion/${id}.jpg`]
			if (!poster) throw new Error(`Missing poster for motion piece "${id}"`)
			return { ...data, id, video: `/assets/video/motion/${id}.mp4`, poster: poster.default }
		})
		.sort((a, b) => a.order - b.order)
}
