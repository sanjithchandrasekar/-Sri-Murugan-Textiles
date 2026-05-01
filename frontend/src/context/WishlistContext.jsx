import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export const useWishlist = () => useContext(WishlistContext)

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('smt_wishlist')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('smt_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i._id === product._id)
      if (exists) {
        toast.success('Removed from wishlist')
        return prev.filter(i => i._id !== product._id)
      }
      toast.success('Added to wishlist!')
      return [...prev, product]
    })
  }

  const isWishlisted = (id) => wishlist.some(i => i._id === id)

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}
