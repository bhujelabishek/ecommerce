<script setup>
import { ShoppingCart, ChevronDown } from 'lucide-vue-next'

const { isLoggedIn } = useAuth()

// fetch categories with subcategories
const { data: categories } = await useFetch('/api/categories')

// track which dropdown is open
const activeCategory = ref(null)
const featuredProducts = ref([])

const openDropdown = async (category) => {
  activeCategory.value = category

  // fetch featured products for this category
  const res = await $fetch(`/api/categories/${category.id}/featured`)
  featuredProducts.value = res
}

const closeDropdown = () => {
  activeCategory.value = null
  featuredProducts.value = []
}
</script>

<template>
  <div class="bg-black text-white text-center text-2xl font-bold py-4 m-1">
    WARNING: This product contains nicotine. Nicotine is an addictive chemical.
  </div>

  <header class="sticky top-0 z-50 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]">

    <!-- PROMO BAR -->
    <div class="bg-purple-900 text-white text-center text-sm py-2 font-medium">
      Free Shipping $95+ | Code: FREESHIP
    </div>

    <!-- MAIN HEADER -->
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

      <NuxtLink to="/" class="text-2xl font-bold">HookahStore</NuxtLink>

      <div class="flex-1 hidden md:block">
        <input
          type="text"
          placeholder="Search..."
          class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:shadow-[0_0_3px_#3b82f6]"
        />
      </div>

      <template v-if="isLoggedIn">
        <NuxtLink to="/dashboard"
          class="px-6 py-2 rounded-full border border-gray-300 hover:bg-black hover:text-white transition duration-300">
          Profile
        </NuxtLink>
      </template>

      <template v-else>
        <div class="flex items-center gap-4">
          <NuxtLink to="/login"
            class="px-6 py-2 rounded-full border border-gray-300 hover:bg-black hover:text-white transition duration-300">
            Login
          </NuxtLink>
          <NuxtLink to="/register"
            class="px-6 py-2 rounded-full text-white bg-black border border-gray-300 hover:bg-white hover:text-black transition duration-300">
            SignUp
          </NuxtLink>
        </div>
      </template>

      <NuxtLink to="/cart" class="inline-block transition duration-300 transform hover:scale-110 relative">
        <ShoppingCart class="w-6 h-6" />
      </NuxtLink>
    </div>

    <!-- NAV MENU WITH DROPDOWNS -->
    <div class="border-t" @mouseleave="closeDropdown">
      <div class="max-w-7xl mx-auto px-6 flex gap-1 text-sm font-medium overflow-x-auto">

        <div
          v-for="cat in categories"
          :key="cat.id"
          class="relative"
          @mouseenter="openDropdown(cat)"
        >
          <!-- NAV ITEM -->
          <NuxtLink
            :to="`/products?category=${cat.id}`"
            class="flex items-center gap-1 px-3 py-3 uppercase hover:text-purple-700 whitespace-nowrap transition"
            :class="activeCategory?.id === cat.id ? 'text-purple-700 border-b-2 border-purple-700' : ''"
          >
            {{ cat.name }}
            <ChevronDown class="w-3 h-3" />
          </NuxtLink>

          <!-- DROPDOWN PANEL -->
          <div
            v-if="activeCategory?.id === cat.id"
            class="absolute top-full left-0 z-50 bg-white border shadow-xl rounded-b-xl"
            style="width: 600px"
          >
            <div class="grid grid-cols-3 gap-0">

              <!-- SUBCATEGORIES -->
              <div class="p-5 border-r">
                <p class="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Browse</p>
                <ul class="space-y-2">
                  <li>
                    <NuxtLink
                      :to="`/products?category=${cat.id}`"
                      class="text-sm hover:text-purple-700 font-medium"
                      @click="closeDropdown"
                    >
                      Shop All {{ cat.name }}
                    </NuxtLink>
                  </li>
                  <li
                    v-for="sub in cat.subcategories"
                    :key="sub.id"
                  >
                    <NuxtLink
                      :to="`/products?category=${sub.id}`"
                      class="text-sm text-gray-600 hover:text-purple-700 hover:underline"
                      @click="closeDropdown"
                    >
                      {{ sub.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>

              <!-- FEATURED PRODUCTS -->
              <div class="p-5 col-span-2">
                <p class="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Featured</p>

                <div v-if="featuredProducts.length === 0" class="text-sm text-gray-400">
                  Loading...
                </div>

                <div v-else class="grid grid-cols-3 gap-3">
                  <NuxtLink
                    v-for="p in featuredProducts"
                    :key="p.id"
                    :to="`/products/${p.id}`"
                    class="group text-center"
                    @click="closeDropdown"
                  >
                    <div class="aspect-square overflow-hidden rounded-lg bg-gray-50 mb-2">
                      <img
                        :src="p.image"
                        :alt="p.name"
                        class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <p class="text-xs font-medium text-gray-800 truncate">{{ p.name }}</p>
                    <p class="text-xs text-purple-700 font-semibold">₨{{ p.price }}</p>
                  </NuxtLink>
                </div>

                <!-- PROMO BANNER -->
                <div
                  v-if="cat.image"
                  class="mt-4 rounded-lg overflow-hidden relative h-20"
                >
                  <img :src="cat.image" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 flex items-center px-4">
                    <p class="text-white text-sm font-bold">Shop {{ cat.name }} →</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      
      </div>
    </div>

  </header>
</template>