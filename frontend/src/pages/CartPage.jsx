import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, Tag, MessageCircle, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { validateCoupon } from '../services/api'
import toast from 'react-hot-toast'
import { STORE_INFO } from '../data/constants'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponValid, setCouponValid] = useState(false)
  const [couponLoading, setCouponLoading] = useState(false)
  const navigate = useNavigate()

  const handleCoupon = async () => {
    if (!coupon.trim()) return
    setCouponLoading(true)
    try {
      const res = await validateCoupon(coupon, cartTotal)
      setDiscount(res.data.discount)
      setCouponValid(true)
      toast.success(`Coupon applied! Saved ₹${res.data.discount}`)
    } catch {
      // Demo coupons
      const demos = { 'FACTORY10': 0.1, 'SAVE20': 0.2, 'FIRSTBUY': 0.15 }
      const pct = demos[coupon.toUpperCase()]
      if (pct) {
        const d = Math.round(cartTotal * pct)
        setDiscount(d)
        setCouponValid(true)
        toast.success(`Coupon applied! Saved ₹${d}`)
      } else {
        toast.error('Invalid coupon code')
        setCouponValid(false)
        setDiscount(0)
      }
    }
    setCouponLoading(false)
  }

  const finalTotal = cartTotal - discount
  const shipping = finalTotal > 999 ? 0 : 60

  if (cartItems.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center py-24 px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="text-8xl mb-6 text-center">🛒</div>
        <h2 className="text-2xl font-black text-gray-800 text-center mb-2" style={{ fontFamily: 'Poppins' }}>Your cart is empty!</h2>
        <p className="text-gray-500 text-center mb-8">Add some products to get started</p>
        <Link to="/products" className="bg-[#c41e3a] text-white px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#9b1527] transition-colors">
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
      </motion.div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8" style={{ fontFamily: 'Poppins' }}>Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, i) => (
            <motion.div
              key={`${item._id}-${item.selectedSize}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4"
            >
              <Link to={`/products/${item._id}`} className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item._id}`} className="font-semibold text-gray-800 text-sm hover:text-[#c41e3a] transition-colors line-clamp-2">
                  {item.name}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Size: {item.selectedSize}</span>
                  {item.badge && <span className="text-xs bg-red-50 text-[#c41e3a] px-2 py-0.5 rounded-full">{item.badge}</span>}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity - 1)}
                      className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1.5 font-bold text-sm text-gray-800 min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#c41e3a]">₹{item.offerPrice * item.quantity}</div>
                    {item.quantity > 1 && <div className="text-xs text-gray-400">₹{item.offerPrice} each</div>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item._id, item.selectedSize)}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <Link to="/products" className="text-sm text-gray-500 hover:text-[#c41e3a] flex items-center gap-1 transition-colors">
              ← Continue Shopping
            </Link>
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition-colors">
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Tag size={16} className="text-[#c41e3a]" /> Coupon Code
            </h3>
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={e => setCoupon(e.target.value.toUpperCase())}
                placeholder="FACTORY10"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#c41e3a]"
                disabled={couponValid}
              />
              <button
                onClick={handleCoupon}
                disabled={couponLoading || couponValid}
                className="bg-[#c41e3a] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#9b1527] transition-colors disabled:opacity-50"
              >
                {couponLoading ? '...' : couponValid ? '✓' : 'Apply'}
              </button>
            </div>
            {couponValid && <p className="text-green-600 text-xs mt-2">✅ Coupon applied! Saved ₹{discount}</p>}
            <p className="text-gray-400 text-xs mt-2">Try: FACTORY10, SAVE20, FIRSTBUY</p>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{cartTotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {shipping === 0 && (
                <p className="text-green-600 text-xs bg-green-50 px-3 py-1.5 rounded-lg">🎉 Free shipping on orders above ₹999!</p>
              )}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between font-black text-gray-900 text-lg">
                  <span>Total</span>
                  <span className="text-[#c41e3a]">₹{finalTotal + shipping}</span>
                </div>
                {discount > 0 && <p className="text-green-600 text-xs mt-1">You save ₹{discount + (cartTotal > 999 ? 60 : 0)}!</p>}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkout')}
              className="w-full mt-5 bg-[#c41e3a] text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-[#9b1527] transition-colors shadow-lg"
            >
              Proceed to Checkout <ChevronRight size={18} />
            </motion.button>

            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(
                `Hi! I want to place an order:\n` +
                cartItems.map(i => `• ${i.name} (${i.selectedSize}) x${i.quantity} = ₹${i.offerPrice * i.quantity}`).join('\n') +
                `\n\nTotal: ₹${finalTotal + shipping}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full mt-3 bg-green-500 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={16} /> Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
