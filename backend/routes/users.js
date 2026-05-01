import express from 'express'
import User from '../models/User.js'
import { protect, admin, generateToken } from '../middleware/auth.js'

const router = express.Router()

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' })
    const user = await User.create({ name, email, password })
    res.status(201).json({ token: generateToken(user._id), user: user.toPublicJSON() })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    res.json({ token: generateToken(user._id), user: user.toPublicJSON() })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user)
})

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (req.body.name) user.name = req.body.name
    if (req.body.password) user.password = req.body.password
    if (req.body.addresses) user.addresses = req.body.addresses
    await user.save()
    res.json(user.toPublicJSON())
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// GET /api/users - admin only
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json({ users, total: users.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
