import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, TrendingUp, DollarSign, Eye, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { getAllOrders, getProducts } from '../../services/api'

const DEMO_STATS = {
  totalSales: 128540,
  totalOrders: 234,
  totalProducts: 48,
  totalCustomers: 189,
  recentOrders: [
    { _id: 'ORD100', customer: 'Raj Kumar', total: 1198, status: 'delivered', date: '2024-01-20' },
    { _id: 'ORD101', customer: 'Murugan S', total: 899, status: 'shipped', date: '2024-01-21' },
    { _id: 'ORD102', customer: 'Senthil', total: 1498, status: 'packed', date: '2024-01-22' },
    { _id: 'ORD103', customer: 'Arun', total: 549, status: 'placed', date: '2024-01-23' },
  ]
}

const STATUS_COLORS = {
  placed: 'bg-blue-100 text-blue-700',
  packed: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(DEMO_STATS)

  useEffect(() => {
    Promise.all([getAllOrders(), getProducts()])
      .then(([ordRes, prodRes]) => {
        const orders = ordRes.data?.orders || []
        const products = prodRes.data?.products || []
        setStats(prev => ({
          ...prev,
          totalOrders: orders.length || prev.totalOrders,
          totalProducts: products.length || prev.totalProducts,
          totalSales: orders.reduce((s, o) => s + o.totalPrice, 0) || prev.totalSales,
          recentOrders: orders.slice(0, 5).length ? orders.slice(0, 5) : prev.recentOrders,
        }))
      })
      .catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Sales', value: `₹${stats.totalSales.toLocaleString('en-IN')}`, icon: DollarSign, color: 'from-[#c41e3a] to-[#9b1527]', change: '+12%' },
    { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'from-purple-600 to-purple-800', change: '+8%' },
    { label: 'Products', value: stats.totalProducts, icon: ShoppingBag, color: 'from-blue-600 to-blue-800', change: '+3' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'from-green-600 to-green-800', change: '+18' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Poppins' }}>Admin Dashboard</h1>
          <p className="text-gray-500">Sri Murugan Textiles</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products" className="bg-[#c41e3a] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#9b1527] transition-colors">
            + Add Product
          </Link>
          <Link to="/admin/orders" className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            View Orders
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon size={22} className="text-white/80" />
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">{card.change}</span>
            </div>
            <div className="text-2xl font-black">{card.value}</div>
            <div className="text-white/70 text-xs font-medium mt-1">{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-[#c41e3a] text-sm font-medium flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">#{order._id}</p>
                  <p className="text-gray-500 text-xs">{order.customer || 'Customer'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-[#c41e3a] text-sm">₹{order.totalPrice || order.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/admin/products', label: 'Manage Products', icon: ShoppingBag, color: 'bg-red-50 text-[#c41e3a]' },
              { to: '/admin/orders', label: 'Manage Orders', icon: Package, color: 'bg-blue-50 text-blue-600' },
              { to: '/products', label: 'View Store', icon: Eye, color: 'bg-green-50 text-green-600' },
              { to: '/dashboard', label: 'Analytics', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
