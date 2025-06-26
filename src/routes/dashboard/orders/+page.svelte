<script lang="ts">
  import { HeaderNav, Footer } from "$lib/components";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { 
    Package, 
    Search, 
    Plus, 
    Eye, 
    Edit, 
    Trash2,
    MapPin,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
  } from "lucide-svelte";
  import { orders } from "$lib/placeholder_data";

  let searchQuery = $state("");
  let selectedStatus = $state("all");
  let currentPage = $state(1);
  const itemsPerPage = 10;

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "assigned", label: "Assigned" },
    { value: "preparing", label: "Preparing" },
    { value: "in-transit", label: "In Transit" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  // TODO: Add filter by time
  const filteredOrders = $derived(() => {
    return orders.filter(order => {
      const matchesSearch = searchQuery === "" || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery);
      
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
  });

  function getStatusColor(status: string) {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in-transit':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'assigned':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'preparing':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
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

  function handleCreateOrder() {
    // Add create order logic
    console.log("Create new order");
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

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav>
    <a href="/dashboard" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</a>
    <a href="/dashboard/orders" class="text-blue-600 dark:text-purple-400 font-medium transition-colors">Orders</a>
    <a href="/dashboard/drivers" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Drivers</a>
    <a href="/dashboard/tracking" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Live Tracking</a>
    <a href="/dashboard/analytics" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Analytics</a>
  </HeaderNav>

  <main class="py-8">
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
          onclick={handleCreateOrder}
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
                class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white transition-colors duration-300"
              >
                {#each statusOptions as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Orders Table -->
      <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
        <CardHeader>
          <CardTitle class="text-xl dark:text-white transition-colors duration-300">
            All Orders ({filteredOrders.length})
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
                          <p class="font-medium text-gray-900 dark:text-white transition-colors duration-300">{order.id}</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{formatDate(order.orderTime)}</p>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-4">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white transition-colors duration-300">{order.customer.name}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{order.customer.phone}</p>
                      </div>
                    </td>
                    <td class="py-4 px-4">
                      <p class="text-sm text-gray-900 dark:text-white max-w-xs truncate transition-colors duration-300" title={order.items}>
                        {order.items}
                      </p>
                      <div class="flex items-center space-x-1 mt-1">
                        <MapPin class="w-3 h-3 text-gray-400" />
                        <p class="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          {order.estimatedTime}
                        </p>
                      </div>
                    </td>
                    <td class="py-4 px-4">
                      <Badge class={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td class="py-4 px-4">
                      {#if order.driver}
                        <div class="flex items-center space-x-2">
                          <User class="w-4 h-4 text-gray-400" />
                          <span class="text-sm text-gray-900 dark:text-white transition-colors duration-300">{order.driver}</span>
                        </div>
                      {:else}
                        <span class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Unassigned</span>
                      {/if}
                    </td>
                    <td class="py-4 px-4">
                      <p class="font-medium text-gray-900 dark:text-white transition-colors duration-300">{order.amount}</p>
                    </td>
                    <td class="py-4 px-4">
                      <div class="flex items-center space-x-1">
                        <Clock class="w-3 h-3 text-gray-400" />
                        <span class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          {formatTime(order.deliveryTime) || "Pending"}
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
    </div>
  </main>

  <Footer />
</div>