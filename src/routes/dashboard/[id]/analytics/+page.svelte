<!-- src/routes/dashboard/analytics/+page.svelte -->
<script lang="ts">
  // Components
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  // Lucide Icons
  import TrendingUp from "lucide-svelte/icons/trending-up";
  import TrendingDown from "lucide-svelte/icons/trending-down";
  import Download from "lucide-svelte/icons/download";
  import Activity from "lucide-svelte/icons/activity";
  import Clock from "lucide-svelte/icons/clock";
  import MapPin from "lucide-svelte/icons/map-pin";
  import Star from "lucide-svelte/icons/star";
  import Users from "lucide-svelte/icons/users";
  import ArrowUpRight from "lucide-svelte/icons/arrow-up-right";
  import ArrowDownRight from "lucide-svelte/icons/arrow-down-right";
  // Placeholder Data
  import { customerInsights, deliveryZones, kpiMetrics, performanceData, topDrivers } from "$lib/placeholder_data";

  const { data } = $props();

  let selectedPeriod = $state("7d");
  let selectedMetric = $state("all");

  const maxOrders = Math.max(...performanceData.map(d => d.orders));
  const maxRevenue = Math.max(...performanceData.map(d => d.revenue));
</script>

<svelte:head>
  <title>Analytics - DeliveryManager</title>
</svelte:head>

