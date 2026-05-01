import express from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import Order from '../models/Order.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body
    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Razorpay error' })
  }
})

// POST /api/payment/verify
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    const order = await Order.create({
      ...orderData,
      user: req.user._id,
      isPaid: true,
      paidAt: new Date(),
      paymentResult: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
      statusHistory: [{ status: 'placed' }],
    })

    res.json({ order, message: 'Payment verified successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
