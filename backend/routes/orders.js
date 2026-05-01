import express from 'express'
import Order from '../models/Order.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

// POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user._id, statusHistory: [{ status: 'placed' }] })
    res.status(201).json({ order })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// GET /api/orders/my
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/orders - admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
    res.json({ orders, total: orders.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/orders/:id/status - admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { statusHistory: { status, timestamp: new Date() } },
        ...(status === 'delivered' ? { isPaid: order?.paymentMethod === 'cod', paidAt: new Date() } : {}),
      },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ order })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
