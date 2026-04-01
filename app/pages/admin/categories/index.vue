<script setup>
import Swal from 'sweetalert2'

definePageMeta({
  layout: 'admins',
  middleware: 'auth'  // ✅ add this
})

const { token } = useAuth()

const { data: categories, refresh } = await useFetch('/api/categories')

const showModal = ref(false)
const editingId = ref(null)
const loading = ref(false)

const form = reactive({
  name: '',
  parent_id: '',
  image: '',
  is_active: true
})

const resetForm = () => {
  form.name = ''
  form.parent_id = ''
  form.image = ''
  form.is_active = true
  editingId.value = null
}

const openCreate = () => {
  resetForm()
  showModal.value = true
}

const openEdit = (cat) => {
  form.name = cat.name
  form.parent_id = cat.parent_id || ''
  form.image = cat.image || ''
  form.is_active = cat.is_active
  editingId.value = cat.id
  showModal.value = true
}

const allCategories = computed(() => {
  if (!categories.value) return []
  const flat = []
  for (const cat of categories.value) {
    flat.push(cat)
    if (cat.subcategories) {
      for (const sub of cat.subcategories) flat.push(sub)
    }
  }
  return flat
})

// ===========================
// SAVE (CREATE or UPDATE)
// ===========================
const save = async () => {
  if (!form.name) {
    Swal.fire({
      icon: 'warning',
      title: 'Name required',
      text: 'Please enter a category name.',
      confirmButtonColor: '#000'
    })
    return
  }

  loading.value = true

  try {
    if (editingId.value) {
      await $fetch(`/api/categories/${editingId.value}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token.value}` },
        body: {
          name: form.name,
          parent_id: form.parent_id || null,
          image: form.image || null,
          is_active: form.is_active
        }
      })
    } else {
      await $fetch('/api/categories', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: {
          name: form.name,
          parent_id: form.parent_id || null,
          image: form.image || null
        }
      })
    }

    showModal.value = false
    resetForm()
    await refresh()

    Swal.fire({
      icon: 'success',
      title: editingId.value ? 'Updated!' : 'Created!',
      text: editingId.value
        ? 'Category has been updated successfully.'
        : 'New category has been added.',
      confirmButtonColor: '#000',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    })

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err?.data?.message || 'Failed to save category.',
      confirmButtonColor: '#000'
    })
  }

  loading.value = false
}

// ===========================
// DELETE
// ===========================
const deleteCategory = async (id, name) => {
  const result = await Swal.fire({
    title: `Delete "${name}"?`,
    text: 'This will also delete all its subcategories. This cannot be undone!',
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
    await $fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })

    await refresh()

    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: `"${name}" has been removed.`,
      confirmButtonColor: '#000',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    })

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Could not delete category.',
      confirmButtonColor: '#000'
    })
  }
}

// ===========================
// TOGGLE STATUS
// ===========================
const toggleStatus = async (cat) => {
  const newStatus = !cat.is_active
  const label = newStatus ? 'activate' : 'deactivate'

  const result = await Swal.fire({
    title: `${newStatus ? 'Activate' : 'Deactivate'} "${cat.name}"?`,
    text: `This category will be ${label}d in the store.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: newStatus ? '#22c55e' : '#6b7280',
    cancelButtonColor: '#9ca3af',
    confirmButtonText: `Yes, ${label} it!`,
    reverseButtons: true
  })

  if (!result.isConfirmed) return

  try {
    await $fetch(`/api/categories/${cat.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { ...cat, is_active: newStatus }
    })

    await refresh()

    Swal.fire({
      icon: 'success',
      title: newStatus ? 'Activated!' : 'Deactivated!',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    })

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Could not update status.',
      confirmButtonColor: '#000'
    })
  }
}
</script>

