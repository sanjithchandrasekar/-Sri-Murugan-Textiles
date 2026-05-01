import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const BADGE_COLORS = {
  'Best Seller': 'bg-amber-500',
  'Trending': 'bg-purple-600',
  'Factory Price': 'bg-[#c41e3a]',
  'New Arrival': 'bg-emerald-500',
  'Limited': 'bg-orange-500',
}

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const discount = Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)
  const wishlisted = isWishlisted(product._id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.35 }}
      className="product-card bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
    >
      {/* ── Image area ─────────────────────── */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden bg-gray-50 flex-shrink-0" style={{ aspectRatio: '3/4' }}>
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`${BADGE_COLORS[product.badge] || 'bg-gray-700'} text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide leading-none`}>
              {product.badge}
            </span>
          )}
          {discount >= 5 && (
            <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide leading-none">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={e => { e.preventDefault(); toggleWishlist(product) }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all ${wishlisted ? 'bg-[#c41e3a] text-white' : 'bg-white/90 text-gray-400 hover:text-[#c41e3a]'}`}
          aria-label="Toggle wishlist"
        >
          <Heart size={13} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick Add — slides up on hover */}
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-250 bg-white/95 backdrop-blur-sm p-2">
          <button
            onClick={e => { e.preventDefault(); addToCart(product) }}
            className="w-full bg-[#c41e3a] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#9b1527] transition-colors"
          >
            <ShoppingCart size={13} /> Quick Add
          </button>
        </div>
      </Link>

      {/* ── Info area ──────────────────────── */}
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/products/${product._id}`} className="block mb-auto">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 leading-none capitalize">
            {product.category?.replace(/-/g, ' ')}
          </p>
          <h3 className="text-gray-800 font-semibold text-sm leading-snug hover:text-[#c41e3a] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={10} className={s <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <span className="text-[10px] text-gray-500">({product.reviews || product.numReviews || 0})</span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-[#c41e3a] font-black text-base">₹{product.offerPrice}</span>
          {product.originalPrice > product.offerPrice && (
            <span className="text-gray-400 line-through text-xs">₹{product.originalPrice}</span>
          )}
        </div>

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {product.sizes.slice(0, 5).map(s => (
              <span key={s} className="text-[9px] border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded-md font-medium">
                {s}
              </span>
            ))}
            {product.sizes.length > 5 && <span className="text-[9px] text-gray-400 self-center">+{product.sizes.length - 5}</span>}
          </div>
        )}

        {/* Low stock */}
        {product.stock <= 10 && product.stock > 0 && (
          <p className="text-orange-500 text-[10px] font-semibold mt-2 flex items-center gap-1">
            <Zap size={9} /> Only {product.stock} left
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-red-400 text-[10px] font-semibold mt-2">Out of Stock</p>
        )}
      </div>
    </motion.div>
  )
}
