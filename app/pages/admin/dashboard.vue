
<script setup>
// const { logout } = useAuth()
definePageMeta({
  layout: 'admins',   
  middleware: 'auth'
})

const users = ref([])

// Fetch all users
const fetchUsers = async () => {
    users.value = await $fetch('/api/admin/userss')
}
onMounted(fetchUsers)

const products=ref([]);

const fetchProducts = async () => {
    const res = await $fetch('/api/admin/products')
    products.value = res
}

onMounted(fetchProducts)

</script>

<template>
  <!-- STATS -->
  
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

    <div class="card">
      <p>Revenue</p>
      <h2>$12,400</h2>
    </div>

    <div class="card">
      <p>Orders</p>
      <h2>320</h2>
    </div>


    <div class="card">
      <p>Total Users</p>
      <h2>{{ users.length }}</h2>
    </div>

    <div class="card">
      <p>Products</p>
      <h2>{{products.length}}</h2>
    </div>

  </div>
</template>

<style scoped>
.card {
  @apply bg-white p-6 rounded-2xl border shadow-sm;
}
</style>