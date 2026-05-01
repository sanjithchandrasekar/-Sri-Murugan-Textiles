import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sri-murugan-textiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, quality: 'auto', fetch_format: 'auto' }],
  },
})

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

// POST /api/upload
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' })
    res.json({ url: req.file.path, publicId: req.file.filename })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
