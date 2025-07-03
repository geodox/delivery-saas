<script lang="ts">
  // Types
  import type { Business } from "$lib/models";
  // Svelte
  import { goto } from "$app/navigation";
  // Components
  import { HeaderNav, Footer } from "$lib/components";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Badge } from "$lib/components/ui/badge";
  // Lucide Icons
  import Building from "lucide-svelte/icons/building";
  import MapPin from "lucide-svelte/icons/map-pin";
  import Save from "lucide-svelte/icons/save";
  import ArrowLeft from "lucide-svelte/icons/arrow-left";
  import Clock from "lucide-svelte/icons/clock";
  import Truck from "lucide-svelte/icons/truck";
  import Trash from "lucide-svelte/icons/trash";

  let { data } = $props<{
    data: {
      session: any;
      selectedBusiness: Business;
    };
  }>();

  let business = $state({
    name: data.selectedBusiness.name || '',
    description: data.selectedBusiness.description || '',
    website: data.selectedBusiness.website || '',
    phone: data.selectedBusiness.phone || '',
    address: {
      street: data.selectedBusiness.address?.street || '',
      city: data.selectedBusiness.address?.city || '',
      stateProvince: data.selectedBusiness.address?.stateProvince || '',
      zipPostalCode: data.selectedBusiness.address?.zipPostalCode || '',
      country: data.selectedBusiness.address?.country || 'United States'
    },
    delivery: {
      radius: data.selectedBusiness.delivery?.radius || 10,
      radiusUnit: data.selectedBusiness.delivery?.radiusUnit || 'miles',
      specialRequirements: data.selectedBusiness.delivery?.specialRequirements || ''
    },
    operatingHours: {
      monday: { open: data.selectedBusiness.operatingHours?.monday?.open || '09:00', close: data.selectedBusiness.operatingHours?.monday?.close || '17:00', enabled: data.selectedBusiness.operatingHours?.monday?.enabled || true },
      tuesday: { open: data.selectedBusiness.operatingHours?.tuesday?.open || '09:00', close: data.selectedBusiness.operatingHours?.tuesday?.close || '17:00', enabled: data.selectedBusiness.operatingHours?.tuesday?.enabled || true },
      wednesday: { open: data.selectedBusiness.operatingHours?.wednesday?.open || '09:00', close: data.selectedBusiness.operatingHours?.wednesday?.close || '17:00', enabled: data.selectedBusiness.operatingHours?.wednesday?.enabled || true },
      thursday: { open: data.selectedBusiness.operatingHours?.thursday?.open || '09:00', close: data.selectedBusiness.operatingHours?.thursday?.close || '17:00', enabled: data.selectedBusiness.operatingHours?.thursday?.enabled || true },
      friday: { open: data.selectedBusiness.operatingHours?.friday?.open || '09:00', close: data.selectedBusiness.operatingHours?.friday?.close || '17:00', enabled: data.selectedBusiness.operatingHours?.friday?.enabled || true },
      saturday: { open: data.selectedBusiness.operatingHours?.saturday?.open || '10:00', close: data.selectedBusiness.operatingHours?.saturday?.close || '15:00', enabled: data.selectedBusiness.operatingHours?.saturday?.enabled || false },
      sunday: { open: data.selectedBusiness.operatingHours?.sunday?.open || '10:00', close: data.selectedBusiness.operatingHours?.sunday?.close || '15:00', enabled: data.selectedBusiness.operatingHours?.sunday?.enabled || false }
    }
  });

  let isSaving = $state(false);
  let errors = $state<Record<string, string>>({});

  function validateForm() {
    errors = {};
    
    if (!business.name.trim()) {
      errors.name = 'Business name is required';
    }
    
    if (!business.description.trim()) {
      errors.description = 'Business description is required';
    }
    
    if (!business.address.street.trim()) {
      errors.street = 'Street address is required';
    }
    
    if (!business.address.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!business.address.stateProvince.trim()) {
      errors.stateProvince = 'State/Province is required';
    }
    
    if (!business.address.zipPostalCode.trim()) {
      errors.zipPostalCode = 'ZIP/Postal code is required';
    }
    
    if (business.delivery.radius <= 0) {
      errors.radius = 'Delivery radius must be greater than 0';
    }
  }

  async function saveBusiness() {
    validateForm();
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    isSaving = true;
    
    try {
      const formData = new FormData();
      formData.append('name', business.name);
      formData.append('description', business.description);
      formData.append('website', business.website);
      formData.append('phone', business.phone);
      formData.append('streetAddress', business.address.street);
      formData.append('city', business.address.city);
      formData.append('stateProvince', business.address.stateProvince);
      formData.append('zipPostalCode', business.address.zipPostalCode);
      formData.append('country', business.address.country);
      formData.append('deliveryRadius', business.delivery.radius.toString());
      formData.append('specialRequirements', business.delivery.specialRequirements);
      formData.append('operatingHours', JSON.stringify(business.operatingHours));

      const response = await fetch(`/dashboard?id=${data.selectedBusiness.id}/edit`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        // Redirect back to dashboard
        goto(`/dashboard?id=${data.selectedBusiness.id}`);
      } else {
        const result = await response.json();
        console.error('Failed to update business:', result);
      }
    } catch (error) {
      console.error('Error updating business:', error);
    } finally {
      isSaving = false;
    }
  }

  function cancelEdit() {
    // Reset form to original values
    business = {
      name: data.selectedBusiness.name || '',
      description: data.selectedBusiness.description || '',
      website: data.selectedBusiness.website || '',
      phone: data.selectedBusiness.phone || '',
      address: {
        street: data.selectedBusiness.address?.street || '',
        city: data.selectedBusiness.address?.city || '',
        stateProvince: data.selectedBusiness.address?.stateProvince || '',
        zipPostalCode: data.selectedBusiness.address?.zipPostalCode || '',
        country: data.selectedBusiness.address?.country || 'United States'
      },
      delivery: {
        radius: data.selectedBusiness.delivery?.radius || 10,
        radiusUnit: data.selectedBusiness.delivery?.radiusUnit || 'miles',
        specialRequirements: data.selectedBusiness.delivery?.specialRequirements || ''
      },
      operatingHours: {
        monday: { open: data.selectedBusiness.operatingHours?.monday?.open || '09:00', close: data.selectedBusiness.operatingHours?.monday?.close || '17:00', enabled: data.selectedBusiness.operatingHours?.monday?.enabled || true },
        tuesday: { open: data.selectedBusiness.operatingHours?.tuesday?.open || '09:00', close: data.selectedBusiness.operatingHours?.tuesday?.close || '17:00', enabled: data.selectedBusiness.operatingHours?.tuesday?.enabled || true },
        wednesday: { open: data.selectedBusiness.operatingHours?.wednesday?.open || '09:00', close: data.selectedBusiness.operatingHours?.wednesday?.close || '17:00', enabled: data.selectedBusiness.operatingHours?.wednesday?.enabled || true },
        thursday: { open: data.selectedBusiness.operatingHours?.thursday?.open || '09:00', close: data.selectedBusiness.operatingHours?.thursday?.close || '17:00', enabled: data.selectedBusiness.operatingHours?.thursday?.enabled || true },
        friday: { open: data.selectedBusiness.operatingHours?.friday?.open || '09:00', close: data.selectedBusiness.operatingHours?.friday?.close || '17:00', enabled: data.selectedBusiness.operatingHours?.friday?.enabled || true },
        saturday: { open: data.selectedBusiness.operatingHours?.saturday?.open || '10:00', close: data.selectedBusiness.operatingHours?.saturday?.close || '15:00', enabled: data.selectedBusiness.operatingHours?.saturday?.enabled || false },
        sunday: { open: data.selectedBusiness.operatingHours?.sunday?.open || '10:00', close: data.selectedBusiness.operatingHours?.sunday?.close || '15:00', enabled: data.selectedBusiness.operatingHours?.sunday?.enabled || false }
      }
    };
    errors = {};
  }

  function toggleDayEnabled(day: string) {
    switch (day) {
      case 'monday':
        business.operatingHours.monday.enabled = !business.operatingHours.monday.enabled;
        break;
      case 'tuesday':
        business.operatingHours.tuesday.enabled = !business.operatingHours.tuesday.enabled;
        break;
      case 'wednesday':
        business.operatingHours.wednesday.enabled = !business.operatingHours.wednesday.enabled;
        break;
      case 'thursday':
        business.operatingHours.thursday.enabled = !business.operatingHours.thursday.enabled;
        break;
      case 'friday':
        business.operatingHours.friday.enabled = !business.operatingHours.friday.enabled;
        break;
      case 'saturday':
        business.operatingHours.saturday.enabled = !business.operatingHours.saturday.enabled;
        break;
      case 'sunday':
        business.operatingHours.sunday.enabled = !business.operatingHours.sunday.enabled;
        break;
    }
  }

  async function deleteBusiness() {
    let confirmed = confirm("Are you sure you want to delete this business? This action cannot be undone.");
    if (confirmed) {
      let response = await fetch(`/api/businesses/?id=${data.selectedBusiness.id}`, { method: 'DELETE' });
        if (response.ok) {
          goto(`/dashboard`);
        } else {
          console.error("Failed to delete business");
      }
    }
  }
