<script lang="ts">
  // Svelte
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  // Auth
  import { signOut } from "@auth/sveltekit/client";
  // Components
  import { ThemeToggle } from "$lib/components";
  import { Button } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator";
  // Icons
  import BriefcaseBusiness from "lucide-svelte/icons/briefcase-business";
  import Menu from "lucide-svelte/icons/menu";
  import Package from "lucide-svelte/icons/package";
  import X from "lucide-svelte/icons/x";

  import { clickOutside } from "$lib/utils";

  let { children, showLogin = true, showGetStarted = true }: { children?: Snippet, showLogin?: boolean, showGetStarted?: boolean } = $props();

  let profileMenuOpen = $state(false);
  let profileMenuId = "profile-menu";
  let profileButtonId = "profile-button";
  let focusedProfileMenuItemIndex = $state(-1);

  function handleProfileMenuKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      profileMenuOpen = false;
      focusedProfileMenuItemIndex = -1;
    }
  }

  function handleProfileButtonKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleProfileMenu();
    } else if (event.key === 'ArrowDown' && !profileMenuOpen) {
      event.preventDefault();
      toggleProfileMenu();
    }
  }

  function handleProfileMenuItemKeydown(event: KeyboardEvent, index: number) {
    const menuItems = document.querySelectorAll(`#${profileMenuId} [role="menuitem"]`);
    const totalItems = menuItems.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusedProfileMenuItemIndex = (index + 1) % totalItems;
        (menuItems[focusedProfileMenuItemIndex] as HTMLElement).focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusedProfileMenuItemIndex = index === 0 ? totalItems - 1 : index - 1;
        (menuItems[focusedProfileMenuItemIndex] as HTMLElement).focus();
        break;
      case 'Home':
        event.preventDefault();
        focusedProfileMenuItemIndex = 0;
        (menuItems[0] as HTMLElement).focus();
        break;
      case 'End':
        event.preventDefault();
        focusedProfileMenuItemIndex = totalItems - 1;
        (menuItems[totalItems - 1] as HTMLElement).focus();
        break;
      case 'Escape':
        event.preventDefault();
        profileMenuOpen = false;
        focusedProfileMenuItemIndex = -1;
        (document.getElementById(profileButtonId) as HTMLElement).focus();
        break;
      case 'Tab':
        // Only close menu when tabbing out of the last item (forward) or first item (backward)
        if ((!event.shiftKey && index === totalItems - 1) || (event.shiftKey && index === 0)) {
          closeProfileMenu();
        }
        break;
    }
  }

  function toggleProfileMenu() {
    profileMenuOpen = !profileMenuOpen;
    if (profileMenuOpen) {
      // Focus first menu item when opening
      setTimeout(() => {
        const firstMenuItem = document.querySelector(`#${profileMenuId} [role="menuitem"]`) as HTMLElement;
        if (firstMenuItem) {
          firstMenuItem.focus();
          focusedProfileMenuItemIndex = 0;
        }
      }, 100);
    } else {
      focusedProfileMenuItemIndex = -1;
    }
  }

  function closeProfileMenu() {
    profileMenuOpen = false;
    focusedProfileMenuItemIndex = -1;
    // Return focus to the profile button when menu closes
    setTimeout(() => {
      const profileButton = document.getElementById(profileButtonId) as HTMLElement;
      if (profileButton) {
        profileButton.focus();
      }
    }, 0);
  }
  
  let mobileMenuOpen = $state(false);
  let mobileMenuId = "mobile-menu";
  let mobileMenuButtonId = "mobile-menu-button";
  let focusedMobileMenuItemIndex = $state(-1);

  function handleMobileMenuButtonKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMobileMenu();
    } else if (event.key === 'ArrowDown' && !mobileMenuOpen) {
      event.preventDefault();
      toggleMobileMenu();
    }
  }

  // FIXME: Children do not invoke this function so therefore tabbing on children does not trigger this function.
  function handleMobileMenuItemKeydown(event: KeyboardEvent, index: number) {
    const mobileMenuItems = document.querySelectorAll(`#${mobileMenuId} [role="menuitem"]`);
    const totalItems = mobileMenuItems.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusedMobileMenuItemIndex = (index + 1) % totalItems;
        (mobileMenuItems[focusedMobileMenuItemIndex] as HTMLElement).focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusedMobileMenuItemIndex = index === 0 ? totalItems - 1 : index - 1;
        (mobileMenuItems[focusedMobileMenuItemIndex] as HTMLElement).focus();
        break;
      case 'Home':
        event.preventDefault();
        focusedMobileMenuItemIndex = 0;
        (mobileMenuItems[0] as HTMLElement).focus();
        break;
      case 'End':
        event.preventDefault();
        focusedMobileMenuItemIndex = totalItems - 1;
        (mobileMenuItems[totalItems - 1] as HTMLElement).focus();
        break;
      case 'Escape':
        event.preventDefault();
        closeMobileMenu();
        break;
      case 'Tab':
        // Only close menu when tabbing out of the last item (forward) or first item (backward)
        if ((!event.shiftKey && index === totalItems - 1) || (event.shiftKey && index === 0)) {
          closeMobileMenu();
        }
        break;
    }
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    if (mobileMenuOpen) {
      // Focus first menu item when opening
      setTimeout(() => {
        const firstMenuItem = document.querySelector(`#${mobileMenuId} [role="menuitem"]`) as HTMLElement;
        if (firstMenuItem) {
          firstMenuItem.focus();
          focusedMobileMenuItemIndex = 0;
        }
      }, 100);
    } else {
      focusedMobileMenuItemIndex = -1;
    }
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
    focusedMobileMenuItemIndex = -1;
    // Return focus to the mobile menu button when menu closes
    setTimeout(() => {
      const mobileMenuButton = document.getElementById(mobileMenuButtonId) as HTMLElement;
      if (mobileMenuButton) {
        mobileMenuButton.focus();
      }
    }, 0);
  }
