// Types
import type { RequestHandler } from '@sveltejs/kit';
import { Order } from '$lib/models/Order';
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

export const GET: RequestHandler = async ({ url }) => {
  const db = await clientPromise;

  const businessId = url.searchParams.get('businessId');
  if (!businessId) {
    throw error(400, 'Business ID is required');
  }

  // Get orders for the business
  const result = await db.query(
    `SELECT * FROM order 
      WHERE businessId = type::thing('business', $businessId)
      ORDER BY createdAt DESC`,
    { businessId }
  );

  const ordersData = result[0] as any[];
  const orders = ordersData.map((orderData: any) => {
    orderData.id = orderData.id.id; // Handle RecordId object
    const order = new Order(orderData);
    return order.toJSON();
  });
  
  return json(orders);
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
        createdAt = time::now(),
        updatedAt = time::now()
    `, { 
      ...order.toJSON(),
      businessId: data.businessId
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