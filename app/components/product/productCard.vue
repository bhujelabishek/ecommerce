<!-- components/ProductCard.vue -->
<script setup>
import { ShoppingCart } from 'lucide-vue-next'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const { add } = useCart()
const added = ref(false)

const addToCart = (e) => {
  e.preventDefault()  // prevent NuxtLink navigation
  e.stopPropagation()

  if (props.product.stock < 1) return

  add({ ...props.product, qty: 1 })

  // ✅ show "Added!" feedback briefly
  added.value = true
  setTimeout(() => { added.value = false }, 1500)
}
</script>

<template>
  <NuxtLink
    :to="`/products/${product.id}`"
    class="group block bg-white border rounded-xl overflow-hidden hover:shadow-lg transition duration-300"
  >
    <!-- IMAGE -->
    <div class="relative overflow-hidden aspect-square bg-gray-50">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
      />

      <!-- OUT OF STOCK BADGE -->
      <div
        v-if="product.stock < 1"
        class="absolute inset-0 bg-black/40 flex items-center justify-center"
      >
        <span class="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
          Out of Stock
        </span>
      </div>

      <!-- ADD TO CART BUTTON — appears on hover -->
      <button
        v-else
        @click="addToCart"
        :class="added
          ? 'bg-green-500 text-white opacity-100'
          : 'bg-black text-white opacity-0 group-hover:opacity-100'"
        class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition duration-300 whitespace-nowrap"
      >
        <ShoppingCart class="w-4 h-4" />
        {{ added ? 'Added!' : 'Add to Cart' }}
      </button>
    </div>

    <!-- INFO -->
    <div class="p-4">
      <!-- category -->
      <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">
        {{ product.category }}
      </p>

      <!-- name -->
      <h3 class="font-semibold text-gray-900 truncate group-hover:text-purple-700 transition">
        {{ product.name }}
      </h3>

      <!-- rating -->
      <div class="flex items-center gap-1 mt-1">
        <span
          v-for="i in 5"
          :key="i"
          :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-200'"
          class="text-sm"
        >★</span>
      </div>

      <!-- price + stock -->
      <div class="flex items-center justify-between mt-2">
        <p class="font-bold text-gray-900">₨{{ Number(product.price).toLocaleString() }}</p>
        <span
          v-if="product.stock > 0 && product.stock <= 5"
          class="text-xs text-red-500 font-medium"
        >
          Only {{ product.stock }} left
        </span>
      </div>
    </div>

  </NuxtLink>
</template>