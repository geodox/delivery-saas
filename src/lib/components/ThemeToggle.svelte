<!-- src/lib/components/ThemeToggle.svelte -->
<script lang="ts">
  import { browser } from "$app/environment";

  import { Button } from "$lib/components/ui/button";

  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";

  // Use $state rune for reactive state
  let isDark = $state(false);

  // Initialize theme from localStorage or system preference
  $effect(() => {
    if (browser) {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      isDark = stored === 'dark' || (!stored && prefersDark);
      updateTheme();
    }
  });

  function updateTheme() {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  function toggleTheme() {
    isDark = !isDark;
    updateTheme();
  }
</script>

<Button
  variant="ghost"
  size="sm"
  onclick={toggleTheme}
  class="w-9 h-9 p-0"
  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {#if isDark}
    <Sun class="w-4 h-4 transition-all" />
  {:else}
    <Moon class="w-4 h-4 transition-all" />
  {/if}
</Button>