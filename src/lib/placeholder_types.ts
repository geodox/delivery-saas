// Basic types
type TrendDirection = "up" | "down";
type OrderStatus = "delivered" | "in-transit" | "pending" | "preparing" | "cancelled" | "assigned";
type DriverStatus = "online" | "available" | "delivering" | "break" | "offline";
type VehicleType = "Car" | "Motorcycle" | "Bicycle" | "Scooter" | "Van";
type DeliveryStatus = "in-transit" | "approaching" | "picked-up" | "delivered";

// Feature interface
interface Feature {
  icon: any;
  title: string;
  description: string;
}

// Step interface
interface Step {
  number: string;
  title: string;
  description: string;
}

// Pricing plan interface
interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  popular: boolean;
}

// Stats interface
interface Stat {
  title: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon: any;
}

// Customer interface
interface Customer {
  name: string;
  phone: string;
  email: string;
}

// Vehicle interface
interface Vehicle {
  type: VehicleType;
  plate: string;
}

// Coordinates interface
interface Coordinates {
  lat: number;
  lng: number;
}

// Recent order interface
interface RecentOrder {
  id: string;
  customer: string;
  status: OrderStatus;
  amount: string;
  time: string;
}

// Active driver interface
interface ActiveDriver {
  name: string;
  status: DriverStatus;
  orders: number;
  location: string;
}

// Full order interface
interface Order {
  id: string;
  customer: Customer;
  items: string;
  pickup: string;
  delivery: string;
  status: OrderStatus;
  amount: string;
  driver: string | null;
  orderTime: string;
  deliveryTime: string | null;
  estimatedTime: string;
}

// Employee interface
interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: DriverStatus;
  location: string;
  currentOrders: number;
  totalDeliveries: number;
  rating: number;
  joinDate: string;
  vehicle: Vehicle;
  licenseNumber: string;
  lastActive: string;
  role: "driver" | "dispatcher";
}

// Status option interface
interface StatusOption {
  value: string;
  label: string;
}

// Live delivery interface
interface LiveDelivery {
  id: string;
  driver: string;
  customer: string;
  address: string;
  phone: string;
  status: DeliveryStatus;
  estimatedTime: string;
  progress: number;
  lastUpdate: string;
  coordinates: Coordinates;
}

// Driver location interface
interface DriverLocation {
  name: string;
  status: DriverStatus;
  location: string;
  orders: number;
  coordinates: Coordinates;
}

// KPI metric interface
interface KPIMetric {
  title: string;
  value: string;
  change: string;
  trend: TrendDirection;
  period: string;
  icon: any;
}

// Performance data interface
interface PerformanceData {
  day: string;
  orders: number;
  revenue: number;
  avgTime: number;
}

// Top driver interface
interface TopDriver {
  name: string;
  deliveries: number;
  rating: number;
  onTime: number;
  revenue: string;
}

// Delivery zone interface
interface DeliveryZone {
  zone: string;
  orders: number;
  percentage: number;
  avgTime: string;
  revenue: string;
}

// Customer insight interface
interface CustomerInsight {
  metric: string;
  value: string;
  change: string;
  trend: TrendDirection;
}

// Export all types
export type {
  TrendDirection,
  OrderStatus,
  DriverStatus,
  VehicleType,
  DeliveryStatus,
  Feature,
  Step,
  PricingPlan,
  Stat,
  Customer,
  Vehicle,
  Coordinates,
  RecentOrder,
  ActiveDriver,
  Order,
  Employee,
  StatusOption,
  LiveDelivery,
  DriverLocation,
  KPIMetric,
  PerformanceData,
  TopDriver,
  DeliveryZone,
  CustomerInsight,
};