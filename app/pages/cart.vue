<script setup>
useHead({ title: 'Cart - SmokeHaven' })
const { cart, remove, updateQty, total, count } = useCart()
</script>

<template>
  <LayoutNavbar />

  <div class="bg-gray-950 min-h-screen py-12 px-6">
    <div class="max-w-7xl mx-auto">

      <div class="mb-8">
        <p class="text-orange-400 text-xs uppercase tracking-widest font-bold mb-1">Shopping</p>
        <h1 class="text-3xl font-black text-white">Your Cart
          <span class="text-base font-normal text-gray-500 ml-2">({{ count }} items)</span>
        </h1>
      </div>

      <div v-if="cart.length === 0" class="text-center py-24">
        <div class="w-20 h-20 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-4xl">🛒</span>
        </div>
        <p class="text-gray-400 text-lg mb-2">Your cart is empty</p>
        <p class="text-gray-600 text-sm mb-8">Add some premium products to get started</p>
        <NuxtLink to="/products"
          class="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition">
          Browse Products
        </NuxtLink>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-8">

        <!-- ITEMS -->
        <div class="lg:col-span-2 space-y-4">
          <div v-for="item in cart" :key="item.id"
            class="flex gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition">
            <img :src="item.image" :alt="item.name"
              class="w-24 h-24 object-cover rounded-xl flex-shrink-0 border border-gray-800" />

            <div class="flex-1">
              <p class="text-xs text-orange-400 uppercase tracking-wide mb-1">{{ item.category }}</p>
              <h3 class="font-bold text-white">{{ item.name }}</h3>
              <p class="font-bold text-orange-400 mt-1">₨{{ Number(item.price).toLocaleString() }}</p>
            </div>

            <div class="flex flex-col items-end justify-between">
              <div class="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <button @click="updateQty(item.id, item.qty - 1)"
                  class="px-3 py-1.5 hover:bg-gray-700 text-gray-300 hover:text-white transition text-lg">-</button>
                <span class="px-3 py-1.5 text-white text-sm font-medium border-x border-gray-700">{{ item.qty }}</span>
                <button @click="updateQty(item.id, item.qty + 1)"
                  class="px-3 py-1.5 hover:bg-gray-700 text-gray-300 hover:text-white transition text-lg">+</button>
              </div>

              <p class="font-bold text-white text-sm">
                ₨{{ (Number(item.price) * item.qty).toLocaleString() }}
              </p>

              <button @click="remove(item.id)"
                class="text-red-400 text-xs hover:text-red-300 transition hover:underline">
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- SUMMARY -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-fit sticky top-28 space-y-4">
          <h2 class="font-bold text-lg text-white">Order Summary</h2>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-gray-400">
              <span>Subtotal ({{ count }} items)</span>
              <span class="text-white">₨{{ total.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span class="text-green-400 font-medium">Free</span>
            </div>
            <div class="border-t border-gray-800 pt-3 flex justify-between font-bold text-base">
              <span class="text-white">Total</span>
              <span class="text-orange-400">₨{{ total.toLocaleString() }}</span>
            </div>
          </div>

          <NuxtLink to="/checkout"
            class="block w-full bg-orange-500 hover:bg-orange-400 text-white text-center py-3.5 rounded-xl font-bold transition text-sm uppercase tracking-widest">
            Proceed to Checkout
          </NuxtLink>

          <NuxtLink to="/products"
            class="block w-full border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white text-center py-3 rounded-xl transition text-sm">
            Continue Shopping
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <LayoutFooter />
</template>