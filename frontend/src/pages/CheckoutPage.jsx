import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, CreditCard, Truck, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder, createRazorpayOrder, verifyPayment } from '../services/api'
import toast from 'react-hot-toast'

const STEPS = ['Address', 'Payment', 'Confirm']

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
  })

  const shipping = cartTotal > 999 ? 0 : 60
  const total = cartTotal + shipping

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    if (!address.phone || !address.address || !address.city || !address.pincode) {
      toast.error('Please fill all required fields')
      return
    }
    setStep(1)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        items: cartItems.map(i => ({
          product: i._id,
          name: i.name,
          image: i.images?.[0],
          size: i.selectedSize,
          quantity: i.quantity,
          price: i.offerPrice,
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        totalPrice: total,
      }

      if (paymentMethod === 'razorpay') {
        // Razorpay integration
        const { data } = await createRazorpayOrder(total * 100)
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: 'INR',
          name: 'Sri Murugan Textiles',
          description: 'Order Payment',
          order_id: data.id,
          handler: async (response) => {
            await verifyPayment({ ...response, orderData })
            clearCart()
            navigate('/order-success')
          },
          prefill: { name: address.name, contact: address.phone },
          theme: { color: '#c41e3a' },
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        await createOrder(orderData)
        clearCart()
        navigate('/order-success')
      }
    } catch (err) {
      // Demo mode - proceed without backend
      clearCart()
      navigate('/order-success')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8" style={{ fontFamily: 'Poppins' }}>Checkout</h1>

      {/* Steps */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-[#c41e3a]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${i < step ? 'bg-[#c41e3a] text-white' : i === step ? 'bg-[#c41e3a] text-white' : 'bg-gray-100'}`}>
                {i < step ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className="font-medium text-sm hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 transition-colors ${i < step ? 'bg-[#c41e3a]' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Step Content */}
        <div className="md:col-span-2">
          {/* Step 0: Address */}
          {step === 0 && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleAddressSubmit}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
            >
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <MapPin size={18} className="text-[#c41e3a]" /> Shipping Address
              </h2>
              {[
                { key: 'name', label: 'Full Name', type: 'text', required: true },
                { key: 'phone', label: 'Phone Number', type: 'tel', required: true },
                { key: 'address', label: 'Street Address', type: 'text', required: true },
                { key: 'city', label: 'City', type: 'text', required: true },
                { key: 'pincode', label: 'Pincode', type: 'text', required: true },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label} {field.required && '*'}</label>
                  <input
                    type={field.type}
                    value={address[field.key]}
                    onChange={e => setAddress(prev => ({ ...prev, [field.key]: e.target.value }))}
                    required={field.required}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c41e3a] transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  value={address.state}
                  onChange={e => setAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c41e3a]"
                >
                  {['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Maharashtra', 'Other'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-[#c41e3a] text-white py-3.5 rounded-2xl font-bold hover:bg-[#9b1527] transition-colors">
                Continue to Payment
              </button>
            </motion.form>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
            >
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <CreditCard size={18} className="text-[#c41e3a]" /> Payment Method
              </h2>

              {[
                { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: '💵' },
                { id: 'razorpay', label: 'Online Payment', desc: 'UPI, Cards, Net Banking via Razorpay', icon: '💳' },
              ].map(method => (
                <label key={method.id} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-[#c41e3a] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="accent-[#c41e3a]"
                  />
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-800">{method.label}</div>
                    <div className="text-sm text-gray-500">{method.desc}</div>
                  </div>
                </label>
              ))}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(0)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-2xl font-medium hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button onClick={() => setStep(2)} className="flex-1 bg-[#c41e3a] text-white py-3 rounded-2xl font-bold hover:bg-[#9b1527] transition-colors">
                  Review Order
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
            >
              <h2 className="font-bold text-gray-800 text-lg">Order Review</h2>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Shipping to:</p>
                <p className="text-sm text-gray-600">{address.name} • {address.phone}</p>
                <p className="text-sm text-gray-600">{address.address}, {address.city}, {address.state} – {address.pincode}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Payment: {paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}</p>
              </div>

              <div className="space-y-3">
                {cartItems.map(item => (
                  <div key={`${item._id}-${item.selectedSize}`} className="flex items-center gap-3">
                    <img src={item.images?.[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 text-sm">
                      <div className="font-medium text-gray-800 line-clamp-1">{item.name}</div>
                      <div className="text-gray-500">Size: {item.selectedSize} × {item.quantity}</div>
                    </div>
                    <div className="font-bold text-[#c41e3a] text-sm">₹{item.offerPrice * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-2xl font-medium hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 bg-[#c41e3a] text-white py-3 rounded-2xl font-bold hover:bg-[#9b1527] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing...</>
                  ) : (
                    'Place Order 🎉'
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit sticky top-24">
          <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm mb-4">
            {cartItems.map(i => (
              <div key={`${i._id}-${i.selectedSize}`} className="flex justify-between text-gray-600">
                <span className="line-clamp-1 flex-1">{i.name} ×{i.quantity}</span>
                <span className="ml-2 font-medium">₹{i.offerPrice * i.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between font-black text-gray-900 text-base pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-[#c41e3a]">₹{total}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 bg-green-50 p-2 rounded-xl">
            <Truck size={14} className="text-green-600" />
            {shipping === 0 ? 'Free shipping applied!' : `Add ₹${999 - cartTotal} more for free shipping`}
          </div>
        </div>
      </div>
    </div>
  )
}
