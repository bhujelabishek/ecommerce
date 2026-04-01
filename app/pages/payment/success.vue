<script setup>
useHead({ title: 'Payment Successful' })

const route = useRoute()
const { token } = useAuth()
const verified = ref(false)
const error = ref(false)

onMounted(async () => {
  const { oid, amt, refId } = route.query

  try {
    await $fetch('/api/orders/verify-esewa', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { oid, amt, refId }
    })
    verified.value = true
  } catch {
    error.value = true
  }
})
</script>

<template>
  <LayoutNavbar />
  <div class="max-w-lg mx-auto py-20 text-center px-6">

    <div v-if="!verified && !error" class="text-gray-500">Verifying payment...</div>

    <div v-else-if="verified" class="space-y-4">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <span class="text-4xl text-green-500">✓</span>
      </div>
      <h1 class="text-2xl font-bold">Payment Successful!</h1>
      <p class="text-gray-500">Your order has been placed and is being processed.</p>
      <div class="flex gap-3 justify-center mt-6">
        <NuxtLink to="/dashboard/orders"
          class="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
          View Orders
        </NuxtLink>
        <NuxtLink to="/products"
          class="border px-6 py-2 rounded-lg hover:bg-gray-50">
          Continue Shopping
        </NuxtLink>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <span class="text-4xl text-red-500">✕</span>
      </div>
      <h1 class="text-2xl font-bold">Payment Failed</h1>
      <p class="text-gray-500">We could not verify your payment. Please try again.</p>
      <NuxtLink to="/checkout"
        class="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 mt-4">
        Try Again
      </NuxtLink>
    </div>
  </div>
  <LayoutFooter />
</template>