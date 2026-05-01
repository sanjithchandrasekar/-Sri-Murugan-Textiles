import express from 'express'
import Review from '../models/Review.js'
import Product from '../models/Product.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// GET /api/reviews/:productId
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/reviews/:productId
router.post('/:productId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body
    const existing = await Review.findOne({ product: req.params.productId, user: req.user._id })
    if (existing) return res.status(400).json({ message: 'You already reviewed this product' })

    const review = await Review.create({
      user: req.user._id,
      product: req.params.productId,
      name: req.user.name,
      rating: Number(rating),
      comment,
    })

    // Update product rating
    const reviews = await Review.find({ product: req.params.productId })
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    await Product.findByIdAndUpdate(req.params.productId, { rating: avgRating, numReviews: reviews.length })

    res.status(201).json(review)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
