<script lang="ts">
  import { HeaderNav, Footer } from "$lib/components";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { 
    User, 
    Search, 
    Eye, 
    Edit, 
    Trash2,
    MapPin,
    Phone,
    Mail,
    Car,
    Star,
    Activity,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    X
  } from "lucide-svelte";

  import { drivers, statusOptions, vehicleTypes } from "$lib/placeholder_data";

  let searchQuery = $state("");
  let selectedStatus = $state("all");
  let currentPage = $state(1);
  let showAddDriverModal = $state(false);
  const itemsPerPage = 12;

  let drivers_data = $state(drivers);

  // New driver form state
  let newDriver = $state({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    vehicleType: "",
    vehiclePlate: ""
  });

  const filteredDrivers = $derived(() => {
    return drivers_data.filter(driver => {
      const matchesSearch = searchQuery === "" || 
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phone.includes(searchQuery) ||
        driver.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === "all" || driver.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  });

  const totalPages = $derived(() => Math.ceil(filteredDrivers.length / itemsPerPage));
  
  const paginatedDrivers = $derived(() => {
    return filteredDrivers().slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  });

  // Reset to first page when filters change
  $effect(() => {
    searchQuery;
    selectedStatus;
    currentPage = 1;
  });

  function getStatusColor(status: string) {
    switch (status) {
      case 'online':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'available':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'delivering':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'break':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'offline':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  }

  function getStatusDot(status: string) {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'available':
        return 'bg-blue-500';
      case 'delivering':
        return 'bg-purple-500';
      case 'break':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  function formatLastActive(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  }

  function handleAddDriver() {
    showAddDriverModal = true;
  }

  function handleSaveDriver() {
    if (!newDriver.name || !newDriver.email || !newDriver.phone) {
      alert("Please fill in all required fields");
      return;
    }

    const driver = {
      id: `DRV-${String(drivers.length + 1).padStart(3, '0')}`,
      name: newDriver.name,
      email: newDriver.email,
      phone: newDriver.phone,
      status: "offline",
      location: "Unknown",
      currentOrders: 0,
      totalDeliveries: 0,
      rating: 5.0,
      joinDate: new Date().toISOString().split('T')[0],
      vehicle: {
        type: newDriver.vehicleType,
        plate: newDriver.vehiclePlate
      },
      licenseNumber: newDriver.licenseNumber,
      lastActive: new Date().toISOString()
    };

    drivers_data.push(driver);
    
    // Reset form
    newDriver = {
      name: "",
      email: "",
      phone: "",
      licenseNumber: "",
      vehicleType: "",
      vehiclePlate: ""
    };
    
    showAddDriverModal = false;
  }

  function handleCancelAdd() {
    newDriver = {
      name: "",
      email: "",
      phone: "",
      licenseNumber: "",
      vehicleType: "",
      vehiclePlate: ""
    };
    showAddDriverModal = false;
  }

  function handleViewDriver(driverId: string) {
    console.log("View driver:", driverId);
  }

  function handleEditDriver(driverId: string) {
    console.log("Edit driver:", driverId);
  }

  function handleDeleteDriver(driverId: string) {
    if (confirm("Are you sure you want to remove this driver?")) {
      drivers_data = drivers_data.filter(driver => driver.id !== driverId);
    }
  }

  function goToPreviousPage() {
    currentPage = Math.max(1, currentPage - 1);
  }

  function goToNextPage() {
    currentPage = Math.min(totalPages(), currentPage + 1);
  }
</script>

<svelte:head>
  <title>Drivers - DeliveryManager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav>
    <a href="/dashboard" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</a>
    <a href="/dashboard/orders" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Orders</a>
    <a href="/dashboard/drivers" class="text-blue-600 dark:text-purple-400 font-medium transition-colors">Drivers</a>
    <a href="/dashboard/tracking" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Live Tracking</a>
    <a href="/dashboard/analytics" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Analytics</a>
  </HeaderNav>

  <main class="py-8">
    <div class="container mx-auto px-4">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Drivers
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
            Manage your delivery team and track driver performance
          </p>
        </div>
        <Button 
          onclick={handleAddDriver}
          class="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
        >
          <UserPlus class="w-4 h-4 mr-2" />
          Add Driver
        </Button>
      </div>

      <!-- Filters and Search -->
      <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300 mb-6">
        <CardContent class="p-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <Label for="search" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Search Drivers
              </Label>
              <div class="relative mt-1">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                <Input
                  id="search"
                  type="text"
                  bind:value={searchQuery}
                  placeholder="Search by name, email, phone, or ID..."
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

      <!-- Drivers Grid -->
      <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
        <CardHeader>
          <CardTitle class="text-xl dark:text-white transition-colors duration-300">
            All Drivers ({filteredDrivers.length})
          </CardTitle>
          <CardDescription class="dark:text-gray-300 transition-colors duration-300">
            Your delivery team overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {#each paginatedDrivers() as driver}
              <div class="bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-slate-600 rounded-xl p-6 hover:shadow-xl dark:hover:shadow-purple-900/20 transition-all duration-300 backdrop-blur-sm">
                <!-- Header with Avatar and Status -->
                <div class="flex items-start justify-between mb-6">
                  <div class="flex items-center space-x-3">
                    <div class="relative">
                      <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-purple-500 dark:to-purple-600 rounded-full flex items-center justify-center">
                        <User class="w-6 h-6 text-white" />
                      </div>
                      <div class="absolute -bottom-1 -right-1 w-4 h-4 {getStatusDot(driver.status)} rounded-full border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white text-lg">{driver.name}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{driver.id}</p>
                    </div>
                  </div>
                  <Badge class="px-2 py-1 text-xs font-medium rounded-full border {getStatusColor(driver.status)}">
                    {driver.status}
                  </Badge>
                </div>

                <!-- Contact Information -->
                <div class="space-y-3 mb-6">
                  <div class="flex items-center space-x-3">
                    <Mail class="w-4 h-4 text-gray-400 dark:text-gray-400 flex-shrink-0" />
                    <span class="text-sm text-gray-600 dark:text-gray-300 truncate">{driver.email}</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <Phone class="w-4 h-4 text-gray-400 dark:text-gray-400 flex-shrink-0" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">{driver.phone}</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <MapPin class="w-4 h-4 text-gray-400 dark:text-gray-400 flex-shrink-0" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">{driver.location}</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <Car class="w-4 h-4 text-gray-400 dark:text-gray-400 flex-shrink-0" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">
                      {driver.vehicle.type} {driver.vehicle.plate !== "N/A" ? `(${driver.vehicle.plate})` : ""}
                    </span>
                  </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{driver.currentOrders}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Active Orders</div>
                  </div>
                  <div class="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{driver.totalDeliveries}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Total Deliveries</div>
                  </div>
                </div>

                <!-- Rating and Last Active -->
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center space-x-2">
                    <Star class="w-4 h-4 text-yellow-400 fill-current" />
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{driver.rating}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Activity class="w-4 h-4 text-gray-400 dark:text-gray-400" />
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {formatLastActive(driver.lastActive)}
                    </span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onclick={() => handleViewDriver(driver.id)}
                    class="flex-1 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                  >
                    <Eye class="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onclick={() => handleEditDriver(driver.id)}
                    class="flex-1 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                  >
                    <Edit class="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onclick={() => handleDeleteDriver(driver.id)}
                    class="hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300"
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </div>
            {/each}
          </div>

          <!-- Pagination -->
          {#if totalPages() > 1}
            <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
              <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDrivers.length)} of {filteredDrivers.length} drivers
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

<!-- Add Driver Modal Overlay -->
{#if showAddDriverModal}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Add New Driver</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Enter driver information to add them to your team</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onclick={handleCancelAdd}
          class="hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full p-2"
        >
          <X class="w-5 h-5" />
        </Button>
      </div>

      <!-- Modal Content -->
      <div class="p-6 space-y-4 max-h-96 overflow-y-auto">
        <div class="space-y-2">
          <Label for="driverName" class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name *
          </Label>
          <Input
            id="driverName"
            type="text"
            bind:value={newDriver.name}
            placeholder="Enter driver's full name"
            class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="driverEmail" class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address *
          </Label>
          <Input
            id="driverEmail"
            type="email"
            bind:value={newDriver.email}
            placeholder="Enter email address"
            class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="driverPhone" class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number *
          </Label>
          <Input
            id="driverPhone"
            type="tel"
            bind:value={newDriver.phone}
            placeholder="Enter phone number"
            class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="licenseNumber" class="text-sm font-medium text-gray-700 dark:text-gray-300">
            License Number
          </Label>
          <Input
            id="licenseNumber"
            type="text"
            bind:value={newDriver.licenseNumber}
            placeholder="Enter license number"
            class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <div class="space-y-2">
          <Label for="vehicleType" class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Vehicle Type
          </Label>
          <select
            id="vehicleType"
            bind:value={newDriver.vehicleType}
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white"
          >
            <option value="">Select vehicle type</option>
            {#each vehicleTypes as type}
              <option value={type}>{type}</option>
            {/each}
          </select>
        </div>

        <div class="space-y-2">
          <Label for="vehiclePlate" class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Vehicle Plate
          </Label>
          <Input
            id="vehiclePlate"
            type="text"
            bind:value={newDriver.vehiclePlate}
            placeholder="Enter vehicle plate number"
            class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex space-x-3 p-6 border-t border-gray-200 dark:border-slate-700">
        <Button
          onclick={handleSaveDriver}
          class="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700"
        >
          Add Driver
        </Button>
        <Button
          variant="outline"
          onclick={handleCancelAdd}
          class="flex-1 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
{/if}