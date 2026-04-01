// plugins/auth.js
export default defineNuxtPlugin(async (nuxtApp) => {
  const { initUser } = useAuth()

  // ✅ run on first load
  await initUser()

  // ✅ run on every page navigation (this is the fix)
  nuxtApp.hook('page:start', async () => {
    await initUser()
  })
})