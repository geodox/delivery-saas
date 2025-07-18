<script lang="ts">
  // Svelte
  import { page } from "$app/state";
  import { enhance } from "$app/forms";
  // Components
  import { HeaderNav, Footer } from "$lib/components";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import * as Select from "$lib/components/ui/select";
  import { Badge } from "$lib/components/ui/badge";
  // Icons
  import Building from "lucide-svelte/icons/building";
  import MapPin from "lucide-svelte/icons/map-pin";
  import Phone from "lucide-svelte/icons/phone";
  import Globe from "lucide-svelte/icons/globe";
  import CheckCircle from "lucide-svelte/icons/check-circle";
  import ArrowRight from "lucide-svelte/icons/arrow-right";
  import ArrowLeft from "lucide-svelte/icons/arrow-left";
  // Environment variables
  import { PUBLIC_DEBUG_MODE as debug} from "$env/static/public";
  // Utils
  import { toast } from "svelte-sonner";
  import { countries, countryProvinces } from "$lib/utils/locations";

  // Form data
  let currentStep = $state(1);
  const totalSteps = 4;
  let isLoading = $state(false);

  // Step 1: Business Information
  let name = $state("");
  let description = $state("");
  let website = $state("");
  let phone = $state("");

  // Step 2: Business Address
  let streetAddress = $state("");
  let city = $state("");
  let stateProvince = $state("");
  let zipPostalCode = $state("");
  let country = $state("United States");

  // Step 3: Operating Hours
  let operatingHours = $state({
    monday: { open: "09:00", close: "18:00", enabled: true },
    tuesday: { open: "09:00", close: "18:00", enabled: true },
    wednesday: { open: "09:00", close: "18:00", enabled: true },
    thursday: { open: "09:00", close: "18:00", enabled: true },
    friday: { open: "09:00", close: "18:00", enabled: true },
    saturday: { open: "10:00", close: "16:00", enabled: true },
    sunday: { open: "10:00", close: "16:00", enabled: false }
  });

  // Step 4: Delivery Settings
  let deliveryRadius = $state(10);
  let deliveryRadiusUnit = $state("miles");
  let specialRequirements = $state("");

  $effect(() => {
    deliveryRadiusUnit = country === "Canada" ? "kilometers" : "miles";
  });

  function nextStep() {
    if (currentStep < totalSteps) {
      currentStep++;
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  function getStepProgress() {
    return (currentStep / totalSteps) * 100;
  }

  function getStepTitle(step: number) {
    switch (step) {
      case 1: return "Business Information";
      case 2: return "Business Address";
      case 3: return "Operating Hours";
      case 4: return "Delivery Settings";
      default: return "";
    }
  }

  function getStepDescription(step: number) {
    switch (step) {
      case 1: return "Tell us about your business";
      case 2: return "Where is your business located?";
      case 3: return "When are you open for deliveries?";
      case 4: return "Configure your delivery settings";
      default: return "";
    }
  }

  function isStepValid(step: number) {
    switch (step) {
      case 1:
        return name.trim() !== "" && phone.trim() !== "";
      case 2:
        return streetAddress.trim() !== "" && city.trim() !== "" && stateProvince.trim() !== "" && zipPostalCode.trim() !== "";
      case 3:
        return true; // Operating hours are optional
      case 4:
        return deliveryRadius > 0;
      default:
        return false;
    }
  }

  function canProceed() {
    return isStepValid(currentStep);
  }

  function canGoBack() {
    return currentStep > 1;
  }

  function isLastStep() {
    return currentStep === totalSteps;
  }

  if (debug) {
    name = "Deliveries";
    description = "We provide delivery services to the local area.";
    website = "https://example.com";
    phone = "+1 (555) 123-4567";
    streetAddress = "123 Main St";
    city = "Toronto";
    stateProvince = "Ontario";
    zipPostalCode = "A1A 1A1";
    country = "Canada";
    operatingHours = {
      monday: { open: "09:00", close: "18:00", enabled: true },
      tuesday: { open: "09:00", close: "18:00", enabled: true },
      wednesday: { open: "09:00", close: "18:00", enabled: true },
      thursday: { open: "09:00", close: "18:00", enabled: true },
      friday: { open: "09:00", close: "18:00", enabled: true },
      saturday: { open: "10:00", close: "16:00", enabled: true },
      sunday: { open: "10:00", close: "16:00", enabled: false }
    };
    deliveryRadius = 25;
    specialRequirements = "Test Special Requirements";
  }
</script>

<svelte:head>
  <title>Setup Business - DeliveryManager</title>
  <meta name="description" content="Set up your business profile in DeliveryManager to start managing deliveries." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav showLogin={false} showGetStarted={false} />

  <main id="main-content" class="py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            {getStepTitle(currentStep)}
          </h1>
          <span class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 transition-colors duration-300">
          <div 
            class="bg-blue-600 dark:bg-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style="width: {getStepProgress()}%"
          ></div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
          {getStepDescription(currentStep)}
        </p>
      </div>

      <form 
        method="POST" 
        use:enhance={() => {
          isLoading = true;
          return async ({ result, update }) => {
            if (result.type === 'failure') {
              isLoading = false;
              toast.error(result.data?.error as string || 'An error occurred', {
                description: result.data?.details as string || ""
              });
              await update();
            } else {
              isLoading = false;
              toast.success("Business created successfully");
              await update();
            }
          };
        }}
      >
        <!-- Hidden form fields for all data -->
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="website" value={website} />
        <input type="hidden" name="phone" value={phone} />
        <input type="hidden" name="streetAddress" value={streetAddress} />
        <input type="hidden" name="city" value={city} />
        <input type="hidden" name="stateProvince" value={stateProvince} />
        <input type="hidden" name="zipPostalCode" value={zipPostalCode} />
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="operatingHours" value={JSON.stringify(operatingHours)} />
        <input type="hidden" name="deliveryRadius" value={deliveryRadius} />
        <input type="hidden" name="specialRequirements" value={specialRequirements} />

        <!-- Form Card -->
        <Card.Root class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
          <Card.Content class="p-8">
            {#if currentStep === 1}
              <!-- Step 1: Business Information -->
              <div class="space-y-6">
                <div class="space-y-2">
                  <Label for="name" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Business Name *
                  </Label>
                  <div class="relative">
                    <Building class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" aria-hidden="true" />
                    <Input
                      id="name"
                      type="text"
                      bind:value={name}
                      placeholder="Enter your business name"
                      class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <Label for="description" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Business Description
                  </Label>
                  <Textarea
                    id="description"
                    bind:value={description}
                    placeholder="Brief description of your business and services"
                    class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                    rows={3}
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="website" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Website
                    </Label>
                    <div class="relative">
                      <Globe class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" aria-hidden="true" />
                      <Input
                        id="website"
                        type="url"
                        bind:value={website}
                        placeholder="https://example.com"
                        class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <Label for="phone" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Phone Number *
                    </Label>
                    <div class="relative">
                      <Phone class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" aria-hidden="true" />
                      <Input
                        id="phone"
                        type="tel"
                        bind:value={phone}
                        placeholder="(555) 123-4567"
                        class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

            {:else if currentStep === 2}
              <!-- Step 2: Business Address -->
              <div class="space-y-6">
                <div class="space-y-2">
                  <Label for="streetAddress" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Street Address *
                  </Label>
                  <div class="relative">
                    <MapPin class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" aria-hidden="true" />
                    <Input
                      id="streetAddress"
                      type="text"
                      bind:value={streetAddress}
                      placeholder="123 Main Street"
                      class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="city" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      City *
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      bind:value={city}
                      placeholder="City"
                      class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      required
                    />
                  </div>

                  <div class="space-y-2">
                    <Label for="zipPostalCode" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      ZIP/Postal Code *
                    </Label>
                    <Input
                      id="zipPostalCode"
                      type="text"
                      bind:value={zipPostalCode}
                      placeholder="12345"
                      class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="country" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Country *
                    </Label>
                    <Select.Root type="single" bind:value={country} required>
                      <Select.Trigger class="w-full dark:bg-slate-700/50 dark:border-slate-600 dark:text-white transition-colors duration-300">
                        {country}
                      </Select.Trigger>
                      <Select.Content placeholder="Select country">
                        {#each countries as countryOption}
                          <Select.Item value={countryOption}>{countryOption}</Select.Item>
                        {/each}
                      </Select.Content>
                    </Select.Root>
                  </div>

                  {#if country && countryProvinces[country]}
                    <div class="space-y-2">
                      <Label for="stateProvince" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        {country === "United States" ? "State" : "Province/Region"} *
                      </Label>
                      <Select.Root type="single" bind:value={stateProvince} required>
                        <Select.Trigger class="w-full dark:bg-slate-700/50 dark:border-slate-600 dark:text-white transition-colors duration-300">
                          {stateProvince}
                        </Select.Trigger>
                        <Select.Content placeholder="Select {country === 'United States' ? 'state' : 'province/region'}">
                          {#each countryProvinces[country] as province}
                            <Select.Item value={province}>{province}</Select.Item>
                          {/each}
                        </Select.Content>
                      </Select.Root>
                    </div>
                  {:else}
                    <div class="space-y-2">
                      <Label for="stateProvince" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        State/Province/Region *
                      </Label>
                      <Input
                        id="stateProvince"
                        type="text"
                        bind:value={stateProvince}
                        placeholder="State/Province/Region"
                        class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                        required
                      />
                    </div>
                  {/if}
                </div>
              </div>

            {:else if currentStep === 3}
              <!-- Step 3: Operating Hours -->
              <div class="space-y-4">
                <Label class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Operating Hours
                </Label>
                <div class="space-y-3">
                  {#each Object.entries(operatingHours) as [day, hours]}
                    <div class="flex items-center justify-between space-x-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg transition-colors duration-300">
                      <div class="w-20">
                        <div class="flex items-center space-x-2">
                          <Checkbox id={`${day}-enabled`} bind:checked={hours.enabled} />
                          <Label for={`${day}-enabled`} class="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize transition-colors duration-300">{day}</Label>
                        </div>
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
                        <Badge variant="secondary" class="p-2">Closed</Badge>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>

            {:else if currentStep === 4}
              <!-- Step 4: Delivery Settings -->
              <div class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label for="radius" class="text-sm font-medium dark:text-gray-200">Delivery Radius *</Label>
                    <div class="flex space-x-2 mt-1">
                      <Input
                        id="radius"
                        type="number"
                        bind:value={deliveryRadius}
                        class="flex-1"
                        placeholder="10"
                        min="1"
                      />
                      <Select.Root type="single" bind:value={deliveryRadiusUnit}>
                        <Select.Trigger class="w-32">
                          {deliveryRadiusUnit}
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="miles">Miles</Select.Item>
                          <Select.Item value="kilometers">Kilometers</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label for="specialRequirements" class="text-sm font-medium dark:text-gray-200">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    bind:value={specialRequirements}
                    class="mt-1"
                    placeholder="Any special delivery requirements or instructions"
                    rows={3}
                  />
                </div>
              </div>
            {/if}

            <!-- Navigation Buttons -->
            <div class="flex justify-between mt-8">
              <Button
                variant="outline"
                onclick={prevStep}
                disabled={!canGoBack()}
                class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
              >
                <ArrowLeft class="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div class="flex space-x-3">
                {#if isLastStep()}
                  <Button
                    type="submit"
                    disabled={!canProceed() || isLoading}
                    class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
                  >
                    {#if isLoading}
                      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    {:else}
                      <CheckCircle class="w-4 h-4 mr-2" />
                      Create Business
                    {/if}
                  </Button>
                {:else}
                  <Button
                    onclick={nextStep}
                    disabled={!canProceed()}
                    class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
                  >
                    Next
                    <ArrowRight class="w-4 h-4 ml-2" />
                  </Button>
                {/if}
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      </form>
    </div>
  </main>

  <Footer />
</div>