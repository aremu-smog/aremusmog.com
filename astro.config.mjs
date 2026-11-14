// @ts-check
import { defineConfig, fontProviders } from "astro/config"

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
	// Self-hosted: downloaded at build time from Google Fonts (the same files
	// the site used to load at runtime) and served from /_astro/fonts/.
	// The CSS uses Doto 800 and Geist 300/400, Latin only. Optimized
	// (metric-adjusted) fallbacks are off because glyphs these fonts lack,
	// like the "₦" on the home page, would render in them instead of the
	// plain generic family.
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Doto",
			cssVariable: "--font-doto",
			// The full variable file (5.4 KB): a static 800 instance is 1.4 KB
			// smaller but rasterizes slightly differently
			weights: ["100 900"],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["monospace"],
			optimizedFallbacks: false,
		},
		{
			provider: fontProviders.google(),
			name: "Geist",
			cssVariable: "--font-body",
			weights: [300, 400],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["sans-serif"],
			optimizedFallbacks: false,
		},
	],
})
