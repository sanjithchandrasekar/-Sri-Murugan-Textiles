import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'
import User from '../models/User.js'
import Coupon from '../models/Coupon.js'

dotenv.config()

const PRODUCTS = [
  { name: 'Premium Cotton Formal Shirt', category: 'shirts', originalPrice: 999, offerPrice: 599, sizes: ['S', 'M', 'L', 'XL', 'XXL'], stock: 50, badge: 'Best Seller', rating: 4.5, numReviews: 128, isFeatured: true, isTrending: true, description: 'Premium quality cotton formal shirt. Perfect for office and casual wear.', images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'] },
  { name: 'Classic Round Neck T-Shirt', category: 'tshirts', originalPrice: 499, offerPrice: 299, sizes: ['S', 'M', 'L', 'XL', 'XXL'], stock: 100, badge: 'Factory Price', rating: 4.3, numReviews: 89, isFeatured: true, description: '100% cotton round neck t-shirt.', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'] },
  { name: 'Slim Fit Denim Jeans', category: 'jeans', originalPrice: 1499, offerPrice: 899, sizes: ['30', '32', '34', '36', '38'], stock: 35, badge: 'Trending', rating: 4.6, numReviews: 203, isFeatured: true, isTrending: true, description: 'Premium slim fit denim jeans. Stretchable fabric.', images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'] },
  { name: 'Comfortable Cotton Track Pants', category: 'track-pants', originalPrice: 699, offerPrice: 449, sizes: ['S', 'M', 'L', 'XL', 'XXL'], stock: 80, badge: 'Factory Price', rating: 4.2, numReviews: 67, isTrending: true, description: 'Ultra-comfortable cotton track pants.', images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500'] },
  { name: 'Formal Trousers', category: 'trousers', originalPrice: 1199, offerPrice: 749, sizes: ['30', '32', '34', '36', '38'], stock: 45, badge: 'Best Seller', rating: 4.4, numReviews: 91, isFeatured: true, description: 'Premium formal trousers. Wrinkle-resistant fabric.', images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'] },
  { name: 'Cotton Casual Pants', category: 'cotton-pants', originalPrice: 799, offerPrice: 549, sizes: ['30', '32', '34', '36', '38'], stock: 60, badge: 'Factory Price', rating: 4.1, numReviews: 54, description: 'Lightweight cotton casual pants.', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500'] },
  { name: 'Casual 3/4 Shorts', category: 'three-quarter', originalPrice: 599, offerPrice: 399, sizes: ['S', 'M', 'L', 'XL', 'XXL'], stock: 70, badge: 'New Arrival', rating: 4.0, numReviews: 32, isTrending: true, description: 'Comfortable 3/4 length shorts.', images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=500'] },
  { name: 'Premium Innerwear Set', category: 'innerwear', originalPrice: 399, offerPrice: 249, sizes: ['S', 'M', 'L', 'XL', 'XXL'], stock: 200, badge: 'Factory Price', rating: 4.5, numReviews: 156, isFeatured: true, description: 'Premium quality innerwear. Soft cotton blend.', images: ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500'] },
]

const COUPONS = [
  { code: 'FACTORY10', discountType: 'percentage', discountValue: 10, minOrder: 0, maxUses: 1000 },
  { code: 'SAVE20', discountType: 'percentage', discountValue: 20, minOrder: 500, maxUses: 500 },
  { code: 'FIRSTBUY', discountType: 'percentage', discountValue: 15, minOrder: 0, maxUses: 100 },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  await Product.deleteMany()
  await User.deleteMany()
  await Coupon.deleteMany()

  await Product.insertMany(PRODUCTS)
  console.log('✅ Products seeded:', PRODUCTS.length)

  await User.create({ name: 'Admin', email: 'admin@test.com', password: 'admin123', isAdmin: true })
  await User.create({ name: 'Demo User', email: 'demo@test.com', password: 'demo123' })
  console.log('✅ Users seeded')

  await Coupon.insertMany(COUPONS)
  console.log('✅ Coupons seeded:', COUPONS.length)

  console.log('\n🎉 Database seeded successfully!')
  console.log('Admin: admin@test.com / admin123')
  console.log('User: demo@test.com / demo123')
  process.exit(0)
}

seed().catch(console.error)
