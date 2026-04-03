<script setup>
const route = useRoute()
const router = useRouter()

const q = ref(route.query.q || '')
const { data: results, pending, refresh } = await useFetch('/api/search', {
  query: { q },
  watch: [q]
})

useHead({
  title: computed(() => q.value ? `Search: ${q.value} - HookahStore` : 'Search - HookahStore')
})

// sync with URL
watch(() => route.query.q, (val) => {
  q.value = val || ''
})

const updateSearch = useDebounceFn((val) => {
  router.push({ query: { q: val } })
}, 300)
</script>

<template>
  <LayoutNavbar />

  <LayoutContainer>
    <div class="py-10">

      <!-- SEARCH BAR -->
      <div class="max-w-2xl mx-auto mb-10">
        <div class="relative">
          <input
            :value="q"
            @input="updateSearch($event.target.value)"
            type="text"
            placeholder="Search products..."
            class="w-full border-2 border-gray-200 focus:border-purple-600 rounded-xl px-5 py-4 text-lg focus:outline-none transition"
          />
        </div>
      </div>

      <!-- HEADER -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold" v-if="q">
            Results for "{{ q }}"
          </h1>
          <h1 class="text-xl font-bold" v-else>Search Products</h1>
          <p class="text-sm text-gray-500 mt-1" v-if="results">
            {{ results.length }} products found
          </p>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i"
          class="aspect-square bg-gray-100 rounded-xl animate-pulse" />
      </div>

      <!-- NO RESULTS -->
      <div v-else-if="!results?.length && q"
        class="text-center py-20">
        <p class="text-4xl mb-4">🔍</p>
        <p class="text-xl font-bold mb-2">No results for "{{ q }}"</p>
        <p class="text-gray-500 mb-6">Try different keywords or browse our categories</p>
        <NuxtLink to="/products"
          class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
          Browse All Products
        </NuxtLink>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="!q" class="text-center py-20 text-gray-400">
        <p class="text-4xl mb-4">🔎</p>
        <p>Start typing to search for products</p>
      </div>

      <!-- RESULTS GRID -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="p in results"
          :key="p.id"
          :product="p"
        />
      </div>

    </div>
  </LayoutContainer>

  <LayoutFooter />
</template>