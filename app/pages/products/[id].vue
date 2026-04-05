<script setup>
const route = useRoute()
const { token, user } = useAuth()

// ✅ server:false for reviews to avoid SSR route conflict
const { data: product, refresh: refreshProduct } = await useFetch(
  `/api/products/${route.params.id}`,
  {
    key: `product-${route.params.id}`,
    default: () => null
  }
)
const { data: reviews, refresh: refreshReviews } = await useFetch(
  `/api/products/${route.params.id}/reviews`,
  {
    key: `reviews-${route.params.id}`,
    server: false,
    default: () => []
  }
)

useHead({
  title: computed(() => product.value ? `${product.value.name} - HookahStore` : 'Product'),
  meta: [{ name: 'description', content: computed(() => product.value?.description || '') }]
})

const qty = ref(1)
const increase = () => qty.value++
const decrease = () => { if (qty.value > 1) qty.value-- }

const { add } = useCart()
const added = ref(false)

const addToCart = () => {
  if (!product.value || product.value.stock < 1) return
  add({ ...product.value, qty: qty.value })
  added.value = true
  setTimeout(() => added.value = false, 1500)
}

// ===========================
// REVIEWS
// ===========================
const reviewForm = reactive({ rating: 0, comment: '' })
const reviewHover = ref(0)
const submitting = ref(false)
const reviewError = ref('')
const reviewSuccess = ref(false)

const avgRating = computed(() => {
  if (!reviews.value?.length) return 0
  return (reviews.value.reduce((s, r) => s + r.rating, 0) / reviews.value.length).toFixed(1)
})

const ratingCounts = computed(() => {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.value?.forEach(r => counts[r.rating]++)
  return counts
})

const submitReview = async () => {
  if (!token.value) { reviewError.value = 'Please login to leave a review'; return }
  if (!reviewForm.rating) { reviewError.value = 'Please select a rating'; return }
  submitting.value = true
  reviewError.value = ''
  try {
    await $fetch(`/api/products/${route.params.id}/reviews`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { rating: reviewForm.rating, comment: reviewForm.comment }
    })
    reviewForm.rating = 0
    reviewForm.comment = ''
    reviewSuccess.value = true
    await refreshReviews()
    await refreshProduct()
    setTimeout(() => reviewSuccess.value = false, 3000)
  } catch (err) {
    reviewError.value = err?.data?.message || 'Failed to submit review'
  }
  submitting.value = false
}
</script>

