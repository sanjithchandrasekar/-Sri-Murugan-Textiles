import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Package, Heart, User, MapPin, LogOut, ShoppingBag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'
import { getMyOrders } from '../services/api'

const STATUS_COLORS = {
  placed: 'bg-blue-100 text-blue-700',
  packed: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const DEMO_ORDERS = [
  { _id: 'ORD001', items: [{ name: 'Premium Cotton Shirt', quantity: 2, price: 599, size: 'L' }], totalPrice: 1258, status: 'delivered', createdAt: '2024-01-15' },
  { _id: 'ORD002', items: [{ name: 'Slim Fit Jeans', quantity: 1, price: 899, size: '32' }], totalPrice: 959, status: 'shipped', createdAt: '2024-01-20' },
]

export default function DashboardPage() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders')
  const [orders, setOrders] = useState(DEMO_ORDERS)
  const { user, logout } = useAuth()
  const { wishlist } = useWishlist()

  useEffect(() => {
    getMyOrders().then(res => setOrders(res.data)).catch(() => {})
  }, [])

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#c41e3a] to-[#9b1527] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Poppins' }}>
              Hello, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#c41e3a] text-[#c41e3a]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders yet. Start shopping!</p>
              <Link to="/products" className="mt-4 inline-block bg-[#c41e3a] text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
                Shop Now
              </Link>
            </div>
          ) : (
            orders.map(order => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-gray-800">#{order._id}</p>
                    <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                    <span className="font-black text-[#c41e3a]">₹{order.totalPrice}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-[#c41e3a] rounded-full" />
                      {item.name} × {item.quantity} (Size: {item.size || item.selectedSize}) – ₹{item.price}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your wishlist is empty</p>
              <Link to="/products" className="mt-4 inline-block bg-[#c41e3a] text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
                Discover Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlist.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-md">
          <h3 className="font-bold text-gray-800 mb-4">Account Details</h3>
          <div className="space-y-4">
            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Role', value: user?.isAdmin ? 'Admin' : 'Customer' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">{f.label}</label>
                <p className="text-gray-800 font-medium mt-0.5">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
