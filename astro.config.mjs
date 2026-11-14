// @ts-check
import { defineConfig } from "astro/config"

export default defineConfig({
	site: "https://www.aremusmog.com",
	trailingSlash: "ignore",
	build: {
		format: "directory",
	},
})
