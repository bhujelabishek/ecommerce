<script setup>
import Swal from 'sweetalert2'

definePageMeta({
  layout: 'admins',
  middleware: 'auth'
})

const { token } = useAuth()

const { data: orders, refresh } = await useFetch('/api/admin/orders', {
  key: 'admin-orders',
  headers: { Authorization: `Bearer ${token.value}` },
  default: () => []
})

// STATUS HELPERS
const statusColor = (status) => ({
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-600'
}[status] || 'bg-gray-100 text-gray-600')

const paymentColor = (status) => ({
  paid:    'bg-green-100 text-green-700',
  unpaid:  'bg-red-100 text-red-600',
  refunded: 'bg-gray-100 text-gray-600'
}[status] || 'bg-gray-100 text-gray-600')

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']


// SELECTED ORDER FOR DETAIL
const selectedOrder = ref(null)
const orderItems = ref([])
const loadingItems = ref(false)

const openOrder = async (order) => {
  selectedOrder.value = order
  loadingItems.value = true
  orderItems.value = []

  try {
    const res = await $fetch(`/api/orders/${order.id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    orderItems.value = res.items || []
  } catch {
    orderItems.value = []
  } finally {
    loadingItems.value = false
  }
}

const closeOrder = () => {
  selectedOrder.value = null
  orderItems.value = []
}

// UPDATE STATUS
const updateStatus = async (order, newStatus) => {
  const result = await Swal.fire({
    title: `Change status to "${newStatus}"?`,
    text: `Order #${order.id} will be marked as ${newStatus}.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#000',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, update it!',
    reverseButtons: true
  })

  if (!result.isConfirmed) return

  try {
    await $fetch(`/api/admin/orders/${order.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { status: newStatus }
    })

    await refresh()

    // update selected order if open
    if (selectedOrder.value?.id === order.id) {
      selectedOrder.value = { ...selectedOrder.value, status: newStatus }
    }

    Swal.fire({
      icon: 'success',
      title: 'Status updated!',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    })

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err?.data?.message || 'Could not update status.',
      confirmButtonColor: '#000'
    })
  }
}

// FILTERS
const filterStatus = ref('')
const searchQuery = ref('')

const filteredOrders = computed(() => {
  if (!orders.value) return []
  return orders.value.filter(o => {
    const matchStatus = !filterStatus.value || o.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      String(o.id).includes(searchQuery.value) ||
      o.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      o.full_name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchSearch
  })
})


// STATS
const stats = computed(() => {
  if (!orders.value) return {}
  return {
    total: orders.value.length,
    pending: orders.value.filter(o => o.status === 'pending').length,
    processing: orders.value.filter(o => o.status === 'processing').length,
    delivered: orders.value.filter(o => o.status === 'delivered').length,
    revenue: orders.value
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + Number(o.total_amount), 0)
  }
})
</script>

<template>
  <div>

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Orders</h1>
      <button @click="refresh"
        class="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
        Refresh
      </button>
    </div>

    <!-- STATS CARDS -->
    <div class="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
      <div class="bg-white border rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Total Orders</p>
        <p class="text-2xl font-bold">{{ stats.total }}</p>
      </div>
      <div class="bg-white border rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Pending</p>
        <p class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</p>
      </div>
      <div class="bg-white border rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Processing</p>
        <p class="text-2xl font-bold text-blue-600">{{ stats.processing }}</p>
      </div>
      <div class="bg-white border rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Delivered</p>
        <p class="text-2xl font-bold text-green-600">{{ stats.delivered }}</p>
      </div>
      <div class="bg-white border rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Revenue</p>
        <p class="text-2xl font-bold">₨{{ stats.revenue?.toLocaleString() }}</p>
      </div>
    </div>

    <!-- FILTERS -->
    <div class="flex gap-3 mb-4">
      <input
        v-model="searchQuery"
        placeholder="Search by order ID, name or email..."
        class="border rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-black"
      />
      <select
        v-model="filterStatus"
        class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
      >
        <option value="">All Status</option>
        <option v-for="s in statusOptions" :key="s" :value="s">
          {{ s.charAt(0).toUpperCase() + s.slice(1) }}
        </option>
      </select>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="p-4">Order ID</th>
            <th class="p-4">Customer</th>
            <th class="p-4">Date</th>
            <th class="p-4">Total</th>
            <th class="p-4">Payment</th>
            <th class="p-4">Status</th>
            <th class="p-4">Update Status</th>
            <th class="p-4">Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="p-4 font-mono font-medium">#{{ order.id }}</td>
            <td class="p-4">
              <p class="font-medium">{{ order.first_name }} {{ order.last_name }}</p>
              <p class="text-xs text-gray-400">{{ order.email }}</p>
            </td>
            <td class="p-4 text-gray-500 text-xs">
              {{ new Date(order.created_at).toLocaleDateString() }}<br/>
              {{ new Date(order.created_at).toLocaleTimeString() }}
            </td>
            <td class="p-4 font-semibold">
              ₨{{ Number(order.total_amount).toLocaleString() }}
            </td>
            <td class="p-4">
              <span :class="paymentColor(order.payment_status)"
                class="text-xs px-2 py-1 rounded-full font-medium">
                {{ order.payment_status }}
              </span>
            </td>
            <td class="p-4">
              <span :class="statusColor(order.status)"
                class="text-xs px-2 py-1 rounded-full font-medium">
                {{ order.status }}
              </span>
            </td>
            <td class="p-4">
              <select
                :value="order.status"
                @change="updateStatus(order, $event.target.value)"
                class="border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option v-for="s in statusOptions" :key="s" :value="s">
                  {{ s.charAt(0).toUpperCase() + s.slice(1) }}
                </option>
              </select>
            </td>
            <td class="p-4">
              <button
                @click="openOrder(order)"
                class="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition"
              >
                View
              </button>
            </td>
          </tr>

          <!-- empty state -->
          <tr v-if="filteredOrders.length === 0">
            <td colspan="8" class="p-10 text-center text-gray-400">
              No orders found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ORDER DETAIL MODAL -->
    <div
      v-if="selectedOrder"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeOrder"
    >
      <div class="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <!-- MODAL HEADER -->
        <div class="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 class="text-lg font-bold">Order #{{ selectedOrder.id }}</h2>
            <p class="text-sm text-gray-500">
              {{ new Date(selectedOrder.created_at).toLocaleDateString() }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <span :class="statusColor(selectedOrder.status)"
              class="text-xs px-3 py-1 rounded-full font-medium">
              {{ selectedOrder.status }}
            </span>
            <button @click="closeOrder"
              class="text-gray-400 hover:text-black text-xl leading-none">
              ✕
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">

          <!-- CUSTOMER INFO -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">Customer</p>
              <p class="font-medium">{{ selectedOrder.first_name }} {{ selectedOrder.last_name }}</p>
              <p class="text-sm text-gray-500">{{ selectedOrder.email }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">Shipping</p>
              <p class="text-sm">{{ selectedOrder.full_name }}</p>
              <p class="text-sm text-gray-500">{{ selectedOrder.phone }}</p>
              <p class="text-sm text-gray-500">{{ selectedOrder.address }}, {{ selectedOrder.city }}</p>
            </div>
          </div>

          <!-- PAYMENT INFO -->
          <div class="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p class="text-xs font-bold uppercase text-gray-400 mb-1 tracking-wider">Payment</p>
              <p class="text-sm font-medium capitalize">{{ selectedOrder.payment_method }}</p>
            </div>
            <span :class="paymentColor(selectedOrder.payment_status)"
              class="text-xs px-3 py-1 rounded-full font-medium">
              {{ selectedOrder.payment_status }}
            </span>
          </div>

          <!-- ORDER ITEMS -->
          <div>
            <p class="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Items</p>

            <div v-if="loadingItems" class="space-y-3">
              <div v-for="i in 2" :key="i"
                class="h-16 bg-gray-100 rounded-lg animate-pulse" />
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="item in orderItems"
                :key="item.id"
                class="flex gap-3 items-center border rounded-lg p-3"
              >
                <img :src="item.image" :alt="item.name"
                  class="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                <div class="flex-1">
                  <p class="font-medium text-sm">{{ item.name }}</p>
                  <p class="text-xs text-gray-500">x{{ item.quantity }}</p>
                </div>
                <p class="font-semibold text-sm">
                  ₨{{ (item.price * item.quantity).toLocaleString() }}
                </p>
              </div>
            </div>

            <!-- TOTAL -->
            <div class="flex justify-between font-bold text-base border-t mt-4 pt-4">
              <span>Total</span>
              <span>₨{{ Number(selectedOrder.total_amount).toLocaleString() }}</span>
            </div>
          </div>

          <!-- UPDATE STATUS FROM MODAL -->
          <div class="flex items-center gap-3 pt-2 border-t">
            <span class="text-sm font-medium">Update Status:</span>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="s in statusOptions"
                :key="s"
                @click="updateStatus(selectedOrder, s)"
                :class="selectedOrder.status === s
                  ? 'bg-black text-white'
                  : 'border hover:bg-gray-50'"
                class="px-3 py-1 rounded-lg text-xs transition"
              >
                {{ s.charAt(0).toUpperCase() + s.slice(1) }}
              </button>
            </div>
          </div>

          <!-- NOTES -->
          <div v-if="selectedOrder.notes" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p class="text-xs font-bold uppercase text-yellow-600 mb-1">Customer Note</p>
            <p class="text-sm text-gray-700">{{ selectedOrder.notes }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>