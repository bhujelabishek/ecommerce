// export default defineNuxtRouteMiddleware(async () => {
//   let currentToken = null

//   if (process.client) {
//     currentToken = localStorage.getItem('token')
//   }

//   if (!currentToken) {
//     return navigateTo('/login')
//   }

//   try {
//     const res = await $fetch('/api/auth/me', {
//       headers: {
//         Authorization: `Bearer ${currentToken}`
//       }
//     })

//     console.log('MIDDLEWARE USER:', res.user)

//     if (res.user.role !== 'admin') {
//       return navigateTo('/')
//     }

//   } catch (err) {
//     console.error('MIDDLEWARE ERROR:', err)
//     return navigateTo('/login')
//   }
// })


