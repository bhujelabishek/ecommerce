<script setup>
const { cart, remove } = useCart()
</script>

<template>
  <div>
    <h1 class="text-xl font-bold mb-4">Cart</h1>

    <div v-for="item in cart" :key="item.id" class="flex justify-between mb-2">
      <span>{{ item.name }} x {{ item.qty }}</span>
      <button @click="remove(item.id)">Remove</button>
    </div>

    <NuxtLink to="/checkout" class="bg-black text-white px-4 py-2 mt-4 inline-block">
      Checkout
    </NuxtLink>
  </div>
</template>