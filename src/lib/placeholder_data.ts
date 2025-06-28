import { 
    Package, 
    MapPin, 
    Users, 
    Bell, 
    BarChart3, 
    Zap,
    Truck,
    CheckCircle,
    DollarSign,
    Clock,
    Star,
  } from "lucide-svelte";

  import type { Feature, Step, PricingPlan, Stat, RecentOrder, ActiveDriver, Order, Employee, StatusOption, LiveDelivery, DriverLocation, KPIMetric, PerformanceData, TopDriver, DeliveryZone, CustomerInsight } from "$lib/data/types";

const features: Feature[] = [
  {
    icon: Package,
    title: "Order Management",
    description: "Easily create, track, and manage delivery orders through our intuitive dashboard."
  },
  {
    icon: MapPin,
    title: "Real-time Tracking",
    description: "Track your delivery fleet in real-time and optimize routes for maximum efficiency."
  },
  {
    icon: Users,
    title: "Driver Management",
    description: "Manage your drivers, track performance, and optimize assignments."
  },
  {
    icon: Bell,
    title: "Customer Notifications",
    description: "Keep customers informed with automated SMS and email notifications about their deliveries."
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Gain insights into your delivery operations with powerful analytics and reporting tools."
  },
  {
    icon: Zap,
    title: "Integration Capabilities",
    description: "Seamlessly integrate with your existing e-commerce platforms and tools."
  }
];

const steps: Step[] = [
  {
    number: "1",
    title: "Create Orders",
    description: "Easily create delivery orders through our dashboard or automatically import them from your e-commerce platform."
  },
  {
    number: "2",
    title: "Assign & Track",
    description: "Assign orders to drivers and track deliveries in real-time with our powerful mapping and GPS tools."
  },
  {
    number: "3",
    title: "Deliver & Analyze",
    description: "Complete deliveries with proof of delivery and gain insights from comprehensive analytics and reporting."
  }
];

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "$150",
    period: "/month",
    description: "Perfect for small businesses just getting started with delivery.",
    features: [
      "Up to 5 drivers",
      "200 deliveries/month",
      "Basic analytics",
      "Email notifications"
    ],
    buttonText: "Get Started",
    popular: false
  },
  {
    name: "Professional",
    price: "$249",
    period: "/month",
    description: "For growing businesses with moderate delivery volumes.",
    features: [
      "Up to 15 drivers",
      "500 deliveries/month",
      "Advanced analytics",
      "SMS & email notifications"
    ],
    buttonText: "Get Started",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$499",
    period: "/month",
    description: "For businesses with high-delivery volumes and custom needs.",
    features: [
      "Unlimited drivers",
      "Unlimited deliveries",
      "Custom analytics & reports",
      "API access",
      "White-label customer tracking",
      "Priority support"
    ],
    buttonText: "Contact sales",
    popular: false
  }
];

const companies = ["Company 1", "Company 2", "Company 3", "Company 4", "Company 5"];

const stats: Stat[] = [
    {
      title: "Total Orders",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Package
    },
    {
      title: "Active Drivers",
      value: "18",
      change: "+2",
      trend: "up",
      icon: Truck
    },
    {
      title: "Deliveries Today",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: CheckCircle
    },
    {
      title: "Revenue",
      value: "$12,847",
      change: "-2.1%",
      trend: "down",
      icon: DollarSign
    }
  ];

const recentOrders: RecentOrder[] = [
  {
    id: "#ORD-001",
    customer: "John Smith",
    status: "delivered",
    amount: "$45.99",
    time: "2 hours ago"
  },
  {
    id: "#ORD-002",
    customer: "Sarah Johnson",
    status: "in-transit",
    amount: "$32.50",
    time: "3 hours ago"
  },
  {
    id: "#ORD-003",
    customer: "Mike Wilson",
    status: "pending",
    amount: "$78.25",
    time: "4 hours ago"
  },
  {
    id: "#ORD-004",
    customer: "Emma Davis",
    status: "delivered",
    amount: "$56.75",
    time: "5 hours ago"
  },
  {
    id: "#ORD-005",
    customer: "David Brown",
    status: "cancelled",
    amount: "$23.99",
    time: "6 hours ago"
  }
];

