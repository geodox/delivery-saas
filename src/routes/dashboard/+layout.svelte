<script lang="ts">
  import { goto } from "$app/navigation";

  import type { Business } from "$lib/models";

  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  
  import Building from "lucide-svelte/icons/building";
  import MapPin from "lucide-svelte/icons/map-pin";
  import Check from "lucide-svelte/icons/check";
  import X from "lucide-svelte/icons/x";

  let { data, children } = $props<{
    data: {
      session: any;
      businesses: Business[];
      selectedBusiness: Business | null;
    };
    children: any;
  }>();

  // Show business selector if there are multiple businesses and no current business is set
  let showBusinessSelector = $state(data.businesses.length > 1 && !data.selectedBusiness);
  
  function selectBusiness(business: Business) {
    // Navigate to dashboard with the selected business
    goto(`/dashboard?business=${business.id}`);
    showBusinessSelector = false;
  }

  function closeBusinessSelector() {
    // If user closes without selecting, default to first business
    if (data.businesses.length > 0) {
      selectBusiness(data.businesses[0]);
    }
  }
</script>

{@render children()}

<!-- Business Selection Overlay -->
{#if showBusinessSelector}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Select Business</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Choose which business you'd like to manage</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onclick={closeBusinessSelector}
          class="hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full p-2"
        >
          <X class="w-5 h-5" />
        </Button>
      </div>

      <!-- Modal Content -->
      <div class="p-6">
        <div class="grid gap-4">
          {#each data.businesses as business}
            <Card 
              class="group border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all duration-200 hover:shadow-md dark:hover:shadow-purple-900/20"
              onclick={() => selectBusiness(business)}
            >
              <CardContent class="p-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <div class="w-10 h-10 bg-blue-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Building class="w-5 h-5 text-blue-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{business.name}</h3>
                        {#if business.ownerId === data.session?.user?.id}
                          <Badge variant="default" class="text-xs">Owner</Badge>
                        {:else}
                          <Badge variant="secondary" class="text-xs">Employee</Badge>
                        {/if}
                      </div>
                    </div>
                    
                    {#if business.description}
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
                        {business.description}
                      </p>
                    {/if}

                    {#if business.address}
                      <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin class="w-4 h-4" />
                        <span>
                          {business.address.city}, {business.address.stateProvince}
                        </span>
                      </div>
                    {/if}
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    {#if business.website}
                      <Badge variant="outline" class="text-xs">
                        <a href={business.website} target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 dark:hover:text-purple-400">
                          Website
                        </a>
                      </Badge>
                    {/if}
                    <Check class="w-5 h-5 text-blue-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          {/each}
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-slate-700">
          <Button
            variant="outline"
            onclick={closeBusinessSelector}
            class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  </div>
{/if}

