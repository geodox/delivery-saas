<script lang="ts">
  // Components
  import { HeaderNav, Footer } from "$lib/components";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  // Lucide Icons
  import ArrowUpRight from "lucide-svelte/icons/arrow-up-right";
  import ArrowDownRight from "lucide-svelte/icons/arrow-down-right";
  import Package from "lucide-svelte/icons/package";
  import Users from "lucide-svelte/icons/users";
  import CheckCircle from "lucide-svelte/icons/check-circle";
  import Clock from "lucide-svelte/icons/clock";
  import AlertCircle from "lucide-svelte/icons/alert-circle";
  // Placeholder Data
  import { stats, recentOrders, activeDrivers } from "$lib/placeholder_data";

  let { data } = $props();

  function getStatusColor(status: string) {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in-transit':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'delivering':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'break':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  }
</script>

<svelte:head>
  <title>Dashboard - DeliveryManager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav>
    <a href={`/dashboard/${data.selectedBusiness?.id}`} role="menuitem" class="text-blue-600 dark:text-purple-400 font-medium transition-colors">Dashboard</a>
    <a href={`/dashboard/${data.selectedBusiness?.id}/orders`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Orders</a>
    <a href={`/dashboard/${data.selectedBusiness?.id}/employees`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Employees</a>
    <a href={`/dashboard/${data.selectedBusiness?.id}/tracking`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Live Tracking</a>
    <a href={`/dashboard/${data.selectedBusiness?.id}/analytics`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Analytics</a>
  </HeaderNav>

  <main class="py-8">
    <div class="container mx-auto px-4">
      <!-- Page Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            {data.selectedBusiness?.name} - Dashboard
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
            Welcome back! Here's what's happening with your deliveries today.
          </p>
        </div>
          <Button href={`/dashboard/${data.selectedBusiness?.id}/edit`} variant="outline" size="sm" class="ml-4">
            Edit Business
          </Button>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {#each stats as stat}
          <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-2">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    {stat.title}
                  </p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    {stat.value}
                  </p>
                  <div class="flex items-center space-x-1">
                    {#if stat.trend === 'up'}
                      <ArrowUpRight class="w-4 h-4 text-green-500 dark:text-cyan-400" />
                    {:else}
                      <ArrowDownRight class="w-4 h-4 text-red-500" />
                    {/if}
                    <span class="text-sm font-medium {stat.trend === 'up' ? 'text-green-600 dark:text-cyan-400' : 'text-red-600'} transition-colors duration-300">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div class="w-12 h-12 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <component this={stat.icon} class="w-6 h-6 text-blue-600 dark:text-purple-400 transition-colors duration-300"></component>
                </div>
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Recent Orders -->
        <div class="lg:col-span-2">
          <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
            <CardHeader class="flex flex-row items-center justify-between">
              <div>
                <CardTitle class="text-xl dark:text-white transition-colors duration-300">Recent Orders</CardTitle>
                <CardDescription class="dark:text-gray-300 transition-colors duration-300">
                  Latest orders from your customers
                </CardDescription>
              </div>
              <Button 
                href={`/dashboard/${data.selectedBusiness?.id}/orders`}
                variant="outline" 
                size="sm" 
                class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
                >
                View all
              </Button>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                {#each recentOrders as order}
                  <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg transition-colors duration-300">
                    <div class="flex items-center space-x-4">
                      <div class="w-10 h-10 bg-blue-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                        <Package class="w-5 h-5 text-blue-600 dark:text-purple-400 transition-colors duration-300" />
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white transition-colors duration-300">{order.id}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{order.customer}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <Badge class={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <div class="text-right">
                        <p class="font-medium text-gray-900 dark:text-white transition-colors duration-300">{order.amount}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{order.time}</p>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Active Drivers -->
        <div>
          <!-- Added 'h-full' to fill gap from Quick Actions below, remove this if you want quick actions back -->
          <Card class="h-full border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300 mb-6">
            <CardHeader>
              <CardTitle class="text-xl dark:text-white transition-colors duration-300">Active Drivers</CardTitle>
              <CardDescription class="dark:text-gray-300 transition-colors duration-300">
                Current driver status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                {#each activeDrivers as driver}
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-blue-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                        <Users class="w-4 h-4 text-blue-600 dark:text-purple-400 transition-colors duration-300" />
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white transition-colors duration-300">{driver.name}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{driver.location}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <Badge class={getStatusColor(driver.status)}>
                        {driver.status}
                      </Badge>
                      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                        {driver.orders} orders
                      </p>
                    </div>
                  </div>
                {/each}
              </div>
            </CardContent>
          </Card>

          <!-- Quick Actions
          <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
            <CardHeader>
              <CardTitle class="text-xl dark:text-white transition-colors duration-300">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <Button class="w-full justify-start bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300">
                <Package class="w-4 h-4 mr-2" />
                Create New Order
              </Button>
              <Button variant="outline" class="w-full justify-start border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300">
                <MapPin class="w-4 h-4 mr-2" />
                Track Deliveries
              </Button>
              <Button variant="outline" class="w-full justify-start border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300">
                <Activity class="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card> -->
        </div>
      </div>

      <!-- Performance Overview -->
      <div class="mt-8">
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
          <CardHeader>
            <CardTitle class="text-xl dark:text-white transition-colors duration-300">Today's Performance</CardTitle>
            <CardDescription class="dark:text-gray-300 transition-colors duration-300">
              Key metrics for today's operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center p-6 bg-green-50 dark:bg-cyan-900/30 rounded-lg transition-colors duration-300">
                <CheckCircle class="w-8 h-8 text-green-600 dark:text-cyan-400 mx-auto mb-2 transition-colors duration-300" />
                <p class="text-2xl font-bold text-green-600 dark:text-cyan-400 transition-colors duration-300">94%</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">On-time Delivery</p>
              </div>
              <div class="text-center p-6 bg-blue-50 dark:bg-purple-900/30 rounded-lg transition-colors duration-300">
                <Clock class="w-8 h-8 text-blue-600 dark:text-purple-400 mx-auto mb-2 transition-colors duration-300" />
                <p class="text-2xl font-bold text-blue-600 dark:text-purple-400 transition-colors duration-300">28 min</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Avg. Delivery Time</p>
              </div>
              <div class="text-center p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg transition-colors duration-300">
                <AlertCircle class="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2 transition-colors duration-300" />
                <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400 transition-colors duration-300">3</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Pending Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>

  <Footer />
</div>