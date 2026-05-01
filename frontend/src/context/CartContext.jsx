import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('smt_cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('smt_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, size = 'M', quantity = 1) => {
    setCartItems(prev => {
      const key = `${product._id}-${size}`
      const exists = prev.find(i => `${i._id}-${i.selectedSize}` === key)
      if (exists) {
        toast.success('Quantity updated!')
        return prev.map(i =>
          `${i._id}-${i.selectedSize}` === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      toast.success('Added to cart!')
      return [...prev, { ...product, selectedSize: size, quantity }]
    })
  }

  const removeFromCart = (id, size) => {
    setCartItems(prev => prev.filter(i => !(i._id === id && i.selectedSize === size)))
    toast.success('Removed from cart')
  }

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) return
    setCartItems(prev =>
      prev.map(i =>
        i._id === id && i.selectedSize === size ? { ...i, quantity } : i
      )
    )
  }

  const clearCart = () => setCartItems([])

  const cartTotal = cartItems.reduce((sum, i) => sum + i.offerPrice * i.quantity, 0)
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}
