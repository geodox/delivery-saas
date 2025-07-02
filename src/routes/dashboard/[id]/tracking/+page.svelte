<!-- src/routes/dashboard/tracking/+page.svelte -->
<script lang="ts">
  // Components
  import { HeaderNav, Footer } from "$lib/components";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  // Lucide Icons
  import MapPin from "lucide-svelte/icons/map-pin";
  import Navigation from "lucide-svelte/icons/navigation";
  import Clock from "lucide-svelte/icons/clock";
  import Phone from "lucide-svelte/icons/phone";
  import User from "lucide-svelte/icons/user";
  import Package from "lucide-svelte/icons/package";
  import Truck from "lucide-svelte/icons/truck";
  import RefreshCw from "lucide-svelte/icons/refresh-cw";
  import Search from "lucide-svelte/icons/search";
  import Eye from "lucide-svelte/icons/eye";
  import MessageSquare from "lucide-svelte/icons/message-square";
  // Placeholder Data
  import { liveDeliveries, driverLocations } from "$lib/placeholder_data";

  const { data } = $props();

  let searchQuery = $state("");
  let selectedFilter = $state("all");

  function getStatusColor(status: string) {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in-transit':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'approaching':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'picked-up':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'delivering':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  }

  function getDriverStatusColor(status: string) {
    switch (status) {
      case 'delivering':
        return 'bg-blue-500';
      case 'available':
        return 'bg-green-500';
      case 'break':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }

  const filteredDeliveries = liveDeliveries.filter(delivery => {
    const matchesSearch = delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         delivery.driver.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || delivery.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });
</script>

<svelte:head>
  <title>Live Tracking - DeliveryManager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav>
    <a href={`/dashboard/${data.selectedBusiness?.id}`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</a>
    <a href={`/dashboard/${data.selectedBusiness?.id}/orders`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Orders</a>
    <a href={`/dashboard/${data.selectedBusiness?.id}/employees`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Employees</a>
    <a href={`/dashboard/${data.selectedBusiness?.id}/tracking`} role="menuitem" class="text-blue-600 dark:text-purple-400 font-medium transition-colors">Live Tracking</a>
    <a href={`/dashboard/${data.selectedBusiness?.id}/analytics`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Analytics</a>
  </HeaderNav>

  <main class="py-8">
    <div class="container mx-auto px-4">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Live Tracking
            </h1>
            <p class="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
              Monitor all active deliveries and driver locations in real-time
            </p>
          </div>
          <Button class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300">
            <RefreshCw class="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Map Placeholder and Controls -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Map Container -->
          <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
            <CardHeader>
              <CardTitle class="text-xl dark:text-white transition-colors duration-300">Live Map</CardTitle>
              <CardDescription class="dark:text-gray-300 transition-colors duration-300">
                Real-time locations of drivers and deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <!-- Map Placeholder -->
              <div class="h-96 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center relative overflow-hidden transition-colors duration-300">
                <div class="text-center space-y-4">
                  <MapPin class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto transition-colors duration-300" />
                  <div>
                    <p class="text-lg font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">Interactive Map</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Map integration would be implemented here</p>
                  </div>
                </div>
                
                <!-- Mock driver pins -->
                <div class="absolute top-4 left-4 flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-md transition-colors duration-300">
                  <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">4 Active Drivers</span>
                </div>
                
                <div class="absolute top-4 right-4 flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-md transition-colors duration-300">
                  <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">3 En Route</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Search and Filters -->
          <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
            <CardContent class="p-6">
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1 relative">
                  <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <Input
                    bind:value={searchQuery}
                    placeholder="Search by order ID, customer, or driver..."
                    class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                  />
                </div>
                <select 
                  bind:value={selectedFilter}
                  class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="picked-up">Picked Up</option>
                  <option value="in-transit">In Transit</option>
                  <option value="approaching">Approaching</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Driver Status Panel -->
        <div>
          <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300 mb-6">
            <CardHeader>
              <CardTitle class="text-xl dark:text-white transition-colors duration-300">Driver Status</CardTitle>
              <CardDescription class="dark:text-gray-300 transition-colors duration-300">
                Current driver locations and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                {#each driverLocations as driver}
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg transition-colors duration-300">
                    <div class="flex items-center space-x-3">
                      <div class="relative">
                        <div class="w-8 h-8 bg-blue-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                          <User class="w-4 h-4 text-blue-600 dark:text-purple-400 transition-colors duration-300" />
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-3 h-3 {getDriverStatusColor(driver.status)} rounded-full border-2 border-white dark:border-slate-700"></div>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white text-sm transition-colors duration-300">{driver.name}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">{driver.location}</p>
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
        </div>
      </div>

      <!-- Live Deliveries -->
      <div class="mt-8">
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
          <CardHeader>
            <CardTitle class="text-xl dark:text-white transition-colors duration-300">
              Active Deliveries ({filteredDeliveries.length})
            </CardTitle>
            <CardDescription class="dark:text-gray-300 transition-colors duration-300">
              Real-time tracking of all ongoing deliveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              {#each filteredDeliveries as delivery}
                <div class="border border-gray-200 dark:border-slate-600 rounded-lg p-6 transition-colors duration-300">
                  <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <!-- Order Info -->
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                        <Package class="w-6 h-6 text-blue-600 dark:text-purple-400 transition-colors duration-300" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-3 mb-2">
                          <h3 class="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{delivery.id}</h3>
                          <Badge class={getStatusColor(delivery.status)}>
                            {delivery.status}
                          </Badge>
                        </div>
                        <div class="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          <div class="flex items-center space-x-2">
                            <User class="w-4 h-4" />
                            <span>{delivery.customer}</span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <Truck class="w-4 h-4" />
                            <span>{delivery.driver}</span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <MapPin class="w-4 h-4" />
                            <span class="truncate">{delivery.address}</span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <Clock class="w-4 h-4" />
                            <span>ETA: {delivery.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Progress and Actions -->
                    <div class="lg:w-80 space-y-3">
                      <!-- Progress Bar -->
                      <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-600 dark:text-gray-400 transition-colors duration-300">Progress</span>
                          <span class="font-medium text-gray-900 dark:text-white transition-colors duration-300">{delivery.progress}%</span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 transition-colors duration-300">
                          <div 
                            class="bg-blue-600 dark:bg-purple-600 h-2 rounded-full transition-all duration-300" 
                            style="width: {delivery.progress}%"
                          ></div>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          Last update: {delivery.lastUpdate}
                        </p>
                      </div>

                      <!-- Action Buttons -->
                      <div class="flex space-x-2">
                        <Button size="sm" variant="outline" class="flex-1 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300">
                          <Eye class="w-4 h-4 mr-1" />
                          Track
                        </Button>
                        <Button size="sm" variant="outline" class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300">
                          <Phone class="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300">
                          <MessageSquare class="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}

              {#if filteredDeliveries.length === 0}
                <div class="text-center py-12">
                  <Navigation class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors duration-300" />
                  <p class="text-gray-600 dark:text-gray-400 transition-colors duration-300">No deliveries match your search criteria</p>
                </div>
              {/if}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>

  <Footer />
</div>