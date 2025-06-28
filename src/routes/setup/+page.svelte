<script lang="ts">
  import { HeaderNav, Footer } from "$lib/components";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Badge } from "$lib/components/ui/badge";
  import { 
    Building,
    MapPin,
    Phone,
    Globe,
    CheckCircle,
    ArrowRight,
    ArrowLeft
  } from "lucide-svelte";

  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";

  import { PUBLIC_DEBUG_MODE as debug} from "$env/static/public";

  // Form data
  let currentStep = $state(1);
  const totalSteps = 4;
  let isLoading = $state(false);
  let formError = $state<object | null>(null);

  // Step 1: Business Information
  let businessName = $state("");
  let businessType = $state("");
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
  let deliveryRadius = $state("10");
  let estimatedOrderVolume = $state("");
  let specialRequirements = $state("");

  // Country-specific provinces/states
  const countryProvinces: Record<string, string[]> = {
    "United States": [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
      "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
      "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
      "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
      "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
      "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
      "Wisconsin", "Wyoming"
    ],
    "Canada": [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
      "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
      "Quebec", "Saskatchewan", "Yukon"
    ],
    "United Kingdom": [
      "England", "Scotland", "Wales", "Northern Ireland"
    ],
    "Australia": [
      "Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland",
      "South Australia", "Tasmania", "Victoria", "Western Australia"
    ],
    "Germany": [
      "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse",
      "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate",
      "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"
    ],
    "France": [
      "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", "Centre-Val de Loire",
      "Corse", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandie", "Nouvelle-Aquitaine",
      "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"
    ]
  };

  const countries = Object.keys(countryProvinces);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      currentStep++;
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      currentStep--;
    }
  };

  const handleSubmit = async () => {
    isLoading = true;
    formError = null;
    // Form will be submitted via SvelteKit form action
  };

  // Handle form action result
  $effect(() => {
    if (page.form?.error) {
      formError = page.form.error;
      isLoading = false;
    }
  });

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return businessName && businessType && description;
      case 2:
        const addressValid = streetAddress && city && zipPostalCode && country;
        // If country has predefined provinces, require province selection
        if (country && countryProvinces[country]) {
          return addressValid && stateProvince;
        }
        return addressValid;
      case 3:
        return operatingHours;
      case 4:
        return deliveryRadius;
      default:
        return false;
    }
  };
</script>

