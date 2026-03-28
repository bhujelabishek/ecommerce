
<script setup>
// const { logout } = useAuth()
definePageMeta({
    layout: 'admins'
})
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
      <p>Users</p>
      <h2>1,200</h2>
    </div>

    <div class="card">
      <p>Products</p>
      <h2>85</h2>
    </div>

  </div>
</template>

<style scoped>
.card {
  @apply bg-white p-6 rounded-2xl border shadow-sm;
}
</style>