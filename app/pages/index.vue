<script setup>
import { ChevronRight, ChevronLeft } from 'lucide-vue-next'

const { data: banners } = await useFetch('/api/banners', {
  default: () => []
})

const { data: categories } = await useFetch('/api/categories', {
  default: () => []
})

const { data: products } = await useFetch('/api/products', {
  default: () => []
})

const featured = computed(() => products.value?.slice(0, 6) ?? [])
const mainCategories = computed(() => categories.value?.filter(c => !c.parent_id) ?? [])

useHead({
  title: 'Home - HookahStore',
  meta: [{
    name: 'description',
    content: 'Discover premium hookah pots, charcoal, and accessories at HookahStore. Best prices in Nepal.'
  }]
})

// ===========================
// SLIDER
// ===========================
const current = ref(0)
let interval = null

const nextSlide = () => {
  current.value = (current.value + 1) % (banners.value?.length || 1)
}
const prevSlide = () => {
  current.value = (current.value - 1 + (banners.value?.length || 1)) % (banners.value?.length || 1)
}
const goToSlide = (i) => {
  current.value = i
  clearInterval(interval)
  interval = setInterval(nextSlide, 4000)
}

onMounted(() => {
  interval = setInterval(nextSlide, 4000)
})
onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <LayoutNavbar />

  <div class="pb-20">

    <!-- ===========================
         HERO SLIDER
    =========================== -->
    <div class="relative w-full h-[620px] overflow-hidden bg-gray-900">

      <!-- empty state -->
      <div v-if="!banners?.length"
        class="w-full h-full flex flex-col items-center justify-center text-white">
        <h1 class="text-5xl font-bold mb-4">HookahStore</h1>
        <p class="text-xl opacity-70 mb-8">Premium Hookah & Accessories</p>
        <NuxtLink to="/products"
          class="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition">
          Shop Now
        </NuxtLink>
      </div>

      <!-- slides -->
      <div v-else
        class="flex h-full transition-transform duration-700 ease-in-out"
        :style="{ transform: `translateX(-${current * 100}%)` }"
      >
        <div
          v-for="banner in banners"
          :key="banner.id"
          class="w-full h-full flex-shrink-0 relative bg-cover bg-center"
          :style="{ backgroundImage: `url(${banner.image})` }"
        >
          <div
            class="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6"
            :style="{ background: banner.overlay_color || 'rgba(0,0,0,0.45)' }"
          >
            <p class="text-xs font-bold uppercase tracking-[0.3em] text-orange-400 mb-3">
              HookahStore
            </p>
            <h1 class="text-5xl md:text-6xl font-black mb-4 leading-tight drop-shadow-xl">
              {{ banner.title }}
            </h1>
            <p class="text-lg md:text-xl opacity-80 mb-10 max-w-xl drop-shadow">
              {{ banner.subtitle }}
            </p>
            <NuxtLink
              :to="banner.button_link || '/products'"
              class="bg-orange-500 hover:bg-orange-400 text-white font-bold px-10 py-4 rounded-full text-sm uppercase tracking-widest transition duration-300 transform hover:scale-105 shadow-lg"
            >
              {{ banner.button_text || 'Shop Now' }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- PREV BUTTON -->
      <button
        @click="prevSlide"
        class="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition duration-300"
      >
        <ChevronLeft class="text-white w-6 h-6" />
      </button>

      <!-- NEXT BUTTON -->
      <button
        @click="nextSlide"
        class="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition duration-300"
      >
        <ChevronRight class="text-white w-6 h-6" />
      </button>

      <!-- DOTS -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <button
          v-for="(_, index) in banners"
          :key="index"
          @click="goToSlide(index)"
          class="rounded-full transition-all duration-300 h-2"
          :class="current === index
            ? 'bg-orange-500 w-8'
            : 'bg-white/50 hover:bg-white/80 w-2'"
        />
      </div>
    </div>

    <!-- ===========================
         PROMO STRIP
    =========================== -->
    <div class="bg-orange-500 text-white">
      <div class="max-w-7xl mx-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm font-semibold">
        <div class="flex items-center justify-center gap-2">
          <span>🚚</span> Free Shipping on Orders $95+
        </div>
        <div class="flex items-center justify-center gap-2">
          <span>✅</span> 100% Authentic Products
        </div>
        <div class="flex items-center justify-center gap-2">
          <span>🔒</span> Secure eSewa Payments
        </div>
      </div>
    </div>

    <LayoutContainer>

      <!-- ===========================
           CATEGORIES GRID
      =========================== -->
      <section class="py-14">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-black text-gray-900">Shop by Category</h2>
            <p class="text-gray-500 mt-1">Explore our full collection</p>
          </div>
          <NuxtLink to="/products"
            class="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1">
            View All <ChevronRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <NuxtLink
            v-for="c in mainCategories"
            :key="c.id"
            :to="`/products?category=${c.id}`"
            class="group relative overflow-hidden rounded-2xl min-h-[130px] flex flex-col justify-end bg-gray-900 cursor-pointer"
          >
            <!-- bg image -->
            <img
              v-if="c.image"
              :src="c.image"
              :alt="c.name"
              class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition duration-500"
            />

            <!-- gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <!-- text -->
            <div class="relative z-10 p-4">
              <p class="text-white font-bold text-sm uppercase tracking-wide">
                {{ c.name }}
              </p>
              <p class="text-white/50 text-xs mt-0.5">
                {{ c.subcategories?.length || 0 }} subcategories
              </p>
            </div>

            <!-- hover border -->
            <div class="absolute inset-0 border-2 border-transparent group-hover:border-orange-500 rounded-2xl transition duration-300" />
          </NuxtLink>
        </div>
      </section>

      <!-- ===========================
           FEATURED PRODUCTS
      =========================== -->
      <section class="py-6">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-black text-gray-900">Featured Products</h2>
            <p class="text-gray-500 mt-1">Hand-picked premium selections</p>
          </div>
          <NuxtLink
            to="/products"
            class="border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 font-bold px-5 py-2 rounded-full text-sm transition duration-300"
          >
            View All
          </NuxtLink>
        </div>

        <div v-if="!products?.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i"
            class="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard v-for="p in featured" :key="p.id" :product="p" />
        </div>
      </section>

      <!-- ===========================
           WHY CHOOSE US BANNER
      =========================== -->
      <section class="py-14">
        <div class="bg-gray-900 rounded-3xl p-10 grid md:grid-cols-3 gap-8 text-center text-white">
          <div class="space-y-3">
            <div class="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              🏆
            </div>
            <h3 class="font-bold text-lg">Premium Quality</h3>
            <p class="text-gray-400 text-sm">Only authentic products from top global brands</p>
          </div>
          <div class="space-y-3">
            <div class="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              🚀
            </div>
            <h3 class="font-bold text-lg">Fast Delivery</h3>
            <p class="text-gray-400 text-sm">Quick shipping across Nepal with tracking</p>
          </div>
          <div class="space-y-3">
            <div class="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              💬
            </div>
            <h3 class="font-bold text-lg">24/7 Support</h3>
            <p class="text-gray-400 text-sm">Always here to help with your hookah needs</p>
          </div>
        </div>
      </section>

    </LayoutContainer>
  </div>

  <LayoutFooter />
</template>