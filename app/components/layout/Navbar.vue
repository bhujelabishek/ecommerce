<script setup>
import { ShoppingCart, User, UserRoundPen } from 'lucide-vue-next';

const { token, logout } = useAuth();

</script>


<template>
   
  <!-- 1. WARNING BAR -->
  <div class="bg-black text-white text-center text-2xl font-bold py-4 m-1 ">
    WARNING: This product contains nicotine. Nicotine is an addictive chemical.
  </div>

  <header class="sticky top-0 z-50 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] shadow-opacity-50">
    <!-- 2. PROMO BAR -->
    <div class="bg-purple-900 text-white text-center text-sm space-y-4 py-2 font-medium">
      <div>
        Free Shipping $95+ | Code: FREESHIP
      </div>
      <div class="underline cursor-pointer">
        New Coupon Codes - Free Shipping & More
      </div>
    </div>

    <div class="">
      <!-- 4. MAIN HEADER -->
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

        <!-- LOGO -->
        <NuxtLink to="/" class="text-2xl font-bold">
          HookahStore
        </NuxtLink>

        <!-- SEARCH BAR -->
        <div class="flex-1 hidden md:block">
          <input type="text" placeholder="Search..."
            class="w-full border rounded-lg px-4 py-2  focus:outline-none focus:shadow-[0_0_3px_#3b82f6]" />
        </div>

        <template v-if="token">
          <div>
            <NuxtLink to="/dashboard" class="px-6 py-2 rounded-full text-black bg-white border border-gray-300  
        hover:shadow-[0_0_5px_black] hover:shadow-black/20 hover:bg-black hover:text-white transform hover:scale-105 transition duration-300 
          ">
              Profile
              <!-- <UserRoundPen class="w-6 h-6" /> -->
            </NuxtLink>
           </div>
        </template>

        <template v-else>
          <div class="flex items-center gap-4">
            <NuxtLink to="/login" class="px-6 py-2 rounded-full text-black bg-white border border-gray-300  
        hover:shadow-[0_0_5px_black] hover:shadow-opacity-50 hover:bg-black hover:text-white transform hover:scale-105 transition duration-300 
          ">
              Login
              <!-- <UserRoundPen class="w-6 h-6" /> -->
            </NuxtLink>
            <NuxtLink to="/register"
              class="px-6 py-2 rounded-full text-white bg-black border border-gray-300 
        hover:shadow-[0_0_5px_black] hover:shadow-opacity-0 hover:bg-white hover:text-black transform hover:scale-105 transition duration-300">
              SignUp
            </NuxtLink>
          </div>
        </template>

        <!-- RIGHT SIDE -->
        <div>
          <NuxtLink to="/cart" class="inline-block transition duration-300 transform hover:scale-110">
            <ShoppingCart class="w-6 h-6" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 5. NAV MENU -->
    <div class="border-t">
      <div class="max-w-7xl mx-auto px-6 py-6 flex gap-6 py-3 text-sm font-medium overflow-x-auto ">
        <NuxtLink to="/products" class="text-sm text-transform: uppercase hover:text-gray-700">Hookahs</NuxtLink>
        <NuxtLink to="/products" class="text-sm text-transform: uppercase hover:text-gray-700">Shisha Tobacco</NuxtLink>
        <NuxtLink to="/products" class="text-sm text-transform: uppercase hover:text-gray-700">Hookah Charcoal
        </NuxtLink>
        <NuxtLink to="/products" class="text-sm text-transform: uppercase hover:text-gray-700">Hookah Accessories
        </NuxtLink>
        <NuxtLink to="/products" class="text-sm text-transform: uppercase hover:text-gray-700">Nicotine Pouches
        </NuxtLink>
        <NuxtLink to="/products" class="text-sm text-transform: uppercase hover:text-gray-700">Electronic</NuxtLink>
        <NuxtLink to="/products" class="text-sm text-transform: uppercase hover:text-gray-700">Snoop Dogg</NuxtLink>
        <NuxtLink to="/products" class="text-sm text-transform: uppercase hover:text-gray-700">Shop Wholesale</NuxtLink>
      </div>
    </div>
    
  </header>

</template>