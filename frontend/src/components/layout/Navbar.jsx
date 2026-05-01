import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Search, Heart, User, Menu, X, Sun, Moon,
  Phone, ChevronDown
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { useTheme } from '../../context/ThemeContext'
import { CATEGORIES, STORE_INFO } from '../../data/constants'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [catDropdown, setCatDropdown] = useState(false)
  const { cartCount } = useCart()
  const { user, logout } = useAuth()
  const { wishlist } = useWishlist()
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#9b1527] text-white text-xs py-1.5 px-4 flex justify-between items-center">
        <span className="font-medium">🎉 Factory Direct Prices – No Middleman!</span>
        <div className="flex items-center gap-4">
          {STORE_INFO.phones.map(p => (
            <a key={p} href={`tel:${p}`} className="flex items-center gap-1 hover:text-yellow-300 transition-colors">
              <Phone size={10} />
              {p.replace(/(\d{5})(\d{5})/, '$1 $2')}
            </a>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white shadow-lg'
        : 'bg-white'
        } ${darkMode ? 'dark:bg-gray-900' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c41e3a] to-[#9b1527] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">SM</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-[#c41e3a] text-base leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Sri Murugan
              </div>
              <div className="text-gray-500 text-xs leading-tight">Textiles</div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-[#c41e3a] font-medium text-sm transition-colors">Home</Link>

            <div className="relative" onMouseEnter={() => setCatDropdown(true)} onMouseLeave={() => setCatDropdown(false)}>
              <button className="flex items-center gap-1 text-gray-700 hover:text-[#c41e3a] font-medium text-sm transition-colors">
                Categories <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {catDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 min-w-[200px] grid grid-cols-2 gap-1 mt-2"
                  >
                    {CATEGORIES.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${cat.id}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-gray-700 hover:text-[#c41e3a] transition-colors"
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/products" className="text-gray-700 hover:text-[#c41e3a] font-medium text-sm transition-colors">Products</Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#c41e3a] font-medium text-sm transition-colors">Contact</Link>
            <Link to="/track-order" className="text-gray-700 hover:text-[#c41e3a] font-medium text-sm transition-colors">Track Order</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#c41e3a] transition-colors">
              <Search size={20} />
            </button>

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors hidden sm:flex">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wishlist */}
            <Link to="/dashboard?tab=wishlist" className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#c41e3a] transition-colors hidden sm:flex">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c41e3a] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#c41e3a] transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c41e3a] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-[#c41e3a] text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-[#9b1527] transition-colors">
                  <User size={16} />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#c41e3a] rounded-lg">My Dashboard</Link>
                  {user.isAdmin && (
                    <Link to="/admin" className="block px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#c41e3a] rounded-lg">Admin Panel</Link>
                  )}
                  <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-[#c41e3a] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#9b1527] transition-colors">
                Login
              </Link>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-x-0 top-0 bg-white shadow-2xl z-50 p-4"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-2xl mx-auto">
                <Search size={20} className="text-gray-400" />
                <input
                  ref={searchRef}
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for shirts, jeans, trousers..."
                  className="flex-1 text-lg outline-none text-gray-800"
                />
                <button type="submit" className="bg-[#c41e3a] text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Search
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-72 bg-white z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-[#c41e3a] text-lg" style={{ fontFamily: 'Poppins' }}>Menu</span>
                  <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-1">
                  <Link to="/" className="block px-4 py-3 rounded-xl hover:bg-red-50 text-gray-800 font-medium">🏠 Home</Link>
                  <Link to="/products" className="block px-4 py-3 rounded-xl hover:bg-red-50 text-gray-800 font-medium">🛍️ All Products</Link>
                  {CATEGORIES.map(cat => (
                    <Link key={cat.id} to={`/products?category=${cat.id}`} className="block px-4 py-3 rounded-xl hover:bg-red-50 text-gray-700">
                      {cat.icon} {cat.label}
                    </Link>
                  ))}
                  <Link to="/cart" className="block px-4 py-3 rounded-xl hover:bg-red-50 text-gray-800 font-medium">🛒 Cart ({cartCount})</Link>
                  <Link to="/contact" className="block px-4 py-3 rounded-xl hover:bg-red-50 text-gray-800 font-medium">📍 Contact</Link>
                  <Link to="/track-order" className="block px-4 py-3 rounded-xl hover:bg-red-50 text-gray-800 font-medium">📦 Track Order</Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                  {STORE_INFO.phones.map(p => (
                    <a key={p} href={`tel:${p}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600">
                      <Phone size={16} className="text-[#c41e3a]" />
                      {p.replace(/(\d{5})(\d{5})/, '$1 $2')}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
