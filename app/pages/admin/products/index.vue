<script setup>
import Swal from 'sweetalert2'
definePageMeta({
  layout: 'admins',
  middleware: 'auth'  
})


const { token } = useAuth() 

const products = ref([])
const showModal = ref(false)
const file = ref(null)
const editingId = ref(null)
const loading = ref(false)

const form = reactive({
  name: '',
  description: '',
  price: '',
  stock: '',
  category_id: '',
  rating: 0,
  is_active: true
})

const categories = ref([])

onMounted(() => {
  fetchProducts()
  fetchCategories()
})

const fetchCategories = async () => {
  categories.value = await $fetch('/api/categories')
}

const fetchProducts = async () => {
  const res = await $fetch('/api/admin/products')
  products.value = res
}

const handleFile = (e) => {
  file.value = e.target.files[0]
}

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.price = ''
  form.stock = ''
  form.category_id = ''
  form.rating = 0
  form.is_active = true
  file.value = null
  editingId.value = null
}

const openCreate = () => {
  resetForm()
  showModal.value = true
}

// CREATE PRODUCT
const createProduct = async () => {
  if (!form.name || !form.price || !form.stock || !form.category_id) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing fields',
      text: 'Please fill in all required fields.',
      confirmButtonColor: '#000'
    })
    return
  }

  loading.value = true

  try {
    let imagePath = ''

    if (file.value) {
      const fd = new FormData()
      fd.append('file', file.value)
      const uploadRes = await $fetch('/api/upload', { method: 'POST', body: fd })
      imagePath = uploadRes.path
    }

    await $fetch('/api/admin/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        category_id: Number(form.category_id),
        rating: Number(form.rating),
        image: imagePath
      }
    })

    showModal.value = false
    resetForm()
    await fetchProducts()

    Swal.fire({
      icon: 'success',
      title: 'Product created!',
      text: `"${form.name || 'Product'}" has been added successfully.`,
      confirmButtonColor: '#000',
      timer: 2500,
      timerProgressBar: true
    })

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err?.data?.message || 'Failed to create product.',
      confirmButtonColor: '#000'
    })
  }

  loading.value = false
}

// EDIT PRODUCT
const editProduct = async (id) => {
  try {
    const product = await $fetch(`/api/admin/products/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })

    Object.assign(form, product)
    file.value = null
    editingId.value = id
    showModal.value = true
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Could not load product data.',
      confirmButtonColor: '#000'
    })
  }
}

// UPDATE PRODUCT
const updateProduct = async () => {
  loading.value = true

  try {
    let imagePath = form.image

    if (file.value) {
      const fd = new FormData()
      fd.append('file', file.value)
      const uploadRes = await $fetch('/api/upload', { method: 'POST', body: fd })
      imagePath = uploadRes.path
    }

    await $fetch(`/api/admin/products/${editingId.value}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        category_id: Number(form.category_id),
        rating: Number(form.rating),
        image: imagePath
      }
    })

    showModal.value = false
    resetForm()
    await fetchProducts()

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: 'Product has been updated successfully.',
      confirmButtonColor: '#000',
      timer: 2000,
      timerProgressBar: true
    })

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Update failed',
      text: err?.data?.message || 'Something went wrong.',
      confirmButtonColor: '#000'
    })
  }

  loading.value = false
}

// DELETE PRODUCT
const deleteProduct = async (id, name) => {
  const result = await Swal.fire({
    title: `Delete "${name}"?`,
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  })

  if (!result.isConfirmed) return

  try {
    await $fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })

    await fetchProducts()

    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: `"${name}" has been removed.`,
      confirmButtonColor: '#000',
      timer: 2000,
      timerProgressBar: true
    })

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Could not delete product.',
      confirmButtonColor: '#000'
    })
  }
}

