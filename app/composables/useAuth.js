// composables/useAuth.js
export const useAuth = () => {

  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  const user = useState('auth_user', () => null)

  // 👤 GET USER
  const getUser = async () => {
    if (!token.value) return null

    try {
      const res = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      return res.user
    } catch {
      return null
    }
  }

  // ✅ INIT USER - always re-fetch on navigation (no early return if user exists)
  const initUser = async () => {
    if (!token.value) {
      user.value = null
      return
    }

    // ❌ removed: if (user.value) return  ← this was causing stale state

    try {
      user.value = await getUser()
    } catch {
      token.value = null
      user.value = null
    }
  }

  // 🔐 REGISTER
  const register = async (firstName, lastName, email, password, age) => {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: { firstName, lastName, email, password, age }
    })
  }

  // 🔑 LOGIN
  const login = async (email, password) => {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })

    token.value = res.token

    try {
      user.value = await getUser()
    } catch {
      user.value = null
    }

    return { res, user: user.value }
  }

  // ✅ REACTIVE
  const isLoggedIn = computed(() => !!token.value)

  // 🚪 LOGOUT
  const logout = () => {
    token.value = null
    user.value = null
    navigateTo('/')
  }

  return {
    register,
    login,
    isLoggedIn,
    logout,
    getUser,
    initUser,
    token,
    user
  }
}