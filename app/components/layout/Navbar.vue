<script setup>
import { ShoppingCart, ChevronDown, Search, Menu, X, User } from 'lucide-vue-next'

const { isLoggedIn } = useAuth()
const { count } = useCart()

const { data: categories } = await useFetch('/api/categories', {
  server: false,
  default: () => []
})

// ===========================
// MOBILE MENU
// ===========================
const mobileOpen = ref(false)

// ===========================
// SEARCH
// ===========================
const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const showResults = ref(false)
const searchRef = ref(null)
let searchTimer = null

const onSearch = () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  clearTimeout(searchTimer)
  searching.value = true
  searchTimer = setTimeout(async () => {
    try {
      searchResults.value = await $fetch('/api/search', {
        query: { q: searchQuery.value }
      })
    } catch {
      searchResults.value = []
    } finally {
      searching.value = false
    }
  }, 300)
}

const goToSearch = () => {
  if (!searchQuery.value.trim()) return
  closeSearch()
  navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
}

const closeSearch = () => {
  showResults.value = false
}

// ===========================
// DROPDOWN
// ===========================
const activeCategory = ref(null)
const featuredProducts = ref([])
const featuredLoading = ref(false)
let closeTimer = null

const openDropdown = async (category, event) => {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
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

const startClose = () => {
  closeTimer = setTimeout(() => {
    activeCategory.value = null
    featuredProducts.value = []
  }, 150)
}

const cancelClose = () => {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
}

const closeDropdown = () => {
  activeCategory.value = null
  featuredProducts.value = []
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
}

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (searchRef.value && !searchRef.value.contains(e.target)) closeSearch()
  })
})

