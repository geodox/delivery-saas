<script lang="ts">
  // Types
  import type { Business } from "$lib/models";

  // Components
  import { HeaderNav, Footer } from "$lib/components";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Separator } from "$lib/components/ui/separator";
  
  // Lucide Icons
  import User from "lucide-svelte/icons/user";
  import Shield from "lucide-svelte/icons/shield";
  import Bell from "lucide-svelte/icons/bell";
  import Key from "lucide-svelte/icons/key";
  import Trash2 from "lucide-svelte/icons/trash-2";
  import Save from "lucide-svelte/icons/save";
  import Edit from "lucide-svelte/icons/edit";
  import X from "lucide-svelte/icons/x";
  import Building from "lucide-svelte/icons/building";
  import MapPin from "lucide-svelte/icons/map-pin";
  import ExternalLink from "lucide-svelte/icons/external-link";
  import Car from "lucide-svelte/icons/car";
  import Navigation from "lucide-svelte/icons/navigation";
  import DollarSign from "lucide-svelte/icons/dollar-sign";
  import Package from "lucide-svelte/icons/package";

  let { data } = $props<{
    data: {
      session: any;
      businesses: Business[];
      employees: any[];
      userRole: {
        primary: string;
        isDriver: boolean;
        isOwner: boolean;
      };
    };
  }>();

  // Account state using $state()
  let profile = $state({
    name: data.session?.user?.name || '',
    email: data.session?.user?.email || '',
    image: data.session?.user?.image || ''
  });

  let notifications = $state({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    deliveryAlerts: true
  });

  let security = $state({
    twoFactorEnabled: false,
    lastPasswordChange: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    lastLogin: new Date(),
    activeSessions: 2
  });

  let isEditingProfile = $state(false);
  let isSaving = $state(false);
  let showDeleteConfirm = $state(false);

  // Driver-specific state
  let driverPreferences = $state({
    notifications: {
      newOrders: true,
      orderUpdates: true,
      earnings: true,
      pushNotifications: true
    },
    navigation: {
      defaultApp: 'google' as 'google' | 'apple' | 'waze',
      avoidTolls: false,
      avoidHighways: false
    },
    delivery: {
      autoAccept: false,
      maxDistance: 10,
      minOrderValue: 5.00
    }
  });

  // Form validation
  let errors = $state<Record<string, string>>({});

  function validateForm() {
    errors = {};
    
    if (!profile.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profile.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  async function saveProfile() {
    validateForm();
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    isSaving = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    isSaving = false;
    isEditingProfile = false;
    
    // Show success message (you could add a toast notification here)
  }

  function cancelEdit() {
    // Reset form to original values
    profile = {
      name: data.session?.user?.name || '',
      email: data.session?.user?.email || '',
      image: data.session?.user?.image || ''
    };
    isEditingProfile = false;
    errors = {};
  }

  function toggleTwoFactor() {
    security.twoFactorEnabled = !security.twoFactorEnabled;
  }

  function deleteAccount() {
    showDeleteConfirm = true;
  }

  function confirmDeleteAccount() {
    // Handle account deletion
    console.log('Account deletion confirmed');
    showDeleteConfirm = false;
  }

  function updateDriverPreference(category: string, key: string, value: any) {
    driverPreferences[category][key] = value;
    // In a real app, this would save to the server
  }

  function getDriverStats() {
    // In a real app, this would fetch from the server
    return {
      totalDeliveries: 127,
      totalEarnings: 2847.50,
      todaysDeliveries: 8,
      todaysEarnings: 156.75,
      rating: 4.8,
      onTimeRate: 96
    };
  }
</script>

<svelte:head>
  <title>Account Settings - DeliveryManager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav>
    <a href="/dashboard" role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</a>
    <a href="/account" role="menuitem" class="text-blue-600 dark:text-purple-400 font-medium">Account</a>
  </HeaderNav>

  <!-- Main Content -->
  <div class="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Page Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">Manage your profile, security, and preferences</p>
      </div>

      <div class="space-y-6">
        <!-- Profile Section -->
        <div class="space-y-6">
          <!-- Profile Information -->
          <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
            <CardHeader class="pb-4 sm:pb-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <User class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle class="text-lg sm:text-xl dark:text-white">Profile Information</CardTitle>
                    <CardDescription class="dark:text-gray-300 text-sm">Update your personal details</CardDescription>
                  </div>
                </div>
                {#if !isEditingProfile}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onclick={() => isEditingProfile = true}
                    class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 w-full sm:w-auto"
                  >
                    <Edit class="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                {/if}
              </div>
            </CardHeader>
            <CardContent class="space-y-4 sm:space-y-6">
              {#if isEditingProfile}
                <div class="space-y-4">
                  <div>
                    <Label for="name" class="text-sm font-medium dark:text-gray-200">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      bind:value={profile.name}
                      class="mt-1 {errors.name ? 'border-red-500' : ''}"
                      placeholder="Enter your full name"
                    />
                    {#if errors.name}
                      <p class="text-red-500 text-sm mt-1">{errors.name}</p>
                    {/if}
                  </div>
                  
                  <div>
                    <Label for="email" class="text-sm font-medium dark:text-gray-200">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      bind:value={profile.email}
                      class="mt-1 {errors.email ? 'border-red-500' : ''}"
                      placeholder="Enter your email address"
                    />
                    {#if errors.email}
                      <p class="text-red-500 text-sm mt-1">{errors.email}</p>
                    {/if}
                  </div>
                  
                  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                    <Button 
                      onclick={saveProfile}
                      disabled={isSaving}
                      class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 flex-1"
                    >
                      {#if isSaving}
                        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {:else}
                        <Save class="w-4 h-4 mr-2" />
                      {/if}
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onclick={cancelEdit}
                      class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 flex-1"
                    >
                      <X class="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              {:else}
                <div class="space-y-4">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                    {#if profile.image}
                      <img src={profile.image} alt="Profile" class="w-16 h-16 rounded-full mx-auto sm:mx-0" />
                    {:else}
                      <div class="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                        <User class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    {/if}
                    <div class="text-center sm:text-left">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{profile.name}</h3>
                      <p class="text-gray-600 dark:text-gray-300">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Member since</p>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Account status</p>
                      <Badge variant="default" class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              {/if}
            </CardContent>
          </Card>

          <!-- Security Settings -->
          <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
            <CardHeader class="pb-4 sm:pb-6">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Shield class="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle class="text-lg sm:text-xl dark:text-white">Security</CardTitle>
                  <CardDescription class="dark:text-gray-300 text-sm">Manage your account security</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent class="space-y-4 sm:space-y-6">
              <div class="space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <Key class="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-300">
                        {security.twoFactorEnabled ? 'Enabled' : 'Disabled'} - Add an extra layer of security
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant={security.twoFactorEnabled ? "default" : "outline"}
                    size="sm"
                    onclick={toggleTwoFactor}
                    class={security.twoFactorEnabled ? 'bg-green-600 hover:bg-green-700 w-full sm:w-auto' : 'border-gray-300 dark:border-slate-600 w-full sm:w-auto'}
                  >
                    {security.twoFactorEnabled ? 'Enabled' : 'Enable'}
                  </Button>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  <div class="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Last password change</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {security.lastPasswordChange.toLocaleDateString()}
                    </p>
                  </div>
                  <div class="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Last login</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {security.lastLogin.toLocaleDateString()}
                    </p>
                  </div>
                  <div class="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg sm:col-span-2 lg:col-span-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Active sessions</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {security.activeSessions} devices
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Notification Preferences -->
          <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
            <CardHeader class="pb-4 sm:pb-6">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Bell class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <CardTitle class="text-lg sm:text-xl dark:text-white">Notifications</CardTitle>
                  <CardDescription class="dark:text-gray-300 text-sm">Manage your notification preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">Receive notifications via email</p>
                  </div>
                  <Button 
                    variant={notifications.emailNotifications ? "default" : "outline"}
                    size="sm"
                    onclick={() => notifications.emailNotifications = !notifications.emailNotifications}
                    class={notifications.emailNotifications ? 'bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 w-full sm:w-auto' : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 w-full sm:w-auto transition-colors duration-300'}
                  >
                    {notifications.emailNotifications ? 'On' : 'Off'}
                  </Button>
                </div>
                
                <Separator />
                
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">Receive notifications in your browser</p>
                  </div>
                  <Button 
                    variant={notifications.pushNotifications ? "default" : "outline"}
                    size="sm"
                    onclick={() => notifications.pushNotifications = !notifications.pushNotifications}
                    class={notifications.pushNotifications ? 'bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 w-full sm:w-auto' : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 w-full sm:w-auto transition-colors duration-300'}
                  >
                    {notifications.pushNotifications ? 'On' : 'Off'}
                  </Button>
                </div>
                
                <Separator />
                
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">Marketing Emails</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">Receive promotional content and updates</p>
                  </div>
                  <Button 
                    variant={notifications.marketingEmails ? "default" : "outline"}
                    size="sm"
                    onclick={() => notifications.marketingEmails = !notifications.marketingEmails}
                    class={notifications.marketingEmails ? 'bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 w-full sm:w-auto' : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 w-full sm:w-auto transition-colors duration-300'}
                  >
                    {notifications.marketingEmails ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Businesses -->
          <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
            <CardHeader class="pb-4 sm:pb-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Building class="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle class="text-lg sm:text-xl dark:text-white">Businesses</CardTitle>
                    <CardDescription class="dark:text-gray-300 text-sm">Manage your businesses</CardDescription>
                  </div>
                </div>
                <Button 
                  href="/setup"
                  variant="outline" 
                  size="sm"
                  class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 w-full sm:w-auto"
                >
                  <Building class="w-4 h-4 mr-2" />
                  Add Business
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {#if data.businesses.length === 0}
                <div class="text-center py-8">
                  <Building class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No businesses yet</h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-4">Get started by creating your first business</p>
                  <Button 
                    href="/setup"
                    class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 w-full sm:w-auto"
                  >
                    <Building class="w-4 h-4 mr-2" />
                    Create Business
                  </Button>
                </div>
              {:else}
                <div class="space-y-4">
                  {#each data.businesses as business}
                    <div class="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                      <div class="flex flex-col gap-4">
                        <div class="flex items-start gap-3">
                          <div class="w-8 h-8 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building class="w-4 h-4 text-blue-600 dark:text-purple-400" />
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h4 class="font-medium text-gray-900 dark:text-white truncate">{business.name}</h4>
                              {#if business.ownerId === data.session?.user?.id}
                                <Badge variant="default" class="text-xs w-fit">Owner</Badge>
                              {:else}
                                <Badge variant="secondary" class="text-xs w-fit">Employee</Badge>
                              {/if}
                            </div>
                            
                            {#if business.description}
                              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                {business.description}
                              </p>
                            {/if}

                            {#if business.address}
                              <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin class="w-4 h-4 flex-shrink-0" />
                                <span class="truncate">
                                  {business.address.city}, {business.address.stateProvince}
                                </span>
                              </div>
                            {/if}
                          </div>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row gap-2">
                          {#if business.website}
                            <Button 
                              href={business.website}
                              target="_blank"
                              variant="outline" 
                              size="sm"
                              class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 flex-1 sm:flex-none"
                            >
                              <ExternalLink class="w-4 h-4 mr-2" />
                              Website
                            </Button>
                          {/if}
                          <Button 
                            href={`/dashboard/${business.id}`}
                            variant="outline" 
                            size="sm"
                            class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 flex-1 sm:flex-none"
                          >
                            <Edit class="w-4 h-4 mr-2" />
                            Dashboard
                          </Button>
                          <Button 
                            href={`/dashboard/${business.id}/edit`}
                            variant="outline" 
                            size="sm"
                            class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 flex-1 sm:flex-none"
                          >
                            <Edit class="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
            </CardContent>
          </Card>

          <!-- Driver Section (only show for drivers) -->
          {#if data.userRole.isDriver}
            <!-- Driver Stats -->
            <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
              <CardHeader class="pb-4 sm:pb-6">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Car class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle class="text-lg sm:text-xl dark:text-white">Driver Statistics</CardTitle>
                    <CardDescription class="dark:text-gray-300 text-sm">Your delivery performance and earnings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {@const stats = getDriverStats()}
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div class="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <Package class="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDeliveries}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Total Deliveries</p>
                  </div>
                  <div class="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <DollarSign class="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalEarnings}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                  </div>
                  <div class="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <Package class="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.todaysDeliveries}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Today's Deliveries</p>
                  </div>
                  <div class="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <DollarSign class="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">${stats.todaysEarnings}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Today's Earnings</p>
                  </div>
                  <div class="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div class="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2 flex items-center justify-center">
                      <span class="text-lg">★</span>
                    </div>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.rating}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                  </div>
                  <div class="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <Navigation class="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.onTimeRate}%</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">On-Time Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Driver Preferences -->
            <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
              <CardHeader class="pb-4 sm:pb-6">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Navigation class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle class="text-lg sm:text-xl dark:text-white">Driver Preferences</CardTitle>
                    <CardDescription class="dark:text-gray-300 text-sm">Customize your delivery experience</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent class="space-y-6">
                <!-- Notification Preferences -->
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-4">Notifications</h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">New Orders</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Get notified of new delivery requests</p>
                      </div>
                      <Button 
                        variant={driverPreferences.notifications.newOrders ? "default" : "outline"}
                        size="sm"
                        onclick={() => updateDriverPreference('notifications', 'newOrders', !driverPreferences.notifications.newOrders)}
                        class={driverPreferences.notifications.newOrders ? 'bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700' : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'}
                      >
                        {driverPreferences.notifications.newOrders ? 'On' : 'Off'}
                      </Button>
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">Order Updates</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Receive updates about order status changes</p>
                      </div>
                      <Button 
                        variant={driverPreferences.notifications.orderUpdates ? "default" : "outline"}
                        size="sm"
                        onclick={() => updateDriverPreference('notifications', 'orderUpdates', !driverPreferences.notifications.orderUpdates)}
                        class={driverPreferences.notifications.orderUpdates ? 'bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700' : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'}
                      >
                        {driverPreferences.notifications.orderUpdates ? 'On' : 'Off'}
                      </Button>
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">Earnings Updates</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Get notified about your earnings</p>
                      </div>
                      <Button 
                        variant={driverPreferences.notifications.earnings ? "default" : "outline"}
                        size="sm"
                        onclick={() => updateDriverPreference('notifications', 'earnings', !driverPreferences.notifications.earnings)}
                        class={driverPreferences.notifications.earnings ? 'bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700' : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'}
                      >
                        {driverPreferences.notifications.earnings ? 'On' : 'Off'}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <!-- Navigation Preferences -->
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-4">Navigation</h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">Default Navigation App</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Choose your preferred navigation app</p>
                      </div>
                      <select 
                        bind:value={driverPreferences.navigation.defaultApp}
                        onchange={(e) => updateDriverPreference('navigation', 'defaultApp', e.target.value)}
                        class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                      >
                        <option value="google">Google Maps</option>
                        <option value="apple">Apple Maps</option>
                        <option value="waze">Waze</option>
                      </select>
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">Avoid Tolls</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Prefer routes that avoid toll roads</p>
                      </div>
                      <Button 
                        variant={driverPreferences.navigation.avoidTolls ? "default" : "outline"}
                        size="sm"
                        onclick={() => updateDriverPreference('navigation', 'avoidTolls', !driverPreferences.navigation.avoidTolls)}
                        class={driverPreferences.navigation.avoidTolls ? 'bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700' : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'}
                      >
                        {driverPreferences.navigation.avoidTolls ? 'On' : 'Off'}
                      </Button>
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">Avoid Highways</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Prefer local roads over highways</p>
                      </div>
                      <Button 
                        variant={driverPreferences.navigation.avoidHighways ? "default" : "outline"}
                        size="sm"
                        onclick={() => updateDriverPreference('navigation', 'avoidHighways', !driverPreferences.navigation.avoidHighways)}
                        class={driverPreferences.navigation.avoidHighways ? 'bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700' : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'}
                      >
                        {driverPreferences.navigation.avoidHighways ? 'On' : 'Off'}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <!-- Delivery Preferences -->
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-4">Delivery Settings</h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">Auto-Accept Orders</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Automatically accept new orders</p>
                      </div>
                      <Button 
                        variant={driverPreferences.delivery.autoAccept ? "default" : "outline"}
                        size="sm"
                        onclick={() => updateDriverPreference('delivery', 'autoAccept', !driverPreferences.delivery.autoAccept)}
                        class={driverPreferences.delivery.autoAccept ? 'bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700' : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'}
                      >
                        {driverPreferences.delivery.autoAccept ? 'On' : 'Off'}
                      </Button>
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">Maximum Distance (miles)</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Maximum delivery distance you're willing to travel</p>
                      </div>
                      <input 
                        type="number"
                        bind:value={driverPreferences.delivery.maxDistance}
                        onchange={(e) => updateDriverPreference('delivery', 'maxDistance', parseFloat(e.target.value))}
                        class="w-20 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                        min="1"
                        max="50"
                      />
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">Minimum Order Value ($)</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Minimum order value you'll accept</p>
                      </div>
                      <input 
                        type="number"
                        bind:value={driverPreferences.delivery.minOrderValue}
                        onchange={(e) => updateDriverPreference('delivery', 'minOrderValue', parseFloat(e.target.value))}
                        class="w-20 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          {/if}

          <!-- Danger Zone -->
          <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm border-red-200 dark:border-red-800">
            <CardHeader class="pb-4 sm:pb-6">
              <CardTitle class="text-lg text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                class="w-full justify-start border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                onclick={deleteAccount}
              >
                <Trash2 class="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</div>

<!-- Delete Account Confirmation Modal -->
{#if showDeleteConfirm}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-700">
      <div class="p-4 sm:p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <Trash2 class="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Account</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
          </div>
        </div>
        
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete your account? This will permanently remove all your data, 
          including businesses, orders, and settings.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onclick={() => showDeleteConfirm = false}
            class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button 
            onclick={confirmDeleteAccount}
            class="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  </div>
{/if} 