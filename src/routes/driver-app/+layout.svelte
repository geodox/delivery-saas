<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { HeaderNav, IOSInstallPrompt, IOSInstallInstructions } from '$lib/components';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { 
    isIOS, 
    isSafari, 
    isInstalled, 
    hasDismissedIOSPrompt, 
    dismissIOSPrompt,
    registerServiceWorker,
    type BeforeInstallPromptEvent 
  } from '$lib/utils/pwa';
  
  let { children } = $props();

  let isOnline = $state(true);
  
  let deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
  let showInstallPrompt = $state(false);
  let isAppInstalled = $state(false);
  
  // iOS-specific states
  let isIOSDevice = $state(false);
  let isSafariBrowser = $state(false);
  let showIOSInstallPrompt = $state(false);
  let showIOSInstructions = $state(false);
  
  // Get the current section from the URL
  const currentSection = $derived(() => {
    const path = page.url.pathname;
    
    if (path === '/driver-app') return 'dashboard';
    if (path.startsWith('/driver-app/orders')) return 'orders';
    if (path.startsWith('/driver-app/earnings')) return 'earnings';
    if (path.startsWith('/account')) return 'account';
    
    return null;
  });
  
  // Navigation items with their paths and labels
  const navItems = $derived(() => [
    { 
      href: '/driver-app', 
      label: 'Dashboard',
      section: 'dashboard'
    },
    { 
      href: '/driver-app/orders', 
      label: 'Orders',
      section: 'orders'
    },
    { 
      href: '/driver-app/earnings', 
      label: 'Earnings',
      section: 'earnings'
    },
    { 
      href: '/account', 
      label: 'Account',
      section: 'account'
    }
  ]);
  
  // Function to get the appropriate classes for a nav item
  function getNavItemClasses(itemSection: string) {
    const isActive = currentSection() === itemSection;
    return isActive 
      ? "text-blue-600 dark:text-purple-400 font-medium transition-colors"
      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors";
  }
  
  // Detect iOS and Safari
  function detectPlatform() {
    if (browser) {
      isIOSDevice = isIOS();
      isSafariBrowser = isSafari();
      isAppInstalled = isInstalled();
      
      // Show iOS install prompt if on iOS Safari and not already installed
      if (isIOSDevice && isSafariBrowser && !isAppInstalled) {
        // Check if user has dismissed this before
        if (!hasDismissedIOSPrompt()) {
          showIOSInstallPrompt = true;
        }
      }
    }
  }
  
  $effect(() => {
    if (browser) {
      // Detect platform first
      detectPlatform();
      
      // Check initial online status
      isOnline = navigator.onLine;
      
      // Listen for online/offline events
      const handleOnline = () => isOnline = true;
      const handleOffline = () => isOnline = false;
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Register service worker
      registerServiceWorker();
      
      // Listen for beforeinstallprompt event (Android/Chrome)
      window.addEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault();
        deferredPrompt = e as BeforeInstallPromptEvent;
        showInstallPrompt = true;
      });
      
      // Listen for app installed event
      window.addEventListener('appinstalled', () => {
        isAppInstalled = true;
        showInstallPrompt = false;
        showIOSInstallPrompt = false;
        deferredPrompt = null;
      });
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  });
  
  async function installPWA() {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
      } catch (error) {
        console.error('Error during PWA installation:', error);
      } finally {
        deferredPrompt = null;
        showInstallPrompt = false;
      }
    }
  }
  
  function dismissInstallPrompt() {
    showInstallPrompt = false;
    deferredPrompt = null;
  }
  
  function handleIOSDismiss() {
    showIOSInstallPrompt = false;
    dismissIOSPrompt();
  }
  
  function handleIOSShowInstructions() {
    showIOSInstructions = true;
  }
  
  function handleIOSCloseInstructions() {
    showIOSInstructions = false;
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <!-- Header Navigation -->
  <HeaderNav>
    {#each navItems() as item}
      <a 
        href={item.href} 
        role="menuitem" 
        class={getNavItemClasses(item.section)}
      >
        {item.label}
      </a>
    {/each}
  </HeaderNav>

  <!-- Android/Chrome PWA Install Prompt -->
  {#if showInstallPrompt && !isAppInstalled}
    <Card class="fixed top-20 left-0 right-0 z-50 mx-4 mt-4 border-blue-200 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-800">
      <CardContent class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-blue-900 dark:text-blue-100">Install Driver App</h3>
              <p class="text-sm text-blue-700 dark:text-blue-300">Get quick access to your delivery dashboard</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <Button
              onclick={installPWA}
              size="sm"
              class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Install
            </Button>
            <Button
              onclick={dismissInstallPrompt}
              variant="ghost"
              size="sm"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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

  <!-- iOS PWA Install Prompt -->
  <IOSInstallPrompt 
    show={showIOSInstallPrompt && !isAppInstalled}
    on:dismiss={handleIOSDismiss}
    on:showInstructions={handleIOSShowInstructions}
  />

  <!-- iOS Installation Instructions Modal -->
  <IOSInstallInstructions 
    show={showIOSInstructions}
    on:close={handleIOSCloseInstructions}
  />
  
  <!-- Main Content -->
  <main id="main-content" class="pt-4 {(showInstallPrompt || showIOSInstallPrompt) && !isAppInstalled ? 'pt-24' : ''}">
    {@render children()}
  </main>
</div>

<style>
  /* PWA specific styles */
  :global(.driver-app) {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }
  
  @media (display-mode: standalone) {
    :global(.driver-app) {
      /* Styles when running as PWA */
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
</style> 