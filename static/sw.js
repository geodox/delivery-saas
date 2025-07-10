const CACHE_NAME = 'driver-app-v1';
const urlsToCache = [
  '/driver-app',
  '/driver-app/orders',
  '/driver-app/earnings',
  '/favicon.png',
  '/app.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Only handle requests within the driver-app scope
  if (event.request.url.includes('/driver-app')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version or fetch from network
          return response || fetch(event.request);
        })
        .catch(() => {
          // Fallback for navigation requests when offline
          if (event.request.mode === 'navigate') {
            return caches.match('/driver-app');
          }
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for orders when coming back online
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-orders') {
    event.waitUntil(syncOrders());
  }
});

async function syncOrders() {
  try {
    // Get pending updates from IndexedDB or localStorage
    const pendingUpdates = await getPendingUpdates();
    
    // This would sync any pending order updates when coming back online
    const response = await fetch('/api/orders', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sync',
        pendingUpdates
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Orders synced successfully:', result);
      
      // Clear pending updates after successful sync
      await clearPendingUpdates();
    } else {
      console.error('Failed to sync orders:', response.status);
    }
  } catch (error) {
    console.error('Failed to sync orders:', error);
  }
}

// Helper functions for managing pending updates
async function getPendingUpdates() {
  // In a real implementation, this would read from IndexedDB
  // For now, return empty array
  return [];
}

async function clearPendingUpdates() {
  // In a real implementation, this would clear from IndexedDB
  console.log('Clearing pending updates');
} 