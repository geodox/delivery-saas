import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson()
	],
	server: {
      host: true,
    },
    build: {
      target: 'es2022',
      rollupOptions: {
        external : [
          'fsevents',
          'fs',
          'node:fs',
          'path',
          'node:path',
          'node:url',
          'node:perf_hooks',
          'node:crypto',
          'node:fs/promises',
          'node:process',
          'module',
          'node:module',
          'node:child_process',
          'node:dns',
          'node:util',
          'node:zlib',
          'node:buffer',
          'node:http',
          'node:https',
          'node:os',
          '.jj'
        ]
      },
    },
});