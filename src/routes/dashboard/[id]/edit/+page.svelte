<script lang="ts">
  // Types
  import type { Business } from "$lib/models";
  // Svelte
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  // Components
  import { HeaderNav, Footer } from "$lib/components";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Badge } from "$lib/components/ui/badge";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
  // Lucide Icons
  import Building from "lucide-svelte/icons/building";
  import MapPin from "lucide-svelte/icons/map-pin";
  import Save from "lucide-svelte/icons/save";
  import ArrowLeft from "lucide-svelte/icons/arrow-left";
  import Clock from "lucide-svelte/icons/clock";
  import Truck from "lucide-svelte/icons/truck";
  import Trash from "lucide-svelte/icons/trash";
  // Toast
  import { toast } from "svelte-sonner";

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
</script>

<svelte:head>
  <title>Edit Business - {data.selectedBusiness.name} - DeliveryManager</title>
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
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Page Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Edit Business
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">
            Update your business information and settings
          </p>
        </div>
        <Button 
          href={`/dashboard/${data.selectedBusiness?.id}`}
          variant="outline" 
          size="sm"
          class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
        >
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <!-- Form -->
      <form 
        method="POST" 
        action="?/update"
        use:enhance={() => {
          isSaving = true;
          return async ({ result, update }) => {
            isSaving = false;
            if (result.type === 'failure') {
              toast.error(result.data?.error as string || 'An error occurred', {
                description: result.data?.details as string || ""
              });
              await update();
            } else if (result.type === 'success') {
              toast.success("Business updated successfully");
              await update();
            }
          };
        }}
        class="space-y-6"
      >
        <!-- Hidden form fields -->
        <input type="hidden" name="name" value={business.name} />
        <input type="hidden" name="description" value={business.description} />
        <input type="hidden" name="website" value={business.website} />
        <input type="hidden" name="phone" value={business.phone} />
        <input type="hidden" name="streetAddress" value={business.address.street} />
        <input type="hidden" name="city" value={business.address.city} />
        <input type="hidden" name="stateProvince" value={business.address.stateProvince} />
        <input type="hidden" name="zipPostalCode" value={business.address.zipPostalCode} />
        <input type="hidden" name="country" value={business.address.country} />
        <input type="hidden" name="deliveryRadius" value={business.delivery.radius} />
        <input type="hidden" name="specialRequirements" value={business.delivery.specialRequirements} />
        <input type="hidden" name="operatingHours" value={JSON.stringify(business.operatingHours)} />

        <!-- Basic Information -->
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle class="text-xl dark:text-white transition-colors duration-300">
              <Building class="w-5 h-5 inline mr-2" />
              Basic Information
            </CardTitle>
            <CardDescription class="dark:text-gray-300 transition-colors duration-300">
              Update your business details
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="name" class="text-sm font-medium dark:text-gray-200">Business Name *</Label>
                <Input
                  id="name"
                  bind:value={business.name}
                  placeholder="Enter business name"
                />
              </div>

              <div class="space-y-2">
                <Label for="phone" class="text-sm font-medium dark:text-gray-200">Phone Number</Label>
                <Input
                  id="phone"
                  bind:value={business.phone}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="description" class="text-sm font-medium dark:text-gray-200">Description *</Label>
              <Textarea
                id="description"
                bind:value={business.description}
                placeholder="Describe your business and services"
                rows={3}
              />
            </div>

            <div class="space-y-2">
              <Label for="website" class="text-sm font-medium dark:text-gray-200">Website</Label>
              <Input
                id="website"
                bind:value={business.website}
                placeholder="https://example.com"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Address -->
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle class="text-xl dark:text-white transition-colors duration-300">
              <MapPin class="w-5 h-5 inline mr-2" />
              Address
            </CardTitle>
            <CardDescription class="dark:text-gray-300 transition-colors duration-300">
              Your business location
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-2">
              <Label for="street" class="text-sm font-medium dark:text-gray-200">Street Address *</Label>
              <Input
                id="street"
                bind:value={business.address.street}
                placeholder="123 Main Street"
              />
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="city" class="text-sm font-medium dark:text-gray-200">City *</Label>
                <Input
                  id="city"
                  bind:value={business.address.city}
                  placeholder="City"
                />
              </div>

              <div class="space-y-2">
                <Label for="stateProvince" class="text-sm font-medium dark:text-gray-200">State/Province *</Label>
                <Input
                  id="stateProvince"
                  bind:value={business.address.stateProvince}
                  placeholder="State or Province"
                />
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="zipPostalCode" class="text-sm font-medium dark:text-gray-200">ZIP/Postal Code *</Label>
                <Input
                  id="zipPostalCode"
                  bind:value={business.address.zipPostalCode}
                  placeholder="12345"
                />
              </div>

              <div class="space-y-2">
                <Label for="country" class="text-sm font-medium dark:text-gray-200">Country</Label>
                <Input
                  id="country"
                  bind:value={business.address.country}
                  placeholder="Country"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Delivery Settings -->
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle class="text-xl dark:text-white transition-colors duration-300">
              <Truck class="w-5 h-5 inline mr-2" />
              Delivery Settings
            </CardTitle>
            <CardDescription class="dark:text-gray-300 transition-colors duration-300">
              Configure your delivery parameters
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div>
              <Label for="radius" class="text-sm font-medium dark:text-gray-200">Delivery Radius *</Label>
              <div class="flex space-x-2 mt-1">
                <Input
                  id="radius"
                  type="number"
                  bind:value={business.delivery.radius}
                  class="flex-1"
                  placeholder="10"
                  min="1"
                />
                <Select type="single" bind:value={business.delivery.radiusUnit}>
                  <SelectTrigger class="w-32">{business.delivery.radiusUnit}</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="miles">Miles</SelectItem>
                    <SelectItem value="kilometers">Kilometers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div class="space-y-2">
              <Label for="specialRequirements" class="text-sm font-medium dark:text-gray-200">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                bind:value={business.delivery.specialRequirements}
                placeholder="Any special delivery requirements or instructions"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <!-- Operating Hours -->
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle class="text-xl dark:text-white transition-colors duration-300">
              <Clock class="w-5 h-5 inline mr-2" />
              Operating Hours
            </CardTitle>
            <CardDescription class="dark:text-gray-300 transition-colors duration-300">
              Set your business hours for deliveries
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            {#each Object.entries(business.operatingHours) as [day, hours]}
              <div class="flex items-center space-x-4 p-3 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div class="flex items-center space-x-3 flex-1">
                  <Checkbox 
                    id={`${day}-enabled`} 
                    bind:checked={hours.enabled}
                    onchange={() => toggleDayEnabled(day)}
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
          </CardContent>
        </Card>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center pt-6">
          <Button
            type="button"
            variant="outline"
            onclick={cancelEdit}
            class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSaving}
            class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
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
      </form>

      <!-- Danger Zone -->
      <Card class="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 mt-6">
        <CardHeader>
          <CardTitle class="text-xl text-red-800 dark:text-red-200 transition-colors duration-300">
            <Trash class="w-5 h-5 inline mr-2" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Delete Business</h4>
              <p class="text-sm text-red-600 dark:text-red-300 mb-4">
                Once you delete a business, there is no going back. Please be certain.
              </p>
              <form 
                method="POST" 
                action="?/delete" 
                use:enhance={() => {
                  if (!confirm("Are you sure you want to delete this business? This action cannot be undone.")) {
                    return () => {};
                  }
                  return async ({ result, update }) => {
                    if (result.type === 'failure') {
                      toast.error(result.data?.error as string || 'Failed to delete business', {
                        description: result.data?.details as string || ""
                      });
                      await update();
                    } else if (result.type === 'success') {
                      toast.success("Business deleted successfully");
                      await update();
                    }
                  };
                }}
              >
                <Button
                  type="submit"
                  variant="destructive"
                  class="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300"
                >
                  <Trash class="w-4 h-4 mr-2" />
                  Delete Business
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>

  <Footer />
</div> 