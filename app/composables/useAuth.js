export const useAuth = () => {

  // 🔥 GLOBAL STATE (reactive across app)
  const token = useState('auth_token', () => null)

  // ✅ INIT (client only)
  if (process.client && !token.value) {
    token.value = localStorage.getItem('token')
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

    // ✅ SAVE TOKEN
    if (process.client) {
      localStorage.setItem('token', res.token)
    }

    token.value = res.token // 🔥 THIS FIXES NAVBAR

    return res
  }

  // ✅ CHECK LOGIN (reactive)
  const isLoggedIn = () => {
    return !!token.value
  }

  // 🚪 LOGOUT
  const logout = () => {
    if (process.client) {
      localStorage.removeItem('token')
    }
    token.value = null
    navigateTo('/')
  }

  // 👤 GET USER
  const getUser = async () => {
    if (!token.value) return null

    const res = await $fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    return res.user
  }

  return {
    register,
    login,
    isLoggedIn,
    logout,
    getUser,
    token
  }
}