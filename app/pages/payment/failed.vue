<script setup>
useHead({ title: 'Payment Failed' })
</script>

<template>
  <LayoutNavbar />
  <div class="max-w-lg mx-auto py-20 text-center px-6 space-y-4">
    <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
      <span class="text-4xl text-red-500">✕</span>
    </div>
    <h1 class="text-2xl font-bold">Payment Cancelled</h1>
    <p class="text-gray-500">Your payment was cancelled. Your order has not been placed.</p>
    <div class="flex gap-3 justify-center mt-6">
      <NuxtLink to="/checkout"
        class="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
        Try Again
      </NuxtLink>
      <NuxtLink to="/cart" class="border px-6 py-2 rounded-lg hover:bg-gray-50">
        Back to Cart
      </NuxtLink>
    </div>
  </div>
  <LayoutFooter />
</template>