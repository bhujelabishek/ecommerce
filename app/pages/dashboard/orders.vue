<script setup>
useHead({ title: 'My Orders' })
const { token } = useAuth()

const { data: orders } = await useFetch('/api/orders', {
  headers: { Authorization: `Bearer ${token.value}` }
})

const statusColor = (status) => ({
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700'
}[status] || 'bg-gray-100 text-gray-600')
</script>

<template>
  <LayoutNavbar />
  <LayoutContainer>
    <div class="py-12">
      <h1 class="text-2xl font-bold mb-8">My Orders</h1>

      <div v-if="!orders?.length" class="text-center py-20 text-gray-400">
        You have no orders yet.
        <NuxtLink to="/products" class="block mt-4 text-black underline">Start Shopping</NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <NuxtLink
          v-for="order in orders"
          :key="order.id"
          :to="`/dashboard/orders/${order.id}`"
          class="block bg-white border rounded-xl p-5 hover:shadow-md transition"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">Order #{{ order.id }}</p>
              <p class="text-sm text-gray-500">
                {{ new Date(order.created_at).toLocaleDateString() }}
              </p>
            </div>
            <div class="text-right space-y-1">
              <span :class="statusColor(order.status)"
                class="text-xs px-3 py-1 rounded-full font-medium">
                {{ order.status }}
              </span>
              <p class="font-bold text-sm">₨{{ Number(order.total_amount).toLocaleString() }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </LayoutContainer>
  <LayoutFooter />
</template>