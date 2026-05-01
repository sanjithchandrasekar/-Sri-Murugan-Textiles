import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const badgeColors = {
  'Best Seller': 'bg-yellow-500',
  'Trending': 'bg-purple-500',
  'Factory Price': 'bg-[#c41e3a]',
  'New Arrival': 'bg-green-500',
  'Limited': 'bg-orange-500',
}

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const discount = Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)
  const wishlisted = isWishlisted(product._id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="product-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl group"
    >
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden aspect-[3/4] bg-gray-50">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`${badgeColors[product.badge] || 'bg-gray-800'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${wishlisted
            ? 'bg-[#c41e3a] text-white'
            : 'bg-white text-gray-400 hover:text-[#c41e3a] opacity-0 group-hover:opacity-100'
            }`}
        >
          <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-2">
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product) }}
            className="w-full bg-[#c41e3a] text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#9b1527] transition-colors"
          >
            <ShoppingCart size={14} /> Quick Add
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link to={`/products/${product._id}`}>
          <p className="text-xs text-gray-400 capitalize mb-0.5">{product.category?.replace('-', ' ')}</p>
          <h3 className="text-gray-800 font-semibold text-sm line-clamp-2 leading-tight hover:text-[#c41e3a] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[#c41e3a] font-bold text-base">₹{product.offerPrice}</span>
          {product.originalPrice > product.offerPrice && (
            <span className="text-gray-400 line-through text-xs">₹{product.originalPrice}</span>
          )}
        </div>

        {/* Sizes */}
        {product.sizes && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {product.sizes.slice(0, 4).map(s => (
              <span key={s} className="text-[10px] border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
                {s}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[10px] text-gray-400">+{product.sizes.length - 4}</span>
            )}
          </div>
        )}

        {/* Stock */}
        {product.stock <= 10 && product.stock > 0 && (
          <p className="text-orange-500 text-[10px] font-medium mt-1 flex items-center gap-1">
            <Zap size={10} /> Only {product.stock} left!
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-red-500 text-[10px] font-medium mt-1">Out of Stock</p>
        )}
      </div>
    </motion.div>
  )
}
