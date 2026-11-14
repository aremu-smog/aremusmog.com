// @ts-check
import { defineConfig } from "astro/config"

export default defineConfig({
	site: "https://www.aremusmog.com",
	trailingSlash: "ignore",
	// Compression strips line-break whitespace between text and inline
	// elements ("past<span>", "reading</a>,<a"), which changes rendered text
	compressHTML: false,
	build: {
		format: "directory",
		// The global stylesheet is ~1.5 KB gzipped: inlining it into every page
		// saves a render-blocking request, which outweighs cross-page caching
		inlineStylesheets: "always",
	},
})