// TOGGLE STATUS
const toggleStatus = async (product) => {
  const newStatus = !product.is_active
  const label = newStatus ? 'activate' : 'deactivate'

  const result = await Swal.fire({
    title: `${label.charAt(0).toUpperCase() + label.slice(1)} product?`,
    text: `"${product.name}" will be ${label}d.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: newStatus ? '#22c55e' : '#6b7280',
    cancelButtonColor: '#9ca3af',
    confirmButtonText: `Yes, ${label} it!`,
    reverseButtons: true
  })

  if (!result.isConfirmed) return

  try {
    await $fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { ...product, is_active: newStatus }
    })

    await fetchProducts()

    Swal.fire({
      icon: 'success',
      title: newStatus ? 'Activated!' : 'Deactivated!',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    })

  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Status update failed.', confirmButtonColor: '#000' })
  }
}
</script>

<template>
  <div>

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Products</h1>
      <button @click="openCreate" class="btn">+ Add Product</button>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl border overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="p-4">ID</th>
            <th class="p-4">Name</th>
            <th class="p-4">Description</th>
            <th class="p-4">Price</th>
            <th class="p-4">Stock</th>
            <th class="p-4">Category</th>
            <th class="p-4">Image</th>
            <th class="p-4">Rating</th>
            <th class="p-4">Status</th>
            <th class="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id" class="border-t hover:bg-gray-50">
            <td class="p-4">{{ p.id }}</td>
            <td class="p-4 font-medium">{{ p.name }}</td>
            <td class="p-4 max-w-[200px] truncate text-gray-500">{{ p.description }}</td>
            <td class="p-4">₨{{ p.price }}</td>
            <td class="p-4">{{ p.stock }}</td>
            <td class="p-4">{{ p.category }}</td>
            <td class="p-4">
              <img :src="p.image" alt="product" class="w-12 h-12 object-cover rounded-lg" />
            </td>
            <td class="p-4">
              <span v-for="i in 5" :key="i"
                :class="i <= p.rating ? 'text-yellow-400' : 'text-gray-200'">★</span>
            </td>
            <td class="p-4">
              <button
                @click="toggleStatus(p)"
                :class="p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                class="px-3 py-1 rounded-full text-xs font-medium"
              >
                {{ p.is_active ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td class="p-4">
              <div class="flex gap-2">
                <button @click="editProduct(p.id)"
                  class="px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 text-xs transition">
                  Edit
                </button>
                <button @click="deleteProduct(p.id, p.name)"
                  class="px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-xs transition">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl w-full max-w-lg space-y-3 max-h-[90vh] overflow-y-auto">

        <h2 class="text-xl font-bold">
          {{ editingId ? 'Edit Product' : 'Add Product' }}
        </h2>

        <input v-model="form.name" placeholder="Name *" class="input" />
        <textarea v-model="form.description" placeholder="Description" class="input" rows="3" />
        <input v-model="form.price" type="number" placeholder="Price *" class="input" />
        <input v-model="form.stock" type="number" placeholder="Stock *" class="input" />

        <div>
          <label class="text-sm text-gray-500 mb-1 block">Product Image</label>
          <input type="file" @change="handleFile" class="input" />
          <img v-if="form.image && !file" :src="form.image"
            class="w-24 h-24 object-cover rounded-lg mt-2" />
        </div>

        <select v-model="form.category_id" class="input">
          <option disabled value="">Select Category *</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>

        <!-- RATING -->
        <div class="flex items-center gap-2">
          <span class="text-sm">Rating:</span>
          <div class="flex">
            <span v-for="i in 5" :key="i" @click="form.rating = i"
              class="cursor-pointer text-2xl transition"
              :class="i <= form.rating ? 'text-yellow-400' : 'text-gray-300'">
              ★
            </span>
          </div>
          <span class="text-sm text-gray-500">{{ form.rating }}/5</span>
        </div>

        <!-- STATUS -->
        <div class="flex items-center gap-3">
          <span class="text-sm">Status:</span>
          <button type="button" @click="form.is_active = !form.is_active"
            :class="form.is_active ? 'bg-green-500' : 'bg-gray-400'"
            class="px-4 py-1 rounded-full text-white text-sm transition">
            {{ form.is_active ? 'Active' : 'Inactive' }}
          </button>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button @click="showModal = false; resetForm()"
            class="px-4 py-2 border rounded-lg text-sm">
            Cancel
          </button>
          <button
            @click="editingId ? updateProduct() : createProduct()"
            :disabled="loading"
            class="btn disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : editingId ? 'Update' : 'Create' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.btn { @apply bg-black text-white px-4 py-2 rounded-lg; }
.input { @apply border w-full p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-black; }
</style>