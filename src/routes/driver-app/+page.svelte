<script lang="ts">
  import { browser } from '$app/environment';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import type { PageData } from './$types';
  
  interface Props {
    data: PageData;
    isOnline: boolean;
  }
  
  let { data, isOnline }: Props = $props();
  
  let currentLocation = $state<GeolocationPosition | null>(null);
  let locationPermission = $state<'granted' | 'denied' | 'prompt'>('prompt');
  
  $effect(() => {
    if (browser) {
      // Request location permission
      if ('geolocation' in navigator) {
        navigator.permissions.query({name: 'geolocation'}).then((result) => {
          locationPermission = result.state;
          if (result.state === 'granted') {
            getCurrentLocation();
          }
        });
      }
    }
  });
  
  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          currentLocation = position;
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }
  
  function requestLocationPermission() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          currentLocation = position;
          locationPermission = 'granted';
        },
        (error) => {
          locationPermission = 'denied';
          console.error('Location permission denied:', error);
        }
      );
    }
  }
</script>

<svelte:head>
  <title>Driver App - Dashboard</title>
  <meta name="description" content="Professional delivery driver dashboard" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-md">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-foreground transition-colors duration-300">
          Welcome, {data.user.name?.split(' ')[0] || 'Driver'}
        </h1>
        <p class="text-muted-foreground transition-colors duration-300">Ready to deliver?</p>
      </div>
      <div class="flex items-center space-x-2">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full {isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse"></div>
          <Button 
            variant="secondary" 
            size="sm" 
            class="text-xs bg-blue-500 hover:bg-blue-600 dark:bg-purple-500 dark:hover:bg-purple-600"
            onclick={() => isOnline = !isOnline}
          >
            {isOnline ? 'Online' : 'Offline'}
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Location Status -->
    {#if locationPermission === 'prompt'}
      <Card class="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/50 dark:border-yellow-800">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-yellow-900 dark:text-yellow-100">Location needed</h3>
                <p class="text-sm text-yellow-700 dark:text-yellow-300">Enable location for deliveries</p>
              </div>
            </div>
            <Button
              onclick={requestLocationPermission}
              variant="outline"
              size="sm"
              class="border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/30"
            >
              Enable
            </Button>
          </div>
        </CardContent>
      </Card>
    {:else if locationPermission === 'denied'}
      <Card class="border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-800">
        <CardContent class="p-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-red-900 dark:text-red-100">Location access denied</h3>
              <p class="text-sm text-red-700 dark:text-red-300">Please enable in settings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    {:else if currentLocation}
      <Card class="border-green-200 bg-green-50 dark:bg-green-950/50 dark:border-green-800">
        <CardContent class="p-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-green-900 dark:text-green-100">Location services active</h3>
              <p class="text-sm text-green-700 dark:text-green-300">Ready for deliveries</p>
            </div>
          </div>
        </CardContent>
      </Card>
    {/if}
  </div>

  <!-- Quick Stats -->
  <div class="grid grid-cols-2 gap-4 mb-8">
    <Card class="border-0 shadow-lg hover:shadow-xl dark:bg-slate-800/50 dark:shadow-purple-900/20 dark:hover:shadow-purple-900/30 transition-all duration-300 backdrop-blur-sm">
      <CardContent class="p-6">
        <div class="text-3xl font-bold text-foreground transition-colors duration-300">{data.stats.activeOrders}</div>
        <div class="text-sm text-muted-foreground transition-colors duration-300">Active Orders</div>
      </CardContent>
    </Card>
    <Card class="border-0 shadow-lg hover:shadow-xl dark:bg-slate-800/50 dark:shadow-purple-900/20 dark:hover:shadow-purple-900/30 transition-all duration-300 backdrop-blur-sm">
      <CardContent class="p-6">
        <div class="text-3xl font-bold text-green-600 dark:text-cyan-400 transition-colors duration-300">${data.stats.todaysEarnings}</div>
        <div class="text-sm text-muted-foreground transition-colors duration-300">Today's Earnings</div>
      </CardContent>
    </Card>
  </div>

  <!-- Navigation Menu -->
  <div class="space-y-4">
    <a
      href="/driver-app/orders"
      class="block"
    >
      <Card class="border-0 shadow-lg hover:shadow-xl dark:bg-slate-800/50 dark:shadow-purple-900/20 dark:hover:shadow-purple-900/30 transition-all duration-300 backdrop-blur-sm group">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-foreground transition-colors duration-300">Orders</h3>
                <p class="text-sm text-muted-foreground transition-colors duration-300">View and manage deliveries</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-muted-foreground transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </CardContent>
      </Card>
    </a>

    <a
      href="/driver-app/earnings"
      class="block"
    >
      <Card class="border-0 shadow-lg hover:shadow-xl dark:bg-slate-800/50 dark:shadow-purple-900/20 dark:hover:shadow-purple-900/30 transition-all duration-300 backdrop-blur-sm group">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:bg-green-200 dark:group-hover:bg-green-900/50">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-foreground transition-colors duration-300">Earnings</h3>
                <p class="text-sm text-muted-foreground transition-colors duration-300">Track your income</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-muted-foreground transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </CardContent>
      </Card>
    </a>

    <a
      href="/driver-app/profile"
      class="block"
    >
      <Card class="border-0 shadow-lg hover:shadow-xl dark:bg-slate-800/50 dark:shadow-purple-900/20 dark:hover:shadow-purple-900/30 transition-all duration-300 backdrop-blur-sm group">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-foreground transition-colors duration-300">Profile</h3>
                <p class="text-sm text-muted-foreground transition-colors duration-300">Settings and preferences</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-muted-foreground transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </CardContent>
      </Card>
    </a>
  </div>
</div>