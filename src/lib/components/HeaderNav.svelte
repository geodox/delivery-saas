<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";

  import { Menu, Package, X } from "lucide-svelte";
  import { ThemeToggle } from "$lib/components";
  import { Button } from "$lib/components/ui/button";
  import { signOut } from "@auth/sveltekit/client";

  let { children, showLogin = true, showGetStarted = true }: { children?: Snippet, showLogin?: boolean, showGetStarted?: boolean } = $props();

  let mobileMenuOpen = $state(false);
</script>

<header class="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
  <div class="container mx-auto px-4 py-4">
    <nav class="flex items-center justify-between">
      <a href="/" class="flex items-center space-x-2 cursor-pointer">
        <div class="w-8 h-8 bg-blue-600 dark:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-300">
          <Package class="w-4 h-4 text-white" />
        </div>
        <span class="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">DeliveryManager</span>
      </a>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8">
        {#if children}
        {@render children()}
        {/if}
      </div>

      <div class="flex items-center space-x-4">
        {#if page.data && page.data.session?.user}
        <div class="flex items-center space-x-2 transition-all duration-200 {mobileMenuOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}">
          <img
            src={page.data.session?.user?.image ?? "/default-avatar.png"}
            alt="Profile"
            class="w-8 h-8 rounded-full border-2 border-blue-600 dark:border-purple-600 object-cover transition-all duration-300"
            referrerpolicy="no-referrer"
          />
          <span class="hidden md:inline text-gray-900 dark:text-white font-medium pr-4 transition-all duration-300">{page.data.session.user.name ?? "Profile"}</span>
          <Button class="hidden md:inline-flex transition-all duration-300" onclick={() => {signOut()}}>Log out</Button>
        </div>
        {:else}
          {#if showLogin}
          <Button variant="ghost" class="hidden md:inline-flex"><a href="/login">Log in</a></Button>
          {/if}
          {#if showGetStarted}
          <Button class="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"><a href="/register">Get Started</a></Button>
          {/if}
        {/if}
        <ThemeToggle />
        <Button 
        variant="ghost" 
        size="sm" 
        class="md:hidden"
        onclick={() => mobileMenuOpen = !mobileMenuOpen}
      >
        {#if mobileMenuOpen}
        <X class="w-4 h-4" />
        {:else}
        <Menu class="w-4 h-4" />
        {/if}
      </Button>
      </div>
    </nav>
  </div>
  <!-- Mobile Navigation Menu -->
  <div class="md:hidden border-t border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ease-in-out {mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}">
    <div class="flex flex-col space-y-4 transform transition-transform duration-300 ease-in-out {mobileMenuOpen ? 'translate-y-0' : '-translate-y-4'}">
      <!-- Mobile Navigation Links -->
      {#if children}
      <div class="flex flex-col [&>a]:block [&>a]:py-2 [&>a]:px-3 [&>a]:rounded-md [&>a]:transition-colors [&>a]:duration-200">
      {@render children()}
      </div>
      {/if}

      <!-- Mobile User Profile Section -->
      {#if page.data && page.data.session?.user}
      <div class="border-t pt-4 px-4 border-gray-200 dark:border-slate-700">
        <div class="flex items-center space-x-3 mb-4">
          <img
            src={page.data.session?.user?.image ?? "/default-avatar.png"}
            alt="Profile"
            class="w-10 h-10 rounded-full border-2 border-blue-600 dark:border-purple-600 object-cover"
            referrerpolicy="no-referrer"
          />
          <div class="flex-1">
            <p class="text-gray-900 dark:text-white font-medium">{page.data.session.user.name ?? "Profile"}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{page.data.session.user.email ?? ""}</p>
          </div>
        </div>
        <Button 
          onclick={() => {signOut(); mobileMenuOpen = false;}} 
          class="w-full mb-4"
          variant="outline"
        >
          Log out
        </Button>
      </div>
      {:else}
      <!-- Mobile Auth Buttons -->
      <div class="flex space-x-3 border-t pt-4 pr-4 mb-4 border-gray-200 dark:border-slate-700 justify-end">
      {#if showLogin}
      <Button 
        variant="ghost" 
        class="justify-start"
        onclick={() => mobileMenuOpen = false}
      >
        <a href="/login" class="w-full text-left">Log in</a>
      </Button>
      {/if}
      {#if showGetStarted}
      <Button 
        class="pr-4 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
        onclick={() => mobileMenuOpen = false}
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
<div class="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 md:hidden transition-opacity duration-300"></div>
{/if}