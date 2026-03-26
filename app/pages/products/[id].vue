<script setup>
const route = useRoute()
const { products } = useProducts()
const { add } = useCart()

const product = computed(() =>
  products.value?.find(p => p.id == route.params.id)
)

// quantity
const qty = ref(1)

const increase = () => qty.value++
const decrease = () => {
  if (qty.value > 1) qty.value--
}

const addToCart = () => {
  add({ ...product.value, qty: qty.value })
}
</script>

<template>
  <LayoutNavbar />
  <!-- <pre>{{ route.params }}</pre>
  <pre>{{ products }}</pre>
  <pre>{{ product }}</pre>
  <div>
  <h1>DEBUG</h1>
  <pre>{{ product }}</pre>
</div> -->

  <!-- LOADING -->
  <div v-if="!product" class="text-center py-20 text-gray-500">
    Loading product...
  </div>

  <!-- PRODUCT -->
  <div v-else class="max-w-7xl mx-auto px-6 py-12">

    <div class="grid md:grid-cols-2 gap-12">

      <!-- IMAGE -->
      <div>
        <img :src="product.image" class="w-full rounded-lg shadow object-cover" />
      </div>

      <!-- INFO -->
      <div class="space-y-6">

        <h1 class="text-3xl font-bold">
          {{ product.name }}
        </h1>

        <p class="text-2xl font-semibold text-gray-800">
          ₨{{ product.price }}
        </p>

        <p class="text-gray-600 leading-relaxed">
          Premium hookah product designed for smooth airflow and rich flavor.
          Perfect for both beginners and experienced users.
        </p>

        <!-- QUANTITY -->
        <div class="flex items-center gap-4">
          <span class="font-medium">Quantity:</span>

          <div class="flex items-center border rounded">
            <button @click="decrease" class="px-3 py-1">-</button>
            <span class="px-4">{{ qty }}</span>
            <button @click="increase" class="px-3 py-1">+</button>
          </div>
        </div>

        <!-- BUTTONS -->
        <div class="flex gap-4">

          <button @click="addToCart" class="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800 transition">
            Add to Cart
          </button>

          <NuxtLink to="/cart" class="flex-1 border py-3 rounded text-center hover:bg-gray-100">
            View Cart
          </NuxtLink>

        </div>

      </div>

    </div>

    <!-- EXTRA DETAILS -->
    <div class="mt-16 border-t pt-10 max-w-3xl">
      <h2 class="text-xl font-bold mb-4">Product Details</h2>

      <p class="text-gray-600 leading-relaxed">
        This hookah pot is crafted using high-quality materials to ensure durability and
        optimal performance. Its sleek design enhances both style and functionality,
        making it ideal for personal or lounge use.
      </p>
    </div>

  </div>

  <LayoutFooter />
</template>