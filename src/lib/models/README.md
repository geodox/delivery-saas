# Business Models

This directory contains TypeScript classes for managing business-related data in the delivery SaaS application.

## Classes

### Business
The main business entity that represents a delivery service business.

**Properties:**
- `id?: string` - Unique identifier
- `name: string` - Business name
- `description: string` - Business description
- `website?: string` - Business website
- `phone?: string` - Business phone number
- `address: Address` - Business address
- `delivery: DeliverySettings` - Delivery configuration
- `operatingHours: OperatingHours` - Operating hours
- `ownerId?: string` - Owner user ID
- `createdAt?: Date` - Creation timestamp
- `updatedAt?: Date` - Last update timestamp

**Methods:**
- `validate()` - Validates all business data
- `toJSON()` - Converts to plain object for database storage
- `fromFormData(formData: FormData)` - Creates instance from form data

### Address
Represents a business address.

**Properties:**
- `street: string` - Street address
- `city: string` - City
- `stateProvince: string` - State/province
- `zipPostalCode: string` - ZIP/postal code
- `country: string` - Country

**Methods:**
- `validate()` - Validates address data
- `toJSON()` - Converts to plain object
- `getFormattedAddress()` - Returns formatted address string

### DeliverySettings
Represents delivery configuration.

**Properties:**
- `radius: number` - Delivery radius
- `radiusUnit: 'miles' | 'kilometers'` - Radius unit
- `specialRequirements?: string` - Special delivery requirements

**Methods:**
- `validate()` - Validates delivery settings
- `toJSON()` - Converts to plain object
- `getFormattedRadius()` - Returns formatted radius string
- `getRadiusInKilometers()` - Converts radius to kilometers
- `getRadiusInMiles()` - Converts radius to miles

### OperatingHours
Represents business operating hours for each day of the week.

**Properties:**
- `monday: DayHours` - Monday hours
- `tuesday: DayHours` - Tuesday hours
- `wednesday: DayHours` - Wednesday hours
- `thursday: DayHours` - Thursday hours
- `friday: DayHours` - Friday hours
- `saturday: DayHours` - Saturday hours
- `sunday: DayHours` - Sunday hours

**Methods:**
- `validate()` - Validates operating hours
- `toJSON()` - Converts to plain object
- `getDayHours(day: DayOfWeek)` - Gets hours for specific day
- `setDayHours(day: DayOfWeek, hours: DayHours)` - Sets hours for specific day
- `isOpenOnDay(day: DayOfWeek)` - Checks if open on specific day
- `getOpenDays()` - Gets all open days
- `getFormattedHours()` - Returns formatted hours string

### Employee
Represents an employee/team member.

**Properties:**
- `id?: string` - Unique identifier
- `userId: string` - User ID
- `businessId: string` - Business ID
- `role: EmployeeRole` - Employee role
- `status: EmployeeStatus` - Employee status
- `createdAt?: Date` - Creation timestamp
- `updatedAt?: Date` - Last update timestamp

**Methods:**
- `validate()` - Validates employee data
- `toJSON()` - Converts to plain object
- `hasRole(role: EmployeeRole)` - Checks if has specific role
- `isActive()` - Checks if employee is active
- `isOwner()` - Checks if employee is owner
- `isDriver()` - Checks if employee is driver
- `isManager()` - Checks if employee is manager or owner

## SvelteKit Transport

The application uses SvelteKit's transport system to serialize and deserialize Business objects between client and server.

### Transport Configuration (`src/hooks.ts`)

```typescript
import type { Transport } from "@sveltejs/kit";
import { Business } from "$lib/models";

export const transport: Transport = {
	Business: {
		encode: (value) => {
			if (value instanceof Business) {
				return [value.toJSON()];
			}
			return undefined;
		},
		decode: ([data]) => {
			if (data && typeof data === 'object') {
				return new Business(data);
			}
			return undefined;
		}
	}
};
```

### How It Works

1. **Server**: Creates Business instances and returns them from load functions
2. **Transport.encode()**: Converts Business instances to JSON using `toJSON()`
3. **Client**: Receives the JSON data
4. **Transport.decode()**: Reconstructs Business instances from JSON
5. **Result**: Client gets fully functional Business objects with all methods

### Benefits

- **Full Object Functionality**: Business objects retain all methods on the client
- **Type Safety**: Full TypeScript support across client/server boundary
- **Automatic Serialization**: No manual conversion needed
- **Validation**: Can use `business.validate()` on both client and server
- **Consistency**: Same object structure everywhere

## Usage Examples

### Server-Side (Load Functions)

```typescript
// src/routes/dashboard/+layout.server.ts
import { Business } from '$lib/models';

export const load = async () => {
  // Create Business instances
  const business = new Business({
    name: 'My Business',
    description: 'Description',
    // ... other properties
  });

  return {
    business // Will be automatically serialized by transport
  };
};
```

### Client-Side (Components)

```typescript
// src/routes/dashboard/+layout.svelte
<script lang="ts">
  import type { Business } from '$lib/models';

  let { data } = $props<{
    data: { business: Business }
  }>();

  // Use all Business methods
  console.log(data.business.name);
  console.log(data.business.address.getFormattedAddress());
  console.log(data.business.delivery.getFormattedRadius());
  
  // Validation works
  const validation = data.business.validate();
  if (!validation.isValid) {
    console.log('Errors:', validation.errors);
  }
</script>
```

## Types

### DayHours
```typescript
interface DayHours {
  open: string;    // HH:MM format
  close: string;   // HH:MM format
  enabled: boolean;
}
```

### DayOfWeek
```typescript
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
```

### RadiusUnit
```typescript
type RadiusUnit = 'miles' | 'kilometers';
```

### EmployeeRole
```typescript
type EmployeeRole = 'owner' | 'manager' | 'driver' | 'dispatcher';
```

### EmployeeStatus
```typescript
type EmployeeStatus = 'active' | 'inactive' | 'suspended';
```

## Benefits

1. **Type Safety**: Full TypeScript support with proper type checking
2. **Validation**: Built-in validation methods for all data
3. **Encapsulation**: Business logic is encapsulated within classes
4. **Reusability**: Classes can be used across different parts of the application
5. **Maintainability**: Easy to modify and extend functionality
6. **Consistency**: Standardized data structure across the application
7. **Transport**: Seamless serialization between client and server
8. **Method Access**: All object methods available on both client and server 