<template>
  <div>

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Categories</h1>
      <button @click="openCreate" class="bg-black text-white px-4 py-2 rounded-lg">
        + Add Category
      </button>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="p-4">ID</th>
            <th class="p-4">Name</th>
            <th class="p-4">Type</th>
            <th class="p-4">Image</th>
            <th class="p-4">Subcategories</th>
            <th class="p-4">Status</th>
            <th class="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="cat in categories" :key="cat.id">

            <!-- PARENT ROW -->
            <tr class="border-t hover:bg-gray-50 transition">
              <td class="p-4 text-gray-400">{{ cat.id }}</td>
              <td class="p-4 font-semibold">{{ cat.name }}</td>
              <td class="p-4">
                <span class="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                  Main
                </span>
              </td>
              <td class="p-4">
                <img v-if="cat.image" :src="cat.image" class="w-10 h-10 object-cover rounded-lg" />
                <span v-else class="text-gray-400 text-xs">No image</span>
              </td>
              <td class="p-4 text-gray-500 text-xs">
                {{ cat.subcategories?.length || 0 }} subcategories
              </td>
              <td class="p-4">
                <button
                  @click="toggleStatus(cat)"
                  :class="cat.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'"
                  class="px-3 py-1 rounded-full text-xs font-medium transition"
                >
                  {{ cat.is_active ? 'Active' : 'Inactive' }}
                </button>
              </td>
              <td class="p-4 space-x-2">
                <button @click="openEdit(cat)"
                  class="px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 text-xs transition">
                  Edit
                </button>
                <button @click="deleteCategory(cat.id, cat.name)"
                  class="px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-xs transition">
                  Delete
                </button>
              </td>
            </tr>

            <!-- SUBCATEGORY ROWS -->
            <tr
              v-for="sub in cat.subcategories"
              :key="sub.id"
              class="border-t bg-gray-50 hover:bg-gray-100 transition"
            >
              <td class="p-4 pl-8 text-gray-400">{{ sub.id }}</td>
              <td class="p-4 pl-8 text-gray-600">↳ {{ sub.name }}</td>
              <td class="p-4">
                <span class="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                  Sub
                </span>
              </td>
              <td class="p-4">
                <img v-if="sub.image" :src="sub.image" class="w-10 h-10 object-cover rounded-lg" />
                <span v-else class="text-gray-400 text-xs">No image</span>
              </td>
              <td class="p-4"></td>
              <td class="p-4"></td>
              <td class="p-4 space-x-2">
                <button @click="openEdit(sub)"
                  class="px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 text-xs transition">
                  Edit
                </button>
                <button @click="deleteCategory(sub.id, sub.name)"
                  class="px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-xs transition">
                  Delete
                </button>
              </td>
            </tr>

          </template>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl w-full max-w-md space-y-4">

        <h2 class="text-lg font-bold">
          {{ editingId ? 'Edit Category' : 'Add Category' }}
        </h2>

        <div>
          <label class="text-sm font-medium">Name *</label>
          <input v-model="form.name" placeholder="e.g. Shop By Brand"
            class="border w-full p-2 rounded-lg mt-1 focus:outline-none focus:ring-1 focus:ring-black" />
        </div>

        <div>
          <label class="text-sm font-medium">Image URL</label>
          <input v-model="form.image" placeholder="https://..."
            class="border w-full p-2 rounded-lg mt-1 focus:outline-none focus:ring-1 focus:ring-black" />
          <img v-if="form.image" :src="form.image"
            class="w-full h-24 object-cover rounded-lg mt-2" />
        </div>

        <div>
          <label class="text-sm font-medium">Parent Category</label>
          <select v-model="form.parent_id"
            class="border w-full p-2 rounded-lg mt-1 focus:outline-none focus:ring-1 focus:ring-black">
            <option value="">None (Main Category)</option>
            <option
              v-for="c in allCategories.filter(c => !c.parent_id)"
              :key="c.id"
              :value="c.id"
            >
              {{ c.name }}
            </option>
          </select>
          <p class="text-xs text-gray-400 mt-1">
            Leave empty for a main category. Select a parent to make it a subcategory.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <label class="text-sm font-medium">Status</label>
          <button
            type="button"
            @click="form.is_active = !form.is_active"
            :class="form.is_active ? 'bg-green-500' : 'bg-gray-400'"
            class="px-4 py-1 rounded-full text-white text-sm transition"
          >
            {{ form.is_active ? 'Active' : 'Inactive' }}
          </button>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button
            @click="showModal = false; resetForm()"
            class="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="save"
            :disabled="loading"
            class="px-4 py-2 bg-black text-white rounded-lg text-sm disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : editingId ? 'Update' : 'Create' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>