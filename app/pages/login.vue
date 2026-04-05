<script setup>
const email = ref('')
const password = ref('')
const errors = reactive({ email: '', password: '', general: '' })
const { login } = useAuth()

const validate = () => {
  let valid = true
  errors.email = ''; errors.password = ''; errors.general = ''
  if (!email.value) { errors.email = 'Email is required'; valid = false }
  if (!password.value) { errors.password = 'Password is required'; valid = false }
  return valid
}

const handleLogin = async () => {
  if (!validate()) return
  try {
    const { user } = await login(email.value, password.value)
    if (!user) { errors.general = 'Login failed, please try again'; return }
    if (user?.role === 'admin') await navigateTo('/admin/dashboard')
    else await navigateTo('/')
  } catch (err) {
    errors.general = err.data?.message || 'Invalid email or password'
  }
}

useHead({ title: 'Login - SmokeHaven' })
</script>

<template>
  <LayoutNavbar />

  <div class="bg-gray-950 min-h-screen flex items-center justify-center px-6 py-20">
    <div class="w-full max-w-md">

      <!-- LOGO -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-black text-2xl">S</span>
        </div>
        <h1 class="text-2xl font-black text-white">Welcome back</h1>
        <p class="text-gray-500 mt-1 text-sm">Sign in to your SmokeHaven account</p>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-5">

        <div>
          <label class="text-sm font-medium text-gray-300 block mb-1.5">Email</label>
          <input v-model="email" type="email" placeholder="you@example.com"
            class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition" />
          <p v-if="errors.email" class="text-red-400 text-xs mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-300 block mb-1.5">Password</label>
          <input v-model="password" type="password" placeholder="••••••••"
            class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition" />
          <p v-if="errors.password" class="text-red-400 text-xs mt-1">{{ errors.password }}</p>
        </div>

        <p v-if="errors.general" class="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-xl p-3">
          {{ errors.general }}
        </p>

        <button @click="handleLogin"
          class="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-xl transition text-sm uppercase tracking-widest">
          Sign In
        </button>

        <p class="text-center text-sm text-gray-500">
          Don't have an account?
          <NuxtLink to="/register" class="text-orange-400 hover:text-orange-300 font-semibold transition">
            Create one
          </NuxtLink>
        </p>
      </div>

    </div>
  </div>

  <LayoutFooter />
</template>