<script lang="ts">
  // Types
  import type { Business } from "$lib/models";

  // Svelte
  import { goto } from "$app/navigation";

  // Components
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
  <meta name="description" content="Choose which business you want to manage in your DeliveryManager dashboard." />
</svelte:head>

<div class="container mx-auto px-4 max-w-2xl">
  <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
    <CardHeader>
      <CardTitle class="text-2xl dark:text-white">Select a Business</CardTitle>
      <CardDescription class="dark:text-gray-300">Choose which business you want to manage.</CardDescription>
    </CardHeader>
    <CardContent>
      {#if data.businesses.length === 0}
        <div class="text-center py-8" role="status" aria-live="polite">
          <Building class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" aria-hidden="true" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No businesses found</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Get started by creating your first business.</p>
          <Button class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700" href="/setup">
            <Building class="w-4 h-4 mr-2" aria-hidden="true" />
            Create Business
          </Button>
        </div>
      {:else}
        <div class="space-y-4" role="list" aria-label="Available businesses">
          {#each data.businesses as business}
            <div class="border border-gray-200 dark:border-slate-700 rounded-lg p-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200" role="listitem">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center" aria-hidden="true">
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
                    <MapPin class="w-4 h-4" aria-hidden="true" />
                    <span>{business.address.city}, {business.address.stateProvince}</span>
                  </div>
                {/if}
              </div>
              <div class="flex items-center ml-4">
                <Button 
                  onclick={() => selectBusiness(business.id)} 
                  class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700"
                  aria-label="Select {business.name} business"
                >
                  Select
                </Button>
              </div>
            </div>
          {/each}
        </div>
        <div class="flex justify-center mt-8">
          <Button 
            variant="outline" 
            href="/setup" 
            class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
            aria-label="Add new business"
          >
            <Building class="w-4 h-4 mr-2" aria-hidden="true" />
            Add Business
          </Button>
        </div>
      {/if}
    </CardContent>
  </Card>
</div> 