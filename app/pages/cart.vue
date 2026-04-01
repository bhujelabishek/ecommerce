<script setup>
useHead({ title: 'Cart - HookahStore' })

const { cart, remove, updateQty, total, count } = useCart()
</script>

<template>
  <LayoutNavbar />

  <LayoutContainer>
    <div class="py-12">
      <h1 class="text-2xl font-bold mb-8">
        Your Cart
        <span class="text-base font-normal text-gray-500 ml-2">({{ count }} items)</span>
      </h1>

      <!-- EMPTY -->
      <div v-if="cart.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg mb-4">Your cart is empty</p>
        <NuxtLink to="/products"
          class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
          Shop Now
        </NuxtLink>
      </div>

      <!-- CART ITEMS -->
      <div v-else class="grid lg:grid-cols-3 gap-10">

        <!-- ITEMS LIST -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cart"
            :key="item.id"
            class="flex gap-4 bg-white border rounded-xl p-4"
          >
            <img :src="item.image" :alt="item.name"
              class="w-24 h-24 object-cover rounded-lg flex-shrink-0" />

            <div class="flex-1">
              <h3 class="font-semibold">{{ item.name }}</h3>
              <p class="text-gray-500 text-sm">{{ item.category }}</p>
              <p class="font-bold mt-1">₨{{ item.price }}</p>
            </div>

            <div class="flex flex-col items-end justify-between">
              <!-- QTY -->
              <div class="flex items-center border rounded-lg">
                <button @click="updateQty(item.id, item.qty - 1)"
                  class="px-3 py-1 hover:bg-gray-100 transition">-</button>
                <span class="px-3 text-sm">{{ item.qty }}</span>
                <button @click="updateQty(item.id, item.qty + 1)"
                  class="px-3 py-1 hover:bg-gray-100 transition">+</button>
              </div>

              <!-- SUBTOTAL -->
              <p class="font-semibold text-sm">
                ₨{{ (Number(item.price) * item.qty).toLocaleString() }}
              </p>

              <!-- REMOVE -->
              <button @click="remove(item.id)"
                class="text-red-500 text-xs hover:underline">
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- ORDER SUMMARY -->
        <div class="bg-white border rounded-xl p-6 h-fit space-y-4 sticky top-28">
          <h2 class="font-bold text-lg">Order Summary</h2>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Subtotal ({{ count }} items)</span>
              <span>₨{{ total.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Shipping</span>
              <span class="text-green-600">Free</span>
            </div>
            <div class="border-t pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>₨{{ total.toLocaleString() }}</span>
            </div>
          </div>

          <NuxtLink to="/checkout"
            class="block w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800 transition">
            Proceed to Checkout
          </NuxtLink>

          <NuxtLink to="/products"
            class="block w-full border text-center py-3 rounded-lg hover:bg-gray-50 transition text-sm">
            Continue Shopping
          </NuxtLink>
        </div>
      </div>
    </div>
  </LayoutContainer>

  <LayoutFooter />
</template>