<script setup>
const route = useRoute()
</script>

<template>
  <div class="h-screen flex bg-gray-100">

    <!-- SIDEBAR -->
    <aside class="w-64 bg-gray-900 text-gray-300 flex flex-col fixed h-full">

      <!-- LOGO -->
      <div class="px-6 py-5 border-b border-gray-800">
        <h1 class="text-xl font-semibold text-white">Admin Panel</h1>
      </div>

      <!-- NAV -->
      <nav class="flex-1 px-3 py-6 space-y-2">

        <NuxtLink
          to="/admin/dashboard"
          class="nav-link"
          :class="{ active: route.path === '/admin/dashboard' }"
        >
          Dashboard
        </NuxtLink>

        <NuxtLink to="/admin/products" class="nav-link">
          Products
        </NuxtLink>

        <NuxtLink to="/admin/orders" class="nav-link">
          Orders
        </NuxtLink>

        <NuxtLink to="/admin/users" class="nav-link">
          Users
        </NuxtLink>

      </nav>

      <!-- LOGOUT -->
      <div class="p-4 border-t border-gray-800">
        <button class="w-full text-left text-red-400 hover:text-red-500">
          Logout
        </button>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="flex-1 ml-64 flex flex-col">

      <!-- HEADER -->
      <header class="bg-white border-b px-8 py-4 flex justify-between">
        <h1 class="text-xl font-semibold capitalize">
          {{ route.name }}
        </h1>
        <p class="text-sm text-gray-500">Welcome back, Admin</p>
      </header>

      <!-- PAGE CONTENT -->
      <main class="p-8 overflow-y-auto">
        <slot />
      </main>

    </div>

  </div>
</template>

<style scoped>
.nav-link {
  @apply block px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition;
}

.active {
  @apply bg-gray-800 text-white;
}
</style>