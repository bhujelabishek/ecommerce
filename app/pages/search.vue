<script setup>
const route = useRoute()
const router = useRouter()
const q = ref(route.query.q || '')

const { data: results, pending } = await useFetch('/api/search', {
  key: 'search-results',
  query: { q },
  watch: [q]
})

useHead({ title: computed(() => q.value ? `"${q.value}" — SmokeHaven` : 'Search — SmokeHaven') })

watch(() => route.query.q, (val) => { q.value = val || '' })

const updateSearch = (val) => {
  clearTimeout(window._st)
  window._st = setTimeout(() => { router.push({ query: { q: val } }) }, 300)
}
</script>

<template>
  <LayoutNavbar />

  <div class="bg-gray-950 min-h-screen py-12 px-6">
    <div class="max-w-7xl mx-auto">

      <div class="max-w-2xl mx-auto mb-12">
        <input
          :value="q"
          @input="updateSearch($event.target.value)"
          type="text"
          placeholder="Search hookahs, shisha, charcoal..."
          class="w-full bg-gray-900 border-2 border-gray-700 focus:border-orange-500 text-white placeholder-gray-500 rounded-2xl px-6 py-4 text-lg focus:outline-none transition"
        />
      </div>

      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-black text-white" v-if="q">
            Results for "<span class="text-orange-400">{{ q }}</span>"
          </h1>
          <h1 class="text-2xl font-black text-white" v-else>Search Products</h1>
          <p class="text-sm text-gray-500 mt-1" v-if="results?.length">
            {{ results.length }} products found
          </p>
        </div>
      </div>

      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="aspect-square bg-gray-900 border border-gray-800 rounded-2xl animate-pulse" />
      </div>

      <div v-else-if="!results?.length && q" class="text-center py-20">
        <p class="text-4xl mb-4">🔍</p>
        <p class="text-xl font-bold text-white mb-2">No results for "{{ q }}"</p>
        <p class="text-gray-500 mb-8">Try different keywords</p>
        <NuxtLink to="/products"
          class="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-full transition">
          Browse All Products
        </NuxtLink>
      </div>

      <div v-else-if="!q" class="text-center py-20 text-gray-500">
        <p class="text-4xl mb-4">🔎</p>
        <p>Start typing to search for products</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard v-for="p in results" :key="p.id" :product="p" />
      </div>

    </div>
  </div>

  <LayoutFooter />
</template>