const activeDrivers: ActiveDriver[] = [
  {
    name: "Alex Rodriguez",
    status: "delivering",
    orders: 3,
    location: "Downtown"
  },
  {
    name: "Maria Garcia",
    status: "available",
    orders: 0,
    location: "Midtown"
  },
  {
    name: "James Wilson",
    status: "delivering",
    orders: 2,
    location: "Uptown"
  },
  {
    name: "Lisa Chen",
    status: "break",
    orders: 0,
    location: "Westside"
  }
];

const orders: Order[] = [
  {
    id: "#ORD-001",
    customer: {
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      email: "john@example.com"
    },
    items: "2x Pizza Margherita, 1x Coca Cola",
    pickup: "Mario's Pizza - 123 Main St",
    delivery: "456 Oak Avenue, Apt 2B",
    status: "delivered",
    amount: "$45.99",
    driver: "Alex Rodriguez",
    orderTime: "2024-01-15 14:30",
    deliveryTime: "2024-01-15 15:15",
    estimatedTime: "45 min"
  },
  {
    id: "#ORD-002",
    customer: {
      name: "Sarah Johnson",
      phone: "+1 (555) 234-5678",
      email: "sarah@example.com"
    },
    items: "1x Chicken Burger, 1x Fries, 1x Milkshake",
    pickup: "Burger Palace - 789 Food St",
    delivery: "321 Pine Street, Unit 5",
    status: "in-transit",
    amount: "$32.50",
    driver: "Maria Garcia",
    orderTime: "2024-01-15 15:45",
    deliveryTime: null,
    estimatedTime: "30 min"
  },
  {
    id: "#ORD-003",
    customer: {
      name: "Mike Wilson",
      phone: "+1 (555) 345-6789",
      email: "mike@example.com"
    },
    items: "3x Sushi Rolls, 1x Miso Soup, 1x Green Tea",
    pickup: "Sushi Express - 555 Asian Ave",
    delivery: "789 Elm Drive, House 12",
    status: "pending",
    amount: "$78.25",
    driver: null,
    orderTime: "2024-01-15 16:20",
    deliveryTime: null,
    estimatedTime: "40 min"
  },
  {
    id: "#ORD-004",
    customer: {
      name: "Emma Davis",
      phone: "+1 (555) 456-7890",
      email: "emma@example.com"
    },
    items: "1x Caesar Salad, 1x Grilled Chicken, 1x Water",
    pickup: "Healthy Bites - 222 Green St",
    delivery: "654 Maple Lane, Apt 3A",
    status: "preparing",
    amount: "$56.75",
    driver: "James Wilson",
    orderTime: "2024-01-15 16:45",
    deliveryTime: null,
    estimatedTime: "35 min"
  },
  {
    id: "#ORD-005",
    customer: {
      name: "David Brown",
      phone: "+1 (555) 567-8901",
      email: "david@example.com"
    },
    items: "2x Tacos, 1x Burrito, 1x Guacamole",
    pickup: "Taco Fiesta - 888 Spice Rd",
    delivery: "987 Cedar Court, Unit 7",
    status: "cancelled",
    amount: "$23.99",
    driver: null,
    orderTime: "2024-01-15 13:15",
    deliveryTime: null,
    estimatedTime: "25 min"
  },
  {
    id: "#ORD-006",
    customer: {
      name: "Lisa Chen",
      phone: "+1 (555) 678-9012",
      email: "lisa@example.com"
    },
    items: "1x Pad Thai, 1x Spring Rolls, 1x Thai Tea",
    pickup: "Thai Garden - 333 Flavor St",
    delivery: "147 Birch Avenue, House 8",
    status: "assigned",
    amount: "$41.80",
    driver: "Lisa Chen",
    orderTime: "2024-01-15 17:00",
    deliveryTime: null,
    estimatedTime: "50 min"
  }
];