onUnmounted(() => {
  if (closeTimer) clearTimeout(closeTimer)
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<template>
  <div class="sticky top-0 z-50">

    <!-- WARNING BAR -->
    <div class="bg-orange-600 text-white text-center text-xs font-semibold py-2 tracking-wide">
      WARNING: This product contains nicotine. Nicotine is an addictive chemical.
    </div>

    <header class="bg-gray-950 text-white shadow-xl">

      <!-- TOP BAR -->
      <div class="border-b border-gray-800">
        <div class="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between text-xs text-gray-400">
          <span>Free Shipping on Orders ₨5000+ | Code: <span class="text-orange-400 font-bold">FREESHIP</span></span>
          <div class="flex items-center gap-4">
            <NuxtLink to="/about" class="hover:text-orange-400 transition">About</NuxtLink>
            <span>|</span>
            <NuxtLink to="/dashboard/orders" class="hover:text-orange-400 transition">Track Order</NuxtLink>
            <span>|</span>
            <span class="text-orange-400">Nepal's #1 Hookah Store</span>
          </div>
        </div>
      </div>

      <!-- MAIN HEADER -->
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">

        <!-- LOGO -->
        <NuxtLink to="/" class="flex items-center gap-2 flex-shrink-0">
          <div class="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-black text-lg leading-none">S</span>
          </div>
          <div>
            <span class="text-xl font-black text-white tracking-tight">Smoke</span><span class="text-xl font-black text-orange-400 tracking-tight">Haven</span>
            <p class="text-xs text-gray-500 leading-none -mt-0.5">Premium Hookah Store</p>
          </div>
        </NuxtLink>

        <!-- SEARCH BAR -->
        <div class="flex-1 hidden md:block relative" ref="searchRef">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              @input="onSearch"
              @focus="showResults = true"
              @keydown.enter="goToSearch"
              @keydown.escape="closeSearch"
              type="text"
              placeholder="Search hookahs, shisha, charcoal..."
              class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:bg-gray-900 transition"
            />
            <button @click="goToSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition">
              ↵
            </button>
          </div>

          <!-- SEARCH RESULTS -->
          <Transition name="search-drop">
            <div v-if="showResults && searchQuery.length >= 2"
              class="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 shadow-2xl rounded-xl mt-1 z-50 max-h-96 overflow-y-auto">

              <div v-if="searching" class="p-4 text-sm text-gray-400 text-center">
                Searching...
              </div>

              <div v-else-if="searchResults.length === 0"
                class="p-4 text-sm text-gray-400 text-center">
                No results for "{{ searchQuery }}"
              </div>

              <div v-else>
                <p class="text-xs text-gray-500 px-4 pt-3 pb-1 uppercase tracking-wider">
                  {{ searchResults.length }} results
                </p>
                <NuxtLink
                  v-for="p in searchResults"
                  :key="p.id"
                  :to="`/products/${p.id}`"
                  @click="closeSearch"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition border-t border-gray-800 first:border-t-0"
                >
                  <img :src="p.image" :alt="p.name"
                    class="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-700" />
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm text-white truncate">{{ p.name }}</p>
                    <p class="text-xs text-gray-400">{{ p.category }}</p>
                  </div>
                  <p class="font-bold text-sm text-orange-400 flex-shrink-0">
                    ₨{{ Number(p.price).toLocaleString() }}
                  </p>
                </NuxtLink>

                <div class="p-3 border-t border-gray-800">
                  <button @click="goToSearch"
                    class="w-full text-center text-sm text-orange-400 hover:text-orange-300 font-medium transition">
                    View all results for "{{ searchQuery }}" →
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- RIGHT SIDE -->
        <div class="flex items-center gap-3 flex-shrink-0">

          <!-- AUTH -->
          <template v-if="isLoggedIn">
            <NuxtLink to="/dashboard"
              class="hidden md:flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition border border-gray-700">
              <User class="w-4 h-4 text-orange-400" />
              <span>Account</span>
            </NuxtLink>
          </template>

          <template v-else>
            <NuxtLink to="/login"
              class="hidden md:block text-sm text-gray-300 hover:text-white font-medium transition px-3 py-2">
              Login
            </NuxtLink>
            <NuxtLink to="/register"
              class="hidden md:block bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold px-5 py-2 rounded-xl transition">
              Sign Up
            </NuxtLink>
          </template>

          <!-- CART -->
          <NuxtLink to="/cart"
            class="relative bg-orange-500 hover:bg-orange-400 p-2.5 rounded-xl transition">
            <ShoppingCart class="w-5 h-5 text-white" />
            <span v-if="count > 0"
              class="absolute -top-1.5 -right-1.5 bg-white text-orange-600 text-xs w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-orange-500">
              {{ count > 99 ? '99+' : count }}
            </span>
          </NuxtLink>

          <!-- MOBILE MENU TOGGLE -->
          <button @click="mobileOpen = !mobileOpen"
            class="md:hidden p-2 text-gray-400 hover:text-white transition">
            <X v-if="mobileOpen" class="w-6 h-6" />
            <Menu v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- CATEGORY NAV -->
      <div class="border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-6 flex gap-0 text-sm font-medium overflow-x-auto">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="relative flex-shrink-0"
            @mouseenter="openDropdown(cat, $event)"
            @mouseleave="startClose"
          >
            <NuxtLink
              :to="`/products?category=${cat.id}`"
              class="flex items-center gap-1 px-4 py-3 text-gray-300 hover:text-orange-400 hover:bg-gray-900 whitespace-nowrap transition text-xs uppercase tracking-wider font-semibold"
              :class="activeCategory?.id === cat.id ? 'text-orange-400 bg-gray-900 border-b-2 border-orange-500' : ''"
            >
              {{ cat.name }}
              <ChevronDown
                class="w-3 h-3 transition-transform duration-200"
                :class="activeCategory?.id === cat.id ? 'rotate-180' : ''"
              />
            </NuxtLink>
          </div>

          <div class="ml-auto flex-shrink-0">
            <NuxtLink to="/products"
              class="flex items-center px-4 py-3 text-xs uppercase tracking-wider font-bold text-orange-400 hover:text-orange-300 transition">
              All Products →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- MOBILE MENU -->
      <Transition name="mobile-menu">
        <div v-if="mobileOpen" class="md:hidden border-t border-gray-800 bg-gray-950">
          <div class="px-6 py-4 space-y-1">
            <!-- Mobile search -->
            <div class="relative mb-4">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                @keydown.enter="goToSearch; mobileOpen = false"
                type="text"
                placeholder="Search products..."
                class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <NuxtLink v-for="cat in categories" :key="cat.id"
              :to="`/products?category=${cat.id}`"
              @click="mobileOpen = false"
              class="block py-2 text-gray-300 hover:text-orange-400 text-sm font-medium border-b border-gray-800 transition">
              {{ cat.name }}
            </NuxtLink>

            <div class="pt-4 flex gap-3">
              <NuxtLink v-if="!isLoggedIn" to="/login" @click="mobileOpen = false"
                class="flex-1 text-center py-2.5 border border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
                Login
              </NuxtLink>
              <NuxtLink v-if="!isLoggedIn" to="/register" @click="mobileOpen = false"
                class="flex-1 text-center bg-orange-500 py-2.5 rounded-xl text-sm font-bold transition hover:bg-orange-400">
                Sign Up
              </NuxtLink>
              <NuxtLink v-if="isLoggedIn" to="/dashboard" @click="mobileOpen = false"
                class="flex-1 text-center py-2.5 border border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
                My Account
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>

    </header>

    <!-- CATEGORY DROPDOWN TELEPORTED TO BODY -->
    <Teleport to="body">
      <Transition name="dropdown">
        <div
          v-if="activeCategory"
          class="fixed bg-gray-900 border border-gray-700 shadow-2xl rounded-b-2xl overflow-hidden"
          style="width: 640px; z-index: 9999; top: var(--dropdown-top, 160px); left: var(--dropdown-left, 0px)"
          @mouseenter="cancelClose"
          @mouseleave="startClose"
        >
          <div class="grid grid-cols-3">

            <!-- SUBCATEGORIES -->
            <div class="p-5 border-r border-gray-800">
              <p class="text-xs font-bold uppercase text-orange-400 mb-3 tracking-widest">Browse</p>
              <ul class="space-y-1">
                <li>
                  <NuxtLink
                    :to="`/products?category=${activeCategory.id}`"
                    class="text-sm text-white hover:text-orange-400 font-semibold block py-1.5 transition"
                    @click="closeDropdown"
                  >
                    Shop All {{ activeCategory.name }}
                  </NuxtLink>
                </li>
                <template v-if="activeCategory.subcategories?.length > 0">
                  <li v-for="sub in activeCategory.subcategories" :key="sub.id">
                    <NuxtLink
                      :to="`/products?category=${sub.id}`"
                      class="text-sm text-gray-400 hover:text-orange-400 block py-1.5 transition"
                      @click="closeDropdown"
                    >
                      → {{ sub.name }}
                    </NuxtLink>
                  </li>
                </template>
                <li v-else class="text-xs text-gray-600 italic pt-1">No subcategories</li>
              </ul>
            </div>

            <!-- FEATURED PRODUCTS -->
            <div class="p-5 col-span-2">
              <p class="text-xs font-bold uppercase text-orange-400 mb-3 tracking-widest">Featured</p>

              <div v-if="featuredLoading" class="grid grid-cols-3 gap-3">
                <div v-for="i in 3" :key="i"
                  class="aspect-square bg-gray-800 rounded-xl animate-pulse" />
              </div>

              <div v-else-if="featuredProducts.length === 0"
                class="text-sm text-gray-500 italic py-4">
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
                  <div class="aspect-square overflow-hidden rounded-xl bg-gray-800 mb-2 border border-gray-700">
                    <img :src="p.image" :alt="p.name"
                      class="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100" />
                  </div>
                  <p class="text-xs font-medium text-gray-300 truncate">{{ p.name }}</p>
                  <p class="text-xs text-orange-400 font-bold">₨{{ p.price }}</p>
                </NuxtLink>
              </div>

              <div v-if="activeCategory.image" class="mt-4 rounded-xl overflow-hidden relative h-20">
                <img :src="activeCategory.image" class="w-full h-full object-cover opacity-60" />
                <div class="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-transparent flex items-center px-4">
                  <p class="text-white text-sm font-bold">Shop {{ activeCategory.name }} →</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.dropdown-enter-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-leave-active { transition: all 0.15s ease-in; }
.dropdown-enter-from { opacity: 0; transform: translateY(-10px) scaleY(0.95); transform-origin: top; }
.dropdown-leave-to { opacity: 0; transform: translateY(-4px); transform-origin: top; }

.search-drop-enter-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.search-drop-leave-active { transition: all 0.1s ease-in; }
.search-drop-enter-from { opacity: 0; transform: translateY(-6px); }
.search-drop-leave-to { opacity: 0; }

.mobile-menu-enter-active { transition: all 0.2s ease-out; }
.mobile-menu-leave-active { transition: all 0.15s ease-in; }
.mobile-menu-enter-from { opacity: 0; transform: translateY(-10px); }
.mobile-menu-leave-to { opacity: 0; transform: translateY(-5px); }
</style>