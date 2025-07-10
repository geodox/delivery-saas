// Types
import type { RequestHandler } from '@sveltejs/kit';
import { Employee } from '$lib/models/Employee';
// Svelte
import { json, error } from '@sveltejs/kit';
// SurrealDB
import { clientPromise } from '$lib/surrealdb';

// Helper to get session from locals
async function getSession(locals: App.Locals) {
  const session = await locals.auth();
  if (!session?.user) throw error(401, 'Authentication required');
  return session;
}

export const GET: RequestHandler = async ({ locals, url }) => {
  const session = await getSession(locals);
  const db = await clientPromise;

  const businessId = url.searchParams.get('businessId');
  const employeeId = url.searchParams.get('id');

  if (employeeId) {
    // Return single employee if ID is provided
    const result = await db.query(
      `SELECT * FROM employee 
        WHERE id = type::thing('employee', $employeeId)
        AND (userId = type::thing('user', $userId)
        OR businessId IN (SELECT id FROM business WHERE ownerId = type::thing('user', $userId)))`,
      { employeeId, userId: session.user.id }
    );

    const employeeData = result[0] as any[];
    if (!employeeData || employeeData.length === 0) {
      throw error(404, 'Employee not found or access denied');
    }

    const employeeRecord = employeeData[0];
    employeeRecord.id = employeeRecord.id.id; // Handle RecordId object
    const employee = new Employee(employeeRecord);
    
    return json(employee.toJSON());
  } else if (businessId) {
    // Return all employees for a specific business
    const result = await db.query(
      `SELECT * FROM employee 
        WHERE businessId = type::thing('business', $businessId)
        AND (userId = type::thing('user', $userId)
        OR $userId IN (SELECT ownerId FROM business WHERE id = type::thing('business', $businessId)))`,
      { businessId, userId: session.user.id }
    );

    const employeesData = result[0] as any[];
    const employees = employeesData.map((employeeData: any) => {
      employeeData.id = employeeData.id.id; // Handle RecordId object
      const employee = new Employee(employeeData);
      return employee.toJSON();
    });
    
    return json(employees);
  } else {
    // Return all employees for businesses the user has access to
    const result = await db.query(
      `SELECT * FROM employee 
        WHERE userId = type::thing('user', $userId)
        OR businessId IN (SELECT id FROM business WHERE ownerId = type::thing('user', $userId))`,
      { userId: session.user.id }
    );

    const employeesData = result[0] as any[];
    const employees = employeesData.map((employeeData: any) => {
      employeeData.id = employeeData.id.id; // Handle RecordId object
      const employee = new Employee(employeeData);
      return employee.toJSON();
    });
    
    return json(employees);
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const session = await getSession(locals);

  try {
    const data = await request.json();
    const db = await clientPromise;

    // Create employee instance from request data
    const employee = new Employee({
      ...data,
      userId: data.userId || session.user.id
    });

    // Validate employee data
    const validation = employee.validate();
    if (!validation.isValid) {
      return json({
        error: 'Validation failed',
        details: validation.errors,
        data: employee.toJSON()
      }, { status: 400 });
    }

    // Check if user has permission to add employees to this business
    const businessCheck = await db.query(
      `SELECT id FROM business 
        WHERE id = type::thing('business', $businessId)
        AND ownerId = type::thing('user', $ownerId)`,
      { businessId: employee.businessId, ownerId: session.user.id }
    );

    const businessData = businessCheck[0] as any[];
    if (!businessData || businessData.length === 0) {
      return json({
        error: 'Access denied. You can only add employees to businesses you own.'
      }, { status: 403 });
    }

    // Check if employee already exists for this user and business
    const existingEmployee = await db.query(
      `SELECT id FROM employee 
        WHERE userId = type::thing('user', $userId)
        AND businessId = type::thing('business', $businessId)`,
      { userId: employee.userId, businessId: employee.businessId }
    );

    const existingData = existingEmployee[0] as any[];
    if (existingData && existingData.length > 0) {
      return json({
        error: 'Employee already exists for this user and business'
      }, { status: 409 });
    }

    // Create employee record
    const employeeResult = await db.query(`
      CREATE employee SET 
        userId = type::thing('user', $userId),
        businessId = type::thing('business', $businessId),
        roles = $roles,
        status = $status,
        createdAt = time::now(),
        updatedAt = time::now()
    `, { 
      ...employee.toJSON(),
      userId: employee.userId,
      businessId: employee.businessId
    }) as any[];

    const employeeRecord = employeeResult[0]?.[0];
    if (!employeeRecord || !employeeRecord.id) {
      return json({
        error: 'Failed to create employee record',
        data: employee.toJSON()
      }, { status: 500 });
    }

    employeeRecord.id = employeeRecord.id.id;
    const createdEmployee = new Employee(employeeRecord);

    return json({ 
      employeeId: employeeRecord.id, 
      employee: createdEmployee.toJSON() 
    });
  } catch (err) {
    console.error('Employees API POST error:', err);
    return json({
      error: 'An unexpected error occurred while creating the employee',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request, locals, url }) => {
  const session = await getSession(locals);
  const employeeId = url.searchParams.get('id');
  
  if (!employeeId) {
    throw error(400, 'Employee ID is required');
  }

  try {
    const data = await request.json();
    const db = await clientPromise;

    // Create employee instance from request data
    const employee = new Employee({
      ...data,
      id: employeeId // Ensure the ID is preserved
    });

    // Validate employee data
    const validation = employee.validate();
    if (!validation.isValid) {
      return json({
        error: 'Validation failed',
        details: validation.errors,
        data: employee.toJSON()
      }, { status: 400 });
    }

    // Check if user has permission to update this employee
    const permissionCheck = await db.query(
      `SELECT id FROM employee 
        WHERE id = type::thing('employee', $employeeId)
        AND businessId IN (SELECT id FROM business WHERE ownerId = type::thing('user', $ownerId))`,
      { employeeId, ownerId: session.user.id }
    );

    const permissionData = permissionCheck[0] as any[];
    if (!permissionData || permissionData.length === 0) {
      return json({
        error: 'Access denied. You can only update employees in businesses you own.'
      }, { status: 403 });
    }

    // Update employee record
    const updateResult = await db.query(`
      UPDATE type::thing('employee', $id) SET 
        roles = $roles,
        status = $status,
        updatedAt = time::now()
    `, { 
      id: employeeId,
      roles: employee.roles,
      status: employee.status
    }) as any[];

    const updatedEmployee = updateResult[0]?.[0];
    if (!updatedEmployee) {
      return json({
        error: 'Failed to update employee record',
        data: employee.toJSON()
      }, { status: 500 });
    }

    // Handle RecordId object
    updatedEmployee.id = updatedEmployee.id.id;
    
    return json({ 
      message: 'Employee updated successfully',
      employee: updatedEmployee 
    });
  } catch (err) {
    console.error('Employees API PUT error:', err);
    return json({
      error: 'An unexpected error occurred during update',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ locals, url }) => {
  const session = await getSession(locals);
  const employeeId = url.searchParams.get('id');
  
  if (!employeeId) {
    throw error(400, 'Employee ID is required');
  }

  try {
    const db = await clientPromise;

    // Check if user has permission to delete this employee
    const permissionCheck = await db.query(
      `SELECT id FROM employee 
        WHERE id = type::thing('employee', $employeeId)
        AND businessId IN (SELECT id FROM business WHERE ownerId = type::thing('user', $ownerId))`,
      { employeeId, ownerId: session.user.id }
    );

    const permissionData = permissionCheck[0] as any[];
    if (!permissionData || permissionData.length === 0) {
      return json({
        error: 'Access denied. You can only delete employees in businesses you own.'
      }, { status: 403 });
    }

    // Check if trying to delete the last owner
    const employeeData = await db.query(
      `SELECT roles, businessId FROM employee WHERE id = type::thing('employee', $employeeId)`,
      { employeeId }
    ) as any[];

    const employeeRecord = employeeData[0]?.[0] as any;
    if (employeeRecord?.roles && employeeRecord.roles.includes('owner')) {
      const ownerCount = await db.query(
        `SELECT count() as count FROM employee 
          WHERE businessId = $businessId AND array::contains(roles, 'owner')`,
        { businessId: employeeRecord.businessId }
      ) as any[];

      const countResult = ownerCount[0]?.[0] as any;
      if (countResult?.count <= 1) {
        return json({
          error: 'Cannot delete the last owner of a business'
        }, { status: 400 });
      }
    }

    // Delete employee record
    const deleteResult = await db.query(
      `DELETE FROM type::thing('employee', $id)`,
      { id: employeeId }
    ) as any[];

    if (!deleteResult[0] || deleteResult[0].length === 0) {
      return json({
        error: 'Failed to delete employee record'
      }, { status: 500 });
    }
    
    return json({ 
      message: 'Employee deleted successfully'
    });
  } catch (err) {
    console.error('Employees API DELETE error:', err);
    return json({
      error: 'An unexpected error occurred during deletion',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
};
