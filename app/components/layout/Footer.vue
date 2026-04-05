<script setup>
const { data: categories } = await useFetch('/api/categories', {
  server: false,
  default: () => []
})

const mainCategories = computed(() =>
  categories.value?.filter(c => !c.parent_id).slice(0, 5) ?? []
)

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-950 text-gray-400 border-t border-gray-800">

    <!-- MAIN FOOTER -->
    <div class="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

      <!-- BRAND -->
      <div class="lg:col-span-1 space-y-4">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-black text-lg leading-none">S</span>
          </div>
          <div>
            <span class="text-xl font-black text-white">Smoke</span><span class="text-xl font-black text-orange-400">Haven</span>
          </div>
        </NuxtLink>
        <p class="text-sm leading-relaxed text-gray-500">
          Nepal's premier hookah and shisha store. We bring you authentic products from the world's top brands, delivered to your doorstep.
        </p>
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-orange-400">📍</span>
            <span>Kathmandu, Nepal</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-orange-400">📞</span>
            <span>+977-9800000000</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-orange-400">✉️</span>
            <span>hello@smokehaven.com.np</span>
          </div>
        </div>
      </div>

      <!-- SHOP CATEGORIES -->
      <div class="space-y-4">
        <h3 class="text-white font-bold uppercase tracking-widest text-xs">Shop</h3>
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/products" class="text-sm hover:text-orange-400 transition flex items-center gap-1">
              <span class="text-orange-500 text-xs">→</span> All Products
            </NuxtLink>
          </li>
          <li v-for="cat in mainCategories" :key="cat.id">
            <NuxtLink
              :to="`/products?category=${cat.id}`"
              class="text-sm hover:text-orange-400 transition flex items-center gap-1"
            >
              <span class="text-orange-500 text-xs">→</span> {{ cat.name }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/search" class="text-sm hover:text-orange-400 transition flex items-center gap-1">
              <span class="text-orange-500 text-xs">→</span> Search Products
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- CUSTOMER SERVICE -->
      <div class="space-y-4">
        <h3 class="text-white font-bold uppercase tracking-widest text-xs">Customer Service</h3>
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/dashboard/orders" class="text-sm hover:text-orange-400 transition flex items-center gap-1">
              <span class="text-orange-500 text-xs">→</span> Track My Order
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/dashboard" class="text-sm hover:text-orange-400 transition flex items-center gap-1">
              <span class="text-orange-500 text-xs">→</span> My Account
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/cart" class="text-sm hover:text-orange-400 transition flex items-center gap-1">
              <span class="text-orange-500 text-xs">→</span> Shopping Cart
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/register" class="text-sm hover:text-orange-400 transition flex items-center gap-1">
              <span class="text-orange-500 text-xs">→</span> Create Account
            </NuxtLink>
          </li>
          <li>
            <a href="mailto:hello@smokehaven.com.np" class="text-sm hover:text-orange-400 transition flex items-center gap-1">
              <span class="text-orange-500 text-xs">→</span> Contact Us
            </a>
          </li>
        </ul>
      </div>

      <!-- POLICIES + PAYMENT -->
      <div class="space-y-4">
        <h3 class="text-white font-bold uppercase tracking-widest text-xs">Information</h3>
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/about" class="text-sm hover:text-orange-400 transition flex items-center gap-1">
              <span class="text-orange-500 text-xs">→</span> About Us
            </NuxtLink>
          </li>
          <li>
            <a href="#" class="text-sm hover:text-orange-400 transition flex items-center gap-1">
              <span class="text-orange-500 text-xs">→</span> Shipping Policy
            </a>
          </li>
          <li>
            <a href="#" class="text-sm hover:text-orange-400 transition flex items-center gap-1">
              <span class="text-orange-500 text-xs">→</span> Return Policy
            </a>
          </li>
          <li>
            <a href="#" class="text-sm hover:text-orange-400 transition flex items-center gap-1">
              <span class="text-orange-500 text-xs">→</span> Privacy Policy
            </a>
          </li>
        </ul>

        <!-- PAYMENT METHODS -->
        <div class="pt-2">
          <p class="text-xs text-gray-600 uppercase tracking-widest mb-3">We Accept</p>
          <div class="flex gap-2 flex-wrap">
            <div class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs font-bold text-green-400">
              eSewa
            </div>
            <div class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs font-bold text-blue-400">
              Khalti
            </div>
            <div class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-300">
              Cash on Delivery
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- PROMO STRIP -->
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
        <div class="flex items-center justify-center gap-2 text-gray-400">
          <span class="text-orange-400 text-base">🚚</span>
          <div class="text-left">
            <p class="font-bold text-white text-sm">Free Shipping</p>
            <p>On orders over ₨5,000</p>
          </div>
        </div>
        <div class="flex items-center justify-center gap-2 text-gray-400">
          <span class="text-orange-400 text-base">🔒</span>
          <div class="text-left">
            <p class="font-bold text-white text-sm">Secure Payments</p>
            <p>eSewa & Khalti protected</p>
          </div>
        </div>
        <div class="flex items-center justify-center gap-2 text-gray-400">
          <span class="text-orange-400 text-base">✅</span>
          <div class="text-left">
            <p class="font-bold text-white text-sm">100% Authentic</p>
            <p>All products verified genuine</p>
          </div>
        </div>
      </div>
    </div>

    <!-- BOTTOM BAR -->
    <div class="border-t border-gray-800 bg-black">
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <p>© {{ year }} SmokeHaven Nepal. All rights reserved.</p>
        <p class="text-center">
          Must be 18+ to purchase. Contains nicotine — an addictive substance.
        </p>
        <div class="flex gap-4">
          <a href="#" class="hover:text-orange-400 transition">Terms</a>
          <a href="#" class="hover:text-orange-400 transition">Privacy</a>
          <a href="#" class="hover:text-orange-400 transition">Sitemap</a>
        </div>
      </div>
    </div>

  </footer>
</template>