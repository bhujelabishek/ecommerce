<!-- components/ProductCard.vue -->
<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const { add } = useCart()
const added = ref(false)

const addToCart = (e) => {
  e.preventDefault()
  e.stopPropagation()

  if (props.product.stock < 1) return

  add({ ...props.product, qty: 1 })

  added.value = true
  setTimeout(() => { added.value = false }, 1500)
}
</script>

<template>
  <NuxtLink
    :to="`/products/${product.id}`"
    class="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition duration-300 flex flex-col"
  >
    <!-- IMAGE -->
    <div class="relative overflow-hidden bg-gray-50 aspect-square">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
      />

      <!-- BACK IN STOCK BADGE -->
      <div
        v-if="product.stock > 0"
        class="absolute top-3 left-0"
      >
        <span class="bg-amber-500 text-white text-xs font-bold px-3 py-1 tracking-wider uppercase"
          style="clip-path: polygon(0 0, 100% 0, 95% 100%, 0 100%)">
          In Stock
        </span>
      </div>

      <!-- OUT OF STOCK -->
      <div
        v-else
        class="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        <span class="bg-white text-black text-xs font-bold px-4 py-2 rounded-full tracking-wider uppercase">
          Out of Stock
        </span>
      </div>

      <!-- LOW STOCK WARNING -->
      <div
        v-if="product.stock > 0 && product.stock <= 5"
        class="absolute top-3 right-3"
      >
        <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Only {{ product.stock }} left
        </span>
      </div>
    </div>

    <!-- INFO -->
    <div class="p-4 flex flex-col flex-1">

      <!-- BRAND -->
      <p class="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">
        {{ product.brand || product.category }}
      </p>

      <!-- NAME -->
      <h3 class="font-bold text-gray-900 leading-snug mb-2 group-hover:text-purple-800 transition line-clamp-2">
        {{ product.name }}
      </h3>

      <!-- DESCRIPTION -->
      <p class="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
        {{ product.description }}
      </p>

      <!-- RATING -->
      <div class="flex items-center gap-1 mb-3">
        <span
          v-for="i in 5"
          :key="i"
          :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-200'"
          class="text-sm leading-none"
        >★</span>
        <span class="text-xs text-gray-400 ml-1">({{ product.rating }}/5)</span>
      </div>

      <!-- PRICE -->
      <p class="font-bold text-gray-900 text-lg mb-3">
        ₨{{ Number(product.price).toLocaleString() }}
      </p>

      <!-- ADD TO CART BUTTON -->
      <button
        @click="addToCart"
        :disabled="product.stock < 1"
        :class="[
          'w-full py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
          added
            ? 'bg-green-600 text-white'
            : product.stock < 1
              ? 'bg-gray-200 text-gray-500'
              : 'bg-purple-900 text-white hover:bg-purple-800 active:scale-95'
        ]"
      >
        {{ added ? '✓ Added to Cart' : product.stock < 1 ? 'Out of Stock' : 'Add to Cart' }}
      </button>

    </div>
  </NuxtLink>
</template>