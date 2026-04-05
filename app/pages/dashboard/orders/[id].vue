<script setup>
const route = useRoute()
const { token } = useAuth()

const { data: orders } = await useFetch('/api/orders', {
  key: 'user-orders',
  headers: { Authorization: `Bearer ${token.value}` },
  default: () => []
})
useHead({ title: computed(() => `Order #${order.value?.id}`) })

const statusColor = (s) => ({
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700'
}[s] || 'bg-gray-100 text-gray-600')
</script>

<template>
  <LayoutNavbar />
  <LayoutContainer>
    <div class="py-12 max-w-3xl mx-auto">

      <NuxtLink to="/dashboard/orders"
        class="text-sm text-gray-500 hover:underline mb-6 block">
        ← Back to Orders
      </NuxtLink>

      <div v-if="order" class="space-y-6">

        <!-- HEADER -->
        <div class="bg-white border rounded-xl p-6 flex justify-between items-center">
          <div>
            <h1 class="text-xl font-bold">Order #{{ order.id }}</h1>
            <p class="text-sm text-gray-500">
              Placed on {{ new Date(order.created_at).toLocaleDateString() }}
            </p>
          </div>
          <span :class="statusColor(order.status)"
            class="px-4 py-1 rounded-full text-sm font-medium">
            {{ order.status }}
          </span>
        </div>

        <!-- ITEMS -->
        <div class="bg-white border rounded-xl p-6">
          <h2 class="font-bold mb-4">Items</h2>
          <div class="space-y-4">
            <div v-for="item in order.items" :key="item.id"
              class="flex gap-4">
              <img :src="item.image" class="w-16 h-16 object-cover rounded-lg" />
              <div class="flex-1">
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-sm text-gray-500">x{{ item.quantity }}</p>
              </div>
              <p class="font-medium">₨{{ (item.price * item.quantity).toLocaleString() }}</p>
            </div>
          </div>
          <div class="border-t pt-4 mt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>₨{{ Number(order.total_amount).toLocaleString() }}</span>
          </div>
        </div>

        <!-- SHIPPING -->
        <div class="bg-white border rounded-xl p-6">
          <h2 class="font-bold mb-4">Shipping Details</h2>
          <div class="text-sm space-y-1 text-gray-600">
            <p><span class="font-medium text-black">Name:</span> {{ order.full_name }}</p>
            <p><span class="font-medium text-black">Phone:</span> {{ order.phone }}</p>
            <p><span class="font-medium text-black">Address:</span> {{ order.address }}, {{ order.city }}</p>
            <p v-if="order.notes"><span class="font-medium text-black">Notes:</span> {{ order.notes }}</p>
          </div>
        </div>

        <!-- PAYMENT -->
        <div class="bg-white border rounded-xl p-6">
          <h2 class="font-bold mb-4">Payment</h2>
          <div class="text-sm space-y-1 text-gray-600">
            <p><span class="font-medium text-black">Method:</span> {{ order.payment_method }}</p>
            <p><span class="font-medium text-black">Status:</span>
              <span :class="order.payment_status === 'paid' ? 'text-green-600' : 'text-red-500'">
                {{ order.payment_status }}
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  </LayoutContainer>
  <LayoutFooter />
</template>