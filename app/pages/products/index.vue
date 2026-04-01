<script setup>
useHead({
  title: 'Products - HookahStore',
  meta: [{ name: 'description', content: 'Browse our full collection of hookahs, shisha, charcoal and accessories.' }]
})

// ===========================
// FETCH BASE DATA
// ===========================
const { data: allProducts } = await useFetch('/api/products')
const { data: categories } = await useFetch('/api/categories')

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

  <LayoutContainer>
    <div class="py-10">

      <!-- TOP BAR -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">All Products
          <span class="text-base font-normal text-gray-500 ml-2">({{ filteredProducts.length }} results)</span>
        </h1>

        <div class="flex items-center gap-3">
          <!-- SORT -->
          <select
            v-model="sortBy"
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <!-- mobile filter toggle -->
          <button
            @click="showFilters = !showFilters"
            class="md:hidden border px-4 py-2 rounded-lg text-sm"
          >
            Filters
          </button>
        </div>
      </div>

      <div class="flex gap-8">

        <!-- ===========================
             SIDEBAR FILTERS
        =========================== -->
        <aside
          :class="[
            'w-64 shrink-0 space-y-6',
            showFilters ? 'block' : 'hidden md:block'
          ]"
        >

          <!-- RESET -->
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-sm uppercase tracking-wide">Filters</h2>
            <button
              @click="resetFilters"
              class="text-xs text-gray-500 underline hover:text-black"
            >
              Reset all
            </button>
          </div>

          <!-- CATEGORY -->
          <div>
            <h3 class="font-medium mb-3 text-sm">Category</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  v-model="selectedCategory"
                  value=""
                  class="accent-black"
                />
                All Categories
              </label>
              <label
                v-for="c in categories"
                :key="c.id"
                class="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="radio"
                  v-model="selectedCategory"
                  :value="String(c.id)"
                  class="accent-black"
                />
                {{ c.name }}
              </label>
            </div>
          </div>

          <!-- PRICE RANGE -->
          <div>
            <h3 class="font-medium mb-3 text-sm">Price Range</h3>
            <div class="flex items-center gap-2">
              <input
                v-model="minPrice"
                type="number"
                placeholder="Min"
                class="border rounded px-2 py-1 w-full text-sm focus:outline-none"
              />
              <span class="text-gray-400">-</span>
              <input
                v-model="maxPrice"
                type="number"
                placeholder="Max"
                class="border rounded px-2 py-1 w-full text-sm focus:outline-none"
              />
            </div>
          </div>

          <!-- BRAND -->
          <div v-if="brands.length > 0">
            <h3 class="font-medium mb-3 text-sm">Brand</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  v-model="selectedBrand"
                  value=""
                  class="accent-black"
                />
                All Brands
              </label>
              <label
                v-for="brand in brands"
                :key="brand"
                class="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="radio"
                  v-model="selectedBrand"
                  :value="brand"
                  class="accent-black"
                />
                {{ brand }}
              </label>
            </div>
          </div>

        </aside>

        <!-- ===========================
             PRODUCTS GRID
        =========================== -->
        <div class="flex-1">

          <!-- no results -->
          <div
            v-if="filteredProducts.length === 0"
            class="text-center py-20 text-gray-400"
          >
            No products found. Try adjusting your filters.
          </div>

          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ProductCard
              v-for="p in filteredProducts"
              :key="p.id"
              :product="p"
            />
          </div>

        </div>
      </div>
    </div>
  </LayoutContainer>

  <LayoutFooter />
</template>