let employees: Employee[] = [
  {
    id: "DRV-001",
    name: "Alex Rodriguez",
    email: "alex@deliverymanager.com",
    phone: "+1 (555) 123-4567",
    status: "online",
    location: "Downtown",
    currentOrders: 3,
    totalDeliveries: 247,
    rating: 4.8,
    joinDate: "2023-06-15",
    vehicle: {
      type: "Motorcycle",
      plate: "ABC-123"
    },
    licenseNumber: "DL123456789",
    lastActive: "2024-01-15 17:30",
    role: "driver"
  },
  {
    id: "DRV-002",
    name: "Maria Garcia",
    email: "maria@deliverymanager.com",
    phone: "+1 (555) 234-5678",
    status: "available",
    location: "Midtown",
    currentOrders: 0,
    totalDeliveries: 189,
    rating: 4.9,
    joinDate: "2023-08-22",
    vehicle: {
      type: "Car",
      plate: "XYZ-789"
    },
    licenseNumber: "DL987654321",
    lastActive: "2024-01-15 17:25",
    role: "driver"
  },
  {
    id: "DRV-003",
    name: "James Wilson",
    email: "james@deliverymanager.com",
    phone: "+1 (555) 345-6789",
    status: "delivering",
    location: "Uptown",
    currentOrders: 2,
    totalDeliveries: 156,
    rating: 4.7,
    joinDate: "2023-09-10",
    vehicle: {
      type: "Bicycle",
      plate: "N/A"
    },
    licenseNumber: "DL456789123",
    lastActive: "2024-01-15 17:35",
    role: "driver"
  },
  {
    id: "DSP-001",
    name: "Lisa Chen",
    email: "lisa@deliverymanager.com",
    phone: "+1 (555) 456-7890",
    status: "break",
    location: "Westside",
    currentOrders: 0,
    totalDeliveries: 203,
    rating: 4.6,
    joinDate: "2023-07-03",
    vehicle: {
      type: "Scooter",
      plate: "SCT-456"
    },
    licenseNumber: "DL789123456",
    lastActive: "2024-01-15 16:45",
    role: "dispatcher"
  },
  {
    id: "DRV-004",
    name: "David Brown",
    email: "david@deliverymanager.com",
    phone: "+1 (555) 567-8901",
    status: "offline",
    location: "Eastside",
    currentOrders: 0,
    totalDeliveries: 98,
    rating: 4.5,
    joinDate: "2023-11-18",
    vehicle: {
      type: "Car",
      plate: "DEF-321"
    },
    licenseNumber: "DL321654987",
    lastActive: "2024-01-15 14:20",
    role: "driver"
  },
  {
    id: "DSP-002",
    name: "Sarah Kim",
    email: "sarah@deliverymanager.com",
    phone: "+1 (555) 678-9012",
    status: "online",
    location: "Southside",
    currentOrders: 1,
    totalDeliveries: 134,
    rating: 4.8,
    joinDate: "2023-10-05",
    vehicle: {
      type: "Motorcycle",
      plate: "MTO-789"
    },
    licenseNumber: "DL654987321",
    lastActive: "2024-01-15 17:40",
    role: "dispatcher"
  }
];

const statusOptions: StatusOption[] = [
  { value: "all", label: "All" },
  { value: "online", label: "Online" },
  { value: "available", label: "Available" },
  { value: "delivering", label: "Delivering" },
  { value: "break", label: "On Break" },
  { value: "offline", label: "Offline" }
];

const vehicleTypes = [
  "Car",
  "Motorcycle",
  "Bicycle",
  "Scooter",
  "Van"
];

const liveDeliveries: LiveDelivery[] = [
  {
    id: "#ORD-001",
    driver: "Alex Rodriguez",
    customer: "John Smith",
    address: "123 Main St, Downtown",
    phone: "+1 (555) 123-4567",
    status: "in-transit",
    estimatedTime: "15 min",
    progress: 75,
    lastUpdate: "2 min ago",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: "#ORD-002",
    driver: "Maria Garcia",
    customer: "Sarah Johnson",
    address: "456 Oak Ave, Midtown",
    phone: "+1 (555) 234-5678",
    status: "approaching",
    estimatedTime: "5 min",
    progress: 90,
    lastUpdate: "1 min ago",
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: "#ORD-003",
    driver: "James Wilson",
    customer: "Mike Wilson",
    address: "789 Pine Rd, Uptown",
    phone: "+1 (555) 345-6789",
    status: "picked-up",
    estimatedTime: "25 min",
    progress: 25,
    lastUpdate: "5 min ago",
    coordinates: { lat: 40.7831, lng: -73.9712 }
  },
  {
    id: "#ORD-004",
    driver: "Lisa Chen",
    customer: "Emma Davis",
    address: "321 Elm St, Westside",
    phone: "+1 (555) 456-7890",
    status: "delivered",
    estimatedTime: "Completed",
    progress: 100,
    lastUpdate: "10 min ago",
    coordinates: { lat: 40.7282, lng: -74.0776 }
  }
];

