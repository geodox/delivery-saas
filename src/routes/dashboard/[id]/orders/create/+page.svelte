<script lang="ts">
  // Svelte
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  // Components
  import { HeaderNav, Footer } from "$lib/components";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  // Lucide Icons
  import ArrowLeft from "lucide-svelte/icons/arrow-left";
  import Save from "lucide-svelte/icons/save";
  import User from "lucide-svelte/icons/user";
  import Mail from "lucide-svelte/icons/mail";
  import Phone from "lucide-svelte/icons/phone";
  import MapPin from "lucide-svelte/icons/map-pin";
  import Package from "lucide-svelte/icons/package";
  import Clock from "lucide-svelte/icons/clock";
  import DollarSign from "lucide-svelte/icons/dollar-sign";
  import FileText from "lucide-svelte/icons/file-text";
  // Utils
  import { toast } from "svelte-sonner";
  import { countries, countryProvinces } from "$lib/utils/locations";
  // Environment variables
  import { PUBLIC_DEBUG_MODE as debug} from "$env/static/public";

  const { data } = $props();

  // Form state using $state()
  let isLoading = $state(false);

  // Customer Information
  let customerName = $state("");
  let customerPhone = $state("");
  let customerEmail = $state("");

  // Order Details
  let orderDetails = $state("");
  let totalAmount = $state<number | undefined>(undefined);
  let specialInstructions = $state("");

  // Delivery Address
  let deliveryStreet = $state("");
  let deliveryCity = $state("");
  let deliveryStateProvince = $state("");
  let deliveryZipPostalCode = $state("");
  let deliveryCountry = $state("United States");

  // Delivery Time
  let estimatedDeliveryTime = $state<string>("");

  // Validation state
  let errors = $state<Record<string, string>>({});

  if (debug) {
    customerName = "John Doe";
    customerPhone = "+1 (555) 123-4567";
    customerEmail = "john.doe@example.com";
    orderDetails = "2 large pizzas, 1 order of wings, 2 sodas";
    totalAmount = 29.99;
    deliveryStreet = "123 Main Street, Apt 4B";
    deliveryCity = "New York";
    deliveryStateProvince = "New York";
    deliveryZipPostalCode = "10001";
    deliveryCountry = "United States";
    estimatedDeliveryTime = "2025-07-03T12:00";
    specialInstructions = "Please leave at the front door";
  }
</script>

