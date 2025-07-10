# Order Flow Documentation

## Overview

The order flow follows a specific sequence of statuses that represent the lifecycle of a delivery order from submission to completion.

## Order Statuses

1. **pending** - Order was submitted by the customer and is waiting for business confirmation
2. **confirmed** - Business has confirmed the order and is ready to process
3. **assigned** - Business has assigned a driver to the order
4. **en_route_pickup** - Driver has received the order and confirmed they are on route to pickup the items
5. **picked_up** - Driver has picked up the items from the business
6. **en_route_delivery** - Driver has confirmed they are on the way to deliver the order
7. **delivered** - Driver has confirmed and verified delivery to the customer
8. **cancelled** - Order has been cancelled (can happen at any point)

## Business Rules

### Status Transitions
- Orders must follow the sequence: pending → confirmed → assigned → en_route_pickup → picked_up → en_route_delivery → delivered
- Orders can be cancelled at any point in the flow
- Once an order reaches "delivered" or "cancelled", no further status changes are allowed

### Cancellation Rules
- **Customer Cancellation**: Customers can only cancel orders before the driver updates the status to "en_route_pickup"
- **Business Cancellation**: Businesses can cancel orders at any point in the flow

### Driver Actions
- Drivers can only update orders that are assigned to them
- Drivers must follow the sequence: assigned → en_route_pickup → picked_up → en_route_delivery → delivered

## API Endpoints

### Order Status Updates
- `PATCH /api/orders` with action:
  - `confirm` - Move from pending to confirmed
  - `assign` - Move from confirmed to assigned (requires driver assignment)
  - `accept` - Move from assigned to en_route_pickup
  - `picked_up` - Move from en_route_pickup to picked_up
  - `en_route_delivery` - Move from picked_up to en_route_delivery
  - `delivered` - Move from en_route_delivery to delivered
  - `cancel` - Move to cancelled from any status

### Validation
- All status transitions are validated to ensure they follow the business rules
- Invalid transitions return a 400 error with details

## Frontend Integration

### Dashboard
- Shows all orders with their current status
- Allows business users to confirm, assign, and cancel orders
- Displays status with appropriate colors and labels

### Driver App
- Shows orders assigned to the driver
- Provides buttons to progress through the delivery flow
- Includes customer contact information and navigation

## Status Colors

- **pending**: Yellow
- **confirmed**: Blue
- **assigned**: Purple
- **en_route_pickup**: Orange
- **picked_up**: Indigo
- **en_route_delivery**: Cyan
- **delivered**: Green
- **cancelled**: Red

## Database Schema

The order status is stored as a string field with validation to ensure only valid statuses are allowed:

```sql
DEFINE FIELD status ON order TYPE string ASSERT $value INSIDE ["pending", "confirmed", "assigned", "en_route_pickup", "picked_up", "en_route_delivery", "delivered", "cancelled"];
```

## Utility Functions

The `src/lib/utils/orderFlow.ts` file provides utility functions for:
- Getting the next valid status
- Validating status transitions
- Checking cancellation permissions
- Getting action text for UI buttons
- Determining order state (active, in progress, etc.) 