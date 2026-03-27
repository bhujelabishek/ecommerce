<script setup>
import { ref, onMounted } from 'vue'
import { User } from 'lucide-vue-next'

const { logout, getUser } = useAuth()

useHead({
    title:'Profile Dashboard',
    meta:[
        { name: 'Profile Page'}
    ]
})

const user = ref(null)

onMounted(async () => {
  try {
    user.value = await getUser()
    console.log('USER:', user.value)
  } catch (err) {
    console.error(err)
  }
})


// localStorage.getItem('token')
</script>

<template>
  <LayoutNavbar />

  <div class="max-w-4xl mx-auto py-20 px-6">

    <!-- LOADING -->
    <div v-if="!user" class="text-center py-10">
      Loading profile...
    </div>

    <!-- USER DATA -->
    <div v-else class="bg-white shadow-lg rounded-2xl p-8 text-center space-y-4">

      <div class="w-24 h-24 mx-auto flex items-center justify-center bg-gray-100 rounded-full">
        <User class="w-12 h-12 text-gray-600" />
      </div>

      <h1 class="text-2xl font-bold">
        {{ user.first_name }} {{ user.last_name }}
      </h1>

      <p class="text-gray-500">{{ user.email }}</p>
      <p class="text-gray-500">Age: {{ user.age }}</p>

      <button
        @click="logout"
        class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Logout
      </button>

    </div>

  </div>

  <LayoutFooter />
</template>