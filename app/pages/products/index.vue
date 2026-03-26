<script setup>
const { products, pending, error } = useProducts()
</script>

<template>
  <LayoutNavbar />
  <div class="max-w-7xl mx-auto px-6 py-12">

    <!-- PAGE TITLE -->
    <h1 class="text-3xl font-bold mb-8">Shop Hookah Products</h1>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">

      <!-- 🧭 SIDEBAR FILTER -->
      <aside class="lg:col-span-1 space-y-8">

        <!-- CATEGORY -->
        <div>
          <h2 class="font-semibold text-lg mb-4">Categories</h2>
          <ul class="space-y-2 text-gray-600">
            <li class="cursor-pointer hover:text-black">Hookah Pots</li>
            <li class="cursor-pointer hover:text-black">Charcoal</li>
            <li class="cursor-pointer hover:text-black">Bowls</li>
            <li class="cursor-pointer hover:text-black">Accessories</li>
          </ul>
        </div>

        <!-- PRICE FILTER -->
        <div>
          <h2 class="font-semibold text-lg mb-4">Price</h2>
          <input type="range" class="w-full" />
          <div class="flex justify-between text-sm text-gray-500 mt-2">
            <span>₨0</span>
            <span>₨5000</span>
          </div>
        </div>

      </aside>

      <!-- 🛍️ PRODUCT GRID -->
      <section class="lg:col-span-3">

        <!-- TOP BAR -->
        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-600">
            Showing {{ products?.length || 0 }} products
          </p>

          <select class="border px-3 py-2 rounded">
            <option>Sort by</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <!-- 🔥 LOADING -->
        <div v-if="pending" class="text-center py-10 text-gray-500">
          Loading products...
        </div>

        <!-- ❌ ERROR -->
        <div v-else-if="error" class="text-center py-10 text-red-500">
          Failed to load products
        </div>

        <!-- ✅ GRID -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          <ProductCard
          v-for="p in products" 
          :key="p.id"
          :product="p"
           />
        </div>

      </section>

    </div>

  </div>
  <LayoutFooter />
</template>