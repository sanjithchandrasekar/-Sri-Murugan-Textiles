import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Search, ChevronDown } from 'lucide-react'
import { getAllOrders, updateOrderStatus } from '../../services/api'
import toast from 'react-hot-toast'

const STATUSES = ['placed', 'packed', 'shipped', 'delivered', 'cancelled']
const STATUS_COLORS = {
  placed: 'bg-blue-100 text-blue-700',
  packed: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const DEMO_ORDERS = [
  { _id: 'ORD100', shippingAddress: { name: 'Raj Kumar', phone: '9876543210', city: 'Erode' }, items: [{ name: 'Cotton Shirt', quantity: 2, price: 599, size: 'L' }], totalPrice: 1198, status: 'delivered', paymentMethod: 'cod', createdAt: '2024-01-20' },
  { _id: 'ORD101', shippingAddress: { name: 'Murugan S', phone: '9876543211', city: 'Bhavani' }, items: [{ name: 'Slim Jeans', quantity: 1, price: 899, size: '32' }], totalPrice: 899, status: 'shipped', paymentMethod: 'razorpay', createdAt: '2024-01-21' },
  { _id: 'ORD102', shippingAddress: { name: 'Senthil R', phone: '9876543212', city: 'Saralai' }, items: [{ name: 'Track Pants', quantity: 3, price: 449, size: 'XL' }], totalPrice: 1347, status: 'packed', paymentMethod: 'cod', createdAt: '2024-01-22' },
  { _id: 'ORD103', shippingAddress: { name: 'Arun K', phone: '9876543213', city: 'Bhavani' }, items: [{ name: 'Formal Trouser', quantity: 1, price: 749, size: '34' }], totalPrice: 749, status: 'placed', paymentMethod: 'razorpay', createdAt: '2024-01-23' },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState(DEMO_ORDERS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getAllOrders()
      .then(res => { if (res.data?.orders?.length) setOrders(res.data.orders) })
      .catch(() => {})
  }, [])

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status)
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
      toast.success('Order status updated!')
    } catch {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
      toast.success('Status updated (demo)!')
    }
  }

  const filtered = orders.filter(o => {
    const matchSearch = o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = !filter || o.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8" style={{ fontFamily: 'Poppins' }}>Orders</h1>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c41e3a] w-64"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!filter ? 'bg-[#c41e3a] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            All ({orders.length})
          </button>
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-[#c41e3a] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {s} ({orders.filter(o => o.status === s).length})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.map((order, i) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-black text-gray-900">#{order._id}</p>
                <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentMethod === 'razorpay' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                  {order.paymentMethod === 'razorpay' ? '💳 Online' : '💵 COD'}
                </span>
                <span className="font-black text-[#c41e3a] text-lg">₹{order.totalPrice}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Customer */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium mb-1">Customer</p>
                <p className="font-semibold text-gray-800 text-sm">{order.shippingAddress?.name}</p>
                <p className="text-gray-500 text-xs">{order.shippingAddress?.phone}</p>
                <p className="text-gray-500 text-xs">{order.shippingAddress?.city}</p>
              </div>

              {/* Items */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium mb-1">Items</p>
                {order.items.map((item, j) => (
                  <p key={j} className="text-sm text-gray-700">
                    {item.name} × {item.quantity} ({item.size || item.selectedSize})
                  </p>
                ))}
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium mb-2">Update Status</p>
                <div className="relative">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    className={`w-full appearance-none px-3 py-2 pr-8 rounded-lg text-sm font-semibold border-0 cursor-pointer focus:outline-none capitalize ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s} className="bg-white text-gray-800">{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  )
}
