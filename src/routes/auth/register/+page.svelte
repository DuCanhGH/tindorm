<script>
  import { resolve } from "$app/paths";
  import { authClient } from "$lib/auth";
  import { register } from "$lib/auth.remote";

  // OAuth handlers
  const handleGitHubRegister = () => {
    authClient.signIn.social({
      provider: "github",
    });
  };

  const handleGoogleRegister = () => {
    authClient.signIn.social({
      provider: "google",
    });
  };

  let errors = { email: "", password: "", general: "" };
</script>

<svelte:head>
  <title>Register | Tindorm</title>
</svelte:head>

<div class="relative min-h-screen overflow-hidden purdue-gradient">
  <!-- Floating Orbs -->
  <div class="floating-orb orb-1"></div>
  <div class="floating-orb orb-2"></div>
  <div class="floating-orb orb-3"></div>

  <!-- Main Container -->
  <div class="relative z-10 flex min-h-screen items-center justify-center p-4">
    <div class="w-full max-w-xl rounded-3xl glass-effect p-8">
      <!-- Logo Section -->
      <div class="mb-8">
        <div class="flex gap-4">
          <div class="logo-glow mb-4">
            <i class="fas fa-home bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-4xl text-transparent"></i>
          </div>
          <h1 class="mb-2 text-4xl font-bold text-white">Tindorm</h1>
        </div>
        <div class="mt-4 h-1 w-full rounded-full purdue-gold"></div>
      </div>

      <!-- Welcome Message -->
      <div class="mb-8">
        <h2 class="mb-3 text-2xl font-semibold text-white">Welcome, dormmate!</h2>
        <p class="text-sm leading-relaxed text-gray-300">
          Join the quest to find your ideal roommate. Your perfect match awaits in this legendary adventure!
        </p>
      </div>

      <form class="flex-1 space-y-6" {...register}>
        {#if errors.general}
          <div class="rounded-lg border border-red-500 bg-red-900/30 p-4 text-sm text-red-200">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            {errors.general}
          </div>
        {/if}

        <div class="space-y-2">
          <label for="name-field" class="block text-sm font-medium text-gray-300">Username</label>
          <div class="relative">
            <input
              id="name-field"
              type="text"
              name="name"
              class="w-full rounded-xl border border-neutral-400 bg-white/10 px-4 py-3 text-white placeholder-neutral-400 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-accent-dark focus:outline-none"
              placeholder="Xxx_JohnTheSlayer_xxX"
              class:border-red-500={errors.email}
              class:focus:ring-red-400={errors.email}
            />
            <i class="fas fa-envelope absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-400"></i>
          </div>
          {#if register.issues?.email}
            <p class="mt-1 text-xs text-red-400">{JSON.stringify(register.issues.email)}</p>
          {/if}
        </div>

        <div class="space-y-2">
          <label for="email-field" class="block text-sm font-medium text-gray-300">Email</label>
          <div class="relative">
            <input
              id="email-field"
              type="email"
              name="email"
              class="w-full rounded-xl border border-neutral-400 bg-white/10 px-4 py-3 text-white placeholder-neutral-400 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-accent-dark focus:outline-none"
              placeholder="john.purdue@email.com"
              class:border-red-500={errors.email}
              class:focus:ring-red-400={errors.email}
            />
            <i class="fas fa-envelope absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-400"></i>
          </div>
          {#if register.issues?.email}
            <p class="mt-1 text-xs text-red-400">{JSON.stringify(register.issues.email)}</p>
          {/if}
        </div>

        <div class="space-y-2">
          <label for="password-field" class="block text-sm font-medium text-gray-300"> Password </label>
          <div class="relative">
            <input
              id="password-field"
              type="password"
              name="password"
              class="w-full rounded-xl border border-neutral-400 bg-white/10 px-4 py-3 text-white placeholder-neutral-400 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-accent-dark focus:outline-none"
              placeholder="Enter your password"
              class:border-red-500={errors.password}
              class:focus:ring-red-400={errors.password}
            />
            <i class="fas fa-lock absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-400"></i>
          </div>
          {#if errors.password}
            <p class="mt-1 text-xs text-red-400">{errors.password}</p>
          {/if}
        </div>

        <!-- Remember Me & Forgot Password -->
        <a href={resolve("/auth/login")} class="block text-accent-light transition-colors duration-300 hover:text-accent-light/80">
          Already have an account?
        </a>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={!!register.pending}
          class="btn-hover relative w-full overflow-hidden rounded-xl px-6 py-4 font-semibold text-black transition-all duration-300 purdue-gold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {#if register.pending}
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Signing in...
          {:else}
            <i class="fas fa-sign-in-alt mr-2"></i>
            Sign in
          {/if}
        </button>

        {#if !register.result?.ok && !!register.result?.message}
          <p class="mt-1 text-sm text-red-400">{register.result.message}</p>
        {/if}
      </form>

      <div class="my-4 flex items-center">
        <div class="h-1 flex-1 purdue-gold-reverse"></div>
        <span class="px-4 text-sm font-medium text-gray-400">OR</span>
        <div class="h-1 flex-1 purdue-gold"></div>
      </div>

      <!-- OAuth Buttons -->
      <div class="space-x-4">
        <!-- GitHub OAuth Button -->
        <button
          class="btn-hover aspect-square items-center justify-center overflow-hidden rounded-full border border-gray-600 bg-gray-800 p-4 text-white transition-all duration-300 hover:bg-gray-700"
          onclick={handleGitHubRegister}
        >
          <i class="fab fa-github text-xl"></i>
          <span class="sr-only">Continue with GitHub</span>
        </button>

        <!-- Google OAuth Button -->
        <button
          class="btn-hover aspect-square items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white p-4 text-gray-800 transition-all duration-300 hover:bg-gray-50"
          onclick={handleGoogleRegister}
        >
          <i class="fab fa-google text-xl"></i>
          <span class="sr-only">Continue with Google</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Background Elements -->
  <div class="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black/50 to-transparent"></div>
</div>

<style>
  .floating-orb {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(207, 185, 145, 0.8), rgba(207, 185, 145, 0.2));
    filter: blur(1px);
    animation: float 6s ease-in-out infinite;
  }

  .orb-1 {
    width: 60px;
    height: 60px;
    top: 10%;
    left: 20%;
    animation-delay: 0s;
  }

  .orb-2 {
    width: 40px;
    height: 40px;
    top: 70%;
    right: 15%;
    animation-delay: 2s;
  }

  .orb-3 {
    width: 80px;
    height: 80px;
    top: 40%;
    right: 10%;
    animation-delay: 4s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    33% {
      transform: translateY(-20px) rotate(120deg);
    }
    66% {
      transform: translateY(10px) rotate(240deg);
    }
  }

  .btn-hover {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .btn-hover::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition:
      left 0.5s ease,
      transform 0.5s ease-out;
  }

  .btn-hover:hover::before {
    left: 100%;
  }

  .btn-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }

  .btn-hover:active {
    transform: scale(0.9);
    & > * {
      opacity: 0.7;
    }
  }
</style>
