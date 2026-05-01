import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, Package, ShoppingBag, MessageCircle } from 'lucide-react'
import { STORE_INFO } from '../data/constants'

export default function OrderSuccessPage() {
  const orderId = `ORD${Math.random().toString(36).substr(2, 8).toUpperCase()}`
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-green-50 to-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl"
      >
        <CheckCircle size={48} className="text-white" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-2">Thank you for your order</p>
        <p className="text-sm font-semibold text-gray-600 mb-8">Order ID: <span className="text-[#c41e3a]">{orderId}</span></p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 max-w-sm mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4 text-left">
            <Package size={20} className="text-[#c41e3a]" />
            <div>
              <p className="font-semibold text-gray-800 text-sm">What's next?</p>
            </div>
          </div>
          <div className="space-y-3">
            {['Order Placed ✅', 'Order Packed 📦', 'Shipped 🚚', 'Delivered 🏠'].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-[#c41e3a] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {i + 1}
                </div>
                <span className={`text-sm ${i === 0 ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard" className="bg-[#c41e3a] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#9b1527] transition-colors flex items-center justify-center gap-2">
            <Package size={16} /> Track Order
          </Link>
          <Link to="/products" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
          <a
            href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hi! I placed order ${orderId}. Please confirm.`}
            target="_blank"
            rel="noreferrer"
            className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} /> WhatsApp Us
          </a>
        </div>
      </motion.div>
    </div>
  )
}
