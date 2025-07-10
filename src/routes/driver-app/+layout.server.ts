import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, fetch }) => {
  const session = await locals.auth();
  
  // Check if user is authenticated
  if (!session?.user) {
    throw redirect(302, '/login?redirectUrl=/driver-app');
  }
  
  // TODO: Check if user has driver role once role field is added to user schema
  // For now, allow all authenticated users to access driver app
  // const userRole = session.user.role;
  // if (userRole !== 'driver') {
  //   throw redirect(302, '/login?error=unauthorized&redirectUrl=/driver-app');
  // }

  try {
    // Get businesses where the user is an employee
    const businessesResponse = await fetch('/api/businesses');
    if (!businessesResponse.ok) {
      throw new Error('Failed to fetch businesses');
    }
    const businesses = await businessesResponse.json();

    // Get orders for all businesses the driver has access to
    const ordersPromises = businesses.map(async (business: any) => {
      const ordersResponse = await fetch(`/api/orders?businessId=${business.id}`);
      if (ordersResponse.ok) {
        return ordersResponse.json();
      }
      return [];
    });

    const allOrders = await Promise.all(ordersPromises);
    const orders = allOrders.flat();

    // Calculate shared stats
    const activeOrders = orders.filter((order: any) => 
      ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status)
    );

    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = orders.filter((order: any) => 
      order.createdAt?.startsWith(today)
    );

    const todaysEarnings = todaysOrders.reduce((total: number, order: any) => {
      // In a real app, you'd calculate driver earnings based on business rules
      // For now, assume 80% of order total goes to driver
      return total + (Number(order.totalAmount) * 0.8);
    }, 0);

    return {
      session,
      user: session.user,
      isDriver: true,
      businesses,
      orders,
      stats: {
        activeOrders: activeOrders.length,
        todaysEarnings: todaysEarnings.toFixed(2),
        totalOrders: orders.length
      }
    };
  } catch (err) {
    console.error('Error loading driver app data:', err);
    return {
      session,
      user: session.user,
      isDriver: true,
      businesses: [],
      orders: [],
      stats: {
        activeOrders: 0,
        todaysEarnings: '0.00',
        totalOrders: 0
      }
    };
  }
}; 