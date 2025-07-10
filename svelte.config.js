import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from "svelte-adapter-bun-next";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		csrf: false, // TODO: remove this in production
	},
};

export default config;
