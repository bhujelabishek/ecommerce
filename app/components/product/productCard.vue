<template>
  <div class="border rounded-lg p-4 hover:shadow-lg transition flex flex-col">

    <!-- IMAGE -->
    <div class="overflow-hidden rounded">
      <img :src="product.image" class="w-full h-48 object-cover hover:scale-105 transition" />
    </div>

    <!-- INFO -->
    <div class="mt-4 flex-1">
      <h2 class="font-semibold text-lg">{{ product.name }}</h2>
      <p class="text-gray-600 mt-1">₨{{ product.price }}</p>
    </div>

    <!-- ACTION -->
    <div class="mt-4 flex gap-2">
      <button 
        @click="add(product)" 
        class="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Add to Cart
      </button>

      <NuxtLink 
        :to="`/products/${product.id}`"
        class="flex-1 border py-2 rounded text-center hover:bg-gray-100"
      >
        View
      </NuxtLink>
    </div>

  </div>
</template>

<script setup>
defineProps(['product'])
const { add } = useCart()
</script>