import type { OrderStatus } from '$lib/models/Order';

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed', 
  'assigned',
  'en_route_pickup',
  'picked_up',
  'en_route_delivery',
  'delivered',
  'cancelled'
];

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  pending: 'Order submitted and waiting for business confirmation',
  confirmed: 'Business has confirmed the order',
  assigned: 'Business has assigned a driver to the order',
  en_route_pickup: 'Driver is on route to pickup the order',
  picked_up: 'Driver has picked up the order',
  en_route_delivery: 'Driver is on route to deliver the order',
  delivered: 'Order has been delivered successfully',
  cancelled: 'Order has been cancelled'
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  assigned: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  en_route_pickup: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
  picked_up: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
  en_route_delivery: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800',
  delivered: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  assigned: 'Assigned',
  en_route_pickup: 'En Route to Pickup',
  picked_up: 'Picked Up',
  en_route_delivery: 'En Route to Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

/**
 * Get the next possible status for an order
 */
export function getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
  switch (currentStatus) {
    case 'pending':
      return 'confirmed';
    case 'confirmed':
      return 'assigned';
    case 'assigned':
      return 'en_route_pickup';
    case 'en_route_pickup':
      return 'picked_up';
    case 'picked_up':
      return 'en_route_delivery';
    case 'en_route_delivery':
      return 'delivered';
    case 'delivered':
    case 'cancelled':
      return null;
    default:
      return null;
  }
}

/**
 * Check if a status transition is valid
 */
export function isValidStatusTransition(fromStatus: OrderStatus, toStatus: OrderStatus): boolean {
  // Cancelled can be set from any status
  if (toStatus === 'cancelled') {
    return true;
  }

  // Delivered can only be set from en_route_delivery
  if (toStatus === 'delivered') {
    return fromStatus === 'en_route_delivery';
  }

  // Check normal flow progression
  const nextStatus = getNextStatus(fromStatus);
  return nextStatus === toStatus;
}

/**
 * Check if a customer can cancel an order
 */
export function canCustomerCancel(status: OrderStatus): boolean {
  // Customer can cancel before driver starts pickup
  return ['pending', 'confirmed', 'assigned'].includes(status);
}

/**
 * Check if a business can cancel an order
 */
export function canBusinessCancel(status: OrderStatus): boolean {
  // Business can cancel at any point
  return true;
}

/**
 * Get the action required to move to the next status
 */
export function getNextAction(currentStatus: OrderStatus): string | null {
  switch (currentStatus) {
    case 'pending':
      return 'confirm';
    case 'confirmed':
      return 'assign';
    case 'assigned':
      return 'accept';
    case 'en_route_pickup':
      return 'picked_up';
    case 'picked_up':
      return 'en_route_delivery';
    case 'en_route_delivery':
      return 'delivered';
    default:
      return null;
  }
}

/**
 * Get the button text for the next action
 */
export function getNextActionText(currentStatus: OrderStatus): string | null {
  switch (currentStatus) {
    case 'pending':
      return 'Confirm Order';
    case 'confirmed':
      return 'Assign Driver';
    case 'assigned':
      return 'Start Pickup';
    case 'en_route_pickup':
      return 'Mark as Picked Up';
    case 'picked_up':
      return 'Start Delivery Route';
    case 'en_route_delivery':
      return 'Mark as Delivered';
    default:
      return null;
  }
}

/**
 * Check if an order is active (not delivered or cancelled)
 */
export function isOrderActive(status: OrderStatus): boolean {
  return !['delivered', 'cancelled'].includes(status);
}

/**
 * Check if an order is in progress (assigned to driver)
 */
export function isOrderInProgress(status: OrderStatus): boolean {
  return ['assigned', 'en_route_pickup', 'picked_up', 'en_route_delivery'].includes(status);
}

/**
 * Check if an order is ready for pickup
 */
export function isOrderReadyForPickup(status: OrderStatus): boolean {
  return status === 'assigned';
}

/**
 * Check if an order is being delivered
 */
export function isOrderBeingDelivered(status: OrderStatus): boolean {
  return ['en_route_delivery'].includes(status);
} 