</script>

<svelte:head>
  <title>Edit Business - {data.selectedBusiness.name} - DeliveryManager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav>
    <a href={`/dashboard/${data.selectedBusiness.id}`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</a>
    <a href="/account" role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Account</a>
  </HeaderNav>

  <!-- Main Content -->
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <Button 
            href={`/dashboard/${data.selectedBusiness.id}`}
            variant="outline" 
            size="sm"
            class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Business</h1>
        <p class="text-gray-600 dark:text-gray-300">Update your business information and settings</p>
      </div>

      <div class="space-y-6">
        <!-- Basic Information -->
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
          <CardHeader>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Building class="w-5 h-5 text-blue-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle class="text-xl dark:text-white">Basic Information</CardTitle>
                <CardDescription class="dark:text-gray-300">Update your business details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <Label for="name" class="text-sm font-medium dark:text-gray-200">Business Name *</Label>
                <Input
                  id="name"
                  type="text"
                  bind:value={business.name}
                  class="mt-1 {errors.name ? 'border-red-500' : ''}"
                  placeholder="Enter business name"
                />
                {#if errors.name}
                  <p class="text-red-500 text-sm mt-1">{errors.name}</p>
                {/if}
              </div>
              
              <div>
                <Label for="phone" class="text-sm font-medium dark:text-gray-200">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  bind:value={business.phone}
                  class="mt-1"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div>
              <Label for="description" class="text-sm font-medium dark:text-gray-200">Description *</Label>
              <Textarea
                id="description"
                bind:value={business.description}
                class="mt-1 {errors.description ? 'border-red-500' : ''}"
                placeholder="Describe your business"
                rows={3}
              />
              {#if errors.description}
                <p class="text-red-500 text-sm mt-1">{errors.description}</p>
              {/if}
            </div>
            
            <div>
              <Label for="website" class="text-sm font-medium dark:text-gray-200">Website</Label>
              <Input
                id="website"
                type="url"
                bind:value={business.website}
                class="mt-1"
                placeholder="https://your-website.com"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Address Information -->
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
          <CardHeader>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <MapPin class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle class="text-xl dark:text-white">Address Information</CardTitle>
                <CardDescription class="dark:text-gray-300">Update your business address</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-6">
            <div>
              <Label for="street" class="text-sm font-medium dark:text-gray-200">Street Address *</Label>
              <Input
                id="street"
                type="text"
                bind:value={business.address.street}
                class="mt-1 {errors.street ? 'border-red-500' : ''}"
                placeholder="Enter street address"
              />
              {#if errors.street}
                <p class="text-red-500 text-sm mt-1">{errors.street}</p>
              {/if}
            </div>
            
            <div class="grid md:grid-cols-3 gap-6">
              <div>
                <Label for="city" class="text-sm font-medium dark:text-gray-200">City *</Label>
                <Input
                  id="city"
                  type="text"
                  bind:value={business.address.city}
                  class="mt-1 {errors.city ? 'border-red-500' : ''}"
                  placeholder="Enter city"
                />
                {#if errors.city}
                  <p class="text-red-500 text-sm mt-1">{errors.city}</p>
                {/if}
              </div>
              
              <div>
                <Label for="stateProvince" class="text-sm font-medium dark:text-gray-200">State/Province *</Label>
                <Input
                  id="stateProvince"
                  type="text"
                  bind:value={business.address.stateProvince}
                  class="mt-1 {errors.stateProvince ? 'border-red-500' : ''}"
                  placeholder="Enter state/province"
                />
                {#if errors.stateProvince}
                  <p class="text-red-500 text-sm mt-1">{errors.stateProvince}</p>
                {/if}
              </div>
              
              <div>
                <Label for="zipPostalCode" class="text-sm font-medium dark:text-gray-200">ZIP/Postal Code *</Label>
                <Input
                  id="zipPostalCode"
                  type="text"
                  bind:value={business.address.zipPostalCode}
                  class="mt-1 {errors.zipPostalCode ? 'border-red-500' : ''}"
                  placeholder="Enter ZIP/postal code"
                />
                {#if errors.zipPostalCode}
                  <p class="text-red-500 text-sm mt-1">{errors.zipPostalCode}</p>
                {/if}
              </div>
            </div>
            
            <div>
              <Label for="country" class="text-sm font-medium dark:text-gray-200">Country</Label>
              <Input
                id="country"
                type="text"
                bind:value={business.address.country}
                class="mt-1"
                placeholder="Enter country"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Delivery Settings -->
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
          <CardHeader>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Truck class="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle class="text-xl dark:text-white">Delivery Settings</CardTitle>
                <CardDescription class="dark:text-gray-300">Configure your delivery parameters</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <Label for="radius" class="text-sm font-medium dark:text-gray-200">Delivery Radius *</Label>
                <div class="flex space-x-2 mt-1">
                  <Input
                    id="radius"
                    type="number"
                    bind:value={business.delivery.radius}
                    class="flex-1 {errors.radius ? 'border-red-500' : ''}"
                    placeholder="10"
                    min="1"
                  />
                  <select 
                    bind:value={business.delivery.radiusUnit}
                    class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="miles">Miles</option>
                    <option value="kilometers">Kilometers</option>
                  </select>
                </div>
                {#if errors.radius}
                  <p class="text-red-500 text-sm mt-1">{errors.radius}</p>
                {/if}
              </div>
            </div>
            
            <div>
              <Label for="specialRequirements" class="text-sm font-medium dark:text-gray-200">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                bind:value={business.delivery.specialRequirements}
                class="mt-1"
                placeholder="Any special delivery requirements or instructions"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <!-- Operating Hours -->
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
          <CardHeader>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Clock class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle class="text-xl dark:text-white">Operating Hours</CardTitle>
                <CardDescription class="dark:text-gray-300">Set your business operating hours</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              {#each Object.entries(business.operatingHours) as [day, hours]}
                <div class="flex items-center space-x-4 p-3 border border-gray-200 dark:border-slate-700 rounded-lg">
                  <div class="flex items-center space-x-3 flex-1">
                    <input
                      type="checkbox"
                      id={`${day}-enabled`}
                      checked={hours.enabled}
                      onchange={() => toggleDayEnabled(day)}
                      class="w-4 h-4 text-blue-600 dark:text-purple-600 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-purple-500"
                    />
                    <Label for={`${day}-enabled`} class="text-sm font-medium dark:text-gray-200 capitalize min-w-[80px]">
                      {day}
                    </Label>
                  </div>
                  
                  {#if hours.enabled}
                    <div class="flex items-center space-x-2">
                      <Input
                        type="time"
                        bind:value={hours.open}
                        class="w-26"
                      />
                      <span class="text-gray-500 dark:text-gray-400">to</span>
                      <Input
                        type="time"
                        bind:value={hours.close}
                        class="w-26"
                      />
                    </div>
                  {:else}
                    <Badge variant="secondary" class="text-xs">Closed</Badge>
                  {/if}
                </div>
              {/each}
            </div>
          </CardContent>
        </Card>

        <!-- Action Buttons -->
        <div class="flex justify-between pt-6">
          <Button
            variant="destructive"
            onclick={deleteBusiness}
          >
            <Trash class="w-4 h-4 mr-2" />
            Delete Business
          </Button>
          <div class="flex space-x-3">
            <Button 
              variant="outline" 
              onclick={cancelEdit}
              class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button 
              onclick={saveBusiness}
              disabled={isSaving}
              class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700"
            >
              {#if isSaving}
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              {:else}
                <Save class="w-4 h-4 mr-2" />
                Save Changes
              {/if}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</div> 