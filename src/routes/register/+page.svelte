<script lang="ts">
  import { HeaderNav, Footer } from "$lib/components";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Separator } from "$lib/components/ui/separator";
  import { Eye, EyeOff, Mail, Lock, User, Building, ArrowRight } from "lucide-svelte";

  let firstName = $state("");
  let lastName = $state("");
  let email = $state("");
  let company = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
  let isLoading = $state(false);
  let agreeToTerms = $state(false);

  // FIXME: Use form actions
  const handleRegister = async (event: SubmitEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    isLoading = true;
    // TODO: Handle registration logic here
  };

  const togglePasswordVisibility = () => {
    showPassword = !showPassword;
  };

  const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword = !showConfirmPassword;
  };
</script>

<svelte:head>
  <title>Sign Up - DeliveryManager</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/30 transition-all duration-500">
  <HeaderNav showLogin={false} showGetStarted={false} />
    <!-- <a href="/" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Home</a> -->

  <section class="py-20 lg:py-32">
    <div class="container mx-auto px-4">
      <div class="max-w-md mx-auto">
        <Card class="border-0 shadow-2xl dark:bg-slate-800/90 dark:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300">
          <CardHeader class="space-y-4 text-center">
            <CardTitle class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Create your account
            </CardTitle>
            <CardDescription class="text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Start your free trial with DeliveryManager today
            </CardDescription>
          </CardHeader>
          
          <CardContent class="space-y-6">
            <form onsubmit={handleRegister} class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="firstName" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    First name
                  </Label>
                  <div class="relative">
                    <User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                    <Input
                      id="firstName"
                      type="text"
                      bind:value={firstName}
                      placeholder="John"
                      class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <Label for="lastName" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    bind:value={lastName}
                    placeholder="Doe"
                    class="dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <Label for="email" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Email address
                </Label>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <Input
                    id="email"
                    type="email"
                    bind:value={email}
                    placeholder="john@company.com"
                    class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <Label for="company" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Company name
                </Label>
                <div class="relative">
                  <Building class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <Input
                    id="company"
                    type="text"
                    bind:value={company}
                    placeholder="Your Company"
                    class="pl-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <Label for="password" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Password
                </Label>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    bind:value={password}
                    placeholder="Create a password"
                    class="pl-10 pr-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                    required
                  />
                  <button
                    type="button"
                    onclick={togglePasswordVisibility}
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    {#if showPassword}
                      <EyeOff class="w-4 h-4" />
                    {:else}
                      <Eye class="w-4 h-4" />
                    {/if}
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <Label for="confirmPassword" class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Confirm password
                </Label>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    bind:value={confirmPassword}
                    placeholder="Confirm your password"
                    class="pl-10 pr-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                    required
                  />
                  <button
                    type="button"
                    onclick={toggleConfirmPasswordVisibility}
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    {#if showConfirmPassword}
                      <EyeOff class="w-4 h-4" />
                    {:else}
                      <Eye class="w-4 h-4" />
                    {/if}
                  </button>
                </div>
              </div>

              <div class="flex items-start space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  bind:checked={agreeToTerms}
                  class="w-4 h-4 mt-1 text-blue-600 dark:text-purple-600 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-purple-500 transition-colors duration-300"
                  required
                />
                <label for="terms" class="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  I agree to the
                  <a href="/terms" class="text-blue-600 dark:text-purple-400 hover:text-blue-700 dark:hover:text-purple-300 transition-colors duration-300">Terms of Service</a>
                  and
                  <a href="/privacy" class="text-blue-600 dark:text-purple-400 hover:text-blue-700 dark:hover:text-purple-300 transition-colors duration-300">Privacy Policy</a>
                </label>
              </div>

              <Button
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
                size="lg"
                disabled={isLoading}
              >
                {#if isLoading}
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating account...
                {:else}
                  Create account
                  <ArrowRight class="w-4 h-4 ml-2" />
                {/if}
              </Button>
            </form>

            <div class="relative">
              <Separator class="dark:bg-slate-600" />
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="bg-white dark:bg-slate-800 px-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Or sign up with
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
              >
                <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                class="border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
              >
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Already have an account?
                <a
                  href="/login"
                  class="text-blue-600 dark:text-purple-400 hover:text-blue-700 dark:hover:text-purple-300 font-medium transition-colors duration-300"
                >
                  Sign in
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>

  <Footer />
</div>