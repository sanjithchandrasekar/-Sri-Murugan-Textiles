import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Package } from 'lucide-react'

const DEMO_STATUS = {
  'ORD001': { status: 'delivered', items: [{ name: 'Premium Cotton Shirt', qty: 2 }], date: '2024-01-15', eta: 'Delivered' },
  'ORD002': { status: 'shipped', items: [{ name: 'Slim Fit Jeans', qty: 1 }], date: '2024-01-20', eta: 'Expected by Jan 25' },
}

const STEPS = ['Placed', 'Packed', 'Shipped', 'Delivered']
const STEP_ICONS = ['📋', '📦', '🚚', '🏠']

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleTrack = (e) => {
    e.preventDefault()
    const data = DEMO_STATUS[orderId.toUpperCase()]
    if (data) {
      setResult(data)
      setError('')
    } else {
      setError('Order not found. Try ORD001 or ORD002')
      setResult(null)
    }
  }

  const stepIndex = result ? ['placed', 'packed', 'shipped', 'delivered'].indexOf(result.status) : -1

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <Package size={48} className="text-[#c41e3a] mx-auto mb-4" />
        <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>Track Your Order</h1>
        <p className="text-gray-500">Enter your order ID to get real-time updates</p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            placeholder="Enter Order ID (e.g. ORD001)"
            className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c41e3a] transition-colors"
          />
        </div>
        <button type="submit" className="bg-[#c41e3a] text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-[#9b1527] transition-colors">
          Track
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center mb-6">
          {error}
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-black text-gray-900 text-lg">#{orderId.toUpperCase()}</p>
              <p className="text-gray-500 text-sm">Ordered: {result.date}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              result.status === 'delivered' ? 'bg-green-100 text-green-700' :
              result.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {result.status}
            </span>
          </div>

          {/* Progress */}
          <div className="relative mb-8">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-100 rounded-full">
              <div
                className="h-full bg-[#c41e3a] rounded-full transition-all duration-1000"
                style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between relative">
              {STEPS.map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all z-10 bg-white ${i <= stepIndex ? 'border-[#c41e3a] scale-110' : 'border-gray-200'}`}>
                    {STEP_ICONS[i]}
                  </div>
                  <span className={`text-xs font-medium ${i <= stepIndex ? 'text-[#c41e3a]' : 'text-gray-400'}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">📦 Items</p>
            {result.items.map((item, i) => (
              <p key={i} className="text-sm text-gray-600">{item.name} × {item.qty}</p>
            ))}
            <p className="text-sm text-[#c41e3a] font-semibold mt-2">⏱️ {result.eta}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
