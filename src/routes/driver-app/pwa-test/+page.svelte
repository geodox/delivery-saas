<script lang="ts">
  import { browser } from '$app/environment';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { 
    isIOS, 
    isSafari, 
    isIOSSafari,
    isInstalled,
    isStandalone,
    isFullscreen,
    supportsPWAInstallation,
    getInstallationMethod,
    hasDismissedIOSPrompt,
    clearIOSPromptDismissal,
    isUserActiveInPWA
  } from '$lib/utils/pwa';
  
  let deviceInfo = $state({
    isIOS: false,
    isSafari: false,
    isIOSSafari: false,
    isInstalled: false,
    isStandalone: false,
    isFullscreen: false,
    supportsPWA: false,
    installationMethod: 'unsupported' as 'native' | 'ios-manual' | 'unsupported',
    hasDismissedPrompt: false,
    isUserActiveInPWA: false
  });
  
  $effect(() => {
    if (browser) {
      deviceInfo = {
        isIOS: isIOS(),
        isSafari: isSafari(),
        isIOSSafari: isIOSSafari(),
        isInstalled: isInstalled(),
        isStandalone: isStandalone(),
        isFullscreen: isFullscreen(),
        supportsPWA: supportsPWAInstallation(),
        installationMethod: getInstallationMethod(),
        hasDismissedPrompt: hasDismissedIOSPrompt(),
        isUserActiveInPWA: isUserActiveInPWA()
      };
    }
  });
  
  function resetIOSPrompt() {
    clearIOSPromptDismissal();
    deviceInfo.hasDismissedPrompt = false;
  }
</script>

<svelte:head>
  <title>PWA Test - Driver App</title>
  <meta name="description" content="Test PWA installation functionality" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">PWA Installation Test</h1>
    
    <!-- Device Information -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Device Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">iOS Device:</span>
              <Badge variant={deviceInfo.isIOS ? 'default' : 'secondary'}>
                {deviceInfo.isIOS ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Safari Browser:</span>
              <Badge variant={deviceInfo.isSafari ? 'default' : 'secondary'}>
                {deviceInfo.isSafari ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">iOS Safari:</span>
              <Badge variant={deviceInfo.isIOSSafari ? 'default' : 'secondary'}>
                {deviceInfo.isIOSSafari ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">PWA Installed:</span>
              <Badge variant={deviceInfo.isInstalled ? 'default' : 'secondary'}>
                {deviceInfo.isInstalled ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Standalone Mode:</span>
              <Badge variant={deviceInfo.isStandalone ? 'default' : 'secondary'}>
                {deviceInfo.isStandalone ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Fullscreen Mode:</span>
              <Badge variant={deviceInfo.isFullscreen ? 'default' : 'secondary'}>
                {deviceInfo.isFullscreen ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- PWA Support -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>PWA Installation Support</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Supports PWA Installation:</span>
            <Badge variant={deviceInfo.supportsPWA ? 'default' : 'destructive'}>
              {deviceInfo.supportsPWA ? 'Yes' : 'No'}
            </Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Installation Method:</span>
            <Badge variant="outline" class="capitalize">
              {deviceInfo.installationMethod.replace('-', ' ')}
            </Badge>
          </div>
          {#if deviceInfo.isIOSSafari}
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">iOS Prompt Dismissed:</span>
              <Badge variant={deviceInfo.hasDismissedPrompt ? 'secondary' : 'default'}>
                {deviceInfo.hasDismissedPrompt ? 'Yes' : 'No'}
              </Badge>
            </div>
          {/if}
        </div>
      </CardContent>
    </Card>
    
    <!-- Notification Status -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Notification Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">User Active in PWA:</span>
            <Badge variant={deviceInfo.isUserActiveInPWA ? 'default' : 'secondary'}>
              {deviceInfo.isUserActiveInPWA ? 'Yes' : 'No'}
            </Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Notifications Status:</span>
            <Badge variant={deviceInfo.isUserActiveInPWA ? 'destructive' : 'default'}>
              {deviceInfo.isUserActiveInPWA ? 'Suppressed' : 'Active'}
            </Badge>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {deviceInfo.isUserActiveInPWA 
              ? 'Notifications are suppressed because you are actively using the PWA'
              : 'Notifications are active and will be shown for new orders and updates'
            }
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Installation Instructions -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Installation Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        {#if deviceInfo.isInstalled}
          <div class="text-center py-8">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">App Already Installed!</h3>
            <p class="text-green-700 dark:text-green-300">The Driver App is already installed on your device.</p>
          </div>
        {:else if deviceInfo.installationMethod === 'native'}
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">Look for the install prompt at the top of the page</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">Click "Install" to add the app to your home screen</p>
              </div>
            </div>
          </div>
        {:else if deviceInfo.installationMethod === 'ios-manual'}
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <span class="text-sm font-semibold text-purple-600 dark:text-purple-400">1</span>
              </div>
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">Tap the <strong>Share</strong> button at the bottom of Safari</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <span class="text-sm font-semibold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">Scroll down and tap <strong>"Add to Home Screen"</strong></p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <span class="text-sm font-semibold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">Tap <strong>"Add"</strong> to confirm</p>
              </div>
            </div>
          </div>
        {:else}
          <div class="text-center py-8">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">PWA Not Supported</h3>
            <p class="text-gray-700 dark:text-gray-300">Your current browser doesn't support PWA installation.</p>
          </div>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Test Controls -->
    {#if deviceInfo.isIOSSafari}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Use these controls to test the iOS installation prompt functionality.
            </p>
            <div class="flex space-x-4">
              <Button
                onclick={resetIOSPrompt}
                variant="outline"
                size="sm"
              >
                Reset iOS Prompt
              </Button>
              <Button
                onclick={() => window.location.reload()}
                variant="outline"
                size="sm"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    {/if}
  </div>
</div> 