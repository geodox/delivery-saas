export class Address {
  public street: string;
  public city: string;
  public stateProvince: string;
  public zipPostalCode: string;
  public country: string;

  constructor(data: Partial<Address> = {}) {
    this.street = data.street || '';
    this.city = data.city || '';
    this.stateProvince = data.stateProvince || '';
    this.zipPostalCode = data.zipPostalCode || '';
    this.country = data.country || '';
  }

  /**
   * Validates the address data
   */
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.street?.trim()) {
      errors.push('Street address is required');
    }

    if (!this.city?.trim()) {
      errors.push('City is required');
    }

    if (!this.zipPostalCode?.trim()) {
      errors.push('ZIP/Postal code is required');
    }

    if (!this.country?.trim()) {
      errors.push('Country is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Converts the address to a plain object
   */
  public toJSON(): Record<string, any> {
    return {
      street: this.street,
      city: this.city,
      stateProvince: this.stateProvince,
      zipPostalCode: this.zipPostalCode,
      country: this.country
    };
  }

  /**
   * Returns a formatted address string
   */
  public getFormattedAddress(): string {
    const parts = [
      this.street,
      this.city,
      this.stateProvince,
      this.zipPostalCode,
      this.country
    ].filter(part => part?.trim());

    return parts.join(', ');
  }
} 