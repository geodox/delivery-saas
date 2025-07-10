<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { createEventDispatcher } from 'svelte';
  
  interface Props {
    show: boolean;
  }
  
  let { show }: Props = $props();
  
  const dispatch = createEventDispatcher<{
    close: void;
  }>();
  
  function handleClose() {
    dispatch('close');
  }
</script>

{#if show}
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <Card class="w-full max-w-md border-purple-200 bg-white dark:bg-slate-800 dark:border-purple-800">
      <CardContent class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-purple-900 dark:text-purple-100">Install on iPhone</h3>
          <Button
            onclick={handleClose}
            variant="ghost"
            size="sm"
            class="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </Button>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-sm font-semibold text-purple-600 dark:text-purple-400">1</span>
            </div>
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">Tap the <strong>Share</strong> button at the bottom of Safari</p>
              <div class="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block">
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-sm font-semibold text-purple-600 dark:text-purple-400">2</span>
            </div>
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">Scroll down and tap <strong>"Add to Home Screen"</strong></p>
              <div class="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block">
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-sm font-semibold text-purple-600 dark:text-purple-400">3</span>
            </div>
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">Tap <strong>"Add"</strong> to confirm</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            The app will now appear on your home screen and work like a native app!
          </p>
        </div>
        
        <div class="mt-4 flex justify-end">
          <Button
            onclick={handleClose}
            size="sm"
            class="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            Got it!
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
{/if} 