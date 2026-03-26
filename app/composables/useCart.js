export const useCart = () => {
  const cart = useState('cart', () => [])

  const add = (product) => {
    const existing = cart.value.find(p => p.id === product.id)
    if (existing) existing.qty++
    else cart.value.push({ ...product, qty: 1 })
  }

  const remove = (id) => {
    cart.value = cart.value.filter(p => p.id !== id)
  }

  return { cart, add, remove }
}