const driverLocations: DriverLocation[] = [
  {
    name: "Alex Rodriguez",
    status: "delivering",
    location: "Downtown",
    orders: 2,
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    name: "Maria Garcia",
    status: "delivering",
    location: "Midtown",
    orders: 1,
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    name: "James Wilson",
    status: "delivering",
    location: "Uptown",
    orders: 3,
    coordinates: { lat: 40.7831, lng: -73.9712 }
  },
  {
    name: "Lisa Chen",
    status: "available",
    location: "Westside",
    orders: 0,
    coordinates: { lat: 40.7282, lng: -74.0776 }
  }
];

const kpiMetrics: KPIMetric[] = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+12.5%",
    trend: "up",
    period: "vs last week",
    icon: DollarSign
  },
  {
    title: "Total Orders",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    period: "vs last week",
    icon: Package
  },
  {
    title: "Avg Delivery Time",
    value: "28 min",
    change: "-5.1%",
    trend: "up",
    period: "vs last week",
    icon: Clock
  },
  {
    title: "Customer Rating",
    value: "4.8",
    change: "+0.2",
    trend: "up",
    period: "vs last week",
    icon: Star
  }
];

const performanceData: PerformanceData[] = [
  { day: "Mon", orders: 45, revenue: 1250, avgTime: 32 },
  { day: "Tue", orders: 52, revenue: 1450, avgTime: 28 },
  { day: "Wed", orders: 38, revenue: 1100, avgTime: 35 },
  { day: "Thu", orders: 61, revenue: 1680, avgTime: 25 },
  { day: "Fri", orders: 58, revenue: 1590, avgTime: 30 },
  { day: "Sat", orders: 72, revenue: 2100, avgTime: 22 },
  { day: "Sun", orders: 49, revenue: 1380, avgTime: 29 }
];

const topDrivers: TopDriver[] = [
  {
    name: "Alex Rodriguez",
    deliveries: 156,
    rating: 4.9,
    onTime: 98,
    revenue: "$4,250"
  },
  {
    name: "Maria Garcia",
    deliveries: 142,
    rating: 4.8,
    onTime: 95,
    revenue: "$3,890"
  },
  {
    name: "James Wilson",
    deliveries: 138,
    rating: 4.7,
    onTime: 92,
    revenue: "$3,720"
  },
  {
    name: "Lisa Chen",
    deliveries: 134,
    rating: 4.9,
    onTime: 96,
    revenue: "$3,650"
  }
];

const deliveryZones: DeliveryZone[] = [
  {
    zone: "Downtown",
    orders: 342,
    percentage: 35,
    avgTime: "25 min",
    revenue: "$12,450"
  },
  {
    zone: "Midtown",
    orders: 298,
    percentage: 30,
    avgTime: "28 min",
    revenue: "$10,890"
  },
  {
    zone: "Uptown",
    orders: 186,
    percentage: 19,
    avgTime: "32 min",
    revenue: "$7,230"
  },
  {
    zone: "Westside",
    orders: 156,
    percentage: 16,
    avgTime: "35 min",
    revenue: "$5,680"
  }
];

const customerInsights: CustomerInsight[] = [
  {
    metric: "New Customers",
    value: "234",
    change: "+18.5%",
    trend: "up"
  },
  {
    metric: "Repeat Orders",
    value: "68%",
    change: "+5.2%",
    trend: "up"
  },
  {
    metric: "Avg Order Value",
    value: "$36.25",
    change: "-2.1%",
    trend: "down"
  },
  {
    metric: "Customer Retention",
    value: "84%",
    change: "+3.8%",
    trend: "up"
  }
];

export {
  features,
  steps,
  pricingPlans,
  companies,
  stats,
  recentOrders,
  activeDrivers,
  orders,
  employees as drivers,
  statusOptions,
  vehicleTypes,
  liveDeliveries,
  driverLocations,
  kpiMetrics,
  performanceData,
  topDrivers,
  deliveryZones,
  customerInsights
}