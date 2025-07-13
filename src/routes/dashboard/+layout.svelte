<script lang="ts">
  // Svelte
  import { page } from "$app/state";
  
  // Components
  import { HeaderNav, Footer } from "$lib/components";
  
  let { children } = $props();
  
  // Get the current business ID from the URL
  const businessId = $derived(() => {
    const path = page.url.pathname;
    const match = path.match(/^\/dashboard\/([^\/]+)/);
    return match ? match[1] : null;
  });
  
  // Get the current section from the URL
  const currentSection = $derived(() => {
    const path = page.url.pathname;
    if (!businessId()) return null;
    
    if (path === `/dashboard/${businessId()}`) return 'dashboard';
    if (path.startsWith(`/dashboard/${businessId()}/orders`)) return 'orders';
    if (path.startsWith(`/dashboard/${businessId()}/employees`)) return 'employees';
    if (path.startsWith(`/dashboard/${businessId()}/tracking`)) return 'tracking';
    if (path.startsWith(`/dashboard/${businessId()}/analytics`)) return 'analytics';
    if (path.startsWith(`/dashboard/${businessId()}/edit`)) return 'edit';
    
    return null;
  });
  
  // Navigation items with their paths and labels
  const navItems = $derived(() => {
    if (!businessId()) return [];
    
    return [
      { 
        href: `/dashboard/${businessId()}`, 
        label: 'Dashboard',
        section: 'dashboard'
      },
      { 
        href: `/dashboard/${businessId()}/orders`, 
        label: 'Orders',
        section: 'orders'
      },
      { 
        href: `/dashboard/${businessId()}/employees`, 
        label: 'Employees',
        section: 'employees'
      },
      { 
        href: `/dashboard/${businessId()}/tracking`, 
        label: 'Live Tracking',
        section: 'tracking'
      },
      { 
        href: `/dashboard/${businessId()}/analytics`, 
        label: 'Analytics',
        section: 'analytics'
      }
    ];
  });
  
  // Function to get the appropriate classes for a nav item
  function getNavItemClasses(itemSection: string) {
    const isActive = currentSection() === itemSection;
    return isActive 
      ? "text-blue-600 dark:text-purple-400 font-medium transition-colors"
      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors";
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  {#if businessId()}
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
  {:else}
    <HeaderNav />
  {/if}

  <main class="py-8">
    {@render children()}
  </main>

  <Footer />
</div> 