<template>
  <LayoutNavbar />

  <div v-if="!product" class="text-center py-20 text-gray-500">Loading...</div>

  <div v-else class="max-w-7xl mx-auto px-6 py-12">
    <div class="grid md:grid-cols-2 gap-12">

      <!-- IMAGE -->
      <div>
        <div class="aspect-square overflow-hidden rounded-2xl bg-gray-50 border">
          <img :src="product.image" :alt="product.name"
            class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- INFO -->
      <div class="space-y-5">
        <p class="text-sm text-gray-400">
          <NuxtLink to="/products" class="hover:underline">Products</NuxtLink>
          / {{ product.category }}
        </p>

        <div>
          <p class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1">
            {{ product.brand }}
          </p>
          <h1 class="text-3xl font-bold leading-tight">{{ product.name }}</h1>
        </div>

        <!-- RATING SUMMARY -->
        <div class="flex items-center gap-2">
          <div class="flex">
            <span v-for="i in 5" :key="i"
              :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-200'"
              class="text-xl">★</span>
          </div>
          <span class="text-sm text-gray-500">({{ reviews?.length || 0 }} reviews)</span>
        </div>

        <p class="text-3xl font-bold">₨{{ Number(product.price).toLocaleString() }}</p>
        <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>

        <!-- STOCK -->
        <div>
          <span v-if="product.stock > 0"
            class="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-medium">
            In Stock ({{ product.stock }} left)
          </span>
          <span v-else
            class="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-medium">
            Out of Stock
          </span>
        </div>

        <!-- QUANTITY -->
        <div class="flex items-center gap-4">
          <span class="font-medium">Quantity:</span>
          <div class="flex items-center border rounded-lg overflow-hidden">
            <button @click="decrease"
              class="px-4 py-2 hover:bg-gray-100 transition text-lg">-</button>
            <span class="px-5 py-2 font-medium border-x">{{ qty }}</span>
            <button @click="increase"
              class="px-4 py-2 hover:bg-gray-100 transition text-lg">+</button>
          </div>
        </div>

        <!-- BUTTONS -->
        <div class="flex gap-3">
          <button
            @click="addToCart"
            :disabled="product.stock < 1"
            :class="added ? 'bg-green-600' : 'bg-purple-900 hover:bg-purple-800'"
            class="flex-1 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition disabled:opacity-50"
          >
            {{ added ? '✓ Added to Cart' : product.stock < 1 ? 'Out of Stock' : 'Add to Cart' }}
          </button>
          <NuxtLink to="/cart"
            class="flex-1 border-2 py-4 rounded-xl text-center font-bold text-sm uppercase tracking-widest hover:bg-gray-50 transition">
            View Cart
          </NuxtLink>
        </div>

        <!-- PRODUCT DETAILS TABLE -->
        <!-- ✅ fixed: wrapped in tbody to fix HTML warning -->
        <table class="w-full text-sm border rounded-xl overflow-hidden">
          <tbody>
            <tr class="border-b bg-gray-50">
              <td class="p-3 font-medium text-gray-600 w-32">Category</td>
              <td class="p-3">{{ product.category }}</td>
            </tr>
            <tr class="border-b">
              <td class="p-3 font-medium text-gray-600">Brand</td>
              <td class="p-3">{{ product.brand || '—' }}</td>
            </tr>
            <tr class="border-b bg-gray-50">
              <td class="p-3 font-medium text-gray-600">Stock</td>
              <td class="p-3">{{ product.stock }} units</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-gray-600">Rating</td>
              <td class="p-3">{{ product.rating }}/5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===========================
         REVIEWS SECTION
    =========================== -->
    <div class="mt-16 border-t pt-12">
      <h2 class="text-2xl font-bold mb-8">Customer Reviews</h2>

      <div class="grid lg:grid-cols-3 gap-10">

        <!-- RATING SUMMARY -->
        <div class="bg-gray-50 rounded-2xl p-6 text-center h-fit">
          <p class="text-6xl font-bold text-gray-900">{{ avgRating }}</p>
          <div class="flex justify-center gap-1 my-2">
            <span v-for="i in 5" :key="i"
              :class="i <= Math.round(Number(avgRating)) ? 'text-yellow-400' : 'text-gray-200'"
              class="text-2xl">★</span>
          </div>
          <p class="text-sm text-gray-500 mb-6">{{ reviews?.length || 0 }} reviews</p>

          <!-- RATING BARS -->
          <div class="space-y-2">
            <div v-for="star in [5,4,3,2,1]" :key="star"
              class="flex items-center gap-2 text-sm">
              <span class="w-3 text-right text-gray-600">{{ star }}</span>
              <span class="text-yellow-400 text-xs">★</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-400 h-2 rounded-full transition-all"
                  :style="{ width: reviews?.length ? `${(ratingCounts[star] / reviews.length) * 100}%` : '0%' }" />
              </div>
              <span class="w-4 text-gray-500 text-xs">{{ ratingCounts[star] }}</span>
            </div>
          </div>
        </div>

        <!-- REVIEWS LIST + FORM -->
        <div class="lg:col-span-2 space-y-6">

          <!-- WRITE A REVIEW -->
          <div class="bg-white border rounded-2xl p-6">
            <h3 class="font-bold text-lg mb-4">Write a Review</h3>

            <!-- ✅ check token.value safely -->
            <div v-if="!token" class="text-center py-4 text-gray-500">
              <NuxtLink to="/login" class="text-purple-700 font-medium hover:underline">
                Login
              </NuxtLink>
              to write a review
            </div>

            <div v-else class="space-y-4">
              <!-- STAR PICKER -->
              <div>
                <p class="text-sm font-medium mb-2">Your Rating *</p>
                <div class="flex gap-1">
                  <button
                    v-for="i in 5"
                    :key="i"
                    @mouseenter="reviewHover = i"
                    @mouseleave="reviewHover = 0"
                    @click="reviewForm.rating = i"
                    class="text-3xl transition"
                    :class="i <= (reviewHover || reviewForm.rating)
                      ? 'text-yellow-400' : 'text-gray-200'"
                  >★</button>
                </div>
              </div>

              <div>
                <label class="text-sm font-medium">Comment (optional)</label>
                <textarea
                  v-model="reviewForm.comment"
                  rows="3"
                  placeholder="Share your experience..."
                  class="mt-1 border w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                />
              </div>

              <p v-if="reviewError" class="text-red-500 text-sm">{{ reviewError }}</p>
              <p v-if="reviewSuccess" class="text-green-600 text-sm font-medium">
                ✓ Review submitted!
              </p>

              <button
                @click="submitReview"
                :disabled="submitting"
                class="bg-purple-900 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-purple-800 transition disabled:opacity-50"
              >
                {{ submitting ? 'Submitting...' : 'Submit Review' }}
              </button>
            </div>
          </div>

          <!-- REVIEWS LIST -->
          <div v-if="!reviews?.length"
            class="text-center py-10 text-gray-400 border rounded-2xl">
            No reviews yet. Be the first to review this product!
          </div>

          <div v-else class="space-y-4">
            <div v-for="review in reviews" :key="review.id"
              class="bg-white border rounded-2xl p-5">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <p class="font-semibold">
                    {{ review.first_name }} {{ review.last_name }}
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ new Date(review.created_at).toLocaleDateString() }}
                  </p>
                </div>
                <div class="flex">
                  <span v-for="i in 5" :key="i"
                    :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-200'"
                    class="text-sm">★</span>
                </div>
              </div>
              <p v-if="review.comment"
                class="text-gray-600 text-sm leading-relaxed">
                {{ review.comment }}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <LayoutFooter />
</template>