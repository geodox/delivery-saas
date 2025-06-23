import { 
    Package, 
    MapPin, 
    Users, 
    Bell, 
    BarChart3, 
    Zap,
  } from "lucide-svelte";

const features = [
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

const steps = [
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

const pricingPlans = [
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

export {
  features,
  steps,
  pricingPlans,
  companies
}