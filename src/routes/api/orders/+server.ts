// Types
import type { RequestHandler } from '@sveltejs/kit';
import { Order } from '$lib/models/Order';
// Svelte
import { json, error } from '@sveltejs/kit';
// SurrealDB
import { clientPromise } from '$lib/surrealdb';
// Order Flow
import { isValidStatusTransition, getNextAction, canCustomerCancel, canBusinessCancel } from '$lib/utils/orderFlow';

// Helper to get session from locals
async function getSession(locals: App.Locals) {
  const session = await locals.auth();
  if (!session?.user) throw error(401, 'Authentication required');
  return session;
}

export const GET: RequestHandler = async ({ url, locals }) => {
  const session = await getSession(locals);
  const db = await clientPromise;

  const businessId = url.searchParams.get('businessId');
  const orderId = url.searchParams.get('id');
  const status = url.searchParams.get('status');
  const driverId = url.searchParams.get('driverId');

  if (orderId) {
    // Return single order if ID is provided
    const result = await db.query(
      `SELECT * FROM order WHERE id = type::thing('order', $orderId)`,
      { orderId }
    );

    const orderData = result[0] as any[];
    if (!orderData || orderData.length === 0) {
      throw error(404, 'Order not found');
    }

    const orderRecord = orderData[0];
    orderRecord.id = orderRecord.id.id; // Handle RecordId object
    const order = new Order(orderRecord);
    
    return json(order.toJSON());
  } else if (businessId) {
    // Get orders for the business
    let query = `SELECT * FROM order WHERE businessId = type::thing('business', $businessId)`;
    const params: any = { businessId };

    if (status) {
      query += ` AND status = $status`;
      params.status = status;
    }

    if (driverId) {
      query += ` AND assignedDriverId IN (
        SELECT id FROM employee 
        WHERE userId = type::thing('user', $driverId)
      )`;
      params.driverId = driverId;
    }

    query += ` ORDER BY createdAt DESC`;

    const result = await db.query(query, params);

    const ordersData = result[0] as any[];
    const orders = ordersData.map((orderData: any) => {
      orderData.id = orderData.id.id; // Handle RecordId object
      const order = new Order(orderData);
      return order.toJSON();
    });
    
    return json(orders);
  } else {
    throw error(400, 'Business ID or Order ID is required');
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const db = await clientPromise;

    // Create order instance from request data
    const order = new Order({
      ...data,
      status: 'pending'
    });

    // Validate order data
    const validation = order.validate();
    if (!validation.isValid) {
      return json({
        error: 'Validation failed',
        details: validation.errors,
        data: order.toJSON()
      }, { status: 400 });
    }

    // Create order in database
    const orderResult = await db.query(`
      CREATE order SET 
        status = $status,
        totalAmount = $totalAmount,
        customerId = $customerId,
        customerName = $customerName,
        customerPhone = $customerPhone,
        customerEmail = $customerEmail,
        deliveryAddress = $deliveryAddress,
        orderDetails = $orderDetails,
        specialInstructions = $specialInstructions,
        estimatedDeliveryTime = $estimatedDeliveryTime,
        businessId = type::thing('business', $businessId),
        assignedDriverId = $assignedDriverId,
        createdAt = $createdAt,
        updatedAt = $updatedAt
    `, { 
      ...order.toJSON(),
      businessId: data.businessId,
      assignedDriverId: order.assignedDriverId || undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    }) as any[];

    const orderRecord = orderResult[0]?.[0];
    if (!orderRecord || !orderRecord.id) {
      return json({
        error: 'Failed to create order',
        data: order.toJSON()
      }, { status: 500 });
    }

    orderRecord.id = orderRecord.id.id;
    const createdOrder = new Order(orderRecord);

    return json({ 
      orderId: orderRecord.id, 
      order: createdOrder.toJSON() 
    });
  } catch (err) {
    console.error('Orders API POST error:', err);
    return json({
      error: 'An unexpected error occurred while creating the order',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}; 

export const PUT: RequestHandler = async ({ request, locals, url }) => {
  const session = await getSession(locals);
  const orderId = url.searchParams.get('id');
  
  if (!orderId) {
    throw error(400, 'Order ID is required');
  }

  try {
    const data = await request.json();
    const db = await clientPromise;

    // Create order instance from request data
    const order = new Order({
      ...data,
      id: orderId // Ensure the ID is preserved
    });

    // Validate order data
    const validation = order.validate();
    if (!validation.isValid) {
      return json({
        error: 'Validation failed',
        details: validation.errors,
        data: order.toJSON()
      }, { status: 400 });
    }

    // Get current order to validate status transition
    const currentOrderResult = await db.query(
      `SELECT status FROM order WHERE id = type::thing('order', $id)`,
      { id: orderId }
    );
    const currentOrderData = currentOrderResult[0] as any[];
    if (currentOrderData && currentOrderData.length > 0) {
      const currentStatus = currentOrderData[0].status;
      
      // Validate status transition
      if (!isValidStatusTransition(currentStatus, order.status)) {
        return json({
          error: 'Invalid status transition',
          details: `Cannot transition from ${currentStatus} to ${order.status}`,
          data: order.toJSON()
        }, { status: 400 });
      }
    }

    // Update order record
    const updateResult = await db.query(`
      UPDATE type::thing('order', $id) SET 
        status = $status,
        assignedDriverId = $assignedDriverId,
        updatedAt = $updatedAt
    `, { 
      id: orderId,
      status: order.status,
      assignedDriverId: order.assignedDriverId || null,
      updatedAt: new Date()
    }) as any[];

    const updatedOrder = updateResult[0]?.[0];
    if (!updatedOrder) {
      return json({
        error: 'Failed to update order record',
        data: order.toJSON()
      }, { status: 500 });
    }

    // Handle RecordId object
    updatedOrder.id = updatedOrder.id.id;
    
    return json({ 
      message: 'Order updated successfully',
      order: updatedOrder 
    });
  } catch (err) {
    console.error('Orders API PUT error:', err);
    return json({
      error: 'An unexpected error occurred during update',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ locals, url }) => {
  const session = await getSession(locals);
  const orderId = url.searchParams.get('id');
  
  if (!orderId) {
    throw error(400, 'Order ID is required');
  }

  try {
    const db = await clientPromise;



    // Delete order record
    const deleteResult = await db.query(
      `DELETE FROM type::thing('order', $id)`,
      { id: orderId }
    ) as any[];

    if (!deleteResult[0] || deleteResult[0].length === 0) {
      return json({
        error: 'Failed to delete order record'
      }, { status: 500 });
    }
    
    return json({ 
      message: 'Order deleted successfully'
    });
  } catch (err) {
    console.error('Orders API DELETE error:', err);
    return json({
      error: 'An unexpected error occurred during deletion',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}; 

export const PATCH: RequestHandler = async ({ request, locals }) => {
  const session = await getSession(locals);

  try {
    const requestData = await request.json();
    const { action, orderId, status, location, pendingUpdates, deliveryPhoto } = requestData;
    const userId = session.user.id;

    let driverId = requestData.driverId;
    if (!driverId) {
      driverId = userId;
      console.log('No driverId provided, using user ID:', driverId);
    }

    // Handle sync operation
    if (action === 'sync') {
      const db = await clientPromise;
      
      console.log('Syncing orders for employee:', userId);
      console.log('Pending updates:', pendingUpdates);
      
      // Process any pending updates from offline mode
      if (pendingUpdates && pendingUpdates.length > 0) {
        for (const update of pendingUpdates) {
          try {
            await db.query(`
              UPDATE type::thing('order', $id) SET 
                status = $status,
                updatedAt = $updatedAt
            `, { 
              id: update.orderId,
              status: update.status,
              updatedAt: new Date()
            });
          } catch (err) {
            console.error('Failed to sync update:', update, err);
          }
        }
      }
      
      // Get latest orders for the employee
      const result = await db.query(
        `SELECT * FROM order 
          WHERE assignedDriverId IN (
            SELECT id FROM employee 
            WHERE userId = type::thing('user', $userId)
          )
          ORDER BY createdAt DESC`,
        { userId }
      );

      const ordersData = result[0] as any[];
      const syncedOrders = ordersData.map((orderData: any) => {
        orderData.id = orderData.id.id; // Handle RecordId object
        const order = new Order(orderData);
        return order.toJSON();
      });
      
      return json({
        success: true,
        syncedOrders,
        pendingUpdatesProcessed: pendingUpdates?.length || 0,
        message: 'Orders synced successfully'
      });
    }

    // Handle individual order updates
    if (!orderId) {
      throw error(400, 'Order ID is required for updates');
    }

    const db = await clientPromise;

    // Update order based on action
    let updateFields: any = { updatedAt: new Date() };
    
    switch (action) {
      case 'confirm':
        updateFields.status = 'confirmed';
        updateFields.confirmedAt = new Date();
        break;
        
      case 'assign':
        updateFields.status = 'assigned';
        // Find the employee record for the selected driver
        const employeeResult = await db.query(
          `SELECT id FROM employee WHERE userId = type::thing('user', $driverId) LIMIT 1`,
          { driverId: driverId }
        );
        const employeeData = employeeResult[0] as any[];
        if (employeeData && employeeData.length > 0) {
          updateFields.assignedDriverId = employeeData[0].id;
        } else {
          throw error(400, 'Driver employee record not found');
        }
        break;
        
      case 'accept':
        updateFields.status = 'en_route_pickup';
        // Find the employee record for this user
        const acceptEmployeeResult = await db.query(
          `SELECT id FROM employee WHERE userId = type::thing('user', $driverId) LIMIT 1`,
          { driverId: userId }
        );
        const acceptEmployeeData = acceptEmployeeResult[0] as any[];
        if (acceptEmployeeData && acceptEmployeeData.length > 0) {
          updateFields.assignedDriverId = acceptEmployeeData[0].id;
        } else {
          throw error(400, 'Driver employee record not found');
        }
        break;
        
      case 'update_status':
        updateFields.status = status;
        if (location) {
          updateFields.driverLocation = location;
        }
        break;
        
      case 'picked_up':
        updateFields.status = 'picked_up';
        break;
        
      case 'en_route_delivery':
        updateFields.status = 'en_route_delivery';
        break;
        
      case 'delivered':
        updateFields.status = 'delivered';
        updateFields.deliveredAt = new Date();
        // Handle delivery photo if provided
        if (deliveryPhoto) {
          updateFields.deliveryPhoto = deliveryPhoto;
        }
        break;
        
      case 'cancel':
        updateFields.status = 'cancelled';
        break;
        
      default:
        throw error(400, 'Invalid action');
    }

    // Build update query dynamically, handling record references
    const updatePairs = Object.keys(updateFields).map(key => {
      if (key === 'assignedDriverId' && updateFields[key]) {
        return `${key} = type::thing('employee', $${key})`;
      }
      return `${key} = $${key}`;
    });
    
    const updateQuery = `UPDATE type::thing('order', $id) SET ${updatePairs.join(', ')}`;
    
    const updateResult = await db.query(updateQuery, { 
      id: orderId,
      ...updateFields
    }) as any[];

    const updatedOrder = updateResult[0]?.[0];
    if (!updatedOrder) {
      return json({
        error: 'Failed to update order record'
      }, { status: 500 });
    }

    // Handle RecordId object
    updatedOrder.id = updatedOrder.id.id;
    
    return json({ 
      success: true, 
      order: updatedOrder,
      message: `Order ${action} successfully`
    });
    
  } catch (err) {
    console.error('Orders API PATCH error:', err);
    return json({
      error: 'An unexpected error occurred during update',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}; 