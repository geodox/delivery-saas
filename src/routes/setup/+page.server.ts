import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { clientPromise } from '$lib/surrealdb';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      const db = await clientPromise;
      const session = await locals.auth();

      // Extract form data
      const businessData = {
        businessName: formData.get('businessName') as string,
        description: formData.get('description') as string,
        website: formData.get('website') as string,
        phone: formData.get('phone') as string,
        address: {
          street: formData.get('streetAddress') as string,
          city: formData.get('city') as string,
          stateProvince: formData.get('stateProvince') as string,
          zipPostalCode: formData.get('zipPostalCode') as string,
          country: formData.get('country') as string
        },
        delivery: {
          radius: parseInt(formData.get('deliveryRadius') as string),
          radiusUnit: formData.get('country') === 'Canada' ? 'km' : 'miles',
          estimatedOrderVolume: formData.get('estimatedOrderVolume') as string,
          specialRequirements: formData.get('specialRequirements') as string
        },
        operatingHours: JSON.parse(formData.get('operatingHours') as string),
        userId: session?.user?.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Validate required fields
      if (!businessData.businessName || !businessData.description) {
        return fail(400, { 
          error: 'Missing required business information',
          data: businessData 
        });
      }

      if (!businessData.address.street || !businessData.address.city || !businessData.address.zipPostalCode) {
        return fail(400, { 
          error: 'Missing required address information',
          data: businessData 
        });
      }

      // Create business profile in SurrealDB
      const [business] = await db.create('business', businessData);

      if (!business) {
        return fail(500, { 
          error: 'Failed to create business profile',
          data: businessData 
        });
      }

      // Create employee record linking user to business
      if (session?.user?.userId) {
        await db.create('employees', {
          userId: session.user.userId,
          businessId: business.id,
          role: 'owner',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error('Business setup error:', error);
      
      if (error instanceof Response) {
        throw error; // Re-throw redirects
      }

      return fail(500, { 
        error: 'An unexpected error occurred during setup',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    redirect(303, '/dashboard');
  }
}; 