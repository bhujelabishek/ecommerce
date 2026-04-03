<script setup>
import Swal from 'sweetalert2'

definePageMeta({
    layout: 'admins', 
    middleware: 'auth' 
})

const { token } = useAuth()
const { data: banners, refresh } = await useFetch('/api/admin/banners', {
  headers: { Authorization: `Bearer ${token.value}` }
})

const showModal = ref(false)
const editingId = ref(null)
const loading = ref(false)
const imageFile = ref(null)
const imagePreview = ref('')

const form = reactive({
  title: '',
  subtitle: '',
  button_text: 'Shop Now',
  button_link: '/products',
  image: '',
  overlay_color: 'rgba(0,0,0,0.4)',
  is_active: true,
  sort_order: 0
})

const resetForm = () => {
  Object.assign(form, {
    title: '', subtitle: '', button_text: 'Shop Now',
    button_link: '/products', image: '',
    overlay_color: 'rgba(0,0,0,0.4)', is_active: true, sort_order: 0
  })
  editingId.value = null
  imageFile.value = null
  imagePreview.value = ''
}

const openCreate = () => { resetForm(); showModal.value = true }

const openEdit = (banner) => {
  Object.assign(form, banner)
  imagePreview.value = banner.image || ''
  imageFile.value = null
  editingId.value = banner.id
  showModal.value = true
}

const handleImageFile = (e) => {
  const file = e.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const uploadImage = async () => {
  if (!imageFile.value) return form.image
  const fd = new FormData()
  fd.append('file', imageFile.value)
  const res = await $fetch('/api/upload', { method: 'POST', body: fd })
  return res.path
}

const save = async () => {
  if (!form.title) {
    Swal.fire({ icon: 'warning', title: 'Title required', confirmButtonColor: '#000' })
    return
  }
  loading.value = true
  try {
    const imagePath = await uploadImage()
    const body = { ...form, image: imagePath }

    if (editingId.value) {
      await $fetch(`/api/admin/banners/${editingId.value}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token.value}` },
        body
      })
    } else {
      await $fetch('/api/admin/banners', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body
      })
    }

    showModal.value = false
    resetForm()
    await refresh()
    Swal.fire({
      icon: 'success',
      title: editingId.value ? 'Updated!' : 'Created!',
      timer: 1500, showConfirmButton: false
    })
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: err?.data?.message, confirmButtonColor: '#000' })
  }
  loading.value = false
}

const deleteBanner = async (id, title) => {
  const res = await Swal.fire({
    title: `Delete "${title}"?`,
    icon: 'warning', showCancelButton: true,
    confirmButtonColor: '#ef4444', reverseButtons: true,
    confirmButtonText: 'Yes, delete!'
  })
  if (!res.isConfirmed) return
  await $fetch(`/api/admin/banners/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token.value}` }
  })
  await refresh()
  Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false })
}

const toggleStatus = async (banner) => {
  await $fetch(`/api/admin/banners/${banner.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token.value}` },
    body: { ...banner, is_active: !banner.is_active }
  })
  await refresh()
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Hero Banners</h1>
      <button @click="openCreate" class="bg-black text-white px-4 py-2 rounded-lg">
        + Add Banner
      </button>
    </div>

    <!-- BANNER PREVIEW CARDS -->
    <div class="space-y-4 mb-8">
      <div v-for="banner in banners" :key="banner.id"
        class="bg-white border rounded-xl overflow-hidden">
        <div class="flex gap-4 p-4 items-center">

          <!-- PREVIEW -->
          <div class="relative w-48 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <img v-if="banner.image" :src="banner.image"
              class="w-full h-full object-cover" />
            <div class="absolute inset-0 flex flex-col justify-center items-center text-white p-2"
              :style="{ background: banner.overlay_color }">
              <p class="text-xs font-bold text-center leading-tight">{{ banner.title }}</p>
              <p class="text-xs opacity-75 text-center">{{ banner.subtitle }}</p>
            </div>
          </div>

          <!-- INFO -->
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <p class="font-semibold">{{ banner.title }}</p>
              <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                Order: {{ banner.sort_order }}
              </span>
            </div>
            <p class="text-sm text-gray-500">{{ banner.subtitle }}</p>
            <p class="text-xs text-blue-600 mt-1">→ {{ banner.button_link }}</p>
          </div>

          <!-- ACTIONS -->
          <div class="flex items-center gap-3">
            <button
              @click="toggleStatus(banner)"
              :class="banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
              class="px-3 py-1 rounded-full text-xs font-medium"
            >
              {{ banner.is_active ? 'Active' : 'Inactive' }}
            </button>
            <button @click="openEdit(banner)"
              class="px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 text-xs">
              Edit
            </button>
            <button @click="deleteBanner(banner.id, banner.title)"
              class="px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-xs">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 class="font-bold text-lg">{{ editingId ? 'Edit Banner' : 'Add Banner' }}</h2>

        <div>
          <label class="text-sm font-medium">Title *</label>
          <input v-model="form.title" placeholder="Premium Hookah Collection"
            class="border w-full p-2 rounded-lg mt-1 focus:outline-none focus:ring-1 focus:ring-black" />
        </div>

        <div>
          <label class="text-sm font-medium">Subtitle</label>
          <input v-model="form.subtitle" placeholder="Experience the smoothest smoke"
            class="border w-full p-2 rounded-lg mt-1 focus:outline-none focus:ring-1 focus:ring-black" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium">Button Text</label>
            <input v-model="form.button_text" placeholder="Shop Now"
              class="border w-full p-2 rounded-lg mt-1 focus:outline-none" />
          </div>
          <div>
            <label class="text-sm font-medium">Button Link</label>
            <input v-model="form.button_link" placeholder="/products"
              class="border w-full p-2 rounded-lg mt-1 focus:outline-none" />
          </div>
        </div>

        <div>
          <label class="text-sm font-medium">Banner Image</label>
          <div class="mt-2 mb-2">
            <img v-if="imagePreview" :src="imagePreview"
              class="w-full h-32 object-cover rounded-lg border" />
            <div v-else
              class="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
              No image selected
            </div>
          </div>
          <input type="file" accept="image/*" @change="handleImageFile"
            class="border w-full p-2 rounded-lg text-sm" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium">Overlay Color</label>
            <select v-model="form.overlay_color"
              class="border w-full p-2 rounded-lg mt-1 focus:outline-none">
              <option value="rgba(0,0,0,0.3)">Dark 30%</option>
              <option value="rgba(0,0,0,0.4)">Dark 40%</option>
              <option value="rgba(0,0,0,0.6)">Dark 60%</option>
              <option value="rgba(88,28,135,0.6)">Purple 60%</option>
              <option value="rgba(20,83,45,0.6)">Green 60%</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium">Sort Order</label>
            <input v-model="form.sort_order" type="number" placeholder="0"
              class="border w-full p-2 rounded-lg mt-1 focus:outline-none" />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <label class="text-sm font-medium">Status</label>
          <button type="button" @click="form.is_active = !form.is_active"
            :class="form.is_active ? 'bg-green-500' : 'bg-gray-400'"
            class="px-4 py-1 rounded-full text-white text-sm transition">
            {{ form.is_active ? 'Active' : 'Inactive' }}
          </button>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button @click="showModal = false; resetForm()"
            class="px-4 py-2 border rounded-lg text-sm">Cancel</button>
          <button @click="save" :disabled="loading"
            class="px-4 py-2 bg-black text-white rounded-lg text-sm disabled:opacity-50">
            {{ loading ? 'Saving...' : editingId ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>