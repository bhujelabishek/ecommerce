<script setup>
const props = defineProps({
  product: { type: Object, required: true }
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
    class="group block bg-gray-900 border border-gray-800 hover:border-orange-500/50 rounded-2xl overflow-hidden transition duration-300 flex flex-col"
  >
    <!-- IMAGE -->
    <div class="relative overflow-hidden aspect-square bg-gray-800">
      <img :src="product.image" :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100" />

      <div v-if="product.stock > 0"
        class="absolute top-3 left-0">
        <span class="bg-orange-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-wide">
          In Stock
        </span>
      </div>

      <div v-else class="absolute inset-0 bg-black/60 flex items-center justify-center">
        <span class="bg-gray-800 text-gray-300 text-xs font-bold px-4 py-2 rounded-full border border-gray-700 uppercase">
          Out of Stock
        </span>
      </div>

      <div v-if="product.stock > 0 && product.stock <= 5" class="absolute top-3 right-3">
        <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {{ product.stock }} left
        </span>
      </div>
    </div>

    <!-- INFO -->
    <div class="p-4 flex flex-col flex-1">
      <p class="text-xs text-orange-400 font-bold uppercase tracking-wide mb-1">
        {{ product.brand || product.category }}
      </p>

      <h3 class="font-bold text-white leading-snug mb-2 group-hover:text-orange-400 transition line-clamp-2">
        {{ product.name }}
      </h3>

      <p class="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
        {{ product.description }}
      </p>

      <div class="flex items-center gap-1 mb-3">
        <span v-for="i in 5" :key="i"
          :class="i <= product.rating ? 'text-orange-400' : 'text-gray-700'"
          class="text-sm leading-none">★</span>
        <span class="text-xs text-gray-600 ml-1">({{ product.rating }}/5)</span>
      </div>

      <p class="font-black text-white text-lg mb-3">
        ₨{{ Number(product.price).toLocaleString() }}
      </p>

      <button
        @click="addToCart"
        :disabled="product.stock < 1"
        :class="[
          'w-full py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed',
          added
            ? 'bg-green-500 text-white'
            : product.stock < 1
              ? 'bg-gray-800 text-gray-500 border border-gray-700'
              : 'bg-orange-500 hover:bg-orange-400 text-white active:scale-95'
        ]"
      >
        {{ added ? '✓ Added!' : product.stock < 1 ? 'Out of Stock' : 'Add to Cart' }}
      </button>
    </div>
  </NuxtLink>
</template>