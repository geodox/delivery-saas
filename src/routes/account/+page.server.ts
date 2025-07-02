// Types
import type { PageServerLoad } from "./$types";

// Svelte
import { redirect } from "@sveltejs/kit";

// Models
import { Business } from "$lib/models";

export const load: PageServerLoad = async ({ fetch, locals }) => {
  const session = await locals.auth();

  // Don't allow access to account page if not logged in
  if (!session?.user) {
    throw redirect(303, '/login');
  }

  return {
    session,
    businesses: await fetch('/api/businesses')
      .then(res => res.json())
      .then(data => data.map((business: any) => new Business(business)))
  };
}; 