<script setup>
const { register } = useAuth()

const form = reactive({ firstName: '', lastName: '', email: '', password: '', age: '' })
const errors = reactive({ general: '' })
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  errors.general = ''
  try {
    await register(form.firstName, form.lastName, form.email, form.password, form.age)
    await navigateTo('/login')
  } catch (err) {
    errors.general = err.data?.message || 'Registration failed'
  }
  loading.value = false
}

useHead({ title: 'Register - SmokeHaven' })
</script>

<template>
  <LayoutNavbar />

  <div class="bg-gray-950 min-h-screen flex items-center justify-center px-6 py-20">
    <div class="w-full max-w-md">

      <div class="text-center mb-8">
        <div class="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-black text-2xl">S</span>
        </div>
        <h1 class="text-2xl font-black text-white">Create Account</h1>
        <p class="text-gray-500 mt-1 text-sm">Join SmokeHaven Nepal</p>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-4">

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-300 block mb-1.5">First Name</label>
            <input v-model="form.firstName" placeholder="John"
              class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition" />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-300 block mb-1.5">Last Name</label>
            <input v-model="form.lastName" placeholder="Doe"
              class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition" />
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-300 block mb-1.5">Email</label>
          <input v-model="form.email" type="email" placeholder="you@example.com"
            class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition" />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-300 block mb-1.5">Password</label>
          <input v-model="form.password" type="password" placeholder="••••••••"
            class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition" />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-300 block mb-1.5">Age</label>
          <input v-model="form.age" type="number" placeholder="Must be 18+"
            class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition" />
        </div>

        <p v-if="errors.general" class="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-xl p-3">
          {{ errors.general }}
        </p>

        <button @click="handleRegister" :disabled="loading"
          class="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-xl transition text-sm uppercase tracking-widest disabled:opacity-50">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <p class="text-center text-sm text-gray-500">
          Already have an account?
          <NuxtLink to="/login" class="text-orange-400 hover:text-orange-300 font-semibold transition">
            Sign in
          </NuxtLink>
        </p>
      </div>

    </div>
  </div>

  <LayoutFooter />
</template>