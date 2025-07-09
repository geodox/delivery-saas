import type { Transport } from "@sveltejs/kit";
import { Business } from "$lib/models";
import { Order } from "$lib/models/Order";
import { Employee } from "$lib/models/Employee";

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
	},
	Order: {
		encode: (value) => {
			if (value instanceof Order) {
				return [value.toJSON()];
			}
			return undefined;
		},
		decode: ([data]) => {
			if (data && typeof data === 'object') {
				return new Order(data);
			}
			return undefined;
		}
	},
	Employee: {
		encode: (value) => {
			if (value instanceof Employee) {
				return [value.toJSON()];
			}
			return undefined;
		},
		decode: ([data]) => {
			if (data && typeof data === 'object') {
				return new Employee(data);
			}
			return undefined;
		}
	},
}; 