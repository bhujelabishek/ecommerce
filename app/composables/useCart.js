export const useCart = () => {
  const cart = useState('cart', () => [])

  // load from cookie on init
  const cartCookie = useCookie('cart_data', {
    maxAge: 60 * 60 * 24 * 7,
    default: () => []
  })

  // sync cookie → state on first load
  if (cart.value.length === 0 && cartCookie.value?.length > 0) {
    cart.value = cartCookie.value
  }

  // save to cookie whenever cart changes
  const syncCookie = () => {
    cartCookie.value = cart.value
  }

  // ADD item
  const add = (product) => {
    const existing = cart.value.find(i => i.id === product.id)
    if (existing) {
      existing.qty += product.qty || 1
    } else {
      cart.value.push({ ...product, qty: product.qty || 1 })
    }
    syncCookie()
  }

  // REMOVE item
  const remove = (productId) => {
    cart.value = cart.value.filter(i => i.id !== productId)
    syncCookie()
  }

  // UPDATE quantity
  const updateQty = (productId, qty) => {
    const item = cart.value.find(i => i.id === productId)
    if (item) {
      if (qty < 1) {
        remove(productId)
      } else {
        item.qty = qty
        syncCookie()
      }
    }
  }

  // CLEAR cart
  const clear = () => {
    cart.value = []
    cartCookie.value = []
  }

  // TOTAL price
  const total = computed(() =>
    cart.value.reduce((sum, i) => sum + Number(i.price) * i.qty, 0)
  )

  // TOTAL item count
  const count = computed(() =>
    cart.value.reduce((sum, i) => sum + i.qty, 0)
  )

  return { cart, add, remove, updateQty, clear, total, count }
}