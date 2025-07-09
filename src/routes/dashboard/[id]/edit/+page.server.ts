// Types
import type { Actions } from './$types';
import { Business } from '$lib/models';
// Svelte
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  update: async ({ request, params, fetch }) => {
    const businessId = params.id;
    try {
      const formData = await request.formData();

      // Create business instance and validate
      const business = Business.fromFormData(formData);
      const validation = business.validate();
      
      if (!validation.isValid) {
        return fail(400, {
          error: 'Validation failed',
          details: validation.errors,
          data: business.toJSON()
        });
      }

      // Update business via API
      const response = await fetch(`/api/businesses?id=${businessId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(business.toDBSafeJSON())
      });

      const result = await response.json();

      if (!response.ok) {
        return fail(response.status, {
          error: result.error || 'Failed to update business',
          details: result.details
        });
      }

    } catch (err) {
      console.error('Business update error:', err);
      
      if (err instanceof Response) {
        throw err;
      }

      return fail(500, { 
        error: 'An unexpected error occurred while updating the business',
        details: err instanceof Error ? err.message : 'Unknown error'
      });
    }

    // Redirect back to dashboard
    redirect(303, `/dashboard/${businessId}`);
  },

  delete: async ({ params, fetch }) => {
    try {
      const businessId = params.id;

      const response = await fetch(`/api/businesses?id=${businessId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const result = await response.json();
        return fail(response.status, {
          error: result.error || 'Failed to delete business'
        });
      }
    } catch (err) {
      if (err instanceof Response) {
        throw err;
      }

      return fail(500, { 
        error: 'An unexpected error occurred while deleting the business',
        details: err instanceof Error ? err.message : 'Unknown error'
      });
    }

    console.log('Business deleted successfully');
    // Redirect to dashboard on success
    redirect(303, `/dashboard`);
  }
}; 