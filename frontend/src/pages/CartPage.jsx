import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, Tag, MessageCircle, ArrowRight } from 'lucide-react'
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

  const shipping = (cartTotal - discount) > 999 ? 0 : 60
  const finalTotal = cartTotal - discount + shipping

  const handleCoupon = async () => {
    if (!coupon.trim()) return
    setCouponLoading(true)
    try {
      const res = await validateCoupon(coupon, cartTotal)
      setDiscount(res.data.discount)
      setCouponValid(true)
      toast.success(`Coupon applied! Saved ₹${res.data.discount}`)
    } catch {
      const demos = { 'FACTORY10': 0.10, 'SAVE20': 0.20, 'FIRSTBUY': 0.15 }
      const pct = demos[coupon.toUpperCase()]
      if (pct) {
        const d = Math.round(cartTotal * pct)
        setDiscount(d); setCouponValid(true)
        toast.success(`Coupon applied! Saved ₹${d}`)
      } else {
        toast.error('Invalid coupon code')
        setCouponValid(false); setDiscount(0)
      }
    }
    setCouponLoading(false)
  }

  if (cartItems.length === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20">
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
        <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={44} className="text-[#c41e3a]" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Discover our factory direct collection and add some items!</p>
        <Link to="/products" className="btn-primary inline-flex">
          <ShoppingBag size={17} /> Start Shopping
        </Link>
      </motion.div>
    </div>
  )

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="section-container py-8">
        <h1 className="section-title mb-8" style={{ fontFamily: 'Poppins' }}>Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Cart items ─────────────────────── */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item, i) => (
              <motion.div
                key={`${item._id}-${item.selectedSize}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-start"
              >
                {/* Image */}
                <Link to={`/products/${item._id}`} className="flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden bg-gray-50">
                  <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item._id}`} className="block font-semibold text-gray-800 text-sm hover:text-[#c41e3a] transition-colors line-clamp-2 leading-snug mb-1">
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-400 capitalize mb-3">{item.category?.replace(/-/g, ' ')} · Size: <span className="font-semibold text-gray-600">{item.selectedSize}</span></p>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {/* Qty controls */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-black text-[#c41e3a] text-base">₹{(item.offerPrice * item.quantity).toLocaleString('en-IN')}</p>
                      {item.quantity > 1 && <p className="text-xs text-gray-400">₹{item.offerPrice} each</p>}
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item._id, item.selectedSize)}
                  className="flex-shrink-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 size={15} />
                </button>
              </motion.div>
            ))}

            {/* Cart footer row */}
            <div className="flex items-center justify-between pt-1">
              <Link to="/products" className="text-sm text-gray-500 hover:text-[#c41e3a] transition-colors flex items-center gap-1">
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 transition-colors font-medium">
                Clear Cart
              </button>
            </div>
          </div>

          {/* ── Order Summary ──────────────────── */}
          <div className="space-y-4">
            {/* Coupon card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                <Tag size={15} className="text-[#c41e3a]" /> Have a Coupon?
              </h3>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={e => setCoupon(e.target.value.toUpperCase())}
                  placeholder="e.g. FACTORY10"
                  className="input-base flex-1 text-sm py-2.5"
                  disabled={couponValid}
                />
                <button
                  onClick={handleCoupon}
                  disabled={couponLoading || couponValid}
                  className="px-4 py-2.5 bg-[#c41e3a] text-white rounded-xl text-sm font-bold hover:bg-[#9b1527] transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  {couponLoading ? '…' : couponValid ? '✓' : 'Apply'}
                </button>
              </div>
              {couponValid && <p className="text-emerald-600 text-xs mt-2 font-medium">✅ Saved ₹{discount}!</p>}
              <p className="text-gray-400 text-xs mt-2">Try: FACTORY10 · SAVE20 · FIRSTBUY</p>
            </div>

            {/* Summary card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>

                {shipping === 0 && (
                  <div className="bg-emerald-50 rounded-lg px-3 py-2 text-emerald-700 text-xs font-medium">
                    🎉 You qualify for free delivery!
                  </div>
                )}
                {shipping > 0 && (
                  <div className="bg-blue-50 rounded-lg px-3 py-2 text-blue-700 text-xs">
                    Add ₹{(999 - (cartTotal - discount)).toLocaleString('en-IN')} more for free delivery
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-base">
                  <span>Total</span>
                  <span className="text-[#c41e3a]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full mt-5 justify-center"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(
                  'Hi! I want to order:\n' +
                  cartItems.map(i => `• ${i.name} (Size: ${i.selectedSize}) ×${i.quantity} = ₹${i.offerPrice * i.quantity}`).join('\n') +
                  `\n\nTotal: ₹${finalTotal}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 w-full py-3 bg-[#25d366] text-white rounded-full font-bold text-sm hover:bg-[#1ebe5c] transition-colors"
              >
                <MessageCircle size={16} /> Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
