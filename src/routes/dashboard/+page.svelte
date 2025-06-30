<script lang="ts">
  // Types
  import type { Business } from "$lib/models";

  // Svelte
  import { goto } from "$app/navigation";

  // Components
  import { HeaderNav, Footer } from "$lib/components";
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";

  // Icons
  import Building from "lucide-svelte/icons/building";
  import MapPin from "lucide-svelte/icons/map-pin";

  let { data } = $props<{
    data: {
      session: any;
      businesses: Business[];
    };
  }>();

  function selectBusiness(id: string) {
    goto(`/dashboard/${id}`);
  }
</script>

<svelte:head>
  <title>Select a Business - DeliveryManager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav />

  <main class="py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle class="text-2xl dark:text-white">Select a Business</CardTitle>
          <CardDescription class="dark:text-gray-300">Choose which business you want to manage.</CardDescription>
        </CardHeader>
        <CardContent>
          {#if data.businesses.length === 0}
            <div class="text-center py-8">
              <Building class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No businesses found</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">Get started by creating your first business.</p>
              <Button class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700" href="/setup">
                <Building class="w-4 h-4 mr-2" />
                Create Business
              </Button>
            </div>
          {:else}
            <div class="space-y-4">
              {#each data.businesses as business}
                <div class="border border-gray-200 dark:border-slate-700 rounded-lg p-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <div class="w-8 h-8 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Building class="w-4 h-4 text-blue-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-900 dark:text-white">{business.name}</h4>
                        {#if business.ownerId === data.session?.user?.id}
                          <Badge variant="default" class="text-xs">Owner</Badge>
                        {:else}
                          <Badge variant="secondary" class="text-xs">Employee</Badge>
                        {/if}
                      </div>
                    </div>
                    {#if business.description}
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{business.description}</p>
                    {/if}
                    {#if business.address}
                      <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin class="w-4 h-4" />
                        <span>{business.address.city}, {business.address.stateProvince}</span>
                      </div>
                    {/if}
                  </div>
                  <div class="flex items-center ml-4">
                    <Button onclick={() => selectBusiness(business.id)} class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700">
                      Select
                    </Button>
                  </div>
                </div>
              {/each}
            </div>
            <div class="flex justify-center mt-8">
              <Button variant="outline" href="/setup" class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">
                <Building class="w-4 h-4 mr-2" />
                Add Business
              </Button>
            </div>
          {/if}
        </CardContent>
      </Card>
    </div>
  </main>

  <Footer />
</div> 