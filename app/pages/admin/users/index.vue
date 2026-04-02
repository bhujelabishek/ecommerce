<script setup>
import Swal from 'sweetalert2'
import { ref, reactive, onMounted } from 'vue'

definePageMeta({
  layout: 'admins',
  middleware: 'auth'  
})
const users = ref([])

// Fetch all users
const fetchUsers = async () => {
    users.value = await $fetch('/api/admin/userss')
}

onMounted(fetchUsers)

// Toggle active status
const toggleStatus = async (user) => {
    try {
        await $fetch(`/api/admin/users/${user.id}`, {
            method: 'PUT',
            body: { role: user.role, is_active: !user.is_active }
        })
        fetchUsers()
    } catch (err) {
        console.error(err)
        Swal.fire('Error', 'Failed to update status', 'error')
    }
}

// Delete user
const deleteUser = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will permanently delete the user!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
        try {
            await $fetch(`/api/admin/userss/${id}`, { method: 'DELETE' })
            Swal.fire('Deleted!', 'User has been deleted.', 'success')
            fetchUsers()
        } catch (err) {
            console.error(err)
            Swal.fire('Error', 'Failed to delete user', 'error')
        }
    }
}
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">Users Management</h1>
        <table class="w-full border rounded">
            <thead class="bg-gray-50">
                <tr>
                    <th class="p-2 text-left">ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id" class="border-t">
                    <td class="p-2">{{ user.id }}</td>
                    <td>{{ user.first_name }}</td>
                    <td>{{ user.last_name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                        <select v-model="user.role" @change="toggleStatus(user)" class="border px-2 py-1 rounded">
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </td>
                    <td>
                        <button @click="toggleStatus(user)" :class="user.is_active ? 'bg-green-500' : 'bg-gray-400'"
                            class="px-3 py-1 rounded text-white transition">
                            {{ user.is_active ? 'Active' : 'Inactive' }}
                        </button>
                    </td>
                    <td class="space-x-2">
                        <button @click="deleteUser(user.id)"
                            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>