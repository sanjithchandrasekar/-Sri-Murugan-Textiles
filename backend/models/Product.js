import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['shirts', 'tshirts', 'jeans', 'cotton-pants', 'trousers', 'track-pants', 'three-quarter', 'innerwear'],
  },
  description: { type: String, default: '' },
  originalPrice: { type: Number, required: true, min: 0 },
  offerPrice: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  sizes: [{ type: String }],
  stock: { type: Number, default: 0, min: 0 },
  badge: { type: String, enum: ['Best Seller', 'Trending', 'Factory Price', 'New Arrival', 'Limited', ''] },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true })

productSchema.index({ name: 'text', category: 1 })

export default mongoose.model('Product', productSchema)
