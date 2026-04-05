// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  app: {
    head: {
      titleTemplate: '%s | SmokeHaven',
      title: 'SmokeHaven — Nepal\'s #1 Hookah Store'
    },
    pageTransition: { name: 'fade', mode: 'out-in' },
  },
  experimental: {
    // prevents data from going stale on navigation
    payloadExtraction: false
  }

})
