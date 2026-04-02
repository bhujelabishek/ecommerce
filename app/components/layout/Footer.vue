<!-- components/Layout/Footer.vue -->
<script setup>
const { data: categories } = await useFetch('/api/categories', {
  server: false,
  default: () => []
})

const mainCategories = computed(() =>
  categories.value?.filter(c => !c.parent_id).slice(0, 6) ?? []
)

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-900 text-gray-300 mt-16">

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">

        <!-- BRAND -->
        <div class="space-y-4">
          <h2 class="text-xl font-bold text-white">HookahStore</h2>
          <p class="text-sm text-gray-400 leading-relaxed">
            Nepal's premier destination for hookahs, shisha tobacco, charcoal, and accessories.
          </p>
          <div class="flex gap-3">
            <a href="#" class="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-700 transition text-sm">f</a>
            <a href="#" class="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-700 transition text-sm">in</a>
            <a href="#" class="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-700 transition text-sm">yt</a>
          </div>
        </div>

        <!-- DYNAMIC CATEGORIES -->
        <div>
          <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h3>
          <ul class="space-y-2">
            <li v-for="cat in mainCategories" :key="cat.id">
              <NuxtLink
                :to="`/products?category=${cat.id}`"
                class="text-sm text-gray-400 hover:text-white transition"
              >
                {{ cat.name }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/products" class="text-sm text-gray-400 hover:text-white transition">
                All Products
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- ACCOUNT -->
        <div>
          <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/login" class="text-sm text-gray-400 hover:text-white transition">Login</NuxtLink></li>
            <li><NuxtLink to="/register" class="text-sm text-gray-400 hover:text-white transition">Sign Up</NuxtLink></li>
            <li><NuxtLink to="/dashboard" class="text-sm text-gray-400 hover:text-white transition">My Profile</NuxtLink></li>
            <li><NuxtLink to="/dashboard/orders" class="text-sm text-gray-400 hover:text-white transition">My Orders</NuxtLink></li>
            <li><NuxtLink to="/cart" class="text-sm text-gray-400 hover:text-white transition">Cart</NuxtLink></li>
          </ul>
        </div>

        <!-- CONTACT + NEWSLETTER -->
        <div>
          <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
          <ul class="space-y-2 text-sm text-gray-400 mb-6">
            <li>📍 Kathmandu, Nepal</li>
            <li>📞 +977-98XXXXXXXX</li>
            <li>✉️ support@hookahstore.com</li>
          </ul>

          <h3 class="text-white font-semibold mb-2 text-sm uppercase tracking-wider">Newsletter</h3>
          <div class="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              class="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button class="bg-purple-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-600 transition">
              Join
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- BOTTOM BAR -->
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <p>© {{ currentYear }} HookahStore. All rights reserved.</p>
        <p class="text-center">
          WARNING: This product contains nicotine. Nicotine is an addictive chemical. For adults only.
        </p>
      </div>
    </div>

  </footer>
</template>