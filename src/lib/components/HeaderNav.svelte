<script lang="ts">
  import { Menu, Package } from "lucide-svelte";
  import { ThemeToggle } from "$lib/components";
  import { Button } from "$lib/components/ui/button";
  import type { Snippet } from "svelte";

  let { children, showLogin = true, showGetStarted = true }: { children?: Snippet, showLogin?: boolean, showGetStarted?: boolean } = $props();
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
        
        <div class="hidden md:flex items-center space-x-8">
          {#if children}
          {@render children()}
          {/if}
        </div>

        <div class="flex items-center space-x-4">
          <ThemeToggle />
          {#if showLogin}
            <Button variant="ghost" class="hidden md:inline-flex"><a href="/login">Log in</a></Button>
          {/if}
          {#if showGetStarted}
            <Button class="bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"><a href="/register">Get Started</a></Button>
          {/if}
            <Button variant="ghost" size="sm" class="md:hidden">
              <Menu class="w-4 h-4" />
            </Button>
        </div>
      </nav>
    </div>
  </header>