// Svelte
import { redirect } from "@sveltejs/kit";

// Models
import { Business } from "$lib/models";

// Types
import type { LayoutServerLoad } from "./$types";

// TODO: Lazy load businesses
export const load: LayoutServerLoad = async ({ fetch, params, locals }) => {
  const session = await locals.auth();

  // Don't allow access to dashboard if not logged in
  if (!session?.user) {
    redirect(303, '/login');
  }

  // Get businesses for user
  const businesses: Business[] = await fetch('/api/businesses')
    .then(res => res.json())
    .then(data => data.map((business: any) => new Business(business)));

  // FIXME: Redirect to /dashboard?id=...?
  // Get current business from URL params or default to first business
  let selectedBusiness = null;
  const selectedBusinessId = params.id || null;
  
  if (selectedBusinessId) {
    selectedBusiness = businesses.find(b => b.id === selectedBusinessId) || null;
  }
  
  if (!selectedBusiness && businesses.length === 1) {
    selectedBusiness = businesses[0];
  }

  if (!selectedBusinessId && selectedBusiness) {
    redirect(301,`/dashboard/${selectedBusiness.id}`);
  }

  return {
    businesses,
    selectedBusiness
  };
};