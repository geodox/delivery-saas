import { Address } from './Address';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'en_route_pickup'
  | 'picked_up'
  | 'en_route_delivery'
  | 'delivered'
  | 'cancelled';

export class Order {
  id: string;
  number: number;
  status: OrderStatus;
  totalAmount?: number;
  customerId?: string; // record<user> in DB
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryAddress: Address;
  orderDetails: string;
  specialInstructions?: string;
  estimatedDeliveryTime?: Date;
  businessId: string; // record<business> in DB
  assignedDriverId?: string; // record<user> in DB
  createdAt?: Date;
  updatedAt?: Date;
  confirmedAt?: Date;
  deliveredAt?: Date;
  deliveryPhoto?: string;

  constructor(orderData: Partial<Order> = {}) {
    this.id = orderData.id || '';
    this.number = orderData.number || 0;
    this.status = orderData.status || 'pending';
    // FIXME: There is probably a better way to do this
    this.totalAmount = typeof orderData.totalAmount === 'string' 
      ? parseFloat(orderData.totalAmount) || 0 
      : (orderData.totalAmount || 0);
    this.customerId = orderData.customerId || undefined;
    this.customerName = orderData.customerName || undefined;
    this.customerPhone = orderData.customerPhone || undefined;
    this.customerEmail = orderData.customerEmail || undefined;
    this.deliveryAddress = orderData.deliveryAddress ? new Address(orderData.deliveryAddress) : new Address();
    this.orderDetails = orderData.orderDetails || '';
    this.specialInstructions = orderData.specialInstructions || undefined;
    this.estimatedDeliveryTime = orderData.estimatedDeliveryTime ? new Date(orderData.estimatedDeliveryTime) : undefined;
    this.businessId = orderData.businessId || '';
    this.assignedDriverId = orderData.assignedDriverId || undefined;
    this.createdAt = orderData.createdAt ? new Date(orderData.createdAt) : new Date();
    this.updatedAt = orderData.updatedAt ? new Date(orderData.updatedAt) : new Date();
    this.confirmedAt = orderData.confirmedAt ? new Date(orderData.confirmedAt) : undefined;
    this.deliveredAt = orderData.deliveredAt ? new Date(orderData.deliveredAt) : undefined;
    this.deliveryPhoto = orderData.deliveryPhoto || undefined;
  }

  toJSON() {
    return {
      id: this.id,
      number: this.number,
      status: this.status,
      totalAmount: this.totalAmount,
      customerId: this.customerId,
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      customerEmail: this.customerEmail,
      deliveryAddress: this.deliveryAddress?.toJSON(),
      orderDetails: this.orderDetails,
      specialInstructions: this.specialInstructions,
      estimatedDeliveryTime: this.estimatedDeliveryTime,
      businessId: this.businessId,
      assignedDriverId: this.assignedDriverId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      confirmedAt: this.confirmedAt,
      deliveredAt: this.deliveredAt,
      deliveryPhoto: this.deliveryPhoto
    };
  }

  validate() {
    const errors: string[] = [];

    if (!this.status) errors.push('Order status is required');
    if (!this.businessId) errors.push('Business ID is required');

    if (!this.customerId) {
      if (!this.customerName) errors.push('Customer name is required');
      if (!this.customerPhone) errors.push('Customer phone is required');
      if (!this.customerEmail) errors.push('Customer email is required');
    }

    if (!this.deliveryAddress) errors.push('Delivery address is required');
    else {
      const addressValidation = this.deliveryAddress.validate();
      if (!addressValidation.isValid) errors.push(...addressValidation.errors.map((error: string) => `Address: ${error}`));
    }

    if (!this.orderDetails) errors.push('Order details are required');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static fromFormData(formData: FormData): Order {
    return new Order({
      id: formData.get('id') as string,
      status: formData.get('status') as OrderStatus,
      totalAmount: parseFloat(formData.get('totalAmount') as string),
      customerId: formData.get('customerId') as string,
      customerName: formData.get('customerName') as string,
      customerPhone: formData.get('customerPhone') as string,
      customerEmail: formData.get('customerEmail') as string,
      deliveryAddress: new Address({
        street: formData.get('deliveryAddressStreet') as string,
        city: formData.get('deliveryAddressCity') as string,
        stateProvince: formData.get('deliveryAddressStateProvince') as string,
        zipPostalCode: formData.get('deliveryAddressZipPostalCode') as string,
        country: formData.get('deliveryAddressCountry') as string
      }),
      orderDetails: formData.get('orderDetails') as string,
      specialInstructions: formData.get('specialInstructions') as string,
      estimatedDeliveryTime: formData.get('estimatedDeliveryTime') ? new Date(formData.get('estimatedDeliveryTime') as string) : undefined,
      businessId: formData.get('businessId') as string,
      assignedDriverId: formData.get('assignedDriverId') as string,
      createdAt: new Date(formData.get('createdAt') as string),
      updatedAt: new Date(formData.get('updatedAt') as string),
      confirmedAt: formData.get('confirmedAt') ? new Date(formData.get('confirmedAt') as string) : undefined,
      deliveredAt: formData.get('deliveredAt') ? new Date(formData.get('deliveredAt') as string) : undefined,
      deliveryPhoto: formData.get('deliveryPhoto') as string
    });
  }
} 