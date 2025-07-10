/**
 * PWA utility functions for iOS and Android support
 */

export interface InstallPromptEvent extends Event {
  preventDefault(): void;
}

export interface BeforeInstallPromptEvent extends InstallPromptEvent {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Detect if the current device is iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Detect if the current browser is Safari
 */
export function isSafari(): boolean {
  if (typeof window === 'undefined') return false;
  return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
}

/**
 * Detect if the current browser is iOS Safari
 */
export function isIOSSafari(): boolean {
  return isIOS() && isSafari();
}

/**
 * Check if the app is running in standalone mode (installed as PWA)
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches;
}

/**
 * Check if the app is running in fullscreen mode (iOS PWA)
 */
export function isFullscreen(): boolean {
  if (typeof window === 'undefined') return false;
  return window.navigator.standalone === true;
}

/**
 * Check if the app is installed (either standalone or fullscreen)
 */
export function isInstalled(): boolean {
  return isStandalone() || isFullscreen();
}

/**
 * Get the appropriate status bar style for iOS
 */
export function getIOSStatusBarStyle(): 'default' | 'black' | 'black-translucent' {
  // You can customize this based on your app's theme
  return 'default';
}

/**
 * Check if the user has previously dismissed the iOS install prompt
 */
export function hasDismissedIOSPrompt(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('dismissed-ios-prompt') === 'true';
}

/**
 * Mark the iOS install prompt as dismissed
 */
export function dismissIOSPrompt(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('dismissed-ios-prompt', 'true');
}

/**
 * Clear the dismissed iOS prompt state (for testing)
 */
export function clearIOSPromptDismissal(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('dismissed-ios-prompt');
}

/**
 * Check if the current environment supports PWA installation
 */
export function supportsPWAInstallation(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for beforeinstallprompt event support (Android/Chrome)
  const hasBeforeInstallPrompt = 'onbeforeinstallprompt' in window;
  
  // Check for iOS Safari
  const isIOSSupported = isIOSSafari();
  
  return hasBeforeInstallPrompt || isIOSSupported;
}

/**
 * Get the appropriate installation method for the current platform
 */
export function getInstallationMethod(): 'native' | 'ios-manual' | 'unsupported' {
  if (typeof window === 'undefined') return 'unsupported';
  
  if ('onbeforeinstallprompt' in window) {
    return 'native';
  }
  
  if (isIOSSafari()) {
    return 'ios-manual';
  }
  
  return 'unsupported';
}

/**
 * Register service worker for PWA functionality
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Request notification permission for PWA
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  
  if (Notification.permission === 'default') {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
}

/**
 * Get the current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  
  return Notification.permission;
} 