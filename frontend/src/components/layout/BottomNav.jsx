import { Link, useLocation } from 'react-router-dom'
import { Home, ShoppingBag, ShoppingCart, Heart, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/products', icon: ShoppingBag, label: 'Shop' },
  { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: 'cart' },
  { path: '/dashboard?tab=wishlist', icon: Heart, label: 'Wishlist', badge: 'wishlist' },
  { path: '/dashboard', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const location = useLocation()
  const { cartCount } = useCart()
  const { wishlist } = useWishlist()

  const getBadge = (badge) => {
    if (badge === 'cart') return cartCount
    if (badge === 'wishlist') return wishlist.length
    return 0
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 safe-area-inset-bottom shadow-2xl">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || location.pathname + location.search === item.path
          const badge = item.badge ? getBadge(item.badge) : 0
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive
                ? 'text-[#c41e3a]'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              <div className="relative">
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#c41e3a] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-[#c41e3a]' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