<div class="container mx-auto px-4">
  <!-- Page Header -->
  <div class="mb-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Analytics
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
          Comprehensive insights into your delivery operations and performance
        </p>
      </div>
      <div class="flex space-x-3">
        <select 
          bind:value={selectedPeriod}
          class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors duration-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <Button variant="outline" class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300">
          <Download class="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  </div>

  <!-- KPI Metrics -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {#each kpiMetrics as metric}
      <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">
                {metric.title}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {metric.value}
              </p>
              <div class="flex items-center space-x-1">
                {#if metric.trend === 'up'}
                  <ArrowUpRight class="w-4 h-4 text-green-500 dark:text-cyan-400" />
                {:else}
                  <ArrowDownRight class="w-4 h-4 text-red-500" />
                {/if}
                <span class="text-sm font-medium {metric.trend === 'up' ? 'text-green-600 dark:text-cyan-400' : 'text-red-600'} transition-colors duration-300">
                  {metric.change}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  {metric.period}
                </span>
              </div>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
              <component this={metric.icon} class="w-6 h-6 text-blue-600 dark:text-purple-400 transition-colors duration-300"></component>
            </div>
          </div>
        </CardContent>
      </Card>
    {/each}
  </div>

  <div class="grid lg:grid-cols-3 gap-8 mb-8">
    <!-- Performance Chart -->
    <div class="lg:col-span-2">
      <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
        <CardHeader>
          <CardTitle class="text-xl dark:text-white transition-colors duration-300">Performance Overview</CardTitle>
          <CardDescription class="dark:text-gray-300 transition-colors duration-300">
            Daily orders and revenue trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Chart Placeholder -->
          <div class="h-80 relative">
            <div class="absolute inset-0 flex items-end justify-between px-4 pb-8">
              {#each performanceData as data}
                <div class="flex flex-col items-center space-y-2 flex-1">
                  <!-- Revenue Bar -->
                  <div class="w-full max-w-8 bg-gray-200 dark:bg-slate-700 rounded-t relative transition-colors duration-300">
                    <div 
                      class="bg-blue-600 dark:bg-purple-600 rounded-t transition-all duration-300"
                      style="height: {(data.revenue / maxRevenue) * 120}px"
                    ></div>
                  </div>
                  <!-- Orders Bar -->
                  <div class="w-full max-w-8 bg-gray-200 dark:bg-slate-700 rounded-t relative transition-colors duration-300">
                    <div 
                      class="bg-green-500 dark:bg-cyan-400 rounded-t transition-all duration-300"
                      style="height: {(data.orders / maxOrders) * 80}px"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">{data.day}</span>
                </div>
              {/each}
            </div>
            
            <!-- Legend -->
            <div class="absolute top-4 right-4 flex space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-600 dark:bg-purple-600 rounded transition-colors duration-300"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Revenue</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 dark:bg-cyan-400 rounded transition-colors duration-300"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Orders</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Customer Insights -->
    <div>
      <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
        <CardHeader>
          <CardTitle class="text-xl dark:text-white transition-colors duration-300">Customer Insights</CardTitle>
          <CardDescription class="dark:text-gray-300 transition-colors duration-300">
            Key customer metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            {#each customerInsights as insight}
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg transition-colors duration-300">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white transition-colors duration-300">{insight.metric}</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{insight.value}</p>
                </div>
                <div class="text-right">
                  <div class="flex items-center space-x-1">
                    {#if insight.trend === 'up'}
                      <TrendingUp class="w-4 h-4 text-green-500 dark:text-cyan-400" />
                    {:else}
                      <TrendingDown class="w-4 h-4 text-red-500" />
                    {/if}
                    <span class="text-sm font-medium {insight.trend === 'up' ? 'text-green-600 dark:text-cyan-400' : 'text-red-600'} transition-colors duration-300">
                      {insight.change}
                    </span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  <div class="grid lg:grid-cols-2 gap-8">
    <!-- Top Drivers -->
    <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
      <CardHeader>
        <CardTitle class="text-xl dark:text-white transition-colors duration-300">Top Performing Drivers</CardTitle>
        <CardDescription class="dark:text-gray-300 transition-colors duration-300">
          Best drivers by deliveries and ratings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each topDrivers as driver, index}
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg transition-colors duration-300">
              <div class="flex items-center space-x-4">
                <div class="w-8 h-8 bg-blue-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-purple-400 transition-colors duration-300">
                  {index + 1}
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white transition-colors duration-300">{driver.name}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    <span>{driver.deliveries} deliveries</span>
                    <span class="flex items-center space-x-1">
                      <Star class="w-3 h-3 fill-current text-yellow-500" />
                      <span>{driver.rating}</span>
                    </span>
                    <span>{driver.onTime}% on-time</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-gray-900 dark:text-white transition-colors duration-300">{driver.revenue}</p>
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>

    <!-- Delivery Zones -->
    <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
      <CardHeader>
        <CardTitle class="text-xl dark:text-white transition-colors duration-300">Delivery Zones Performance</CardTitle>
        <CardDescription class="dark:text-gray-300 transition-colors duration-300">
          Orders and performance by area
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each deliveryZones as zone}
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <MapPin class="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <span class="font-medium text-gray-900 dark:text-white transition-colors duration-300">{zone.zone}</span>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900 dark:text-white transition-colors duration-300">{zone.orders} orders</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{zone.revenue}</p>
                </div>
              </div>
              
              <!-- Progress Bar -->
              <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 transition-colors duration-300">
                <div 
                  class="bg-blue-600 dark:bg-purple-600 h-2 rounded-full transition-all duration-300" 
                  style="width: {zone.percentage}%"
                ></div>
              </div>
              
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                <span>{zone.percentage}% of total</span>
                <span>Avg: {zone.avgTime}</span>
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Additional Metrics -->
  <div class="mt-8">
    <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
      <CardHeader>
        <CardTitle class="text-xl dark:text-white transition-colors duration-300">Operational Efficiency</CardTitle>
        <CardDescription class="dark:text-gray-300 transition-colors duration-300">
          Key performance indicators for operational excellence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-6 bg-green-50 dark:bg-cyan-900/30 rounded-lg transition-colors duration-300">
            <Activity class="w-8 h-8 text-green-600 dark:text-cyan-400 mx-auto mb-2 transition-colors duration-300" />
            <p class="text-2xl font-bold text-green-600 dark:text-cyan-400 transition-colors duration-300">94.2%</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">On-time Delivery Rate</p>
            <p class="text-xs text-green-600 dark:text-cyan-400 mt-1 transition-colors duration-300">+2.1% from last week</p>
          </div>
          
          <div class="text-center p-6 bg-blue-50 dark:bg-purple-900/30 rounded-lg transition-colors duration-300">
            <Clock class="w-8 h-8 text-blue-600 dark:text-purple-400 mx-auto mb-2 transition-colors duration-300" />
            <p class="text-2xl font-bold text-blue-600 dark:text-purple-400 transition-colors duration-300">27.5 min</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Average Delivery Time</p>
            <p class="text-xs text-blue-600 dark:text-purple-400 mt-1 transition-colors duration-300">-1.2 min from last week</p>
          </div>
          
          <div class="text-center p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg transition-colors duration-300">
            <Users class="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2 transition-colors duration-300" />
            <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400 transition-colors duration-300">4.8/5</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Customer Satisfaction</p>
            <p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1 transition-colors duration-300">+0.1 from last week</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</div>