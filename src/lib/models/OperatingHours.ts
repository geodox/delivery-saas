export interface DayHours {
  open: string;
  close: string;
  enabled: boolean;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export class OperatingHours {
  public monday: DayHours;
  public tuesday: DayHours;
  public wednesday: DayHours;
  public thursday: DayHours;
  public friday: DayHours;
  public saturday: DayHours;
  public sunday: DayHours;

  constructor(data: Partial<OperatingHours> = {}) {
    this.monday = data.monday || { open: '09:00', close: '18:00', enabled: true };
    this.tuesday = data.tuesday || { open: '09:00', close: '18:00', enabled: true };
    this.wednesday = data.wednesday || { open: '09:00', close: '18:00', enabled: true };
    this.thursday = data.thursday || { open: '09:00', close: '18:00', enabled: true };
    this.friday = data.friday || { open: '09:00', close: '18:00', enabled: true };
    this.saturday = data.saturday || { open: '10:00', close: '16:00', enabled: true };
    this.sunday = data.sunday || { open: '10:00', close: '16:00', enabled: false };
  }

  /**
   * Validates the operating hours
   */
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    for (const day of days) {
      const hours = this[day];
      
      if (hours.enabled) {
        if (!hours.open || !hours.close) {
          errors.push(`${day.charAt(0).toUpperCase() + day.slice(1)}: Open and close times are required when enabled`);
        } else {
          // Validate time format (HH:MM)
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!timeRegex.test(hours.open) || !timeRegex.test(hours.close)) {
            errors.push(`${day.charAt(0).toUpperCase() + day.slice(1)}: Invalid time format. Use HH:MM format`);
          } else {
            // Check if close time is after open time
            const openTime = this.parseTime(hours.open);
            const closeTime = this.parseTime(hours.close);
            
            if (openTime >= closeTime) {
              errors.push(`${day.charAt(0).toUpperCase() + day.slice(1)}: Close time must be after open time`);
            }
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Converts the operating hours to a plain object
   */
  public toJSON(): Record<string, any> {
    return {
      monday: this.monday,
      tuesday: this.tuesday,
      wednesday: this.wednesday,
      thursday: this.thursday,
      friday: this.friday,
      saturday: this.saturday,
      sunday: this.sunday
    };
  }

  /**
   * Gets hours for a specific day
   */
  public getDayHours(day: DayOfWeek): DayHours {
    return this[day];
  }

  /**
   * Sets hours for a specific day
   */
  public setDayHours(day: DayOfWeek, hours: DayHours): void {
    this[day] = hours;
  }

  /**
   * Checks if the business is open on a specific day
   */
  public isOpenOnDay(day: DayOfWeek): boolean {
    return this[day].enabled;
  }

  /**
   * Gets all days that are open
   */
  public getOpenDays(): DayOfWeek[] {
    const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.filter(day => this[day].enabled);
  }

  /**
   * Parses time string to minutes for comparison
   */
  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Returns a formatted string of operating hours
   */
  public getFormattedHours(): string {
    const openDays = this.getOpenDays();
    if (openDays.length === 0) {
      return 'Closed';
    }

    const dayNames = {
      monday: 'Mon',
      tuesday: 'Tue', 
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun'
    };

    return openDays.map(day => {
      const hours = this[day];
      return `${dayNames[day]}: ${hours.open}-${hours.close}`;
    }).join(', ');
  }
} 