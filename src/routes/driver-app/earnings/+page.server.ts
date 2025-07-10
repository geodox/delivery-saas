import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { user, orders } = await parent();
  
  // Calculate earnings from orders
  const today = new Date().toISOString().split('T')[0];
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  const thisMonth = new Date();
  thisMonth.setMonth(thisMonth.getMonth() - 1);

  const todaysOrders = orders.filter((order: any) => 
    order.createdAt?.startsWith(today) && order.status === 'delivered'
  );

  const weeklyOrders = orders.filter((order: any) => 
    new Date(order.createdAt) >= thisWeek && order.status === 'delivered'
  );

  const monthlyOrders = orders.filter((order: any) => 
    new Date(order.createdAt) >= thisMonth && order.status === 'delivered'
  );

  // Calculate earnings (80% of order total goes to driver)
  const todaysEarnings = todaysOrders.reduce((total: number, order: any) => 
    total + (Number(order.totalAmount) * 0.8), 0
  );

  const weeklyEarnings = weeklyOrders.reduce((total: number, order: any) => 
    total + (Number(order.totalAmount) * 0.8), 0
  );

  const monthlyEarnings = monthlyOrders.reduce((total: number, order: any) => 
    total + (Number(order.totalAmount) * 0.8), 0
  );

  const totalEarnings = orders
    .filter((order: any) => order.status === 'delivered')
    .reduce((total: number, order: any) => 
      total + (Number(order.totalAmount) * 0.8), 0
    );

  return {
    user,
    orders,
    earnings: {
      today: todaysEarnings.toFixed(2),
      week: weeklyEarnings.toFixed(2),
      month: monthlyEarnings.toFixed(2),
      total: totalEarnings.toFixed(2)
    },
    stats: {
      todaysOrders: todaysOrders.length,
      weeklyOrders: weeklyOrders.length,
      monthlyOrders: monthlyOrders.length,
      totalDelivered: orders.filter((order: any) => order.status === 'delivered').length
    }
  };
}; 