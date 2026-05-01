import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Search, Heart, User, Menu, X, Sun, Moon, Phone, ChevronDown } from 'lucide-react'
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
  const [catOpen, setCatOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const { cartCount } = useCart()
  const { user, logout } = useAuth()
  const { wishlist } = useWishlist()
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setCatOpen(false)
    setUserOpen(false)
  }, [location.pathname])

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
      {/* ── Announcement Bar ─────────────────── */}
      <div className="bg-[#9b1527] text-white">
        <div className="section-container flex items-center justify-between h-9 text-xs font-medium">
          <span className="hidden sm:inline">🎉 Factory Direct – No Middleman! Free Shipping above ₹999</span>
          <span className="sm:hidden">🎉 Factory Direct Prices!</span>
          <div className="flex items-center divide-x divide-white/20">
            {STORE_INFO.phones.map((p, i) => (
              <a key={p} href={`tel:${p}`} className="flex items-center gap-1 px-3 hover:text-yellow-300 transition-colors">
                <Phone size={11} />
                <span>{p.replace(/(\d{5})(\d{5})/, '$1 $2')}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Navbar ──────────────────────── */}
      <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="section-container">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-[#c41e3a] to-[#9b1527] rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white font-black text-base tracking-tight">SM</span>
              </div>
              <div className="hidden sm:block leading-none">
                <span className="block font-black text-[#c41e3a] text-base leading-tight" style={{ fontFamily: 'Poppins' }}>Sri Murugan</span>
                <span className="block text-gray-400 text-[11px] font-medium leading-tight">Textiles</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#c41e3a] rounded-lg hover:bg-red-50 transition-all">Home</Link>

              {/* Categories Dropdown */}
              <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#c41e3a] rounded-lg hover:bg-red-50 transition-all">
                  Categories <ChevronDown size={13} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50"
                    >
                      {CATEGORIES.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/products?category=${cat.id}`}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#c41e3a] transition-colors"
                        >
                          <span className="text-base">{cat.icon}</span>
                          <span className="font-medium">{cat.label}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/products" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#c41e3a] rounded-lg hover:bg-red-50 transition-all">Products</Link>
              <Link to="/contact" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#c41e3a] rounded-lg hover:bg-red-50 transition-all">Contact</Link>
              <Link to="/track-order" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#c41e3a] rounded-lg hover:bg-red-50 transition-all">Track Order</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-500 hover:text-[#c41e3a] hover:bg-red-50 rounded-lg transition-all" aria-label="Search">
                <Search size={19} />
              </button>

              {/* Dark mode */}
              <button onClick={toggleTheme} className="hidden sm:flex p-2 text-gray-500 hover:text-[#c41e3a] hover:bg-red-50 rounded-lg transition-all" aria-label="Toggle theme">
                {darkMode ? <Sun size={19} /> : <Moon size={19} />}
              </button>

              {/* Wishlist */}
              <Link to="/dashboard?tab=wishlist" className="relative hidden sm:flex p-2 text-gray-500 hover:text-[#c41e3a] hover:bg-red-50 rounded-lg transition-all" aria-label="Wishlist">
                <Heart size={19} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#c41e3a] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {wishlist.length > 9 ? '9+' : wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-gray-500 hover:text-[#c41e3a] hover:bg-red-50 rounded-lg transition-all" aria-label="Cart">
                <ShoppingCart size={19} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#c41e3a] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserOpen(v => !v)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-red-50 text-[#c41e3a] text-sm font-semibold hover:bg-red-100 transition-colors ml-1"
                  >
                    <div className="w-6 h-6 bg-[#c41e3a] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user.name[0]}
                    </div>
                    {user.name.split(' ')[0]}
                  </button>
                  <AnimatePresence>
                    {userOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50"
                      >
                        <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#c41e3a] font-medium">My Account</Link>
                        <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#c41e3a]">Orders</Link>
                        {user.isAdmin && (
                          <Link to="/admin" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#c41e3a]">Admin Panel</Link>
                        )}
                        <div className="my-1 h-px bg-gray-100 mx-3" />
                        <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium">Sign Out</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="hidden md:inline-flex items-center gap-1.5 ml-1 px-4 py-1.5 bg-[#c41e3a] text-white text-sm font-semibold rounded-full hover:bg-[#9b1527] transition-colors">
                  <User size={14} /> Login
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-1">
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Search Overlay ───────────────────── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute inset-x-0 top-0 h-16 bg-white z-50 flex items-center shadow-lg"
            >
              <form onSubmit={handleSearch} className="section-container flex items-center gap-3 w-full">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search shirts, jeans, trousers…"
                  className="flex-1 text-base text-gray-800 outline-none placeholder-gray-400 bg-transparent"
                />
                <button type="submit" className="px-4 py-1.5 bg-[#c41e3a] text-white text-sm font-semibold rounded-full hover:bg-[#9b1527] transition-colors flex-shrink-0">
                  Search
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <X size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Mobile Drawer ────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded-lg flex items-center justify-center">
                    <span className="text-white font-black text-sm">SM</span>
                  </div>
                  <span className="font-black text-[#c41e3a]" style={{ fontFamily: 'Poppins' }}>Menu</span>
                </div>
                <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer links */}
              <div className="flex-1 overflow-y-auto py-3 px-3">
                {[
                  { to: '/', icon: '🏠', label: 'Home' },
                  { to: '/products', icon: '🛍️', label: 'All Products' },
                  { to: '/cart', icon: '🛒', label: `Cart (${cartCount})` },
                  { to: '/contact', icon: '📍', label: 'Contact Us' },
                  { to: '/track-order', icon: '📦', label: 'Track Order' },
                ].map(item => (
                  <Link key={item.to} to={item.to} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 font-medium hover:bg-red-50 hover:text-[#c41e3a] transition-colors">
                    <span className="text-lg w-6 text-center">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}

                <div className="mt-2 mb-1 px-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                </div>
                {CATEGORIES.map(cat => (
                  <Link key={cat.id} to={`/products?category=${cat.id}`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-[#c41e3a] transition-colors text-sm">
                    <span className="text-base w-6 text-center">{cat.icon}</span>
                    {cat.label}
                  </Link>
                ))}
              </div>

              {/* Drawer footer */}
              <div className="border-t border-gray-100 px-5 py-4 space-y-2">
                {user ? (
                  <>
                    <Link to="/dashboard" className="flex items-center gap-2 w-full px-4 py-2.5 bg-red-50 text-[#c41e3a] rounded-xl font-semibold text-sm">
                      <User size={15} /> My Account
                    </Link>
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 font-medium">Sign Out</button>
                  </>
                ) : (
                  <Link to="/login" className="flex items-center justify-center gap-2 w-full py-3 bg-[#c41e3a] text-white rounded-xl font-bold text-sm">
                    <User size={15} /> Login / Register
                  </Link>
                )}
                <div className="flex gap-2 pt-1">
                  {STORE_INFO.phones.map(p => (
                    <a key={p} href={`tel:${p}`} className="flex-1 flex items-center justify-center gap-1 border border-gray-200 py-2 rounded-xl text-xs text-gray-600 hover:border-[#c41e3a] hover:text-[#c41e3a] transition-colors">
                      <Phone size={12} /> {p.replace(/(\d{5})(\d{5})/, '$1 $2')}
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
