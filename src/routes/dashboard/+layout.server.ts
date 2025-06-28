import { clientPromise } from "$lib/surrealdb";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
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

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.auth();

  // Don't allow access to dashboard if not logged in
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
  
  // Don't allow access to dashboard if not setup
  if (!businessesData || businessesData.length === 0) {
    throw redirect(303, '/setup');
  }

  // Convert SurrealDB objects to Business instances
  const businesses = businessesData.map((businessData: any) => {
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
  });

  // Get current business from URL params or default to first business
  const url = new URL(event.request.url);
  const selectedBusinessId = url.searchParams.get('business');
  
  let selectedBusiness = null;
  if (selectedBusinessId) {
    selectedBusiness = businesses.find(b => b.id === selectedBusinessId);
  }
  
  if (!selectedBusiness && businesses.length > 0) {
    selectedBusiness = businesses[0];
  }

  return {
    session,
    businesses,
    selectedBusiness
  };
};