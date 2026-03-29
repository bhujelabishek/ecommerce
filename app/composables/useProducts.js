export const useProducts = () => {
  const products = useState('products', () => [
    {
      id: 1,
      name: "Shoes",
      price: 100,
      image: "https://via.placeholder.com/200"
    },
    {
      id: 2,
      name: "T-shirt",
      price: 50,
      image: "https://via.placeholder.com/200"
    }
  ])

  return { products }
}

