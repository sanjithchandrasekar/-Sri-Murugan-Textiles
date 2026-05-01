import { Link, useLocation } from 'react-router-dom'
import { Home, ShoppingBag, ShoppingCart, User, Heart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/products', icon: ShoppingBag, label: 'Shop' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: true },
  { to: '/dashboard?tab=wishlist', icon: Heart, label: 'Saved' },
  { to: '/dashboard', icon: User, label: 'Account' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const { cartCount } = useCart()
  const { user } = useAuth()

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-40 pb-safe">
      <div className="grid grid-cols-5 h-16">
        {NAV.map(({ to, icon: Icon, label, badge }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to.split('?')[0]))
          const dest = to === '/dashboard' && !user ? '/login' : to
          return (
            <Link
              key={to}
              to={dest}
              className={`flex flex-col items-center justify-center gap-1 relative transition-colors ${active ? 'text-[#c41e3a]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#c41e3a] rounded-b-full" />
              )}
              <div className="relative">
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {badge && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#c41e3a] text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold leading-none ${active ? 'text-[#c41e3a]' : ''}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
