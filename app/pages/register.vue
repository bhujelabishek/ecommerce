<script setup>
useHead({
    title: 'Register',
    meta: [
        {
            name: 'Register Description', content: "Register"
        }
    ]
})
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const age = ref('')

// error messages
const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: ''
})

const { register } = useAuth()

// validation function
const validate = () => {
    let valid = true

    // reset errors
    Object.keys(errors).forEach(key => errors[key] = '')

    if (!firstName.value) {
        errors.firstName = 'First name is required'
        valid = false
    }

    if (!lastName.value) {
        errors.lastName = 'Last name is required'
        valid = false
    }

    if (!email.value) {
        errors.email = 'Email is required'
        valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        errors.email = 'Invalid email format'
        valid = false
    }

    if (!password.value) {
        errors.password = 'Password is required'
        valid = false
    } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password.value)
    ) {
        errors.password =
            'Password must be 8+ chars, include uppercase, lowercase, and special character'
        valid = false
    }

    if (password.value !== confirmPassword.value) {
        errors.confirmPassword = 'Passwords do not match'
        valid = false
    }

    if (!age.value) {
        errors.age = 'Age is required'
        valid = false
    } else if (age.value < 18) {
        errors.age = 'You must be 18+'
        valid = false
    }

    return valid
}

const handleRegister = async () => {
    console.log("button clicked")
  if (!validate()) return

  try {
    const res = await register(
      firstName.value,
      lastName.value,
      email.value,
      password.value,
      age.value
    )

    console.log('SUCCESS:', res)

    navigateTo('/login')
  } catch (err) {
    console.error('REGISTER ERROR:', err)
    alert(err.data?.message || 'Register failed')
  }
}
</script>

<template>
    <LayoutNavbar />

    <div class="max-w-md mx-auto py-20 space-y-5">

        <h1 class="text-2xl font-bold">Register</h1>

        <!-- FIRST NAME -->
        <div>
            <label>First Name <span class="text-red-500">*</span></label>
            <input v-model="firstName" class="input" />
            <p class="error">{{ errors.firstName }}</p>
        </div>

        <!-- LAST NAME -->
        <div>
            <label>Last Name <span class="text-red-500">*</span></label>
            <input v-model="lastName" class="input" />
            <p class="error">{{ errors.lastName }}</p>
        </div>

        <!-- EMAIL -->
        <div>
            <label>Email <span class="text-red-500">*</span></label>
            <input v-model="email" class="input" />
            <p class="error">{{ errors.email }}</p>
        </div>

        <!-- PASSWORD -->
        <div>
            <label>Password <span class="text-red-500">*</span></label>
            <input v-model="password" type="password" class="input" />
            <p class="text-xs text-gray-500">
                Must be at least 8 characters, include uppercase, lowercase, and special character
            </p>
            <p class="error">{{ errors.password }}</p>
        </div>

        <!-- CONFIRM PASSWORD -->
        <div>
            <label>Confirm Password <span class="text-red-500">*</span></label>
            <input v-model="confirmPassword" type="password" class="input" />
            <p class="error">{{ errors.confirmPassword }}</p>
        </div>

        <!-- AGE -->
        <div>
            <label>Age <span class="text-red-500">*</span></label>
            <input v-model="age" type="number" class="input" />
            <p class="error">{{ errors.age }}</p>
        </div>

        <!-- BUTTON -->
        <button @click="handleRegister" class="bg-black text-white w-full py-3 rounded hover:bg-gray-800">
            Register
        </button>

    </div>

    <LayoutFooter />
</template>

<style scoped>
.input {
    @apply border w-full p-2 rounded mt-1;
}

.error {
    @apply text-red-500 text-sm mt-1;
}
</style>