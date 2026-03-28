<script setup>
definePageMeta({
    layout: 'admins'
     })
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Orders</h1>

    <div class="bg-white rounded-xl border">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-4">Order ID</th>
            <th>User</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          <tr class="border-t">
            <td class="p-4">#123</td>
            <td>John</td>
            <td class="text-yellow-500">Pending</td>
            <td>$120</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>