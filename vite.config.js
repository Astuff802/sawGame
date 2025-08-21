import { defineConfig } from "vite"
import eslint from "@rollup/plugin-eslint"
import { sep } from "path"

// export one big file to easily paste editor.p5js.org or openprocessing.org
export default defineConfig({
	build: {
		emptyOutDir: true,
		minify: false,
		lib: {
			entry: `src${sep}javascripts${sep}main.js`,
			formats: ['iife'],
			name: "window"
		},
		rollupOptions: {
			input: [`src${sep}javascripts${sep}main.js`],
			output: {
				format: "iife",
				name: "window",
				extend: true,
				entryFileNames: "glory-in-the-ring.js",
				inlineDynamicImports: "true"
			}
		}
	},
	server: {
		port: 8888,
		host: true,
		open: "/",
	},
	plugins: [
		{
			...eslint({
				include: ["src/**/*.js"],
			}),
			enforce: "pre",
			apply: "build",
		},
	],
});