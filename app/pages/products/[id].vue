<!-- pages/products/[id].vue -->
<script setup>
const route = useRoute()

// ✅ fetch directly by ID instead of useProducts()
const { data: product } = await useFetch(`/api/products/${route.params.id}`)

// SEO
useHead({
  title: computed(() => product.value ? `${product.value.name} - HookahStore` : 'Product'),
  meta: [
    {
      name: 'description',
      content: computed(() => product.value?.description || 'Premium hookah product')
    }
  ]
})

const qty = ref(1)
const increase = () => qty.value++
const decrease = () => { if (qty.value > 1) qty.value-- }

const { add } = useCart()

const addToCart = () => {
  if (!product.value) return

  // ✅ stock check
  if (product.value.stock < 1) {
    alert('This product is out of stock')
    return
  }

  add({ ...product.value, qty: qty.value })
  alert('Added to cart!')
}
</script>

<template>
  <LayoutNavbar />

  <div v-if="!product" class="text-center py-20 text-gray-500">
    Loading product...
  </div>

  <div v-else class="max-w-7xl mx-auto px-6 py-12">
    <div class="grid md:grid-cols-2 gap-12">

      <!-- IMAGE -->
      <div>
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full rounded-lg object-cover"
        />
      </div>

      <!-- INFO -->
      <div class="space-y-6">

        <!-- breadcrumb -->
        <p class="text-sm text-gray-400">
          <NuxtLink to="/products" class="hover:underline">Products</NuxtLink>
          / {{ product.category }}
        </p>

        <h1 class="text-3xl font-bold">{{ product.name }}</h1>

        <!-- rating -->
        <div class="flex items-center gap-1">
          <span
            v-for="i in 5"
            :key="i"
            :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-300'"
          >★</span>
          <span class="text-sm text-gray-500 ml-1">({{ product.rating }}/5)</span>
        </div>

        <p class="text-2xl font-semibold">₨{{ product.price }}</p>

        <!-- ✅ use actual description -->
        <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>

        <!-- stock badge -->
        <div>
          <span
            v-if="product.stock > 0"
            class="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full"
          >
            In Stock ({{ product.stock }} left)
          </span>
          <span
            v-else
            class="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full"
          >
            Out of Stock
          </span>
        </div>

        <!-- QUANTITY -->
        <div class="flex items-center gap-4">
          <span class="font-medium">Quantity:</span>
          <div class="flex items-center border rounded">
            <button @click="decrease" class="px-3 py-2 hover:bg-gray-100">-</button>
            <span class="px-4">{{ qty }}</span>
            <button @click="increase" class="px-3 py-2 hover:bg-gray-100">+</button>
          </div>
        </div>

        <!-- BUTTONS -->
        <div class="flex gap-4">
          <button
            @click="addToCart"
            :disabled="product.stock < 1"
            class="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>

          <NuxtLink
            to="/cart"
            class="flex-1 border py-3 rounded text-center hover:bg-gray-100"
          >
            View Cart
          </NuxtLink>
        </div>

      </div>
    </div>

    <!-- PRODUCT DETAILS -->
    <div class="mt-16 border-t pt-10 max-w-3xl">
      <h2 class="text-xl font-bold mb-4">Product Details</h2>
      <table class="w-full text-sm text-gray-600">
        <tr class="border-b">
          <td class="py-2 font-medium w-32">Category</td>
          <td class="py-2">{{ product.category }}</td>
        </tr>
        <tr class="border-b">
          <td class="py-2 font-medium">Stock</td>
          <td class="py-2">{{ product.stock }} units</td>
        </tr>
        <tr class="border-b" v-if="product.brand">
          <td class="py-2 font-medium">Brand</td>
          <td class="py-2">{{ product.brand }}</td>
        </tr>
        <tr>
          <td class="py-2 font-medium">Rating</td>
          <td class="py-2">{{ product.rating }} / 5</td>
        </tr>
      </table>
    </div>

  </div>

  <LayoutFooter />
</template>