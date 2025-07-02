import { json, error, type RequestHandler } from '@sveltejs/kit';
import { Business } from '$lib/models/Business';
import { Address } from '$lib/models/Address';
import { DeliverySettings } from '$lib/models/DeliverySettings';
import { OperatingHours } from '$lib/models/OperatingHours';
import { clientPromise } from '$lib/surrealdb';
import { Employee } from '$lib/models/Employee';

// Helper to get session from locals
async function getSession(locals: App.Locals) {
  if (typeof locals.auth === 'function') {
    return await locals.auth();
  }
  throw error(401, 'Authentication required');
}

export const GET: RequestHandler = async ({ locals }) => {
  const session = await getSession(locals);

  if (!session?.user) throw error(401, 'Not authenticated');

  const db = await clientPromise;
  const result = await db.query(
    `SELECT * FROM business 
      WHERE ownerId = type::thing('user', $ownerId)
      OR id IN (SELECT businessId FROM employees WHERE userId = type::thing('user', $ownerId))`,
    { ownerId: session.user.id }
  );

  const businessesData = result[0] as any[];
  const businesses = businessesData.map((businessData: any) => new Business({
    id: businessData.id?.id || businessData.id,
    name: businessData.name || '',
    description: businessData.description || '',
    website: businessData.website || null,
    phone: businessData.phone || null,
    address: businessData.address ? new Address(businessData.address) : new Address(),
    delivery: businessData.delivery ? new DeliverySettings(businessData.delivery) : new DeliverySettings(),
    operatingHours: businessData.operatingHours ? new OperatingHours(businessData.operatingHours) : new OperatingHours(),
    ownerId: businessData.ownerId?.id || businessData.ownerId,
    createdAt: businessData.createdAt || null,
    updatedAt: businessData.updatedAt || null,
  }));
  
  return json(businesses.map(b => b.toJSON()));
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const session = await getSession(locals);
  if (!session?.user) throw error(401, 'Not authenticated');

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