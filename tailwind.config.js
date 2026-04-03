// tailwind.config.js  ← create this file
export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        brand: '#ff7700'
      }
    }
  }
}