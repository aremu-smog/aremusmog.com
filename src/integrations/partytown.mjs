// @ts-check
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { copyLibFiles, libDirPath } from "@qwik.dev/partytown/utils"

export const partytownLib = "/~partytown/"

/**
 * Serves (dev) and copies (build) Partytown's worker files to /~partytown/.
 * Unlike @astrojs/partytown it does not inject the snippet into every page:
 * GTM.astro renders it, so pages without GTM (the teleprompter) stay clean.
 *
 * @returns {import("astro").AstroIntegration}
 */
export default function partytown() {
	return {
		name: "partytown-lib",
		hooks: {
			"astro:server:setup": ({ server }) => {
				server.middlewares.use(partytownLib, async (req, res, next) => {
					const name = path.basename((req.url ?? "").split("?")[0])
					try {
						const body = await readFile(path.join(libDirPath(), name))
						res.setHeader(
							"Content-Type",
							name.endsWith(".html") ? "text/html" : "text/javascript",
						)
						res.end(body)
					} catch {
						next()
					}
				})
			},
			"astro:build:done": async ({ dir }) => {
				await copyLibFiles(fileURLToPath(new URL("." + partytownLib, dir)), {
					debugDir: false,
				})
			},
		},
	}
}
