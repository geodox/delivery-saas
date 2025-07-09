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

      const businessData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        website: formData.get('website') as string,
        phone: formData.get('phone') as string,
        streetAddress: formData.get('streetAddress') as string,
        city: formData.get('city') as string,
        stateProvince: formData.get('stateProvince') as string,
        zipPostalCode: formData.get('zipPostalCode') as string,
        country: formData.get('country') as string,
        deliveryRadius: parseInt(formData.get('deliveryRadius') as string),
        specialRequirements: formData.get('specialRequirements') as string,
        operatingHours: JSON.parse(formData.get('operatingHours') as string)
      };

      // Validate required fields
      const errors: Record<string, string> = {};
      
      if (!businessData.name?.trim()) {
        errors.name = 'Business name is required';
      }
      
      if (!businessData.description?.trim()) {
        errors.description = 'Business description is required';
      }
      
      if (!businessData.streetAddress?.trim()) {
        errors.street = 'Street address is required';
      }
      
      if (!businessData.city?.trim()) {
        errors.city = 'City is required';
      }
      
      if (!businessData.stateProvince?.trim()) {
        errors.stateProvince = 'State/Province is required';
      }
      
      if (!businessData.zipPostalCode?.trim()) {
        errors.zipPostalCode = 'ZIP/Postal code is required';
      }
      
      if (businessData.deliveryRadius <= 0) {
        errors.radius = 'Delivery radius must be greater than 0';
      }

      if (Object.keys(errors).length > 0) {
        return fail(400, {
          error: 'Validation failed',
          details: errors,
          data: businessData
        });
      }

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
        body: JSON.stringify(business.toJSON())
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