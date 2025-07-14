<script lang="ts">
  // Types
  import type { Order } from '$lib/models/Order';
  import type { PageData } from './$types';
  // Svelte
  import { browser } from '$app/environment';
  // Components
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  // Utils
  import { isUserActiveInPWA } from '$lib/utils/pwa';
  
  interface Props {
    data: PageData;
    isOnline: boolean;
  }
  
  let { data, isOnline }: Props = $props();
  
  let orders = $state<Order[]>(data.orders || []);
  let activeOrder = $state<Order | null>(null);
  let notificationPermission = $state<'granted' | 'denied' | 'default'>('default');
  let intervalId = $state<number | null>(null);
  let isLoading = $state<boolean>(false);
  let lastSyncTime = $state<Date | null>(null);
  let showDeliveryVerification = $state<boolean>(false);
  let deliveryPhoto = $state<string | null>(null);
  let isTakingPhoto = $state<boolean>(false);
  let cameraInputRef = $state<HTMLInputElement | null>(null);
  
  $effect(() => {
    if (browser) {
      // Request notification permission
      if ('Notification' in window) {
        notificationPermission = Notification.permission;
        if (notificationPermission === 'default') {
          Notification.requestPermission().then((permission) => {
            notificationPermission = permission;
          });
        }
      }
      
      // Set up real-time order updates
      intervalId = window.setInterval(() => {
        if (isOnline) {
          fetchOrders();
        }
      }, 10000); // Check every 10 seconds
      
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  });
  
  // Auto-set active order when orders are updated
  $effect(() => {
    if (orders.length > 0 && !activeOrder) {
      // Find the first order that's assigned to this driver
      const assignedOrder = orders.find(order => 
        order.assignedDriverId && 
        ['assigned', 'en_route_pickup', 'picked_up', 'en_route_delivery'].includes(order.status)
      );
      if (assignedOrder) {
        activeOrder = assignedOrder;
      }
    }
  });
  
  async function fetchOrders() {
    if (!isOnline || isLoading) return;
    
    isLoading = true;
    try {
      // Get businesses first (driver might work for multiple businesses)
      const businessesResponse = await fetch('/api/businesses');
      if (!businessesResponse.ok) {
        throw new Error('Failed to fetch businesses');
      }
      const businesses = await businessesResponse.json();
      
      // Fetch orders for all businesses the driver has access to
      const ordersPromises = businesses.map(async (business: any) => {
        const ordersResponse = await fetch(`/api/orders?businessId=${business.id}`);
        if (ordersResponse.ok) {
          return ordersResponse.json();
        }
        return [];
      });
      
      const allOrders = await Promise.all(ordersPromises);
      const newOrders = allOrders.flat();
      
      // Check for new orders and show notifications
      const currentOrderIds = new Set(orders.map(order => order.id));
      const newOrderIds = new Set(newOrders.map(order => order.id));
      
      // Find newly added orders
      const newlyAddedOrders = newOrders.filter(order => !currentOrderIds.has(order.id));
      
      // Find updated orders
      const updatedOrders = newOrders.filter(order => {
        const existingOrder = orders.find(o => o.id === order.id);
        return existingOrder && existingOrder.status !== order.status;
      });
      
      // Update orders state
      orders = newOrders;
      
      // Show notifications for new orders
      newlyAddedOrders.forEach(order => {
        switch (order.status) {
          case 'confirmed':
            showNotification('New Order Available', `Order #${order.number} is ready for pickup`);
            break;
          case 'assigned':
            showNotification('Order Assigned', `Order #${order.number} has been assigned to you`);
            break;
        }
      });
      
      // Show notifications for status changes
      updatedOrders.forEach(order => {
        // If the active order is cancelled, update the active order to null
        if (order.id === activeOrder?.id && order.status === 'cancelled') {
          activeOrder = null;
        }

        const statusMessages: Record<string, string> = {
          'confirmed': 'Order confirmed',
          'assigned': 'Order assigned to driver',
          'en_route_pickup': 'Driver en route to pickup',
          'picked_up': 'Order picked up',
          'en_route_delivery': 'Driver en route to delivery',
          'delivered': 'Order delivered',
          'cancelled': 'Order cancelled'
        };
        showNotification('Order Status Updated', `Order #${order.number}: ${statusMessages[order.status] || 'Status updated'}`);
      });
      
      lastSyncTime = new Date();
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function showNotification(title: string, body: string) {
    // Don't show notifications if the user is actively using the PWA
    if (isUserActiveInPWA()) {
      console.log('Notification suppressed - user is actively using PWA:', title);
      return;
    }
    
    if (notificationPermission === 'granted') {
      console.log('Showing notification:', title);
      new Notification(title, {
        body,
        icon: '/favicon.png',
        tag: 'driver-order'
      });
    }
  }
  
  function acceptOrder(orderId: string) {
    // Make API call to accept order
    fetch(`/api/orders?id=${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'accept',
        orderId
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update local state with the updated order
        orders = orders.map(order => {
          if (order.id === orderId) {
            return { ...order, ...data.order };
          }
          return order;
        });
        activeOrder = data.order;
        showNotification('Order Accepted', `Order #${activeOrder?.number} accepted`);
      } else {
        console.error('Failed to accept order:', data.error);
      }
    })
    .catch(error => {
      console.error('Error accepting order:', error);
    });
  }
  
  function updateOrderStatus(orderId: string, newStatus: Order['status']) {
    // Check if this is a delivery completion that needs verification
    if (newStatus === 'delivered') {
      showDeliveryVerification = true;
      return;
    }

    // Make API call to update order status
    fetch(`/api/orders?id=${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update_status',
        orderId,
        status: newStatus
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update local state with the updated order
        orders = orders.map(order => {
          if (order.id === orderId) {
            return { ...order, ...data.order };
          }
          return order;
        });
        
        // Update active order if it's the one being updated
        if (activeOrder && activeOrder.id === orderId) {
          activeOrder = data.order;
        }
        
        const statusMessages: Record<string, string> = {
          'assigned': 'Order assigned',
          'en_route_pickup': 'En route to pickup',
          'picked_up': 'Order picked up',
          'en_route_delivery': 'En route to delivery',
          'delivered': 'Order delivered'
        };
        showNotification('Status Updated', statusMessages[newStatus] || 'Status updated');
      } else {
        console.error('Failed to update order status:', data.error);
      }
    })
    .catch(error => {
      console.error('Error updating order status:', error);
    });
  }
  
  function callCustomer(phone: string) {
    window.location.href = `tel:${phone}`;
  }
  
  function textCustomer(phone: string) {
    window.location.href = `sms:${phone}`;
  }
  
  function openNavigation(address: string) {
    const encodedAddress = encodeURIComponent(address);
    // Try to open in native apps first, fallback to web
    const googleMapsUrl = `https://maps.google.com/maps?daddr=${encodedAddress}`;
    const appleMapUrl = `https://maps.apple.com/?daddr=${encodedAddress}`;
    
    // For iOS devices
    if (navigator.userAgent.match(/iPhone|iPad|iPod/)) {
      window.open(appleMapUrl, '_blank');
    } else {
      window.open(googleMapsUrl, '_blank');
    }
  }

  function takeDeliveryPhoto() {
    // Trigger the hidden file input with camera capture
    if (cameraInputRef) {
      cameraInputRef.click();
    }
  }

  function handleCameraCapture(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      isTakingPhoto = true;
      
      // Compress the image to lossless WebP at 1200x1200
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas size to 1200x1200 max while maintaining aspect ratio
        const maxSize = 1200;
        let { width, height } = img;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw the resized image
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to lossless WebP
        const compressedDataUrl = canvas.toDataURL('image/webp', 1.0);
        deliveryPhoto = compressedDataUrl;
        isTakingPhoto = false;
      };
      
      img.onerror = () => {
        console.error('Error loading image for compression');
        alert('Failed to process photo. Please try again.');
        isTakingPhoto = false;
      };
      
      // Load the image from the file
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        console.error('Error reading photo file');
        alert('Failed to read photo. Please try again.');
        isTakingPhoto = false;
      };
      reader.readAsDataURL(file);
    }
    
    // Reset the input so the same file can be selected again
    target.value = '';
  }

  function confirmDelivery() {
    if (!activeOrder) return;

    // Make API call to confirm delivery
    fetch(`/api/orders?id=${activeOrder.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delivered',
        orderId: activeOrder.id,
        deliveryPhoto: deliveryPhoto // Include photo if taken
      })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('Photo file is too large. Please try taking a new photo or skip the photo.');
        }
        return response.json().then(data => {
          throw new Error(data.error || `Server error: ${response.status}`);
        });
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Update local state with the updated order
        orders = orders.map(order => {
          if (activeOrder && order.id === activeOrder.id) {
            return { ...order, ...data.order };
          }
          return order;
        });
        
        activeOrder = null;
        showDeliveryVerification = false;
        deliveryPhoto = null;
        
        showNotification('Delivery Confirmed', `Order #${data.order.number} has been delivered successfully!`);
      } else {
        console.error('Failed to confirm delivery:', data.error);
        showNotification('Delivery Failed', data.error || 'Failed to confirm delivery');
      }
    })
    .catch(error => {
      console.error('Error confirming delivery:', error);
      showNotification('Delivery Failed', error.message || 'Error confirming delivery');
    });
  }

  function skipPhotoAndConfirm() {
    confirmDelivery();
  }

  function cancelDeliveryVerification() {
    showDeliveryVerification = false;
    deliveryPhoto = null;
  }
  
  function getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
      case 'en_route_pickup': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      case 'picked_up': return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800';
      case 'en_route_delivery': return 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
    }
  }
  
  function getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'assigned': return 'Assigned';
      case 'en_route_pickup': return 'En Route to Pickup';
      case 'picked_up': return 'Picked Up';
      case 'en_route_delivery': return 'En Route to Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }
  
  function getNextStatus(currentStatus: Order['status']): Order['status'] | null {
    switch (currentStatus) {
      case 'assigned': return 'en_route_pickup';
      case 'en_route_pickup': return 'picked_up';
      case 'picked_up': return 'en_route_delivery';
      case 'en_route_delivery': return 'delivered';
      default: return null;
    }
  }
