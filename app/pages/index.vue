<script setup>
import hero from '~/assets/hero.png'
import { ChevronRight, ChevronLeft } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'


gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  gsap.from('.fade-up', {
    y: 100,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: '.fade-up',
      start: 'top 80%',
    }
  })
})

//fetch categories from category backend 
const {data: categories} = await useFetch('/api/categories')



  //  FETCH PRODUCTS (SSR SAFE)

const { data: products } = await useFetch('/api/products')

const featured = computed(() => {
  return products.value ? products.value.slice(0, 6) : []
})


  // SEO

useHead({
  title: 'Home - HookahStore',
  meta: [
    {
      name: 'description',
      content:
        'Discover premium hookah pots, charcoal, and accessories at HookahStore. Best prices in Nepal with fast shipping.'
    }
  ]
})

// SLIDER LOGIC
const slides = [
  {
    image: hero,
    title: 'Premium Hookah Collection',
    subtitle: 'Experience the smoothest smoke'
  },
  {
    image: hero,
    title: 'Luxury Shisha Flavors',
    subtitle: 'Taste the difference'
  },
  {
    image: hero,
    title: 'Top Accessories',
    subtitle: 'Upgrade your setup'
  }
]

const current = ref(0)
let interval = null

const nextSlide = () => {
  current.value = (current.value + 1) % slides.length
}

const prevSlide = () => {
  current.value = (current.value - 1 + slides.length) % slides.length
}

const goToSlide = (index) => {
  current.value = index
}

onMounted(() => {
  interval = setInterval(nextSlide, 3000)
})

onUnmounted(() => {
  clearInterval(interval)
})


</script>

<template>
  <LayoutNavbar />

  <div class="fade-up space-y-16">

   <!-- HERO SLIDER -->
    <div class="relative w-full h-[600px] overflow-hidden">

      <div
        class="flex transition-transform duration-700 ease-in-out h-full"
        :style="{ transform: `translateX(-${current * 100}%)` }"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="w-full h-full flex-shrink-0 bg-cover bg-center relative"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <div class="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
            <h1 class="text-4xl font-bold mb-2">{{ slide.title }}</h1>
            <p class="text-lg">{{ slide.subtitle }}</p>

            <NuxtLink
              to="/products"
              class="mt-6 bg-yellow-500 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-400"
            >
              Shop Now
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <button
        @click="prevSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black rounded-full"
      >
        <ChevronLeft class="text-white" />
      </button>

      <button
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black rounded-full"
      >
        <ChevronRight class="text-white" />
      </button>

      <!-- Dots -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <span
          v-for="(slide, index) in slides"
          :key="index"
          @click="goToSlide(index)"
          class="w-2 h-2 rounded-full cursor-pointer"
          :class="current === index ? 'bg-white' : 'bg-gray-400'"
        ></span>
      </div>
    </div>

<!-- FEATURED PRODUCTS -->
    <LayoutContainer>
      <section class="fade-up">
        <h2 class="text-2xl font-bold mb-6">Featured Products</h2>

        <div v-if="!products" class="text-gray-500">
          Loading products...
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <ProductCard
            v-for="p in featured"
            :key="p.id"
            :product="p"
          />
        </div>

        <div class="text-center mt-6">
          <NuxtLink
            to="/products"
            class="text-black font-semibold underline"
          >
            View All Products
          </NuxtLink>
        </div>
      </section>

      <!-- CATEGORIES -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Explore Categories</h2>

       <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  <NuxtLink
    v-for="c in categories"
    :key="c.id"
    :to="`/products?category=${c.id}`"
    class="category-card"
  >
    {{ c.name }}
  </NuxtLink>
</div>
      </section>

    </LayoutContainer>
  </div>

  <LayoutFooter />
</template>

<style scoped>
.category-card {
  @apply border py-4 text-center font-medium uppercase 
         hover:shadow-lg transition cursor-pointer;
}
</style>