<svelte:head>
  <title>Business Setup - DeliveryManager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav>
    <a href="/" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Home</a>
  </HeaderNav>

  <section class="py-20 lg:py-32">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Welcome Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
            <Building class="w-8 h-8 text-blue-600 dark:text-purple-400 transition-colors duration-300" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Welcome, {page.data.session?.user?.name}!
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
            Let's set up your business profile to get started with DeliveryManager
          </p>
        </div>

        <!-- Progress Indicator -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            {#each Array(totalSteps) as _, i}
              <div class="flex items-center {i < totalSteps - 1 ? 'flex-1' : ''}">
                <div class="w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors duration-300 {
                  i + 1 === currentStep 
                    ? 'bg-blue-600 dark:bg-purple-600 text-white' 
                    : i + 1 < currentStep 
                      ? 'bg-green-500 dark:bg-cyan-400 text-white' 
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                }">
                  {#if i + 1 < currentStep}
                    <CheckCircle class="w-4 h-4" />
                  {:else}
                    {i + 1}
                  {/if}
                </div>
                {#if i < totalSteps - 1}
                  <div class="flex-1 h-1 mx-4 rounded transition-colors duration-300 {
                    i + 1 < currentStep 
                      ? 'bg-green-500 dark:bg-cyan-400' 
                      : 'bg-gray-200 dark:bg-slate-700'
                  }"></div>
                {/if}
              </div>
            {/each}
          </div>
          <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            <span>Business Info</span>
            <span>Address</span>
            <span>Operating Hours</span>
            <span>Delivery Settings</span>
          </div>
        </div>

        <!-- Form Steps -->
        <Card class="border-0 shadow-2xl dark:bg-slate-800/90 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
          <CardHeader>
            <CardTitle class="text-2xl text-gray-900 dark:text-white transition-colors duration-300">
              {#if currentStep === 1}
                Business Information
              {:else if currentStep === 2}
                Business Address
              {:else if currentStep === 3}
                Operating Hours
              {:else}
                Delivery Settings
              {/if}
            </CardTitle>
            <CardDescription class="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              {#if currentStep === 1}
                Tell us about your business and what you do
              {:else if currentStep === 2}
                Where is your business located?
              {:else if currentStep === 3}
                Set your operating hours
              {:else}
                Configure your delivery settings
              {/if}
            </CardDescription>
          </CardHeader>

          <form 
            method="POST" 
            use:enhance={() => {
              return async ({ result }) => {
                if (result.type === 'failure') {
                  formError = result.data?.error || 'An error occurred';
                  isLoading = false;
                }
              };
            }}
          >
            <!-- Hidden form fields for all data -->
            <input type="hidden" name="businessName" value={businessName} />
            <input type="hidden" name="businessType" value={businessType} />
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
            <input type="hidden" name="estimatedOrderVolume" value={estimatedOrderVolume} />
            <input type="hidden" name="specialRequirements" value={specialRequirements} />

            <CardContent class="space-y-6">
              <!-- Error Display -->
              {#if formError}
                <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p class="text-red-800 dark:text-red-200 text-sm">{formError}</p>
                </div>
              {/if}

              {#if currentStep === 1}
                <!-- Step 1: Business Information -->
                <div class="space-y-4">
                  <div class="space-y-2">
                    <Label for="businessName" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      bind:value={businessName}
                      placeholder="Enter your business name"
                      class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      required
                    />
                  </div>

                <div class="space-y-2">
                  <Label for="description" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Business Description *
                  </Label>
                  <Textarea
                    id="description"
                    bind:value={description}
                    placeholder="Describe what your business does and what you deliver"
                    rows={3}
                    class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                    required
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="website" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Website
                    </Label>
                    <div class="relative">
                      <Globe class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                      <Input
                        id="website"
                        bind:value={website}
                        placeholder="https://yourwebsite.com"
                        class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <Label for="phone" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Phone Number
                    </Label>
                    <div class="relative">
                      <Phone class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                      <Input
                        id="phone"
                        bind:value={phone}
                        placeholder="+1 (555) 123-4567"
                        class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

            {:else if currentStep === 2}
              <!-- Step 2: Business Address -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <Label for="streetAddress" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Street Address *
                  </Label>
                  <div class="relative">
                    <MapPin class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                    <Input
                      id="streetAddress"
                      bind:value={streetAddress}
                      placeholder="123 Main Street"
                      class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="country" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Country *
                    </Label>
                    <select 
                      id="country"
                      bind:value={country}
                      class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white transition-colors duration-300"
                      required
                    >
                      {#each countries as countryOption}
                        <option value={countryOption}>{countryOption}</option>
                      {/each}
                    </select>
                  </div>

                  {#if country && countryProvinces[country]}
                    <div class="space-y-2">
                      <Label for="stateProvince" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        {country === "United States" ? "State" : "Province/Region"} *
                      </Label>
                      <select 
                        id="stateProvince"
                        bind:value={stateProvince}
                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white transition-colors duration-300"
                        required
                      >
                        <option value="">Select {country === "United States" ? "state" : "province/region"}</option>
                        {#each countryProvinces[country] as province}
                          <option value={province}>{province}</option>
                        {/each}
                      </select>
                    </div>
                  {:else if country}
                    <div class="space-y-2">
                      <Label for="stateProvince" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        State/Province/Region
                      </Label>
                      <Input
                        id="stateProvince"
                        bind:value={stateProvince}
                        placeholder="Enter state, province, or region"
                        class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      />
                    </div>
                  {/if}
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="city" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      City *
                    </Label>
                    <Input
                      id="city"
                      bind:value={city}
                      placeholder="New York"
                      class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      required
                    />
                  </div>

                  <div class="space-y-2">
                    <Label for="zipCode" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      {#if country === "Canada"}
                        Postal Code *
                      {:else}
                        ZIP Code *
                      {/if}
                    </Label>
                    <Input
                      id="zipCode"
                      bind:value={zipPostalCode}
                      placeholder={country === "Canada" ? "A1A 1A1" : "10001"}
                      class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      required
                    />
                  </div>
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
                    <div class="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg transition-colors duration-300">
                      <div class="w-20">
                        <label class="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            bind:checked={hours.enabled}
                            class="w-4 h-4 text-blue-600 dark:text-purple-600 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-purple-500 transition-colors duration-300"
                          />
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize transition-colors duration-300">{day}</span>
                        </label>
                      </div>
                      {#if hours.enabled}
                        <div class="flex items-center space-x-2">
                          <input
                            type="time"
                            bind:value={hours.open}
                            class="px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors duration-300"
                          />
                          <span class="text-gray-500 dark:text-gray-400 transition-colors duration-300">to</span>
                          <input
                            type="time"
                            bind:value={hours.close}
                            class="px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors duration-300"
                          />
                        </div>
                      {:else}
                        <span class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Closed</span>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>

              <div class="space-y-2">
                <Label for="specialRequirements" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Special Requirements or Notes
                </Label>
                <Textarea
                  id="specialRequirements"
                  bind:value={specialRequirements}
                  placeholder="Any special delivery requirements, restrictions, or additional information..."
                  rows={3}
                  class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                />
              </div>
            {:else if currentStep === 4}
              <!-- Step 4: Delivery Settings -->
              <div class="space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="deliveryRadius" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Delivery Radius ({country === "Canada" ? "km" : "miles"}) *
                    </Label>
                    <Input
                      id="deliveryRadius"
                      type="number"
                      bind:value={deliveryRadius}
                      placeholder="10"
                      min="1"
                      max="50"
                      class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>
              </div>
            {/if}

            <!-- Navigation Buttons -->
            <div class="flex justify-between pt-6 border-t border-gray-200 dark:border-slate-600 transition-colors duration-300">
              <Button
                variant="outline"
                onclick={handlePrevious}
                disabled={currentStep === 1}
                class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
              >
                <ArrowLeft class="w-4 h-4 mr-2" />
                Previous
              </Button>

                {#if currentStep === totalSteps}
                  <Button
                    type="submit"
                    disabled={!isStepValid(currentStep) || isLoading}
                    class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
                  >
                    {#if isLoading}
                      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Setting up...
                    {:else}
                      Complete Setup
                      <CheckCircle class="w-4 h-4 ml-2" />
                    {/if}
                  </Button>
                {:else}
                  <Button
                    type="button"
                    onclick={handleNext}
                    disabled={!debug && !isStepValid(currentStep)}
                    class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
                  >
                    Next
                    <ArrowRight class="w-4 h-4 ml-2" />
                  </Button>
                {/if}
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  </section>

  <Footer />
</div>