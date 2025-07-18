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
      watch: {
        ignored: [
          '**/.jj/**', // Ignore the whole .jj directory
        ],
      },
      allowedHosts: [
        'geodox-pc.tail4c5766.ts.net'
      ]
    }
});