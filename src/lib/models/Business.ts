import { Address } from './Address';
import { DeliverySettings } from './DeliverySettings';
import type { RadiusUnit } from './DeliverySettings';
import { OperatingHours } from './OperatingHours';

export class Business {
  public id?: string;
  public name: string;
  public description: string;
  public website?: string;
  public phone?: string;
  public address: Address;
  public delivery: DeliverySettings;
  public operatingHours: OperatingHours;
  public ownerId?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(data: Partial<Business> = {}) {
    this.id = data.id;
    this.name = data.name || '';
    this.description = data.description || '';
    this.website = data.website;
    this.phone = data.phone;
    this.address = data.address ? new Address(data.address) : new Address();
    this.delivery = data.delivery ? new DeliverySettings(data.delivery) : new DeliverySettings();
    this.operatingHours = data.operatingHours ? new OperatingHours(data.operatingHours) : new OperatingHours();
    this.ownerId = data.ownerId;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  /**
   * Validates the business data
   */
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name?.trim()) {
      errors.push('Business name is required');
    }

    if (!this.description?.trim()) {
      errors.push('Business description is required');
    }

    // Validate address
    const addressValidation = this.address.validate();
    if (!addressValidation.isValid) {
      errors.push(...addressValidation.errors.map((error: string) => `Address: ${error}`));
    }

    // Validate delivery settings
    const deliveryValidation = this.delivery.validate();
    if (!deliveryValidation.isValid) {
      errors.push(...deliveryValidation.errors.map((error: string) => `Delivery: ${error}`));
    }

    // Validate operating hours
    const hoursValidation = this.operatingHours.validate();
    if (!hoursValidation.isValid) {
      errors.push(...hoursValidation.errors.map((error: string) => `Operating Hours: ${error}`));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Converts the business to a plain object for database storage
   */
  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      website: this.website,
      phone: this.phone,
      address: this.address.toJSON(),
      delivery: this.delivery.toJSON(),
      operatingHours: this.operatingHours.toJSON(),
      ownerId: this.ownerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Converts the business to a plain object for database updates (excludes date fields)
   */
  public toDBSafeJSON(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      website: this.website,
      phone: this.phone,
      address: this.address.toJSON(),
      delivery: this.delivery.toJSON(),
      operatingHours: this.operatingHours.toJSON(),
      ownerId: this.ownerId
      // Exclude createdAt and updatedAt - let SurrealDB handle these
    };
  }

  /**
   * Creates a Business instance from form data
   */
  public static fromFormData(formData: FormData): Business {
    return new Business({
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      website: formData.get('website') as string,
      phone: formData.get('phone') as string,
      address: new Address({
        street: formData.get('streetAddress') as string,
        city: formData.get('city') as string,
        stateProvince: formData.get('stateProvince') as string,
        zipPostalCode: formData.get('zipPostalCode') as string,
        country: formData.get('country') as string
      }),
      delivery: new DeliverySettings({
        radius: parseInt(formData.get('deliveryRadius') as string),
        radiusUnit: formData.get('deliveryRadiusUnit') as RadiusUnit,
        specialRequirements: formData.get('specialRequirements') as string
      }),
      operatingHours: new OperatingHours(JSON.parse(formData.get('operatingHours') as string)),
      ownerId: formData.get('ownerId') as string
    });
  }
} 