</script>

<svelte:head>
  <title>Driver App - Orders</title>
  <meta name="description" content="Manage your delivery orders" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-md">
  <!-- Header -->
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-2xl font-bold text-foreground transition-colors duration-300">Orders</h1>
      <p class="text-muted-foreground transition-colors duration-300">Manage your deliveries</p>
      <div class="flex items-center space-x-2">
        {#if lastSyncTime}
          <p class="text-xs text-muted-foreground transition-colors duration-300">
            Last sync: {lastSyncTime.toLocaleTimeString()}
          </p>
        {/if}
        {#if isLoading}
          <div class="flex items-center space-x-1">
            <svg class="w-3 h-3 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-xs text-blue-500">Syncing...</span>
          </div>
        {/if}
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-2 h-2 rounded-full {isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse"></div>
      <Button 
        variant="secondary" 
        size="sm" 
        class="text-xs bg-blue-500 hover:bg-blue-600 dark:bg-purple-500 dark:hover:bg-purple-600"
        onclick={() => isOnline = !isOnline}
      >
        {isOnline ? 'Online' : 'Offline'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onclick={() => fetchOrders()}
        disabled={isLoading || !isOnline}
        class="text-xs"
      >
        {#if isLoading}
          <svg class="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        {/if}
        Refresh
      </Button>
    </div>
  </div>

  <!-- Active Order -->
  {#if activeOrder}
    <Card class="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 mb-6">
      <CardHeader class="pb-4">
                  <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <CardTitle class="text-foreground transition-colors duration-300">Active Order</CardTitle>
            </div>
            <span class="text-sm text-muted-foreground transition-colors duration-300">#{activeOrder?.number}</span>
          </div>
      </CardHeader>
      
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-muted-foreground transition-colors duration-300">Status</span>
          <Badge class="border {getStatusColor(activeOrder.status)}">
            {getStatusText(activeOrder.status)}
          </Badge>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
            <div class="flex-1">
              <div class="text-sm font-medium text-foreground transition-colors duration-300">Delivery</div>
              <div class="text-sm text-muted-foreground transition-colors duration-300">
                {activeOrder.deliveryAddress.street}, {activeOrder.deliveryAddress.city}, {activeOrder.deliveryAddress.stateProvince} {activeOrder.deliveryAddress.zipPostalCode}
              </div>
              <div class="text-xs text-muted-foreground transition-colors duration-300">
                {activeOrder.estimatedDeliveryTime ? `Est. ${activeOrder.estimatedDeliveryTime}` : 'No estimated time'}
              </div>
            </div>
            <Button
              onclick={() => activeOrder && openNavigation(`${activeOrder.deliveryAddress.street}, ${activeOrder.deliveryAddress.city}, ${activeOrder.deliveryAddress.stateProvince} ${activeOrder.deliveryAddress.zipPostalCode}`)}
              variant="outline"
              size="sm"
              class="text-primary hover:text-primary/90"
            >
              Navigate
            </Button>
          </div>
        </div>
        
        <div class="border-t pt-4">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-muted-foreground transition-colors duration-300">Customer</span>
            <span class="text-sm text-foreground transition-colors duration-300">{activeOrder.customerName}</span>
          </div>
          <div class="flex space-x-2">
            <Button
              onclick={() => activeOrder?.customerPhone && callCustomer(activeOrder.customerPhone)}
              class="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-300"
              disabled={!activeOrder?.customerPhone}
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Call
            </Button>
            <Button
              onclick={() => activeOrder?.customerPhone && textCustomer(activeOrder.customerPhone)}
              class="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-300"
              disabled={!activeOrder?.customerPhone}
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Text
            </Button>
          </div>
        </div>
        
        {#if getNextStatus(activeOrder.status)}
          <div class="border-t pt-4">
            <Button
              onclick={() => {
                if (activeOrder) {
                  const nextStatus = getNextStatus(activeOrder.status);
                  if (nextStatus) {
                    updateOrderStatus(activeOrder.id, nextStatus);
                  }
                }
              }}
              class="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300"
              disabled={!activeOrder || !getNextStatus(activeOrder.status)}
            >
              {#if activeOrder?.status === 'assigned'}
                Start Pickup
              {:else if activeOrder?.status === 'en_route_pickup'}
                Mark as Picked Up
              {:else if activeOrder?.status === 'picked_up'}
                Start Delivery Route
              {:else if activeOrder?.status === 'en_route_delivery'}
                Mark as Delivered
              {/if}
            </Button>
          </div>
        {/if}
      </CardContent>
    </Card>
  {/if}

  <!-- Available Orders -->
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-foreground transition-colors duration-300">Available Orders</h2>
    
    {#each orders.filter(order => order.status === 'confirmed') as order}
      <Card class="border-0 shadow-lg hover:shadow-xl dark:bg-slate-800/50 dark:shadow-purple-900/20 dark:hover:shadow-purple-900/30 transition-all duration-300 backdrop-blur-sm">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-4">
            <span class="text-2xl text-muted-foreground transition-colors duration-300">#{order.number}</span>
            <span class="text-2xl font-bold text-green-600 dark:text-cyan-400 transition-colors duration-300">${Number(order.totalAmount).toFixed(2)}</span>
          </div>
          
          <div class="space-y-3 mb-4">
            <div class="flex items-start space-x-2">
              <div class="flex-1">
                <div class="text-sm font-medium text-foreground transition-colors duration-300">Delivery</div>
                <div class="text-sm text-muted-foreground transition-colors duration-300">
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.stateProvince} {order.deliveryAddress.zipPostalCode}
                </div>
                <div class="text-xs text-muted-foreground transition-colors duration-300">
                  {order.estimatedDeliveryTime ? order.estimatedDeliveryTime : 'No estimated time'}
                </div>
              </div>
            </div>
          </div>
          
          <div class="border-t pt-4 mb-4">
            <div class="text-sm font-medium text-muted-foreground transition-colors duration-300 mb-2">Order Details</div>
            <div class="text-sm text-foreground transition-colors duration-300">
              {order.orderDetails}
            </div>
            {#if order.specialInstructions}
              <div class="text-sm text-muted-foreground transition-colors duration-300 mt-2">
                <strong>Special Instructions:</strong> {order.specialInstructions}
              </div>
            {/if}
          </div>
          
          <Button
            onclick={() => acceptOrder(order.id)}
            class="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300"
            disabled={activeOrder !== null}
          >
            Accept Order
          </Button>
        </CardContent>
      </Card>
    {/each}
    
    {#if orders.filter(order => order.status === 'confirmed').length === 0}
      <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 transition-all duration-300 backdrop-blur-sm">
        <CardContent class="p-12 text-center">
          <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <p class="text-muted-foreground transition-colors duration-300">No orders available</p>
          <p class="text-sm text-muted-foreground transition-colors duration-300">New orders will appear here automatically</p>
        </CardContent>
      </Card>
    {/if}
  </div>

  <!-- Hidden Camera Input -->
  <input
    bind:this={cameraInputRef}
    type="file"
    accept="image/*"
    capture="environment"
    onchange={handleCameraCapture}
    class="hidden"
  />

  <!-- Delivery Verification Modal -->
  {#if showDeliveryVerification}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card class="w-full max-w-md border-0 shadow-2xl dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle class="text-xl text-center dark:text-white transition-colors duration-300">
            Verify Delivery
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="text-center">
            <p class="text-muted-foreground transition-colors duration-300 mb-4">
              Please verify that the order has been delivered to the customer.
            </p>
            {#if activeOrder && activeOrder.number}
              <p class="text-sm font-medium text-foreground transition-colors duration-300">
                Order #{activeOrder.number} - {activeOrder.customerName || 'Unknown Customer'}
              </p>
            {/if}
          </div>

          <!-- Photo Section -->
          <div class="space-y-4">
            <div class="text-center">
              <p class="text-sm font-medium text-muted-foreground transition-colors duration-300 mb-2">
                Take a photo (optional)
              </p>
              <p class="text-xs text-muted-foreground transition-colors duration-300">
                Capture proof of delivery
              </p>
            </div>

            {#if deliveryPhoto}
              <div class="relative">
                <img 
                  src={deliveryPhoto} 
                  alt="Delivery proof" 
                  class="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-slate-600"
                />
                <Button
                  onclick={() => deliveryPhoto = null}
                  variant="outline"
                  size="sm"
                  class="absolute top-2 right-2 bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </Button>
              </div>
            {:else}
              <div class="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <Button
                  onclick={takeDeliveryPhoto}
                  disabled={isTakingPhoto}
                  variant="outline"
                  class="w-full"
                >
                  {#if isTakingPhoto}
                    <svg class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Taking Photo...
                  {:else}
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Take Photo
                  {/if}
                </Button>
              </div>
            {/if}
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-3">
            <Button
              onclick={cancelDeliveryVerification}
              variant="outline"
              class="flex-1"
            >
              Cancel
            </Button>
            <Button
              onclick={skipPhotoAndConfirm}
              class="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300"
            >
              Confirm Delivery
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  {/if}
</div> 