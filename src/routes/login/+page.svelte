<script lang="ts">
  import { goto } from "$app/navigation";
  import { signIn } from "@auth/sveltekit/client";

  import { HeaderNav, Footer } from "$lib/components";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Separator } from "$lib/components/ui/separator";
  
  import Eye from "lucide-svelte/icons/eye";
  import EyeOff from "lucide-svelte/icons/eye-off";
  import Mail from "lucide-svelte/icons/mail";
  import Lock from "lucide-svelte/icons/lock";
  import ArrowRight from "lucide-svelte/icons/arrow-right";
  import AlertCircle from "lucide-svelte/icons/alert-circle";

  let email = $state("");
  let password = $state("");
  let showPassword = $state(false);
  let isLoading = $state(false);
  let errors = $state<{ email?: string; password?: string; general?: string }>({});
  let rememberMe = $state(false);

  const handleLogin = async (event: SubmitEvent) => {
    event.preventDefault();
    isLoading = true;
    errors = {};

    // Basic validation
    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      isLoading = false;
      return;
    }

    try {
      // TODO: Handle login logic here
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      goto("/dashboard");
    } catch (error) {
      errors.general = "Invalid email or password. Please try again.";
    } finally {
      isLoading = false;
    }
  };

  const togglePasswordVisibility = () => {
    showPassword = !showPassword;
  };

  const handleEmailInput = () => {
    if (errors.email) {
      errors.email = undefined;
    }
  };

  const handlePasswordInput = () => {
    if (errors.password) {
      errors.password = undefined;
    }
  };
</script>

<svelte:head>
  <title>Login - DeliveryManager</title>
  <meta name="description" content="Sign in to your DeliveryManager account to access your delivery dashboard." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav showLogin={false} showGetStarted={false} />
    <!-- <a href="/" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Home</a> -->

  <main id="main-content" class="py-20 lg:py-32">
    <div class="container mx-auto px-4">
      <div class="max-w-md mx-auto">
        <Card class="border-0 shadow-2xl dark:bg-slate-800/90 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
          <CardHeader class="space-y-4 text-center">
            <CardTitle class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Welcome back
            </CardTitle>
            <CardDescription class="text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Sign in to your DeliveryManager account
            </CardDescription>
          </CardHeader>
          
          <CardContent class="space-y-6">
            <!-- Error Alert -->
            {#if errors.general}
              <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4" role="alert" aria-live="polite">
                <div class="flex items-center space-x-2">
                  <AlertCircle class="w-5 h-5 text-red-500 dark:text-red-400" aria-hidden="true" />
                  <p class="text-sm text-red-700 dark:text-red-300">{errors.general}</p>
                </div>
              </div>
            {/if}

            <form onsubmit={handleLogin} class="space-y-4" novalidate>
              <div class="space-y-2">
                <Label for="email" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Email address
                </Label>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" aria-hidden="true" />
                  <Input
                    id="email"
                    type="email"
                    bind:value={email}
                    oninput={handleEmailInput}
                    placeholder="Enter your email"
                    class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300 {errors.email ? 'border-red-500 dark:border-red-400' : ''}"
                    required
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {#if errors.email}
                  <p id="email-error" class="text-sm text-red-600 dark:text-red-400" role="alert">{errors.email}</p>
                {/if}
              </div>

              <div class="space-y-2">
                <Label for="password" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Password
                </Label>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" aria-hidden="true" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    bind:value={password}
                    oninput={handlePasswordInput}
                    placeholder="Enter your password"
                    class="pl-10 pr-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300 {errors.password ? 'border-red-500 dark:border-red-400' : ''}"
                    required
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onclick={togglePasswordVisibility}
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {#if showPassword}
                      <EyeOff class="w-4 h-4" aria-hidden="true" />
                    {:else}
                      <Eye class="w-4 h-4" aria-hidden="true" />
                    {/if}
                  </button>
                </div>
                {#if errors.password}
                  <p id="password-error" class="text-sm text-red-600 dark:text-red-400" role="alert">{errors.password}</p>
                {/if}
              </div>

              <div class="flex items-center justify-between">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    bind:checked={rememberMe}
                    class="w-4 h-4 text-blue-600 dark:text-purple-600 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-purple-500 transition-colors duration-300"
                  />
                  <span class="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Remember me</span>
                </label>
                <a
                  href="/forgot-password"
                  class="text-sm text-blue-600 dark:text-purple-400 hover:text-blue-700 dark:hover:text-purple-300 transition-colors duration-300"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
                size="lg"
                disabled={isLoading}
                aria-describedby={isLoading ? 'loading-status' : undefined}
              >
                {#if isLoading}
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true"></div>
                  <span id="loading-status" class="sr-only">Signing in, please wait...</span>
                  Signing in...
                {:else}
                  Sign in
                  <ArrowRight class="w-4 h-4 ml-2" aria-hidden="true" />
                {/if}
              </Button>
            </form>

            <div class="relative">
              <Separator class="dark:bg-slate-600" />
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="bg-white dark:bg-slate-800 px-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  or continue with
                </span>
              </div>
            </div>

            <!-- This may be useful in the future: grid-cols-2 -->
            <div class="grid gap-3"> 
              <Button
                variant="outline"
                class="w-full border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
                onclick={() => signIn("google", { redirectTo: "/dashboard" })}
                aria-label="Sign in with Google"
              >
                <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
            
              <!-- FIXME: Meta's new Dev App Dashboard sucks ass. Fuck this. -->
              <!-- <Button
                variant="outline"
                class="w-full border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
                onclick={() => signIn("facebook", { redirectTo: "/dashboard" })}
              >
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button> -->
            </div>

            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Don't have an account?
                <a
                  href="/register"
                  class="text-blue-600 dark:text-purple-400 hover:text-blue-700 dark:hover:text-purple-300 font-medium transition-colors duration-300"
                >
                  Sign up
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>

  <Footer />
</div>