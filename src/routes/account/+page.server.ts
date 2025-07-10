// Types
import type { PageServerLoad } from "./$types";

// Svelte
import { redirect } from "@sveltejs/kit";

// Models
import { Business, Employee } from "$lib/models";

export const load: PageServerLoad = async ({ fetch, locals }) => {
  const session = await locals.auth();

  // Don't allow access to account page if not logged in
  if (!session?.user) {
    redirect(303, '/login');
  }

  // Fetch user's businesses and employee roles
  const [businessesResponse, employeesResponse] = await Promise.all([
    fetch('/api/businesses'),
    fetch('/api/employees')
  ]);

  const businesses = await businessesResponse.json()
    .then(data => data.map((business: any) => new Business(business)));

  const employees = await employeesResponse.json()
    .then(data => data.map((employee: any) => new Employee(employee)));

  // Determine user's primary role
  let primaryRole = 'customer'; // default role
  let isDriver = false;
  let isOwner = false;

  if (employees.length > 0) {
    // Flatten all roles from all employee records
    const allRoles = employees.flatMap((emp: Employee) => emp.roles);
    
    if (allRoles.includes('owner')) {
      primaryRole = 'owner';
      isOwner = true;
    } else if (allRoles.includes('driver')) {
      primaryRole = 'driver';
      isDriver = true;
    } else if (allRoles.includes('dispatcher')) {
      primaryRole = 'dispatcher';
    }
  }

  return {
    session,
    businesses,
    employees,
    userRole: {
      primary: primaryRole,
      isDriver,
      isOwner,
    }
  };
}; 