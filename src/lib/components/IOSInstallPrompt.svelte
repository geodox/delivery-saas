<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { createEventDispatcher } from 'svelte';
  
  interface Props {
    show: boolean;
  }
  
  let { show }: Props = $props();
  
  const dispatch = createEventDispatcher<{
    dismiss: void;
    showInstructions: void;
  }>();
  
  function handleShowInstructions() {
    dispatch('showInstructions');
  }
  
  function handleDismiss() {
    dispatch('dismiss');
  }
</script>

{#if show}
  <Card class="fixed top-20 left-0 right-0 z-50 mx-4 mt-4 border-purple-200 bg-purple-50 dark:bg-purple-950/75 dark:border-purple-800">
    <CardContent class="p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-purple-900 dark:text-purple-100">Add to Home Screen</h3>
            <p class="text-sm text-purple-700 dark:text-purple-300">Install the Driver App on your iPhone</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <Button
            onclick={handleShowInstructions}
            size="sm"
            class="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            How to Install
          </Button>
          <Button
            onclick={handleDismiss}
            variant="ghost"
            size="sm"
            class="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
{/if} 