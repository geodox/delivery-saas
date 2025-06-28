import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { clientPromise } from '$lib/surrealdb';
import { Business, Employee } from '$lib/models';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      const db = await clientPromise;
      const session = await locals.auth();

      // Create business instance from form data
      const business = Business.fromFormData(formData);

      // Validate business data
      const validation = business.validate();
      if (!validation.isValid) {
        return fail(400, { 
          error: 'Validation failed',
          details: validation.errors,
          data: business.toJSON()
        });
      }

      // Create business profile
      const businessResult = await db.query(`
        CREATE business SET 
          name = $name,
          description = $description,
          website = $website,
          phone = $phone,
          address = $address,
          delivery = $delivery,
          operatingHours = $operatingHours,
          ownerId = type::thing('user', $ownerId),
          createdAt = time::now(),
          updatedAt = time::now()
      `, { 
        ...business.toJSON(),
        ownerId: session?.user?.userId
      }) as any[];

      const businessRecord = businessResult[0]?.[0];
      if (!businessRecord || !businessRecord.id) {
        return fail(500, { 
          error: 'Failed to create business profile',
          data: business.toJSON()
        });
      }

      // Create employee record
      if (session?.user?.userId) {
        const employee = new Employee({
          userId: session.user.userId,
          businessId: businessRecord.id,
          role: 'owner',
          status: 'active'
        });

        const employeeValidation = employee.validate();
        if (!employeeValidation.isValid) {
          return fail(500, { 
            error: 'Failed to create employee record',
            details: employeeValidation.errors
          });
        }

        await db.query(`
          CREATE employees SET 
            userId = type::thing('user', $userId),
            businessId = $businessId,
            role = $role,
            status = $status,
            createdAt = time::now(),
            updatedAt = time::now()
        `, employee.toJSON());
      }

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

    throw redirect(303, '/dashboard');
  }
};