import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, MessageCircle, Star, Truck, Shield, RefreshCw, Minus, Plus, ChevronLeft, Share2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { DEMO_PRODUCTS, STORE_INFO, SIZES } from '../data/constants'
import { getProduct, getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  useEffect(() => {
    setLoading(true)
    getProduct(id)
      .then(res => {
        setProduct(res.data)
        if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0])
        getProducts({ category: res.data.category, limit: 4 })
          .then(r => setRelated(r.data?.products?.filter(p => p._id !== id) || []))
          .catch(() => setRelated(DEMO_PRODUCTS.filter(p => p.category === res.data.category && p._id !== id).slice(0, 4)))
      })
      .catch(() => {
        const demo = DEMO_PRODUCTS.find(p => p._id === id) || DEMO_PRODUCTS[0]
        setProduct(demo)
        if (demo.sizes?.length) setSelectedSize(demo.sizes[0])
        setRelated(DEMO_PRODUCTS.filter(p => p.category === demo.category && p._id !== id).slice(0, 4))
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="shimmer aspect-[3/4] rounded-2xl" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className="shimmer h-6 rounded w-full" />)}
        </div>
      </div>
    </div>
  )

  if (!product) return null

  const discount = Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)
  const wishlisted = isWishlisted(product._id)

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('Please select a size!'); return }
    addToCart(product, selectedSize, quantity)
  }

  const handleBuyNow = () => {
    if (!selectedSize) { toast.error('Please select a size!'); return }
    addToCart(product, selectedSize, quantity)
    navigate('/cart')
  }

  const whatsappMsg = encodeURIComponent(
    `Hi! I want to order:\n*${product.name}*\nSize: ${selectedSize}\nQty: ${quantity}\nPrice: ₹${product.offerPrice * quantity}\n\nPlease confirm availability.`
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-[#c41e3a] transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <span>/</span>
        <Link to="/products" className="hover:text-[#c41e3a]">Products</Link>
        <span>/</span>
        <span className="text-gray-800 capitalize">{product.category?.replace('-', ' ')}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 mb-4">
            <img
              src={product.images?.[activeImage] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {discount}% OFF
              </span>
            )}
            {product.badge && (
              <span className="absolute top-4 right-4 bg-[#c41e3a] text-white text-xs font-bold px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${wishlisted ? 'bg-[#c41e3a] text-white' : 'bg-white text-gray-400 hover:text-[#c41e3a]'}`}
            >
              <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Thumbnail row */}
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-[#c41e3a]' : 'border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-gray-400 capitalize mb-2">{product.category?.replace(/-/g, ' ')}</p>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <span className="font-semibold text-sm text-gray-700">{product.rating}</span>
              <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-black text-[#c41e3a]">₹{product.offerPrice}</span>
            {product.originalPrice > product.offerPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-0.5 rounded-full">
                  Save ₹{product.originalPrice - product.offerPrice}
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="mb-5">
            {product.stock > 10 ? (
              <span className="text-green-600 text-sm font-medium">✅ In Stock</span>
            ) : product.stock > 0 ? (
              <span className="text-orange-500 text-sm font-medium">⚠️ Only {product.stock} left!</span>
            ) : (
              <span className="text-red-500 text-sm font-medium">❌ Out of Stock</span>
            )}
          </div>

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="font-semibold text-gray-800 mb-2 text-sm">Size: <span className="text-[#c41e3a]">{selectedSize}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 border-2 rounded-xl text-sm font-semibold transition-all ${selectedSize === s
                      ? 'border-[#c41e3a] bg-[#c41e3a] text-white'
                      : 'border-gray-200 text-gray-600 hover:border-[#c41e3a] hover:text-[#c41e3a]'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="font-semibold text-gray-800 text-sm">Quantity:</p>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-gray-50 text-gray-600 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 font-bold text-gray-800 min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-3 py-2 hover:bg-gray-50 text-gray-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="text-gray-500 text-sm">Total: <strong className="text-[#c41e3a]">₹{product.offerPrice * quantity}</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 border-2 border-[#c41e3a] text-[#c41e3a] py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <ShoppingCart size={18} /> Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-[#c41e3a] text-white py-3.5 rounded-2xl font-bold hover:bg-[#9b1527] transition-colors disabled:opacity-50"
              >
                Buy Now
              </motion.button>
            </div>
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=${whatsappMsg}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-green-500 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={18} /> Order via WhatsApp
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
            {[
              { icon: Truck, text: 'Fast Delivery' },
              { icon: Shield, text: '100% Genuine' },
              { icon: RefreshCw, text: 'Easy Returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1 text-center">
                <Icon size={18} className="text-[#c41e3a]" />
                <span className="text-xs text-gray-600 font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: 'Poppins' }}>You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  )
}
