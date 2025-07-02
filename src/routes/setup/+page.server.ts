// Types
import type { Actions } from './$types';

// Svelte
import { error, fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    let businessId: string | undefined;
    try {
      const formData = await request.formData();
      // Convert formData to plain object
      const data: Record<string, any> = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      // If operatingHours is a stringified JSON, parse it
      if (typeof data.operatingHours === 'string') {
        try {
          data.operatingHours = JSON.parse(data.operatingHours);
        } catch {}
      }
      // POST to API endpoint
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) {
        return fail(res.status, {
          error: result.error || 'Failed to create business',
          details: result.details,
          data
        });
      }
      businessId = result.businessId;
    } catch (error) {
      console.error('Business setup error:', error);
      
      if (error instanceof Response) {
        throw error;
      }

      return fail(500, { 
        error: 'An unexpected error occurred during setup',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    if (businessId) {
      throw redirect(303, `/dashboard/${businessId}`);
    }

    throw error(400, 'Business ID not found');
  }
};