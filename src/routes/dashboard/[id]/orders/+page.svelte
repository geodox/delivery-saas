<script lang="ts">
  // Types
  import type { Order } from "$lib/models/Order";
  // Components
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  // Lucide Icons
  import MapPin from "lucide-svelte/icons/map-pin";
  import Clock from "lucide-svelte/icons/clock";
  import User from "lucide-svelte/icons/user";
  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
  import Plus from "lucide-svelte/icons/plus";
  import Search from "lucide-svelte/icons/search";
  import Package from "lucide-svelte/icons/package";
  import Eye from "lucide-svelte/icons/eye";
  import Edit from "lucide-svelte/icons/edit";
  import Trash2 from "lucide-svelte/icons/trash-2";

  const { data } = $props<{ orders: Order[] }>();

  // Local state for orders that can be mutated
  let orders = $state([...data.orders]);
  
  let searchQuery = $state("");
  let selectedStatus = $state("all");
  let currentPage = $state(1);
  let showAssignModal = $state(false);
  let selectedOrder = $state<Order | null>(null);
  let selectedDriverId = $state("");
  let isLoading = $state(false);
  const itemsPerPage = 10;

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "assigned", label: "Assigned" },
    { value: "en_route_pickup", label: "En Route to Pickup" },
    { value: "picked_up", label: "Picked Up" },
    { value: "en_route_delivery", label: "En Route to Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  // TODO: Add filter by time
  const filteredOrders = $derived(() => {
    return orders.filter((order: Order) => {
      const matchesSearch = searchQuery === "" || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone?.includes(searchQuery);
      
      const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  });

  const totalPages = $derived(() => Math.ceil(filteredOrders.length / itemsPerPage));
  
  const paginatedOrders = $derived(() => {
    return filteredOrders().slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  });

  // Reset to first page when filters change
  $effect(() => {
    // Watch searchQuery and selectedStatus
    searchQuery;
    selectedStatus;
    currentPage = 1;
    orders;
  });

  function getStatusColor(status: string) {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'en_route_delivery':
        return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300';
      case 'picked_up':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300';
      case 'en_route_pickup':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'assigned':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'confirmed':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  }

  function formatTime(timeString: string | null) {
    if (!timeString) return "N/A";
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  function formatDate(timeString: string) {
    return new Date(timeString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function handleViewOrder(orderId: string) {
    // Add view order logic
    console.log("View order:", orderId);
  }

  function handleEditOrder(orderId: string) {
    // Add edit order logic
    console.log("Edit order:", orderId);
  }

  function handleDeleteOrder(orderId: string) {
    // Add delete order logic
    console.log("Delete order:", orderId);
  }

  async function confirmOrder(orderId: string) {
    isLoading = true;
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'confirm',
          orderId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to confirm order:', error);
        alert('Failed to confirm order. Please try again.');
      } else {
        orders = orders.map((order: Order) => {
          if (order.id === orderId) {
            return { ...order, status: 'confirmed' };
          }
          return order;
        });
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Error confirming order. Please try again.');
    } finally {
      isLoading = false;
    }
  }

  async function cancelOrder(orderId: string) {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    isLoading = true;
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel',
          orderId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to cancel order:', error);
        alert('Failed to cancel order. Please try again.');
      } else {
        orders = orders.map((order: Order) => {
          if (order.id === orderId) {
            return { ...order, status: 'cancelled' };
          }
          return order;
        });
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order. Please try again.');
    } finally {
      isLoading = false;
    }
  }

  function openAssignModal(order: Order) {
    selectedOrder = order;
    selectedDriverId = "";
    showAssignModal = true;
  }

  async function assignOrder() {
    if (!selectedOrder || !selectedDriverId) {
      alert('Please select a driver');
      return;
    }

    isLoading = true;
    try {
          if (!selectedOrder) return;
    
    const response = await fetch(`/api/orders?id=${selectedOrder.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'assign',
        orderId: selectedOrder.id,
        driverId: selectedDriverId
      })
    });

      if (response.ok) {
        // Update the local orders state
        if (selectedOrder) {
          orders = orders.map((order: Order) => {
            if (order.id === selectedOrder.id) {
              return { ...order, status: 'assigned', assignedDriverId: selectedDriverId };
            }
            return order;
          });
        }
      } else {
        const error = await response.json();
        console.error('Failed to assign order:', error);
        alert('Failed to assign order. Please try again.');
      }
    } catch (error) {
      console.error('Error assigning order:', error);
      alert('Error assigning order. Please try again.');
    } finally {
      isLoading = false;
      showAssignModal = false;
    }
  }

  function closeAssignModal() {
    showAssignModal = false;
    selectedOrder = null;
    selectedDriverId = "";
  }

  function goToPreviousPage() {
    currentPage = Math.max(1, currentPage - 1);
  }

  function goToNextPage() {
    currentPage = Math.min(totalPages(), currentPage + 1);
  }
</script>

<svelte:head>
  <title>Orders - DeliveryManager</title>
</svelte:head>

<div class="container mx-auto px-4">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
        Orders
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
        Manage and track all your delivery orders
      </p>
    </div>
    <Button 
      href={`/dashboard/${data.selectedBusiness?.id}/orders/create`}
      class="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
    >
      <Plus class="w-4 h-4 mr-2" />
      Create Order
    </Button>
  </div>

  <!-- Filters and Search -->
  <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300 mb-6">
    <CardContent class="p-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <Label for="search" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Search Orders
          </Label>
          <div class="relative mt-1">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
            <Input
              id="search"
              type="text"
              bind:value={searchQuery}
              placeholder="Search by order ID, customer name, or phone..."
              class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
            />
          </div>
        </div>
        <div class="sm:w-48">
          <Label for="status" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Filter by Status
          </Label>
          <select
            id="status"
            bind:value={selectedStatus}
            class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white transition-colors duration-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent"
          >
            {#each statusOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Pending Orders Section -->
  {#if orders.filter((order: Order) => order.status === 'pending').length > 0}
    <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300 mb-6">
      <CardHeader>
        <CardTitle class="text-xl dark:text-white transition-colors duration-300">
          Pending Orders ({orders.filter((order: Order) => order.status === 'pending').length})
        </CardTitle>
        <CardDescription class="dark:text-gray-300 transition-colors duration-300">
          Orders waiting for confirmation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each orders.filter((order: Order) => order.status === 'pending') as order}
            <div class="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <Package class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Order #{order.number}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{order.customerName} - {order.customerPhone}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">${order.totalAmount?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <Button
                  onclick={() => confirmOrder(order.id)}
                  disabled={isLoading}
                  class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white transition-colors duration-300"
                  size="sm"
                >
                  {#if isLoading}
                    <svg class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Confirming...
                  {:else}
                    Confirm Order
                  {/if}
                </Button>
                <Button
                  onclick={() => cancelOrder(order.id)}
                  disabled={isLoading}
                  variant="destructive"
                  class="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300"
                  size="sm"
                >
                  {#if isLoading}
                    <svg class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cancelling...
                  {:else}
                    Cancel Order
                  {/if}
                </Button>
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
  {/if}

  <!-- Confirmed Orders Section -->
  {#if orders.filter((order: Order) => order.status === 'confirmed').length > 0}
    <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300 mb-6">
      <CardHeader>
        <CardTitle class="text-xl dark:text-white transition-colors duration-300">
          Confirmed Orders ({orders.filter((order: Order) => order.status === 'confirmed').length})
        </CardTitle>
        <CardDescription class="dark:text-gray-300 transition-colors duration-300">
          Orders ready to be assigned to drivers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each orders.filter((order: Order) => order.status === 'confirmed') as order}
            <div class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Package class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Order #{order.number}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{order.customerName} - {order.customerPhone}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">${order.totalAmount?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <Button
                  onclick={() => openAssignModal(order)}
                  disabled={isLoading}
                  class="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white transition-colors duration-300"
                  size="sm"
                >
                  Assign Driver
                </Button>
                <Button
                  onclick={() => cancelOrder(order.id)}
                  disabled={isLoading}
                  variant="destructive"
                  class="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300"
                  size="sm"
                >
                  {#if isLoading}
                    <svg class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cancelling...
                  {:else}
                    Cancel Order
                  {/if}
                </Button>
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
  {/if}

  <!-- Orders Table -->
  <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
    <CardHeader>
      <CardTitle class="text-xl dark:text-white transition-colors duration-300">
        All Orders ({filteredOrders().length})
      </CardTitle>
      <CardDescription class="dark:text-gray-300 transition-colors duration-300">
        Complete list of delivery orders
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-slate-700">
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Order</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Customer</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Items</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Status</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Driver</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Amount</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Time</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each paginatedOrders() as order}
              <tr class="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors duration-200">
                <td class="py-4 px-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                      <Package class="w-4 h-4 text-blue-600 dark:text-purple-400 transition-colors duration-300" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white transition-colors duration-300">#{order.number}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{formatDate(order.createdAt?.toString() || '')}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white transition-colors duration-300">{order.customerName}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{order.customerPhone}</p>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <p class="text-sm text-gray-900 dark:text-white max-w-xs truncate transition-colors duration-300" title={order.orderDetails}>
                    {order.orderDetails}
                  </p>
                  <div class="flex items-center space-x-1 mt-1">
                    <MapPin class="w-3 h-3 text-gray-400" />
                    <p class="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {order.estimatedDeliveryTime ? formatTime(order.estimatedDeliveryTime.toString()) : 'Not set'}
                    </p>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <Badge class={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td class="py-4 px-4">
                  {#if order.assignedDriverId}
                    <div class="flex items-center space-x-2">
                      <User class="w-4 h-4 text-gray-400" />
                      <span class="text-sm text-gray-900 dark:text-white transition-colors duration-300">{order.assignedDriverId}</span>
                    </div>
                  {:else}
                    <span class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Unassigned</span>
                  {/if}
                </td>
                <td class="py-4 px-4">
                  <p class="font-medium text-gray-900 dark:text-white transition-colors duration-300">${order.totalAmount?.toFixed(2) || '0.00'}</p>
                </td>
                <td class="py-4 px-4">
                  <div class="flex items-center space-x-1">
                    <Clock class="w-3 h-3 text-gray-400" />
                    <span class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {order.deliveredAt ? formatTime(order.deliveredAt.toString()) : "Pending"}
                    </span>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <div class="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onclick={() => handleViewOrder(order.id)}
                      class="hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors duration-300"
                    >
                      <Eye class="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onclick={() => handleEditOrder(order.id)}
                      class="hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors duration-300"
                    >
                      <Edit class="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onclick={() => handleDeleteOrder(order.id)}
                      class="hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors duration-300"
                    >
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      {#if totalPages() > 1}
        <div class="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </p>
          <div class="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onclick={goToPreviousPage}
              class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
            >
              <ChevronLeft class="w-4 h-4" />
            </Button>
            <span class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages()}
              onclick={goToNextPage}
              class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
            >
              <ChevronRight class="w-4 h-4" />
            </Button>
          </div>
        </div>
      {/if}
    </CardContent>
  </Card>

  <!-- Assign Driver Modal -->
  {#if showAssignModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card class="w-full max-w-md border-0 shadow-2xl dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle class="text-xl text-center dark:text-white transition-colors duration-300">
            Assign Driver
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          {#if selectedOrder}
            <div class="text-center">
              <p class="text-muted-foreground transition-colors duration-300 mb-4">
                Select a driver to assign to this order.
              </p>
              <p class="text-sm font-medium text-foreground transition-colors duration-300">
                Order #{selectedOrder.number} - {selectedOrder.customerName}
              </p>
            </div>

            <div class="space-y-4">
              <div>
                <Label for="driver" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Select Driver
                </Label>
                <select
                  id="driver"
                  bind:value={selectedDriverId}
                  class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white transition-colors duration-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose a driver...</option>
                  {#if data.employees}
                    {#each data.employees.filter((emp: any) => emp.roles.includes('driver') && emp.status === 'active') as employee}
                      <option value={employee.userId}>{employee.userId}</option>
                    {/each}
                  {/if}
                </select>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3">
              <Button
                onclick={closeAssignModal}
                variant="outline"
                class="flex-1"
              >
                Cancel
              </Button>
              <Button
                onclick={assignOrder}
                disabled={!selectedDriverId || isLoading}
                class="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white transition-colors duration-300"
              >
                {#if isLoading}
                  <svg class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Assigning...
                {:else}
                  Assign Driver
                {/if}
              </Button>
            </div>
          {/if}
        </CardContent>
      </Card>
    </div>
  {/if}
</div>