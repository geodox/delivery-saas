<script lang="ts">
  import Package from "lucide-svelte/icons/package";
  
  // Footer links organized by sections
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Integrations", href: "#integrations" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#docs" },
        { label: "Blog", href: "#blog" },
        { label: "Support", href: "#support" },
        { label: "API Reference", href: "#api" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Careers", href: "#careers" },
        { label: "Contact", href: "#contact" },
        { label: "Privacy Policy", href: "#privacy" }
      ]
    }
  ];

  const socialLinks = [
    { label: "Twitter", href: "#twitter" },
    { label: "LinkedIn", href: "#linkedin" },
    { label: "Facebook", href: "#facebook" }
  ];
</script>

<footer class="bg-gray-900 dark:bg-slate-950 text-gray-300 py-16 transition-colors duration-300">
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-4 gap-8">
      <!-- Company Info -->
      <div class="space-y-4">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-600 dark:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-300">
            <Package class="w-4 h-4 text-white" />
          </div>
          <span class="text-xl font-bold text-white">Delivery Manager</span>
        </div>
        <p class="text-gray-400 dark:text-gray-500 transition-colors duration-300">
          The complete delivery management platform for modern businesses.
        </p>
      </div>

      <!-- Footer Sections -->
      {#each footerSections as section}
        <div class="space-y-4">
          <h4 class="text-white font-semibold">{section.title}</h4>
          <ul class="space-y-2">
            {#each section.links as link}
              <li>
                <a 
                  href={link.href} 
                  class="hover:text-white dark:hover:text-purple-300 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <!-- Bottom Section -->
    <div class="border-t border-gray-800 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center transition-colors duration-300">
      <p class="text-gray-400 dark:text-gray-500 transition-colors duration-300">
        © {new Date().getFullYear()} Delivery Manager. All rights reserved.
      </p>
      <div class="flex space-x-6 mt-4 md:mt-0">
        {#each socialLinks as social}
          <a 
            href={social.href} 
            class="text-gray-400 hover:text-white dark:hover:text-purple-300 transition-colors"
            aria-label={social.label}
          >
            {social.label}
          </a>
        {/each}
      </div>
    </div>
  </div>
</footer>