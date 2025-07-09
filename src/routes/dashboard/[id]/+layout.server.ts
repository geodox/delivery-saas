// Types
import type { LayoutServerLoad } from "./$types";
import { Order } from "$lib/models/Order";
import { Employee } from "$lib/models/Employee";

export const load: LayoutServerLoad = async ({ fetch, params }) => {
  // Get orders for the selected business
  const ordersResponse = await fetch(`/api/orders?businessId=${params.id}`);
  if (!ordersResponse.ok) {
    throw new Error('Failed to fetch orders');
  }

  const ordersData = await ordersResponse.json();
  const orders = ordersData.map((order: any) => new Order(order));

  // Get employees for the selected business
  const employeesResponse = await fetch(`/api/employees?businessId=${params.id}`);
  if (!employeesResponse.ok) {
    throw new Error('Failed to fetch employees');
  }

  const employeesData = await employeesResponse.json();
  const employees = employeesData.map((employee: any) => new Employee(employee));

  return {
    orders,
    employees
  };
};
