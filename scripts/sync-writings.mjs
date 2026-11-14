// Pulls the Medium RSS feed and merges any new posts into
// src/content/writings/posts.json. The feed only carries the latest 10
// posts, so existing entries are never removed or rewritten: the file keeps
// every post it has ever seen. Output is deterministic, so a run with no new
// posts leaves the file untouched.
//
// Usage: pnpm sync:writings

import { readFile, writeFile } from "node:fs/promises"

const FEED_URL = "https://aremusmog.medium.com/feed"
const POSTS_FILE = new URL("../src/content/writings/posts.json", import.meta.url)
const WORDS_PER_MINUTE = 230
const EXCERPT_LENGTH = 160
// Shorter blocks are usually captions or one-line intros, not a real paragraph
const MIN_PARAGRAPH_LENGTH = 40

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " }

const decodeEntities = (text) =>
	text.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (match, code) => {
		if (code[0] !== "#") return ENTITIES[code.toLowerCase()] ?? match
		const hex = code[1] === "x" || code[1] === "X"
		return String.fromCodePoint(parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10))
	})

/** The text of an XML element, unwrapping CDATA or decoding entities */
const unwrap = (raw) => {
	const cdata = raw.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/)
	return cdata ? cdata[1] : decodeEntities(raw.trim())
}

const elements = (xml, tag) =>
	[...xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "g"))].map(
		([, inner]) => unwrap(inner),
	)

const element = (xml, tag) => elements(xml, tag)[0]

const toText = (html) =>
	decodeEntities(html.replace(/<[^>]+>/g, " "))
		.replace(/\s+/g, " ")
		.trim()

const truncate = (text, length) => {
	if (text.length <= length) return text
	const cut = text.slice(0, length + 1)
	const lastSpace = cut.lastIndexOf(" ")
	return `${cut.slice(0, lastSpace > 0 ? lastSpace : length).replace(/[\s,;:.—–-]+$/, "")}…`
}

/** The first paragraph or list item long enough to read as prose */
const excerptOf = (html) => {
	const blocks = [...html.matchAll(/<(p|li)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g)].map(([, , inner]) =>
		toText(inner),
	)
	const paragraph = blocks.find((text) => text.length >= MIN_PARAGRAPH_LENGTH) ?? toText(html)
	return truncate(paragraph, EXCERPT_LENGTH)
}

const readingTimeOf = (html) => {
	const words = toText(html).split(" ").filter(Boolean).length
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

/** Drops Medium's tracking query, e.g. ?source=rss-e17e222b85d4------2 */
const cleanUrl = (link) => {
	const url = new URL(link)
	url.search = ""
	url.hash = ""
	return url.toString()
}

/** The slug Medium puts in the URL, used as the entry id */
const idOf = (url) => new URL(url).pathname.split("/").filter(Boolean).pop()

const parsePost = (item) => {
	const html = element(item, "content:encoded") ?? ""
	const url = cleanUrl(element(item, "link"))
	return {
		id: idOf(url),
		title: toText(element(item, "title")),
		url,
		date: new Date(element(item, "pubDate")).toISOString(),
		tags: elements(item, "category"),
		readingTime: readingTimeOf(html),
		excerpt: excerptOf(html),
	}
}

const byNewest = (a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id)

const response = await fetch(FEED_URL, { headers: { "User-Agent": "aremusmog.com sync-writings" } })
if (!response.ok) throw new Error(`Fetching ${FEED_URL} failed: ${response.status}`)
const feed = await response.text()
const fetched = elements(feed, "item").map(parsePost)
if (fetched.length === 0) throw new Error(`No posts found in ${FEED_URL}`)

const existing = JSON.parse(await readFile(POSTS_FILE, "utf8").catch(() => "[]"))
const known = new Set(existing.map((post) => post.url))
const added = fetched.filter((post) => !known.has(post.url))
const posts = [...existing, ...added].sort(byNewest)

const output = `${JSON.stringify(posts, null, "\t")}\n`
const current = await readFile(POSTS_FILE, "utf8").catch(() => "")
if (output !== current) await writeFile(POSTS_FILE, output)

console.log(
	added.length === 0
		? `No new posts (${posts.length} in total)`
		: `Added ${added.length} post(s), ${posts.length} in total:\n${added.map((post) => `  - ${post.title}`).join("\n")}`,
)
