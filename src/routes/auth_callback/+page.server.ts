import { redirect } from '@sveltejs/kit';
import { clientPromise } from '$lib/surrealdb';
import type { PageServerLoad } from './$types';

async function getRedirectUrl(userId: string): Promise<string> {
  try {
    const db = await clientPromise;
    
    // Check if user is a business owner
    const ownerCheck = await db.query(
      `SELECT id FROM business WHERE ownerId = type::thing('user', $userId)`,
      { userId }
    );
    
    const ownerData = ownerCheck[0] as any[];
    if (ownerData && ownerData.length > 0) {
      return "/dashboard";
    }
    
    // Check user's employee roles
    const employeeCheck = await db.query(
      `SELECT roles FROM employee WHERE userId = type::thing('user', $userId) AND status = 'active'`,
      { userId }
    );
    
    const employeeData = employeeCheck[0] as any[];
    if (employeeData && employeeData.length > 0) {
      // Flatten all roles from all employee records
      const allRoles = employeeData.flatMap((emp: any) => emp.roles || []);
      
      if (allRoles.includes('dispatcher')) {
        return "/dashboard";
      }
      
      if (allRoles.includes('driver')) {
        return "/driver-app";
      }
      
      // For other roles (employee, manager), default to dashboard
      return "/dashboard";
    }
    
    // If no business ownership or employee role found, default to dashboard
    return "/";
  } catch (error) {
    console.error('Error determining user role for redirect:', error);
    // Fallback to dashboard on error
    return "/dashboard";
  }
}

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.auth();
  
  if (!session?.user?.id) {
    throw redirect(302, '/login');
  }

  // If redirectUrl is provided, use it
  let redirectUrl = url.searchParams.get('redirectUrl');

  if (redirectUrl) {
    throw redirect(302, redirectUrl);
  }
  else {
    redirectUrl = await getRedirectUrl(session.user.id);
    throw redirect(302, redirectUrl);
  }
}; 