<svelte:head>
  <title>Create Order - DeliveryManager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav>
    <a href={`/dashboard/${data.selectedBusiness?.id}`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</a>
    <a href={`/dashboard/${data.selectedBusiness?.id}/orders`} role="menuitem" class="text-blue-600 dark:text-purple-400 font-medium transition-colors">Orders</a>
    <a href={`/dashboard/${data.selectedBusiness?.id}/employees`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Employees</a>
    <a href={`/dashboard/${data.selectedBusiness?.id}/tracking`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Live Tracking</a>
    <a href={`/dashboard/${data.selectedBusiness?.id}/analytics`} role="menuitem" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Analytics</a>
  </HeaderNav>

  <main class="py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Page Header -->
      <div class="flex items-center mb-8">
        <div class="w-full flex items-center justify-between space-x-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Create New Order
            </h1>
            <p class="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
              Add a new delivery order for {data.selectedBusiness?.name}
            </p>
          </div>
          <Button
            href={`/dashboard/${data.selectedBusiness?.id}/orders`}
            variant="outline"
            class="hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-300"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>



      <form method="POST" use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'failure') {
            toast.error((result.data?.error as string) || 'Failed to create order');
          } else {
            toast.success('Order created successfully!');
          }
        };
      }} class="space-y-6">
        <!-- Customer Information -->
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
          <CardHeader>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <User class="w-5 h-5 text-blue-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle class="text-xl dark:text-white transition-colors duration-300">Customer Information</CardTitle>
                <CardDescription class="dark:text-gray-300 transition-colors duration-300">Enter customer details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="customerName" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Customer Name *
                </Label>
                <div class="relative">
                  <User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <Input
                    id="customerName"
                    name="customerName"
                    bind:value={customerName}
                    placeholder="John Doe"
                    class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300 {errors.customerName ? 'border-red-500 dark:border-red-400' : ''}"
                    required
                  />
                </div>
                {#if errors.customerName}
                  <p class="text-red-500 dark:text-red-400 text-sm">{errors.customerName}</p>
                {/if}
              </div>

              <div class="space-y-2">
                <Label for="customerPhone" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Phone Number *
                </Label>
                <div class="relative">
                  <Phone class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    bind:value={customerPhone}
                    placeholder="+1 (555) 123-4567"
                    class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300 {errors.customerPhone ? 'border-red-500 dark:border-red-400' : ''}"
                    required
                  />
                </div>
                {#if errors.customerPhone}
                  <p class="text-red-500 dark:text-red-400 text-sm">{errors.customerPhone}</p>
                {/if}
              </div>
            </div>

            <div class="space-y-2">
              <Label for="customerEmail" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Email Address *
              </Label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  bind:value={customerEmail}
                  placeholder="john.doe@example.com"
                  class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300 {errors.customerEmail ? 'border-red-500 dark:border-red-400' : ''}"
                  required
                />
              </div>
              {#if errors.customerEmail}
                <p class="text-red-500 dark:text-red-400 text-sm">{errors.customerEmail}</p>
              {/if}
            </div>
          </CardContent>
        </Card>

        <!-- Order Details -->
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
          <CardHeader>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Package class="w-5 h-5 text-blue-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle class="text-xl dark:text-white transition-colors duration-300">Order Details</CardTitle>
                <CardDescription class="dark:text-gray-300 transition-colors duration-300">What items are being delivered</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="orderDetails" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Order Details *
              </Label>
              <div class="relative">
                <FileText class="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                <Textarea
                  id="orderDetails"
                  name="orderDetails"
                  bind:value={orderDetails}
                  placeholder="Describe the items being delivered (e.g., 2 large pizzas, 1 order of wings, 2 sodas)"
                  rows={3}
                  class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300 {errors.orderDetails ? 'border-red-500 dark:border-red-400' : ''}"
                  required
                />
              </div>
              {#if errors.orderDetails}
                <p class="text-red-500 dark:text-red-400 text-sm">{errors.orderDetails}</p>
              {/if}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="totalAmount" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Total Amount
                </Label>
                <div class="relative">
                  <DollarSign class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <Input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    bind:value={totalAmount}
                    placeholder="29.99"
                    step="0.01"
                    min="0"
                    class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300 {errors.totalAmount ? 'border-red-500 dark:border-red-400' : ''}"
                  />
                </div>
                {#if errors.totalAmount}
                  <p class="text-red-500 dark:text-red-400 text-sm">{errors.totalAmount}</p>
                {/if}
              </div>

              <div class="space-y-2">
                <Label for="estimatedDeliveryTime" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Estimated Delivery Time
                </Label>
                <div class="relative">
                  <Clock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <Input
                    id="estimatedDeliveryTime"
                    name="estimatedDeliveryTime"
                    type="datetime-local"
                    bind:value={estimatedDeliveryTime}
                    class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white transition-colors duration-300"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="specialInstructions" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Special Instructions
              </Label>
              <Textarea
                id="specialInstructions"
                name="specialInstructions"
                bind:value={specialInstructions}
                placeholder="Any special delivery instructions, dietary restrictions, or notes..."
                rows={2}
                class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Delivery Address -->
        <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
          <CardHeader>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <MapPin class="w-5 h-5 text-blue-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle class="text-xl dark:text-white transition-colors duration-300">Delivery Address</CardTitle>
                <CardDescription class="dark:text-gray-300 transition-colors duration-300">Where should the order be delivered</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="deliveryStreet" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Street Address *
              </Label>
              <Input
                id="deliveryStreet"
                name="deliveryStreet"
                bind:value={deliveryStreet}
                placeholder="123 Main Street, Apt 4B"
                class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300 {errors.deliveryStreet ? 'border-red-500 dark:border-red-400' : ''}"
                required
              />
              {#if errors.deliveryStreet}
                <p class="text-red-500 dark:text-red-400 text-sm">{errors.deliveryStreet}</p>
              {/if}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label for="deliveryCity" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  City *
                </Label>
                <Input
                  id="deliveryCity"
                  name="deliveryCity"
                  bind:value={deliveryCity}
                  placeholder="New York"
                  class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300 {errors.deliveryCity ? 'border-red-500 dark:border-red-400' : ''}"
                  required
                />
                {#if errors.deliveryCity}
                  <p class="text-red-500 dark:text-red-400 text-sm">{errors.deliveryCity}</p>
                {/if}
              </div>

              <div class="space-y-2">
                <Label for="deliveryStateProvince" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  {deliveryCountry === "United States" ? "State" : "Province/Region"}
                  {#if deliveryCountry && countryProvinces[deliveryCountry]} *{/if}
                </Label>
                {#if deliveryCountry && countryProvinces[deliveryCountry]}
                  <select
                    id="deliveryStateProvince"
                    name="deliveryStateProvince"
                    bind:value={deliveryStateProvince}
                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white transition-colors duration-300 {errors.deliveryStateProvince ? 'border-red-500 dark:border-red-400' : ''}"
                    required
                  >
                    <option value="">Select {deliveryCountry === "United States" ? "state" : "province/region"}</option>
                    {#each countryProvinces[deliveryCountry] as province}
                      <option value={province}>{province}</option>
                    {/each}
                  </select>
                {:else}
                  <Input
                    id="deliveryStateProvince"
                    bind:value={deliveryStateProvince}
                    placeholder="Enter state, province, or region"
                    class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                  />
                {/if}
                {#if errors.deliveryStateProvince}
                  <p class="text-red-500 dark:text-red-400 text-sm">{errors.deliveryStateProvince}</p>
                {/if}
              </div>

              <div class="space-y-2">
                <Label for="deliveryZipPostalCode" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  {deliveryCountry === "Canada" ? "Postal Code" : "ZIP Code"} *
                </Label>
                                  <Input
                    id="deliveryZipPostalCode"
                    name="deliveryZipPostalCode"
                    bind:value={deliveryZipPostalCode}
                    placeholder={deliveryCountry === "Canada" ? "A1A 1A1" : "10001"}
                    class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300 {errors.deliveryZipPostalCode ? 'border-red-500 dark:border-red-400' : ''}"
                    required
                  />
                {#if errors.deliveryZipPostalCode}
                  <p class="text-red-500 dark:text-red-400 text-sm">{errors.deliveryZipPostalCode}</p>
                {/if}
              </div>
            </div>

            <div class="space-y-2">
              <Label for="deliveryCountry" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Country *
              </Label>
              <select
                id="deliveryCountry"
                name="deliveryCountry"
                bind:value={deliveryCountry}
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white transition-colors duration-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent {errors.deliveryCountry ? 'border-red-500 dark:border-red-400' : ''}"
                required
              >
                {#each countries as countryOption}
                  <option value={countryOption}>{countryOption}</option>
                {/each}
              </select>
              {#if errors.deliveryCountry}
                <p class="text-red-500 dark:text-red-400 text-sm">{errors.deliveryCountry}</p>
              {/if}
            </div>
          </CardContent>
        </Card>

        <!-- Form Actions -->
        <div class="flex items-center justify-end space-x-4 pt-6">
          <Button
            href={`/dashboard/${data.selectedBusiness?.id}/orders`}
            variant="outline"
            class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
          >
            {#if isLoading}
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Order...
            {:else}
              <Save class="w-4 h-4 mr-2" />
              Create Order
            {/if}
          </Button>
        </div>
      </form>
    </div>
  </main>

  <Footer />
</div>
