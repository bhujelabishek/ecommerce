<script setup>
import { ShoppingCart, ChevronDown } from 'lucide-vue-next'

const { isLoggedIn } = useAuth()
const { count } = useCart()

const { data: categories } = await useFetch('/api/categories', {
  server: false,
  default: () => []
})

const activeCategory = ref(null)
const featuredProducts = ref([])
const featuredLoading = ref(false)
let closeTimer = null  // delay timer

const openDropdown = async (category, event) => {
  // cancel any pending close
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }

  if (activeCategory.value?.id === category.id) return

  activeCategory.value = category
  featuredProducts.value = []
  featuredLoading.value = true

  const el = event?.currentTarget
  if (el) {
    const rect = el.getBoundingClientRect()
    document.documentElement.style.setProperty('--dropdown-top', `${rect.bottom}px`)
    document.documentElement.style.setProperty('--dropdown-left', `${rect.left}px`)
  }

  try {
    featuredProducts.value = await $fetch(`/api/categories/${category.id}/featured`)
  } catch {
    featuredProducts.value = []
  } finally {
    featuredLoading.value = false
  }
}

// don't close immediately — wait 150ms
const startClose = () => {
  closeTimer = setTimeout(() => {
    activeCategory.value = null
    featuredProducts.value = []
  }, 150)
}

// cancel or close when mouse enters dropdown
const cancelClose = () => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

const closeDropdown = () => {
  activeCategory.value = null
  featuredProducts.value = []
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

onUnmounted(() => {
  if (closeTimer) clearTimeout(closeTimer)
})
</script>

<template>
  <div class="sticky top-0 z-50">

    <!-- WARNING BAR -->
    <div class="bg-black text-white text-center text-lg font-bold py-3">
      WARNING: This product contains nicotine. Nicotine is an addictive chemical.
    </div>

    <header class="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]">

      <!-- PROMO BAR -->
      <div class="bg-purple-900 text-white text-center text-sm py-2 font-medium">
        Free Shipping $95+ | Code: FREESHIP
      </div>

      <!-- MAIN HEADER -->
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

        <NuxtLink to="/" class="text-2xl font-bold">HookahStore</NuxtLink>

        <div class="flex-1 hidden md:block">
          <input type="text" placeholder="Search..."
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:shadow-[0_0_3px_#3b82f6]" />
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

        <!-- CART BADGE -->
        <NuxtLink to="/cart"
          class="inline-block transition duration-300 transform hover:scale-110 relative">
          <ShoppingCart class="w-6 h-6" />
          <span v-if="count > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {{ count > 99 ? '99+' : count }}
          </span>
        </NuxtLink>

      </div>

      <!-- NAV MENU -->
      <div class="border-t">
        <div class="max-w-7xl mx-auto px-6 flex gap-1 text-sm font-medium overflow-x-auto">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="relative"
            @mouseenter="openDropdown(cat, $event)"
            @mouseleave="startClose" 
          >
            <NuxtLink
              :to="`/products?category=${cat.id}`"
              class="flex items-center gap-1 px-3 py-3 uppercase hover:text-purple-700 whitespace-nowrap transition"
              :class="activeCategory?.id === cat.id ? 'text-purple-700 border-b-2 border-purple-700' : ''"
            >
              {{ cat.name }}
              <ChevronDown class="w-3 h-3" />
            </NuxtLink>
          </div>
        </div>
      </div>

    </header>

    <!-- DROPDOWN TELEPORTED TO BODY  -->
    <Teleport to="body">
      <div
        v-if="activeCategory"
        class="fixed bg-white border shadow-2xl rounded-b-xl"
        style="width: 600px; z-index: 9999; top: var(--dropdown-top, 140px); left: var(--dropdown-left, 0px)"
        @mouseenter="cancelClose"   
        @mouseleave="startClose"    
      >
        <div class="grid grid-cols-3">

          <!-- SUBCATEGORIES -->
          <div class="p-5 border-r">
            <p class="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Browse</p>
            <ul class="space-y-1">
              <li>
                <NuxtLink
                  :to="`/products?category=${activeCategory.id}`"
                  class="text-sm hover:text-purple-700 font-medium block py-1"
                  @click="closeDropdown"
                >
                  Shop All {{ activeCategory.name }}
                </NuxtLink>
              </li>
              <template v-if="activeCategory.subcategories && activeCategory.subcategories.length > 0">
                <li v-for="sub in activeCategory.subcategories" :key="sub.id">
                  <NuxtLink
                    :to="`/products?category=${sub.id}`"
                    class="text-sm text-gray-600 hover:text-purple-700 hover:underline block py-1"
                    @click="closeDropdown"
                  >
                    {{ sub.name }}
                  </NuxtLink>
                </li>
              </template>
              <li v-else class="text-xs text-gray-400 italic pt-1">
                No subcategories
              </li>
            </ul>
          </div>

          <!-- FEATURED PRODUCTS -->
          <div class="p-5 col-span-2">
            <p class="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Featured</p>

            <div v-if="featuredLoading" class="grid grid-cols-3 gap-3">
              <div v-for="i in 3" :key="i"
                class="aspect-square bg-gray-100 rounded-lg animate-pulse" />
            </div>

            <div v-else-if="featuredProducts.length === 0"
              class="text-sm text-gray-400 italic py-4">
              No featured products yet
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
                  <img :src="p.image" :alt="p.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <p class="text-xs font-medium text-gray-800 truncate">{{ p.name }}</p>
                <p class="text-xs text-purple-700 font-semibold">₨{{ p.price }}</p>
              </NuxtLink>
            </div>

            <div v-if="activeCategory.image"
              class="mt-4 rounded-lg overflow-hidden relative h-20">
              <img :src="activeCategory.image" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/40 flex items-center px-4">
                <p class="text-white text-sm font-bold">Shop {{ activeCategory.name }} →</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>
