export type RadiusUnit = 'miles' | 'kilometers';

export class DeliverySettings {
  public radius: number;
  public radiusUnit: RadiusUnit;
  public specialRequirements?: string;

  constructor(data: Partial<DeliverySettings> = {}) {
    this.radius = data.radius || 10;
    this.radiusUnit = data.radiusUnit || 'miles';
    this.specialRequirements = data.specialRequirements;
  }

  /**
   * Validates the delivery settings
   */
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.radius || this.radius < 1) {
      errors.push('Delivery radius must be at least 1');
    }

    if (this.radius > 100) {
      errors.push('Delivery radius cannot exceed 100');
    }

    if (!['miles', 'kilometers'].includes(this.radiusUnit)) {
      errors.push('Radius unit must be either miles or kilometers');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Converts the delivery settings to a plain object
   */
  public toJSON(): Record<string, any> {
    return {
      radius: this.radius,
      radiusUnit: this.radiusUnit,
      specialRequirements: this.specialRequirements
    };
  }

  /**
   * Returns the radius with unit as a formatted string
   */
  public getFormattedRadius(): string {
    return `${this.radius} ${this.radiusUnit}`;
  }

  /**
   * Converts radius to kilometers
   */
  public getRadiusInKilometers(): number {
    if (this.radiusUnit === 'kilometers') {
      return this.radius;
    }
    return this.radius * 1.60934; // Convert miles to kilometers
  }

  /**
   * Converts radius to miles
   */
  public getRadiusInMiles(): number {
    if (this.radiusUnit === 'miles') {
      return this.radius;
    }
    return this.radius * 0.621371; // Convert kilometers to miles
  }
} 