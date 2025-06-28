import type { Transport } from "@sveltejs/kit";
import { Business } from "$lib/models";

export const transport: Transport = {
	Business: {
		encode: (value) => {
			if (value instanceof Business) {
				return [value.toJSON()];
			}
			return undefined;
		},
		decode: ([data]) => {
			if (data && typeof data === 'object') {
				return new Business(data);
			}
			return undefined;
		}
	}
}; 