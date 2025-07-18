<script lang="ts">
  import { HeaderNav, Footer } from "$lib/components";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  
  import Check from "lucide-svelte/icons/check";
  import ArrowRight from "lucide-svelte/icons/arrow-right";

  import { companies, features, steps, pricingPlans } from "$lib/placeholder_data";
</script>

<svelte:head>
  <title>DeliveryManager - Streamline Your Delivery Operations</title>
  <meta name="description" content="Manage orders, drivers, and deliveries all in one place with our powerful delivery management platform." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav>
    <a href="#features" role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
    <a href="#how-it-works" role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">How it works</a>
    <a href="#pricing" role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a>
  </HeaderNav>

  <main id="main-content">
    <!-- Hero Section -->
    <section class="py-20 lg:py-32" aria-labelledby="hero-heading">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 id="hero-heading" class="text-4xl lg:text-6xl font-bold text-foreground leading-tight transition-colors duration-300">
                Streamline Your Delivery Operations
              </h1>
              <p class="text-xl text-muted-foreground leading-relaxed transition-colors duration-300">
                Manage orders, drivers, and deliveries all in one place with our powerful 
                delivery management platform.
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <Button size="lg" class="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300">
                Start free trial
                <ArrowRight class="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>
              <Button variant="outline" size="lg" class="border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-300">
                See it in action
              </Button>
            </div>
          </div>

          <div class="relative">
            <div class="bg-white dark:bg-slate-800/90 rounded-2xl shadow-2xl dark:shadow-purple-900/20 p-8 transform rotate-3 hover:rotate-0 transition-all duration-300 backdrop-blur-sm" role="img" aria-label="Delivery Dashboard Preview">
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Delivery Dashboard</h3>
                  <Badge variant="secondary" class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Live</Badge>
                </div>
                
                <div class="space-y-4" aria-hidden="true">
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
    <section class="py-12 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300" aria-labelledby="trusted-heading">
      <div class="container mx-auto px-4">
        <div class="text-center space-y-8">
          <p id="trusted-heading" class="text-gray-600 dark:text-gray-400 transition-colors duration-300">Trusted by businesses all around the world</p>
          <div class="flex flex-wrap justify-center items-center gap-8 opacity-60" role="list" aria-label="Trusted companies">
            {#each companies as company}
              <div class="text-gray-400 dark:text-gray-500 font-medium transition-colors duration-300" role="listitem">{company}</div>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20" aria-labelledby="features-heading">
      <div class="container mx-auto px-4">
        <div class="text-center space-y-4 mb-16">
          <h2 id="features-heading" class="text-3xl lg:text-4xl font-bold text-foreground transition-colors duration-300">
            Everything You Need to Manage Deliveries
          </h2>
          <p class="text-xl text-muted-foreground max-w-3xl mx-auto transition-colors duration-300">
            Our platform offers a complete suite of tools to streamline your delivery operations, 
            from order management to driver tracking and customer notifications.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Platform features">
          {#each features as feature}
            <Card class="border-0 shadow-lg hover:shadow-xl dark:bg-slate-800/50 dark:shadow-purple-900/20 dark:hover:shadow-purple-900/30 transition-all duration-300 backdrop-blur-sm" role="listitem">
              <CardHeader class="space-y-4">
                <div class="w-12 h-12 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center transition-colors duration-300" aria-hidden="true">
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
    <section id="how-it-works" class="py-20 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300" aria-labelledby="how-it-works-heading">
      <div class="container mx-auto px-4">
        <div class="text-center space-y-4 mb-16">
          <h2 id="how-it-works-heading" class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">How It Works</h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            DeliveryManager streamlines your delivery process from end to end, connecting 
            businesses, drivers, and customers.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-12" role="list" aria-label="How it works steps">
          {#each steps as step}
            <div class="text-center space-y-4" role="listitem">
              <div class="w-16 h-16 bg-blue-600 dark:bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto transition-colors duration-300" aria-hidden="true">
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
    <section id="pricing" class="py-20" aria-labelledby="pricing-heading">
      <div class="container mx-auto px-4">
        <div class="text-center space-y-4 mb-16">
          <h2 id="pricing-heading" class="text-3xl lg:text-4xl font-bold text-foreground transition-colors duration-300">Simple, Transparent Pricing</h2>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto transition-colors duration-300">
            Choose the plan that fits your business needs, with no hidden fees or long-term contracts.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" role="list" aria-label="Pricing plans">
          {#each pricingPlans as plan}
            <Card class="relative dark:bg-slate-800/50 backdrop-blur-sm {plan.popular ? 'border-blue-500 dark:border-purple-500 shadow-xl scale-105 dark:shadow-purple-900/30' : 'border-gray-200 dark:border-slate-700'} transition-all duration-300 flex flex-col h-full" role="listitem">
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
                <ul class="space-y-3 flex-1 mb-6" role="list" aria-label="Plan features">
                  {#each plan.features as feature}
                    <li class="flex items-center space-x-3" role="listitem">
                      <Check class="w-5 h-5 text-green-500 dark:text-cyan-400 flex-shrink-0 transition-colors duration-300" aria-hidden="true" />
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
    <section class="py-20 bg-blue-600 dark:bg-gradient-to-r dark:from-purple-800 dark:to-purple-900 transition-all duration-500" aria-labelledby="cta-heading">
      <div class="container mx-auto px-4 text-center">
        <div class="space-y-8 max-w-3xl mx-auto">
          <h2 id="cta-heading" class="text-3xl lg:text-4xl font-bold text-white">
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
  </main>

  <Footer />
</div>