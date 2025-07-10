import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { user, orders } = await parent();
  
  // Filter orders for display
  const activeOrders = orders.filter((order: any) => 
    ['pending', 'confirmed', 'assigned', 'en_route_pickup', 'picked_up', 'en_route_delivery'].includes(order.status)
  );

  const completedOrders = orders.filter((order: any) => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  return {
    user,
    orders,
    activeOrders,
    completedOrders
  };
}; 