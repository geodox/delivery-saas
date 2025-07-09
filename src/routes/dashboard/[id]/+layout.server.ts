import { redirect, error } from "@sveltejs/kit";

// Models
import { Business } from "$lib/models";

// Types
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch, params, locals }) => {
  const session = await locals.auth();

  // Don't allow access to dashboard if not logged in
  if (!session?.user) {
    redirect(303, '/login');
  }

  const businessId = params.id;

  // Validate that businessId is provided
  if (!businessId) {
    redirect(303, '/dashboard');
  }

  try {
    // First, try to get the specific business
    const selectedBusinessResponse = await fetch(`/api/businesses?id=${businessId}`);
    
    if (!selectedBusinessResponse.ok) {
      if (selectedBusinessResponse.status === 404) {
        // Business not found or access denied
        redirect(303, '/dashboard');
      }
      throw new Error('Failed to fetch business');
    }

    const selectedBusinessData = await selectedBusinessResponse.json();
    const selectedBusiness = new Business(selectedBusinessData);

    // Also get all businesses for the user (for navigation, etc.)
    const businessesResponse = await fetch('/api/businesses');
    if (!businessesResponse.ok) {
      throw new Error('Failed to fetch businesses');
    }

    const businessesData = await businessesResponse.json();
    const businesses = businessesData.map((business: any) => new Business(business));

    return {
      selectedBusiness,
      businesses
    };
  } catch (err) {
    // If it's already a redirect, re-throw it
    if (err instanceof Response) {
      throw err;
    }

    // For any other error, redirect to main dashboard
    console.error('Error validating business ID:', err);
    redirect(303, '/dashboard');
  }
};
