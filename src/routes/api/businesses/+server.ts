// Types
import type { LayoutServerLoad } from '../../$types';
import { Business } from '$lib/models/Business';
import { Employee } from '$lib/models/Employee';
// Svelte
import { json, error, type RequestHandler } from '@sveltejs/kit';
// SurrealDB
import { clientPromise } from '$lib/surrealdb';

// Helper to get session from locals
async function getSession(locals: App.Locals) {
  const session = await locals.auth();
  if (!session?.user) throw error(401, 'Authentication required');
  return session;
}

export const GET: LayoutServerLoad = async ({ locals, url }) => {
  const session = await getSession(locals);
  const db = await clientPromise;

  const businessId = url.searchParams.get('id');
  if (businessId) {
    // Return single business if ID is provided
    const result = await db.query(
      `SELECT * FROM business 
        WHERE id = type::thing('business', $businessId)
        AND (ownerId = type::thing('user', $ownerId)
        OR id IN (SELECT businessId FROM employees WHERE userId = type::thing('user', $ownerId)))`,
      { businessId, ownerId: session.user.id }
    );

    const businessData = result[0] as any[];
    if (!businessData || businessData.length === 0) {
      throw error(404, 'Business not found or access denied');
    }

    const businessRecord = businessData[0];
    businessRecord.id = businessRecord.id.id; // Handle RecordId object
    const business = new Business(businessRecord);
    
    return json(business.toJSON());
  } else {
    // Return all businesses for the user
    const result = await db.query(
      `SELECT * FROM business 
        WHERE ownerId = type::thing('user', $ownerId)
        OR id IN (SELECT businessId FROM employees WHERE userId = type::thing('user', $ownerId))`,
      { ownerId: session.user.id }
    );

    const businessesData = result[0] as any[];
    const businesses = businessesData.map((businessData: any) => {
      businessData.id = businessData.id.id; // Handle RecordId object
      const business = new Business(businessData);
      return business;
    });
    
    return json(businesses.map(b => b.toJSON()));
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const session = await getSession(locals);

  let businessId: string | undefined;
  try {
    const data = await request.json();
    const db = await clientPromise;

    // Create business instance from request data
    const business = new Business(data);

    // Validate business data
    const validation = business.validate();
    if (!validation.isValid) {
      return json({
        error: 'Validation failed',
        details: validation.errors,
        data: business.toJSON()
      }, { status: 400 });
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
      ownerId: session.user.id
    }) as any[];

    const businessRecord = businessResult[0]?.[0];
    if (!businessRecord || !businessRecord.id) {
      return json({
        error: 'Failed to create business profile',
        data: business.toJSON()
      }, { status: 500 });
    }

    // Create employee record
    const employee = new Employee({
      userId: session.user.id,
      businessId: businessRecord.id,
      role: 'owner',
      status: 'active'
    });

    const employeeValidation = employee.validate();
    if (!employeeValidation.isValid) {
      return json({
        error: 'Failed to create employee record',
        details: employeeValidation.errors
      }, { status: 500 });
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

    businessRecord.id = businessRecord.id.id;
    businessId = businessRecord.id;

    return json({ businessId, business: businessRecord });
  } catch (err) {
    console.error('Business API POST error:', err);
    return json({
      error: 'An unexpected error occurred during setup',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
  const db = await clientPromise;

  const businessId = url.searchParams.get('id');
  
  if (!businessId) throw error(400, 'Business ID is required');

  const business = await db.query(`
    SELECT * FROM business WHERE id = type::thing('business', $businessId)
  `, { businessId });

  if (!business || business.length === 0) throw error(404, 'Business not found');

  await db.query(`
    DELETE ONLY business WHERE id = type::thing('business', $businessId) RETURN BEFORE
  `, { businessId });

  return json({ message: 'Business deleted successfully' });
};