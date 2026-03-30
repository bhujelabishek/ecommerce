export const useProducts = () => {
  const { data: products } = useFetch('/api/products')
  return { products }
}