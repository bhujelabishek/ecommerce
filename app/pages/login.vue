<script setup>
const email = ref('')
const password = ref('')

const errors = reactive({
  email: '',
  password: '',
  general: ''
})

const { login } = useAuth()

const validate = () => {
  let valid = true
  errors.email = ''
  errors.password = ''
  errors.general = ''

  if (!email.value) {
    errors.email = 'Email is required'
    valid = false
  }
  if (!password.value) {
    errors.password = 'Password is required'
    valid = false
  }

  return valid
}

const handleLogin = async () => {
  if (!validate()) return

  try {
    const { user } = await login(email.value, password.value)

    if (!user) {
      errors.general = 'Login failed, please try again'
      return
    }

    if (user?.role === 'admin') {
      await navigateTo('/admin/dashboard')
    } else {
      await navigateTo('/')
    }
  } catch (err) {
    console.error(err)
    errors.general = err.data?.message || 'Invalid email or password'
  }
}
</script>

<template>
  <LayoutNavbar />

  <div class="max-w-md mx-auto py-20 space-y-5">
    <h1 class="text-2xl font-bold">Login</h1>

    <div>
      <input v-model="email" placeholder="Email" class="input" />
      <p class="error">{{ errors.email }}</p>
    </div>

    <div>
      <input v-model="password" type="password" placeholder="Password" class="input" />
      <p class="error">{{ errors.password }}</p>
    </div>

    <p class="error text-center">{{ errors.general }}</p>

    <button
      @click="handleLogin"
      class="bg-black text-white w-full py-3 rounded hover:bg-gray-800"
    >
      Login
    </button>
  </div>

  <LayoutFooter />
</template>

<style scoped>
.input {
  @apply border w-full p-2 rounded;
}
.error {
  @apply text-red-500 text-sm mt-1;
}
</style>