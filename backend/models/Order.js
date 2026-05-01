import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  image: String,
  size: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
})

const shippingAddressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: { type: String, enum: ['cod', 'razorpay'], default: 'cod' },
  paymentResult: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
  },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, default: 0 },
  discountPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['placed', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'placed',
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
  }],
  couponCode: String,
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
