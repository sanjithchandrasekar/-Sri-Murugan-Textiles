import express from 'express'
import Product from '../models/Product.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

// GET /api/products - with search, filter, pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 20, featured, trending } = req.query
    const query = {}

    if (search) query.$text = { $search: search }
    if (category) query.category = category
    if (featured === 'true') query.isFeatured = true
    if (trending === 'true') query.isTrending = true

    const sortOption = {
      price_low: { offerPrice: 1 },
      price_high: { offerPrice: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
    }[sort] || { createdAt: -1 }

    const skip = (page - 1) * Number(limit)
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ])

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/products - admin only
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json({ product })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/products/:id - admin only
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ product })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/products/:id - admin only
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
