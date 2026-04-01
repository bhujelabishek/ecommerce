<script setup>
useHead({ title: 'Checkout - HookahStore' })

const { cart, total, clear } = useCart()
const { token, user } = useAuth()
const router = useRouter()

// redirect if cart empty
if (cart.value.length === 0) {
  navigateTo('/cart')
}

const loading = ref(false)

const form = reactive({
  full_name: user.value?.first_name + ' ' + user.value?.last_name || '',
  phone: '',
  address: '',
  city: '',
  notes: ''
})

// eSewa config
const ESEWA_URL = 'https://uat.esewa.com.np/epay/main' // change to prod URL when ready
const ESEWA_SCD = 'EPAYTEST' // your merchant code from eSewa

const placeOrder = async () => {
  if (!form.full_name || !form.phone || !form.address || !form.city) {
    alert('Please fill all required fields')
    return
  }

  if (!token.value) {
    navigateTo('/login')
    return
  }

  loading.value = true

  try {
    // 1. create order in DB first
    const order = await $fetch('/api/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: {
        items: cart.value,
        total_amount: total.value,
        ...form,
        payment_method: 'esewa'
      }
    })

    // 2. redirect to eSewa
    const esewaForm = document.createElement('form')
    esewaForm.method = 'POST'
    esewaForm.action = ESEWA_URL

    const params = {
      amt: total.value,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: total.value,
      pid: order.id,
      scd: ESEWA_SCD,
      su: `${window.location.origin}/payment/success?order_id=${order.id}`,
      fu: `${window.location.origin}/payment/failed?order_id=${order.id}`
    }

    for (const [key, value] of Object.entries(params)) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = value
      esewaForm.appendChild(input)
    }

    document.body.appendChild(esewaForm)
    clear() // clear cart before redirect
    esewaForm.submit()

  } catch (err) {
    console.error(err)
    alert(err?.data?.message || 'Failed to place order')
    loading.value = false
  }
}
</script>

<template>
  <LayoutNavbar />

  <LayoutContainer>
    <div class="py-12">
      <h1 class="text-2xl font-bold mb-8">Checkout</h1>

      <div class="grid lg:grid-cols-3 gap-10">

        <!-- SHIPPING FORM -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white border rounded-xl p-6 space-y-4">
            <h2 class="font-bold text-lg">Shipping Information</h2>

            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium">Full Name *</label>
                <input v-model="form.full_name" placeholder="John Doe"
                  class="input mt-1" />
              </div>
              <div>
                <label class="text-sm font-medium">Phone *</label>
                <input v-model="form.phone" placeholder="98XXXXXXXX"
                  class="input mt-1" />
              </div>
            </div>

            <div>
              <label class="text-sm font-medium">Address *</label>
              <input v-model="form.address" placeholder="Street address"
                class="input mt-1" />
            </div>

            <div>
              <label class="text-sm font-medium">City *</label>
              <input v-model="form.city" placeholder="Kathmandu"
                class="input mt-1" />
            </div>

            <div>
              <label class="text-sm font-medium">Order Notes (optional)</label>
              <textarea v-model="form.notes" placeholder="Any special instructions..."
                class="input mt-1" rows="3" />
            </div>
          </div>

          <!-- PAYMENT METHOD -->
          <div class="bg-white border rounded-xl p-6">
            <h2 class="font-bold text-lg mb-4">Payment Method</h2>
            <div class="flex items-center gap-3 border rounded-lg p-4 bg-green-50 border-green-200">
              <img src="https://esewa.com.np/common/images/esewa_logo.png"
                class="h-8 object-contain" alt="eSewa" />
              <div>
                <p class="font-medium text-sm">eSewa</p>
                <p class="text-xs text-gray-500">Pay securely with eSewa</p>
              </div>
              <div class="ml-auto w-4 h-4 rounded-full bg-green-500 border-2 border-white ring-2 ring-green-500"></div>
            </div>
          </div>
        </div>

        <!-- ORDER SUMMARY -->
        <div class="bg-white border rounded-xl p-6 h-fit space-y-4 sticky top-28">
          <h2 class="font-bold text-lg">Order Summary</h2>

          <div class="space-y-3 max-h-60 overflow-y-auto">
            <div v-for="item in cart" :key="item.id"
              class="flex gap-3 text-sm">
              <img :src="item.image" class="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
              <div class="flex-1">
                <p class="font-medium truncate">{{ item.name }}</p>
                <p class="text-gray-500">x{{ item.qty }}</p>
              </div>
              <p class="font-medium">₨{{ (Number(item.price) * item.qty).toLocaleString() }}</p>
            </div>
          </div>

          <div class="border-t pt-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Subtotal</span>
              <span>₨{{ total.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Shipping</span>
              <span class="text-green-600">Free</span>
            </div>
            <div class="flex justify-between font-bold text-base border-t pt-2">
              <span>Total</span>
              <span>₨{{ total.toLocaleString() }}</span>
            </div>
          </div>

          <button
            @click="placeOrder"
            :disabled="loading"
            class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
          >
            {{ loading ? 'Placing Order...' : 'Pay with eSewa' }}
          </button>
        </div>

      </div>
    </div>
  </LayoutContainer>

  <LayoutFooter />
</template>

<style scoped>
.input { @apply border w-full p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-black; }
</style>