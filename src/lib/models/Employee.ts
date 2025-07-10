export type EmployeeRole = 'owner' | 'driver' | 'dispatcher' | '';
export type EmployeeStatus = 'active' | 'inactive' | 'suspended';

export class Employee {
  public id?: string;
  public userId: string;
  public businessId: string;
  public roles: EmployeeRole[];
  public status: EmployeeStatus;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(data: Partial<Employee> = {}) {
    this.id = data.id;
    this.userId = data.userId || '';
    this.businessId = data.businessId || '';
    this.roles = data.roles || [''];
    this.status = data.status || 'active';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  /**
   * Validates the employee data
   */
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (!this.businessId) {
      errors.push('Business ID is required');
    }

    if (!this.roles || this.roles.length === 0) {
      errors.push('At least one role is required');
    }

    const validRoles = ['owner', 'dispatcher', 'driver'];
    for (const role of this.roles) {
      if (!validRoles.includes(role)) {
        errors.push(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`);
      }
    }

    if (!['active', 'inactive', 'suspended'].includes(this.status)) {
      errors.push('Invalid status. Must be active, inactive, or suspended');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Converts the employee to a plain object for database storage
   */
  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      userId: this.userId,
      businessId: this.businessId,
      roles: this.roles,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Checks if the employee has a specific role
   */
  public hasRole(role: EmployeeRole): boolean {
    return this.roles.includes(role);
  }

  /**
   * Checks if the employee is active
   */
  public isActive(): boolean {
    return this.status === 'active';
  }

  /**
   * Checks if the employee is an owner
   */
  public isOwner(): boolean {
    return this.roles.includes('owner');
  }

  /**
   * Checks if the employee is a driver
   */
  public isDriver(): boolean {
    return this.roles.includes('driver');
  }

  /**
   * Adds a role to the employee
   */
  public addRole(role: EmployeeRole): void {
    if (!this.roles.includes(role)) {
      this.roles.push(role);
    }
  }

  /**
   * Removes a role from the employee
   */
  public removeRole(role: EmployeeRole): void {
    this.roles = this.roles.filter(r => r !== role);
    // Ensure at least one role remains
    if (this.roles.length === 0) {
      this.roles = ['driver'];
    }
  }
} 