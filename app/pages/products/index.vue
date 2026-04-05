<script setup>
useHead({
  title: 'Products - HookahStore',
  meta: [{ name: 'description', content: 'Browse our full collection of hookahs, shisha, charcoal and accessories.' }]
})

// ===========================
// FETCH BASE DATA
// ===========================
const { data: allProducts } = await useFetch('/api/products', {
  key: 'products-listing',
  default: () => []
})
const { data: categories } = await useFetch('/api/categories', {
  key: 'products-categories',
  default: () => []
})

// ===========================
// FILTERS STATE
// ===========================
const route = useRoute()
const router = useRouter()

const selectedCategory = ref(route.query.category || '')
const selectedBrand = ref(route.query.brand || '')
const minPrice = ref(route.query.minPrice || '')
const maxPrice = ref(route.query.maxPrice || '')
const sortBy = ref(route.query.sort || 'newest')

// ===========================
// BRANDS - extract from products dynamically
// ===========================
const brands = computed(() => {
  if (!allProducts.value) return []
  const b = allProducts.value
    .map(p => p.brand)
    .filter(Boolean)
  return [...new Set(b)]
})

// ===========================
// FILTERED + SORTED PRODUCTS
// ===========================
const filteredProducts = computed(() => {
  if (!allProducts.value) return []

  let list = [...allProducts.value]

  // category filter
  if (selectedCategory.value) {
    list = list.filter(p => String(p.category_id) === String(selectedCategory.value))
  }

  // brand filter
  if (selectedBrand.value) {
    list = list.filter(p => p.brand === selectedBrand.value)
  }

  // price filter
  if (minPrice.value !== '') {
    list = list.filter(p => Number(p.price) >= Number(minPrice.value))
  }
  if (maxPrice.value !== '') {
    list = list.filter(p => Number(p.price) <= Number(maxPrice.value))
  }

  // sort
  if (sortBy.value === 'price_asc') {
    list.sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sortBy.value === 'price_desc') {
    list.sort((a, b) => Number(b.price) - Number(a.price))
  } else {
    // newest — default (API already returns newest first)
  }

  return list
})

// ===========================
// SYNC FILTERS TO URL
// ===========================
const applyFilters = () => {
  router.push({
    query: {
      ...(selectedCategory.value && { category: selectedCategory.value }),
      ...(selectedBrand.value && { brand: selectedBrand.value }),
      ...(minPrice.value && { minPrice: minPrice.value }),
      ...(maxPrice.value && { maxPrice: maxPrice.value }),
      ...(sortBy.value && { sort: sortBy.value }),
    }
  })
}

const resetFilters = () => {
  selectedCategory.value = ''
  selectedBrand.value = ''
  minPrice.value = ''
  maxPrice.value = ''
  sortBy.value = 'newest'
  router.push({ query: {} })
}

// watch filters to auto apply
watch([selectedCategory, selectedBrand, minPrice, maxPrice, sortBy], applyFilters)

// mobile filter sidebar toggle
const showFilters = ref(false)
</script>

<template>
  <LayoutNavbar />

  <div class="bg-gray-950 min-h-screen py-10 px-6">
    <div class="max-w-7xl mx-auto">

      <!-- TOP BAR -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="text-orange-400 text-xs uppercase tracking-widest font-bold mb-1">Catalogue</p>
          <h1 class="text-3xl font-black text-white">All Products
            <span class="text-base font-normal text-gray-500 ml-2">({{ filteredProducts.length }})</span>
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <select v-model="sortBy"
            class="bg-gray-900 border border-gray-700 text-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <button @click="showFilters = !showFilters"
            class="md:hidden bg-gray-900 border border-gray-700 px-4 py-2 rounded-xl text-sm text-gray-300">
            Filters
          </button>
        </div>
      </div>

      <div class="flex gap-8">

        <!-- SIDEBAR -->
        <aside :class="['w-60 shrink-0 space-y-6', showFilters ? 'block' : 'hidden md:block']">

          <div class="flex items-center justify-between">
            <h2 class="font-bold text-sm uppercase tracking-wide text-gray-400">Filters</h2>
            <button @click="resetFilters"
              class="text-xs text-orange-400 hover:text-orange-300 transition underline">
              Reset all
            </button>
          </div>

          <!-- CATEGORY -->
          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2">
            <h3 class="font-bold text-sm text-white mb-3">Category</h3>
            <label class="flex items-center gap-2 text-sm cursor-pointer text-gray-400 hover:text-white transition">
              <input type="radio" v-model="selectedCategory" value="" class="accent-orange-500" />
              All Categories
            </label>
            <label v-for="c in categories?.filter(c => !c.parent_id)" :key="c.id"
              class="flex items-center gap-2 text-sm cursor-pointer text-gray-400 hover:text-white transition">
              <input type="radio" v-model="selectedCategory" :value="String(c.id)" class="accent-orange-500" />
              {{ c.name }}
            </label>
          </div>

          <!-- PRICE RANGE -->
          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h3 class="font-bold text-sm text-white mb-3">Price Range</h3>
            <div class="flex items-center gap-2">
              <input v-model="minPrice" type="number" placeholder="Min"
                class="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-3 py-2 w-full text-xs focus:outline-none focus:border-orange-500" />
              <span class="text-gray-600">-</span>
              <input v-model="maxPrice" type="number" placeholder="Max"
                class="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-3 py-2 w-full text-xs focus:outline-none focus:border-orange-500" />
            </div>
          </div>

          <!-- BRAND -->
          <div v-if="brands.length > 0" class="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2">
            <h3 class="font-bold text-sm text-white mb-3">Brand</h3>
            <label class="flex items-center gap-2 text-sm cursor-pointer text-gray-400 hover:text-white transition">
              <input type="radio" v-model="selectedBrand" value="" class="accent-orange-500" />
              All Brands
            </label>
            <label v-for="brand in brands" :key="brand"
              class="flex items-center gap-2 text-sm cursor-pointer text-gray-400 hover:text-white transition">
              <input type="radio" v-model="selectedBrand" :value="brand" class="accent-orange-500" />
              {{ brand }}
            </label>
          </div>

        </aside>

        <!-- GRID -->
        <div class="flex-1">
          <div v-if="filteredProducts.length === 0"
            class="text-center py-20 text-gray-500">
            <p class="text-4xl mb-3">🔍</p>
            <p class="text-lg font-bold text-white mb-1">No products found</p>
            <p>Try adjusting your filters</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard v-for="p in filteredProducts" :key="p.id" :product="p" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <LayoutFooter />
</template>