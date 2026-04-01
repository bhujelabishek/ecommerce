// middleware/auth.js
export default defineNuxtRouteMiddleware((to) => {
  const { token, user } = useAuth()

  const adminRoutes = to.path.startsWith('/admin')
  const protectedRoutes = to.path.startsWith('/dashboard') || to.path.startsWith('/checkout')

  if (!token.value && (adminRoutes || protectedRoutes)) {
    return navigateTo('/login')
  }

  if (adminRoutes && user.value?.role !== 'admin') {
    return navigateTo('/')
  }
})