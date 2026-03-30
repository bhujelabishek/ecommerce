<script setup>
definePageMeta({ 
    layout: 'admins'
})

const users = ref([])

onMounted(async () => {
  const res = await $fetch('/api/admin/users')
  users.value = res
})
</script>

<template>
  <div class="p-10">
    <h1 class="text-2xl font-bold">Users</h1>

    <div v-for="u in users" :key="u.id" class="border p-4 mt-2">
      {{ u.email }} - {{ u.role }}
    </div>
  </div>
</template>