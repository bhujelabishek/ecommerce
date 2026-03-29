<script setup>
definePageMeta({
    layout: 'admins'
})

const products = ref([])
const showModal = ref(false)
const file = ref(null)

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

const fetchCategories = async () => {
    categories.value = await $fetch('/api/categories')
}

onMounted(() => {
    fetchProducts()
    fetchCategories()
})

// FETCH PRODUCTS
const fetchProducts = async () => {
    const res = await $fetch('/api/admin/products')
    products.value = res
}

onMounted(fetchProducts)

// HANDLE FILE
const handleFile = (e) => {
    file.value = e.target.files[0]
}

// CREATE PRODUCT
const createProduct = async () => {
    try {
        let imagePath = ''

        // upload file first
        if (file.value) {
            const fd = new FormData()
            fd.append('file', file.value)

            const uploadRes = await $fetch('/api/upload', {
                method: 'POST',
                body: fd
            })

            imagePath = uploadRes.path
        }

        // create product
        await $fetch('/api/admin/products', {
            method: 'POST',
            body: {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
                category_id: Number(form.category_id),
                rating: Number(form.rating),
                image: imagePath
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        showModal.value = false
        fetchProducts()

    } catch (err) {
        console.error(err)
        alert(err?.data?.message || err.message)
    }
}
</script>

<template>
    <div>

        <!-- HEADER -->
        <div class="flex justify-between mb-6">
            <h1 class="text-2xl font-bold">Products</h1>
            <button @click="showModal = true" class="btn">
                + Add Product
            </button>
        </div>

        <!-- TABLE -->
        <div class="bg-white rounded-xl border">
            <table class="w-full text-sm border">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="p-4 text-left">ID</th>
                        <th >Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Rating</th>
                        <th>Active</th>
                        <th>Action</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody class="bg-black text-white">
                    <tr v-for="p in products" :key="p.id" class="border-t">
                        <td class="p-4 text-left">{{ p.id }}</td>
                        <td class="p-4">{{ p.name }}</td>
                        <td>{{ p.description }}</td>
                        <td>${{ p.price }}</td>
                        <td>{{ p.stock }}</td>
                        <td>{{ p.category }}</td>
                        <td> <img :src="p.image" alt="product" class="w-16 h-16 object-cover rounded" /></td>
                        <td>
                            <span v-for="i in 5" :key="i" :class="i <= p.rating ? 'text-yellow-400' : 'text-gray-300'">
                                ★
                            </span>
                        </td>
                        <td>
                            <button @click="toggleStatus(p)" :class="p.is_active ? 'bg-green-500' : 'bg-gray-400'"
                                class="px-3 py-1 rounded text-white">
                                {{ p.is_active ? 'Active' : 'Inactive' }}
                            </button>
                        </td>

                        <td class="space-x-2">
                            <NuxtLink :to="`/admin/products/${p.id}`"
                            class="inline-block px-4 py-2 bg-white text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-[0_0_10px_blue] transform hover:scale-105 transition duration-300 ">
                            Edit</NuxtLink>
                           
                            <button @click="deleteProduct(p.id)" 
                              class="px-4 py-2 bg-white text-red-500 rounded-lg hover:bg-red-500 hover:text-white hover:shadow-[0_0_5px_red] transform hover:scale-105 transition duration-300 "
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>

        <!-- MODAL -->
        <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div class="bg-white p-6 rounded w-full max-w-lg space-y-3">

                <h2 class="text-xl font-bold  ">Add Product</h2>

                <input v-model="form.name" placeholder="Name" class="input" />
                <textarea v-model="form.description" placeholder="Description" class="input" />
                <input v-model="form.price" type="number" placeholder="Price" class="input" />
                <input v-model="form.stock" type="number" placeholder="Stock" class="input" />

                <!-- file -->
                <input type="file" @change="handleFile" class="input" />
                <!-- CATEGORY ID (for now manual) -->
                <select v-model="form.category_id" class="input">
                    <option disabled value="">Select Category</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">
                        {{ c.name }}
                    </option>
                </select>

                <div class="flex items-center gap-2">
                    <span>Rating:</span>

                    <div class="flex">
                        <span v-for="i in 5" :key="i" @click="form.rating = i" class="cursor-pointer text-2xl"
                            :class="i <= form.rating ? 'text-yellow-400' : 'text-gray-300'">
                            ★
                        </span>
                    </div>

                    <span class="text-sm ml-2">
                        {{ form.rating }} / 5
                    </span>
                </div>

                <div class="flex items-center gap-3">
                    <span class="text-sm">Status:</span>

                    <button type="button" @click="form.is_active = !form.is_active"
                        :class="form.is_active ? 'bg-green-500' : 'bg-gray-400'"
                        class="px-4 py-2 rounded text-white transition">
                        {{ form.is_active ? 'Active' : 'Inactive' }}
                    </button>
                </div>


                <div class="flex justify-end gap-2">
                    <button @click="showModal = false">Cancel</button>
                    <button @click="createProduct" class="btn">Save</button>
                </div>

            </div>
        </div>

    </div>
</template>

<style scoped>
.btn {
    @apply bg-black text-white px-4 py-2 rounded-lg;
}

.input {
    @apply border w-full p-2 rounded;
}
</style>
