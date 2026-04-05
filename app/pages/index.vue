<script setup>
import { ChevronRight, ChevronLeft, Flame, Shield, Truck } from 'lucide-vue-next'

const { data: banners } = await useFetch('/api/banners', {
  key: 'home-banners',
  default: () => []
})
const { data: categories } = await useFetch('/api/categories', {
  key: 'home-categories',
  default: () => []
})
const { data: products } = await useFetch('/api/products', {
  key: 'home-products',
  default: () => []
})

const featured = computed(() => products.value?.slice(0, 6) ?? [])
const mainCategories = computed(() => categories.value?.filter(c => !c.parent_id) ?? [])

useHead({
  title: 'SmokeHaven — Nepal\'s #1 Hookah Store',
  meta: [{ name: 'description', content: 'Premium hookah, shisha tobacco, charcoal and accessories in Nepal.' }]
})

const current = ref(0)
let interval = null
const nextSlide = () => { current.value = (current.value + 1) % (banners.value?.length || 1) }
const prevSlide = () => { current.value = (current.value - 1 + (banners.value?.length || 1)) % (banners.value?.length || 1) }
const goToSlide = (i) => { current.value = i; clearInterval(interval); interval = setInterval(nextSlide, 4000) }
onMounted(() => { interval = setInterval(nextSlide, 4000) })
onUnmounted(() => { clearInterval(interval) })
</script>

<template>
  <LayoutNavbar />

  <div class="bg-gray-950 min-h-screen">

    <!-- HERO SLIDER -->
    <div class="relative w-full h-[620px] overflow-hidden bg-gray-900">
      <div v-if="!banners?.length"
        class="w-full h-full flex flex-col items-center justify-center text-white">
        <div class="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4">
          <Flame class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-5xl font-black mb-3">SmokeHaven</h1>
        <p class="text-gray-400 text-xl mb-8">Nepal's Premium Hookah Store</p>
        <NuxtLink to="/products"
          class="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition">
          Shop Now
        </NuxtLink>
      </div>

      <div v-else class="flex h-full transition-transform duration-700 ease-in-out"
        :style="{ transform: `translateX(-${current * 100}%)` }">
        <div v-for="banner in banners" :key="banner.id"
          class="w-full h-full flex-shrink-0 relative bg-cover bg-center"
          :style="{ backgroundImage: `url(${banner.image})` }">
          <div class="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6"
            :style="{ background: banner.overlay_color || 'rgba(0,0,0,0.6)' }">
            <span class="text-orange-400 text-xs font-bold uppercase tracking-[0.4em] mb-4">SmokeHaven Nepal</span>
            <h1 class="text-5xl md:text-6xl font-black mb-4 leading-tight">{{ banner.title }}</h1>
            <p class="text-lg text-gray-300 mb-10 max-w-xl">{{ banner.subtitle }}</p>
            <NuxtLink :to="banner.button_link || '/products'"
              class="bg-orange-500 hover:bg-orange-400 text-white font-bold px-10 py-4 rounded-full text-sm uppercase tracking-widest transition transform hover:scale-105 shadow-lg shadow-orange-500/30">
              {{ banner.button_text || 'Shop Now' }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <button @click="prevSlide"
        class="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-orange-500/80 backdrop-blur-sm rounded-full flex items-center justify-center transition border border-white/20">
        <ChevronLeft class="text-white w-6 h-6" />
      </button>
      <button @click="nextSlide"
        class="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-orange-500/80 backdrop-blur-sm rounded-full flex items-center justify-center transition border border-white/20">
        <ChevronRight class="text-white w-6 h-6" />
      </button>

      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <button v-for="(_, index) in banners" :key="index" @click="goToSlide(index)"
          class="rounded-full transition-all duration-300 h-2"
          :class="current === index ? 'bg-orange-500 w-8' : 'bg-white/30 hover:bg-white/60 w-2'" />
      </div>
    </div>

    <!-- PROMO STRIP -->
    <div class="bg-orange-500">
      <div class="max-w-7xl mx-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div class="flex items-center justify-center gap-2 text-white text-sm font-semibold">
          <Truck class="w-4 h-4" /> Free Shipping on Orders ₨5000+
        </div>
        <div class="flex items-center justify-center gap-2 text-white text-sm font-semibold">
          <Shield class="w-4 h-4" /> 100% Authentic Products
        </div>
        <div class="flex items-center justify-center gap-2 text-white text-sm font-semibold">
          <Flame class="w-4 h-4" /> Secure eSewa Payments
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6">

      <!-- CATEGORIES -->
      <section class="py-16">
        <div class="flex items-center justify-between mb-10">
          <div>
            <p class="text-orange-400 text-xs uppercase tracking-widest font-bold mb-1">Explore</p>
            <h2 class="text-3xl font-black text-white">Shop by Category</h2>
          </div>
          <NuxtLink to="/products"
            class="flex items-center gap-1 text-sm font-semibold text-orange-400 hover:text-orange-300 transition">
            View All <ChevronRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <NuxtLink v-for="c in mainCategories" :key="c.id"
            :to="`/products?category=${c.id}`"
            class="group relative overflow-hidden rounded-2xl min-h-[140px] flex flex-col justify-end bg-gray-900 border border-gray-800 cursor-pointer hover:border-orange-500 transition duration-300">
            <img v-if="c.image" :src="c.image" :alt="c.name"
              class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div class="relative z-10 p-4">
              <p class="text-white font-bold text-sm uppercase tracking-wide">{{ c.name }}</p>
              <p class="text-orange-400 text-xs mt-0.5">{{ c.subcategories?.length || 0 }} types</p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- FEATURED PRODUCTS -->
      <section class="pb-16">
        <div class="flex items-center justify-between mb-10">
          <div>
            <p class="text-orange-400 text-xs uppercase tracking-widest font-bold mb-1">Handpicked</p>
            <h2 class="text-3xl font-black text-white">Featured Products</h2>
          </div>
          <NuxtLink to="/products"
            class="border border-gray-700 hover:border-orange-500 hover:text-orange-400 text-gray-300 font-bold px-5 py-2 rounded-full text-sm transition duration-300">
            View All
          </NuxtLink>
        </div>

        <div v-if="!products?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="aspect-square bg-gray-900 rounded-2xl animate-pulse border border-gray-800" />
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard v-for="p in featured" :key="p.id" :product="p" />
        </div>
      </section>

      <!-- WHY CHOOSE US -->
      <section class="pb-16">
        <div class="bg-gray-900 border border-gray-800 rounded-3xl p-10 grid md:grid-cols-3 gap-8 text-center">
          <div class="space-y-3">
            <div class="w-14 h-14 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <span class="text-2xl">🏆</span>
            </div>
            <h3 class="font-bold text-lg text-white">Premium Quality</h3>
            <p class="text-gray-500 text-sm">Only authentic products from top global brands like Al Fakher, Khalil Mamoon, and more</p>
          </div>
          <div class="space-y-3">
            <div class="w-14 h-14 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <span class="text-2xl">🚀</span>
            </div>
            <h3 class="font-bold text-lg text-white">Fast Delivery</h3>
            <p class="text-gray-500 text-sm">Quick nationwide shipping across Nepal with real-time order tracking</p>
          </div>
          <div class="space-y-3">
            <div class="w-14 h-14 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <span class="text-2xl">🔒</span>
            </div>
            <h3 class="font-bold text-lg text-white">Secure Payments</h3>
            <p class="text-gray-500 text-sm">Pay safely with eSewa, Khalti or cash on delivery. 100% secure checkout</p>
          </div>
        </div>
      </section>

    </div>
  </div>

  <LayoutFooter />
</template>