</script>

<header class="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
  <div class="container mx-auto px-4 py-4">
    <nav class="flex items-center justify-between" aria-label="Main navigation">
      <a href="/" class="flex items-center space-x-2 cursor-pointer" aria-label="DeliveryManager Home">
        <div class="w-8 h-8 bg-blue-600 dark:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-300" aria-hidden="true">
          <Package class="w-4 h-4 text-white" />
        </div>
        <span class="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">DeliveryManager</span>
      </a>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8" role="menubar">
        {#if children}
        {@render children()}
        {/if}
      </div>

      <div class="flex items-center md:space-x-4">
        {#if page.data && page.data.session?.user}
        <div class="relative">
          <Button 
            id={profileButtonId}
            variant="ghost" 
            class="flex items-center space-x-2 px-0 md:px-2 transition-all duration-200 {mobileMenuOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}"
            onclick={toggleProfileMenu}
            onkeydown={handleProfileButtonKeydown}
            aria-expanded={profileMenuOpen}
            aria-haspopup="true"
            aria-controls={profileMenuId}
            aria-label="User profile menu"
            {@attach clickOutside(() => closeProfileMenu())}
          >
            <img
              src={page.data.session?.user?.image ?? "/default-avatar.png"}
              alt=""
              class="w-8 h-8 rounded-full border-2 border-blue-600 dark:border-purple-600 object-cover transition-all duration-300"
              referrerpolicy="no-referrer"
            />
            <span class="hidden md:inline text-gray-900 dark:text-white font-medium transition-colors duration-300">{page.data.session.user.name ?? "Profile"}</span>
          </Button>
          
          <!-- Dropdown Menu -->
          {#if profileMenuOpen}
          <div 
            id={profileMenuId}
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-gray-200 dark:border-slate-700 z-50"
            role="menu"
            aria-labelledby={profileButtonId}
            aria-orientation="vertical"
            tabindex="-1"
            onkeydown={handleProfileMenuKeydown}
          >
            <div class="flex flex-col space-y-1 py-1">
              <a 
                href="/dashboard" 
                class="flex items-center rounded-md mx-1 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none"
                onclick={() => closeProfileMenu()}
                onkeydown={(e) => handleProfileMenuItemKeydown(e, 0)}
                role="menuitem"
                tabindex={0}
              >
                <BriefcaseBusiness class="w-4 h-4 mr-2" aria-hidden="true" />
                Dashboard
              </a>
              <Separator />
              <a 
                href="/account" 
                class="block rounded-md mx-1 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none"
                onclick={() => closeProfileMenu()}
                onkeydown={(e) => handleProfileMenuItemKeydown(e, 1)}
                role="menuitem"
                tabindex={0}
              >
                Account
              </a>
              <button 
                class="block rounded-md mx-1 text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer w-full focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none"
                onclick={() => {signOut(); closeProfileMenu();}}
                onkeydown={(e) => handleProfileMenuItemKeydown(e, 2)}
                role="menuitem"
                tabindex={0}
              >
                Sign out
              </button>
            </div>
          </div>
          {/if}
        </div>
        {:else}
          {#if showLogin}
          <Button variant="ghost" class="hidden md:inline-flex" role="menuitem"><a href="/login">Log in</a></Button>
          {/if}
          {#if showGetStarted}
          <Button class="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300" role="menuitem"><a href="/register">Get Started</a></Button>
          {/if}
        {/if}
        <ThemeToggle />
        <Button 
          id={mobileMenuButtonId}
          variant="ghost" 
          size="sm" 
          class="md:hidden"
          onclick={toggleMobileMenu}
          onkeydown={handleMobileMenuButtonKeydown}
          aria-expanded={mobileMenuOpen}
          aria-controls={mobileMenuId}
          aria-label="Toggle mobile menu"
        >
          {#if mobileMenuOpen}
          <X class="w-4 h-4" aria-hidden="true" />
          {:else}
          <Menu class="w-4 h-4" aria-hidden="true" />
          {/if}
        </Button>
      </div>
    </nav>
  </div>
  <!-- Mobile Navigation Menu -->
  <div 
    id={mobileMenuId}
    class="md:hidden border-t border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ease-in-out {mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}"
    role="navigation"
    aria-labelledby={mobileMenuButtonId}
    aria-hidden={!mobileMenuOpen}
  >
    <div class="flex flex-col space-y-4 transform transition-transform duration-300 ease-in-out {mobileMenuOpen ? 'translate-y-0' : '-translate-y-4'}">
      <!-- Mobile Navigation Links -->
      {#if children}
      <div class="flex flex-col [&>a]:block [&>a]:py-2 [&>a]:px-3 [&>a]:rounded-md [&>a]:transition-colors [&>a]:duration-200 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none [&>a]:tabindex-0 [&>a]:role-menuitem" role="menubar">
      {@render children()}
      </div>
      {/if}

      <!-- Mobile User Profile Section -->
      {#if page.data && page.data.session?.user}
      <div class="border-t pt-4 px-4 border-gray-200 dark:border-slate-700">
        <div class="flex items-center space-x-3 mb-4">
          <img
            src={page.data.session?.user?.image ?? "/default-avatar.png"}
            alt=""
            class="w-10 h-10 rounded-full border-2 border-blue-600 dark:border-purple-600 object-cover"
            referrerpolicy="no-referrer"
          />
          <div class="flex-1">
            <p class="text-gray-900 dark:text-white font-medium">{page.data.session.user.name ?? "Profile"}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{page.data.session.user.email ?? ""}</p>
          </div>
        </div>
        <Button 
          onclick={() => {signOut(); closeMobileMenu();}} 
          class="w-full mb-4"
          variant="outline"
          role="menuitem"
          tabindex={0}
          onkeydown={(e) => handleMobileMenuItemKeydown(e, 0)}
        >
          Log out
        </Button>
      </div>
      {:else}
      <!-- Mobile Auth Buttons -->
      <div class="flex space-x-3 border-t pt-4 pr-4 mb-4 border-gray-200 dark:border-slate-700 justify-end" role="menubar">
      {#if showLogin}
      <Button 
        variant="ghost" 
        class="justify-start"
        onclick={() => closeMobileMenu()}
        role="menuitem"
        tabindex={0}
        onkeydown={(e) => handleMobileMenuItemKeydown(e, 0)}
      >
        <a href="/login" class="w-full text-left">Log in</a>
      </Button>
      {/if}
      {#if showGetStarted}
      <Button 
        class="pr-4 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
        onclick={() => closeMobileMenu()}
        role="menuitem"
        tabindex={0}
        onkeydown={(e) => handleMobileMenuItemKeydown(e, 1)}
      >
        <a href="/register" class="w-full text-center">Get Started</a>
      </Button>
      {/if}
      </div>
      {/if}
    </div>
  </div>
</header>

<!-- Mobile Menu Overlay -->
{#if mobileMenuOpen}
<div 
  class="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 md:hidden transition-opacity duration-300"
  aria-hidden="true"
  onclick={() => closeMobileMenu()}
></div>
{/if}