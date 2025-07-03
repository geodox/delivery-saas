import type { PageServerLoad } from "./$types";
import { Order } from "$lib/models/Order";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const { id } = params;

  const orders = await fetch(`/api/orders?businessId=${id}&limit=100`)
    .then(res => res.json())
    .then(orders => orders.map((order: Partial<Order> | undefined) => new Order(order)));

  return { orders };
};