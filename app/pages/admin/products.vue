<script setup>
// const { logout } = useAuth()
definePageMeta({
    layout: 'admins'
})
</script>

<template>
  <div>
    <!-- HEADER -->
    <div class="flex justify-between mb-6">
      <h1 class="text-2xl font-semibold">Products</h1>
      <NuxtLink to="/admin/products/create" class="btn">
        + Add Product
      </NuxtLink>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl border">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-4 text-left">Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr class="border-t">
            <td class="p-4">iPhone 15</td>
            <td>$1200</td>
            <td>50</td>
            <td>
              <NuxtLink to="/admin/products/1">Edit</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.btn {
  @apply bg-black text-white px-4 py-2 rounded-lg;
}
</style>