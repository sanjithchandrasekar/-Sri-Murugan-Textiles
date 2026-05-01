import express from 'express'
import Coupon from '../models/Coupon.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

// POST /api/coupons/validate
router.post('/validate', protect, async (req, res) => {
  try {
    const { code, amount } = req.body
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })

    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' })
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon expired' })
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon limit reached' })
    if (amount < coupon.minOrder) return res.status(400).json({ message: `Minimum order ₹${coupon.minOrder} required` })

    const discount = coupon.discountType === 'percentage'
      ? Math.round(amount * (coupon.discountValue / 100))
      : coupon.discountValue

    res.json({ discount, coupon: coupon.code })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/coupons - admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    res.json(coupons)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/coupons - admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body)
    res.status(201).json(coupon)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/coupons/:id - admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id)
    res.json({ message: 'Coupon deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
