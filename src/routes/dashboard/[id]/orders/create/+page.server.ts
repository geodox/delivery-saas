import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, params, fetch }) => {
    const formData = await request.formData();
    const businessId = params.id;

    try {
      const orderData = {
        businessId,
        customerName: formData.get('customerName') as string,
        customerPhone: formData.get('customerPhone') as string,
        customerEmail: formData.get('customerEmail') as string,
        orderDetails: formData.get('orderDetails') as string,
        totalAmount: parseFloat(formData.get('totalAmount') as string),
        specialInstructions: formData.get('specialInstructions') as string,
        deliveryAddress: {
          street: formData.get('deliveryStreet') as string,
          city: formData.get('deliveryCity') as string,
          stateProvince: formData.get('deliveryStateProvince') as string,
          zipPostalCode: formData.get('deliveryZipPostalCode') as string,
          country: formData.get('deliveryCountry') as string
        },
        estimatedDeliveryTime: formData.get('estimatedDeliveryTime') ? new Date(formData.get('estimatedDeliveryTime') as string) : undefined,
        status: 'confirmed'
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (!response.ok) {
        return fail(response.status, {
          error: result.error || 'Failed to create order',
          details: result.details
        });
      }

      return { success: true, orderId: result.orderId };

    } catch (error) {
      console.error('Order creation error:', error);
      return fail(500, {
        error: 'An unexpected error occurred while creating the order'
      });
    }
  }
}; 