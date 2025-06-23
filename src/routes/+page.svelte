<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { 
    Package, 
    MapPin, 
    Users, 
    Bell, 
    BarChart3, 
    Zap,
    Check,
    ArrowRight,
    Menu
  } from "lucide-svelte";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";

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
      price: "$29",
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
      price: "$99",
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
      price: "$249",
      period: "/month",
      description: "For businesses with high-delivery volumes and custom needs.",
      features: [
        "Unlimited drivers",
        "2000+ deliveries/month",
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
</script>

<svelte:head>
  <title>DeliveryManager - Streamline Your Delivery Operations</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <!-- Header -->
  <header class="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
    <div class="container mx-auto px-4 py-4">
      <nav class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-600 dark:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-300">
            <Package class="w-4 h-4 text-white" />
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">DeliveryManager</span>
        </div>
        
        <div class="hidden md:flex items-center space-x-8">
          <a href="#features" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
          <a href="#pricing" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">How it works</a>
          <a href="#pricing" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a>
        </div>

        <div class="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" class="hidden md:inline-flex">Log in</Button>
          <Button class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300">Get Started</Button>
          <Button variant="ghost" size="sm" class="md:hidden">
            <Menu class="w-4 h-4" />
          </Button>
        </div>
      </nav>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="py-20 lg:py-32">
    <div class="container mx-auto px-4">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-8">
          <div class="space-y-4">
            <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300">
              Streamline Your Delivery Operations
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
              Manage orders, drivers, and deliveries all in one place with our powerful 
              delivery management platform.
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <Button size="lg" class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300">
              Start free trial
              <ArrowRight class="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" class="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-300">
              See it in action
            </Button>
          </div>
        </div>

        <div class="relative">
          <div class="bg-white dark:bg-slate-800/90 rounded-2xl shadow-2xl dark:shadow-purple-900/20 p-8 transform rotate-3 hover:rotate-0 transition-all duration-300 backdrop-blur-sm">
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Delivery Dashboard</h3>
                <Badge variant="secondary" class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Live</Badge>
              </div>
              
              <div class="space-y-4">
                <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 dark:bg-purple-900/30 p-4 rounded-lg transition-colors duration-300">
                  <div class="text-2xl font-bold text-blue-600 dark:text-purple-400">247</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Active Orders</div>
                </div>
                <div class="bg-green-50 dark:bg-cyan-900/30 p-4 rounded-lg transition-colors duration-300">
                  <div class="text-2xl font-bold text-green-600 dark:text-cyan-400">18</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Drivers Online</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Trusted By Section -->
  <section class="py-12 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300">
    <div class="container mx-auto px-4">
      <div class="text-center space-y-8">
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-300">Trusted by businesses all around the world</p>
        <div class="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {#each companies as company}
            <div class="text-gray-400 dark:text-gray-500 font-medium transition-colors duration-300">{company}</div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-20">
    <div class="container mx-auto px-4">
      <div class="text-center space-y-4 mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Everything You Need to Manage Deliveries
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
          Our platform offers a complete suite of tools to streamline your delivery operations, 
          from order management to driver tracking and customer notifications.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each features as feature}
          <Card class="border-0 shadow-lg hover:shadow-xl dark:bg-slate-800/50 dark:shadow-purple-900/20 dark:hover:shadow-purple-900/30 transition-all duration-300 backdrop-blur-sm">
            <CardHeader class="space-y-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
                <svelte:component this={feature.icon} class="w-6 h-6 text-blue-600 dark:text-purple-400 transition-colors duration-300" />
              </div>
              <CardTitle class="text-xl dark:text-white transition-colors duration-300">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription class="text-base leading-relaxed dark:text-gray-300 transition-colors duration-300">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        {/each}
      </div>
    </div>
  </section>

  <!-- How It Works Section -->
  <section class="py-20 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300">
    <div class="container mx-auto px-4">
      <div class="text-center space-y-4 mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">How It Works</h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
          DeliveryManager streamlines your delivery process from end to end, connecting 
          businesses, drivers, and customers.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 mb-12">
        {#each steps as step}
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-blue-600 dark:bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto transition-colors duration-300">
              {step.number}
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">{step.title}</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">{step.description}</p>
          </div>
        {/each}
      </div>

      <div class="text-center">
        <Button size="lg" class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300">
          Start optimizing your deliveries
        </Button>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
<section id="pricing" class="py-20">
  <div class="container mx-auto px-4">
    <div class="text-center space-y-4 mb-16">
      <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Simple, Transparent Pricing</h2>
      <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
        Choose the plan that fits your business needs, with no hidden fees or long-term contracts.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {#each pricingPlans as plan}
        <Card class="relative dark:bg-slate-800/50 backdrop-blur-sm {plan.popular ? 'border-blue-500 dark:border-purple-500 shadow-xl scale-105 dark:shadow-purple-900/30' : 'border-gray-200 dark:border-slate-700'} transition-all duration-300 flex flex-col h-full">
          {#if plan.popular}
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge class="bg-blue-600 dark:bg-purple-600 text-white px-4 py-1 transition-colors duration-300">Most Popular</Badge>
            </div>
          {/if}
          
          <CardHeader class="text-center space-y-4">
            <CardTitle class="text-2xl dark:text-white transition-colors duration-300">{plan.name}</CardTitle>
            <div class="space-y-2">
              <div class="text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {plan.price}<span class="text-lg font-normal text-gray-600 dark:text-gray-400">{plan.period}</span>
              </div>
              <CardDescription class="text-base dark:text-gray-300 transition-colors duration-300">{plan.description}</CardDescription>
            </div>
          </CardHeader>
          
          <CardContent class="flex flex-col flex-1">
            <ul class="space-y-3 flex-1 mb-6">
              {#each plan.features as feature}
                <li class="flex items-center space-x-3">
                  <Check class="w-5 h-5 text-green-500 dark:text-cyan-400 flex-shrink-0 transition-colors duration-300" />
                  <span class="text-gray-700 dark:text-gray-300 transition-colors duration-300">{feature}</span>
                </li>
              {/each}
            </ul>
            
            <!-- Button positioned at bottom -->
            <div class="mt-auto">
              <Button 
                class="w-full {plan.popular ? 'bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700' : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'} transition-colors duration-300" 
                variant={plan.popular ? 'default' : 'outline'}
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  </div>
</section>

  <!-- CTA Section -->
  <section class="py-20 bg-blue-600 dark:bg-gradient-to-r dark:from-purple-800 dark:to-purple-900 transition-all duration-500">
    <div class="container mx-auto px-4 text-center">
      <div class="space-y-8 max-w-3xl mx-auto">
        <h2 class="text-3xl lg:text-4xl font-bold text-white">
          Ready to optimize your delivery operations?
        </h2>
        <p class="text-xl text-blue-100 dark:text-purple-100 transition-colors duration-300">
          Join thousands of businesses that have improved their delivery efficiency with DeliveryManager.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" class="bg-white text-blue-600 hover:bg-gray-50 dark:bg-slate-100 dark:text-purple-800 dark:hover:bg-white transition-colors duration-300">
            Start your free trial
          </Button>
          <Button size="lg" variant="outline" class="border-white text-white hover:bg-white hover:text-blue-600 dark:hover:text-purple-800 transition-colors duration-300">
            Schedule a demo
          </Button>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 dark:bg-slate-950 text-gray-300 py-16 transition-colors duration-300">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8">
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 dark:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-300">
              <Package class="w-4 h-4 text-white" />
            </div>
            <span class="text-xl font-bold text-white">DeliveryManager</span>
          </div>
          <p class="text-gray-400 dark:text-gray-500 transition-colors duration-300">
            The complete delivery management platform for modern businesses.
          </p>
        </div>

        <div class="space-y-4">
          <h4 class="text-white font-semibold">Product</h4>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-white dark:hover:text-purple-300 transition-colors">Features</a></li>
            <li><a href="#" class="hover:text-white dark:hover:text-purple-300 transition-colors">Pricing</a></li>
            <li><a href="#" class="hover:text-white dark:hover:text-purple-300 transition-colors">Integrations</a></li>
          </ul>
        </div>

        <div class="space-y-4">
          <h4 class="text-white font-semibold">Resources</h4>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-white dark:hover:text-purple-300 transition-colors">Documentation</a></li>
            <li><a href="#" class="hover:text-white dark:hover:text-purple-300 transition-colors">Blog</a></li>
            <li><a href="#" class="hover:text-white dark:hover:text-purple-300 transition-colors">Support</a></li>
            <li><a href="#" class="hover:text-white dark:hover:text-purple-300 transition-colors">API Reference</a></li>
          </ul>
        </div>

        <div class="space-y-4">
          <h4 class="text-white font-semibold">Company</h4>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-white dark:hover:text-purple-300 transition-colors">About</a></li>
            <li><a href="#" class="hover:text-white dark:hover:text-purple-300 transition-colors">Careers</a></li>
            <li><a href="#" class="hover:text-white dark:hover:text-purple-300 transition-colors">Contact</a></li>
            <li><a href="#" class="hover:text-white dark:hover:text-purple-300 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center transition-colors duration-300">
        <p class="text-gray-400 dark:text-gray-500 transition-colors duration-300">© 2025 DeliveryManager. All rights reserved.</p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a href="#" class="text-gray-400 hover:text-white dark:hover:text-purple-300 transition-colors">Twitter</a>
          <a href="#" class="text-gray-400 hover:text-white dark:hover:text-purple-300 transition-colors">LinkedIn</a>
          <a href="#" class="text-gray-400 hover:text-white dark:hover:text-purple-300 transition-colors">Facebook</a>
        </div>
      </div>
    </div>
  </footer>
</div>