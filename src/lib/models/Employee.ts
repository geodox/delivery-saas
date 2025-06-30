export type EmployeeRole = 'owner' | 'manager' | 'driver' | 'dispatcher';
export type EmployeeStatus = 'active' | 'inactive' | 'suspended';

export class Employee {
  public id?: string;
  public userId: string;
  public businessId: string;
  public role: EmployeeRole;
  public status: EmployeeStatus;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(data: Partial<Employee> = {}) {
    this.id = data.id;
    this.userId = data.userId || '';
    this.businessId = data.businessId || '';
    this.role = data.role || 'driver';
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

    if (!['owner', 'manager', 'driver', 'dispatcher'].includes(this.role)) {
      errors.push('Invalid role. Must be owner, manager, driver, or dispatcher');
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
      role: this.role,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Checks if the employee has a specific role
   */
  public hasRole(role: EmployeeRole): boolean {
    return this.role === role;
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
    return this.role === 'owner';
  }

  /**
   * Checks if the employee is a driver
   */
  public isDriver(): boolean {
    return this.role === 'driver';
  }

  /**
   * Checks if the employee is a manager or owner
   */
  public isManager(): boolean {
    return this.role === 'manager' || this.role === 'owner';
  }
} 