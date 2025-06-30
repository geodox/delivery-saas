// Types
import type { PageServerLoad } from "./$types";

// Svelte
import { redirect } from "@sveltejs/kit";

// SurrealDB
import { clientPromise } from "$lib/surrealdb";

// Models
import { Business } from "$lib/models";

// Helper function to extract ID from SurrealDB objects
function extractId(value: any): string | undefined {
  if (!value) return undefined;
  
  if (typeof value === 'object' && value.id) {
    // Handle _RecordId object
    return value.id;
  } else if (typeof value === 'string' && value.includes(':')) {
    // Handle string format with colon (table:id)
    return value.split(':')[1];
  } else {
    // Handle plain string or other formats
    return String(value);
  }
}

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.auth();

  // Don't allow access to account page if not logged in
  if (!session?.user) {
    throw redirect(303, '/login');
  }

  // Get businesses for user
  const result = await (await clientPromise).query(`
    SELECT * FROM business 
    WHERE ownerId = type::thing('user', $ownerId)
    OR id IN (SELECT businessId FROM employees WHERE userId = type::thing('user', $ownerId))
  `, { ownerId: session.user?.id });
  
  const businessesData = result[0] as any[];
  
  // Convert SurrealDB objects to Business instances
  const businesses = businessesData?.map((businessData: any) => {
    const id = extractId(businessData.id);
    const ownerId = extractId(businessData.ownerId);
    
    // Create Business instance with extracted data
    return new Business({
      id,
      name: businessData.name || '',
      description: businessData.description || '',
      website: businessData.website || null,
      phone: businessData.phone || null,
      address: businessData.address || null,
      delivery: businessData.delivery || null,
      operatingHours: businessData.operatingHours || null,
      ownerId: ownerId || undefined,
      createdAt: businessData.createdAt || null,
      updatedAt: businessData.updatedAt || null,
    });
  }) || [];

  return {
    session,
    businesses
  };
}; 