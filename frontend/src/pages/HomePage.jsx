import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, MessageCircle, Phone, ChevronRight, Star, Truck, Shield, RefreshCw, Tag, ArrowRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, DEMO_PRODUCTS, STORE_INFO } from '../data/constants'
import { getProducts } from '../services/api'

// Countdown timer
function CountdownTimer({ endTime }) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = endTime - Date.now()
      if (diff <= 0) return
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endTime])
  return (
    <div className="flex items-center gap-2">
      {[time.h, time.m, time.s].map((v, i) => (
        <span key={i} className="bg-white/20 backdrop-blur rounded-lg px-3 py-1.5 text-white font-bold text-lg min-w-[48px] text-center">
          {String(v).padStart(2, '0')}
          <span className="block text-[10px] font-normal opacity-70">{['HRS', 'MIN', 'SEC'][i]}</span>
        </span>
      ))}
    </div>
  )
}

export default function HomePage() {
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [featured, setFeatured] = useState(DEMO_PRODUCTS.filter(p => p.isFeatured))
  const [trending, setTrending] = useState(DEMO_PRODUCTS.filter(p => p.isTrending))
  const navigate = useNavigate()
  const offerEnd = useRef(Date.now() + 8 * 3600000).current

  useEffect(() => {
    getProducts({ limit: 12 })
      .then(res => {
        if (res.data?.products?.length) {
          setProducts(res.data.products)
          setFeatured(res.data.products.filter(p => p.isFeatured))
          setTrending(res.data.products.filter(p => p.isTrending))
        }
      })
      .catch(() => {}) // fallback to demo data
  }, [])

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center"
        style={{ background: 'linear-gradient(135deg, #9b1527 0%, #c41e3a 50%, #e63950 100%)' }}>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

        <div className="relative max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-white text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Factory Direct Prices – No Middleman!
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}>
              Sri Murugan
              <span className="block text-yellow-300">Textiles</span>
            </h1>

            <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed max-w-md">
              Factory Direct Branded Clothing at Best Price. Shirts, Jeans, T-Shirts & more at unbeatable prices!
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/products')}
                className="bg-white text-[#c41e3a] px-8 py-3.5 rounded-full font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
              >
                <ShoppingBag size={18} /> Shop Now
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hi! I want to know about your products.`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 text-white px-8 py-3.5 rounded-full font-bold text-base shadow-xl hover:bg-green-600 transition-all flex items-center gap-2"
              >
                <MessageCircle size={18} /> WhatsApp
              </motion.a>
            </div>

            <div className="flex gap-6">
              {STORE_INFO.phones.map(p => (
                <a key={p} href={`tel:${p}`} className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                  <Phone size={16} />
                  {p.replace(/(\d{5})(\d{5})/, '$1 $2')}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Hero Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:grid grid-cols-2 gap-4"
          >
            {featured.slice(0, 4).map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`rounded-2xl overflow-hidden shadow-2xl ${i === 0 ? 'col-span-2' : ''}`}
              >
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="w-full h-40 md:h-48 object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* TRUST BADGES */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Tag, label: 'Factory Direct', desc: 'No Middleman' },
            { icon: Truck, label: 'Fast Delivery', desc: 'Across Tamil Nadu' },
            { icon: Shield, label: '100% Genuine', desc: 'Branded Products' },
            { icon: RefreshCw, label: 'Easy Returns', desc: '7-Day Policy' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-[#c41e3a]" />
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{label}</div>
                <div className="text-gray-500 text-xs">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIMITED OFFER BANNER */}
      <section className="bg-gradient-to-r from-[#9b1527] to-[#c41e3a] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-yellow-300 font-bold text-sm uppercase tracking-wider mb-1">⏳ Limited Time Offer</p>
            <h2 className="text-white font-black text-2xl md:text-3xl" style={{ fontFamily: 'Poppins' }}>
              Up to 40% OFF on All Products!
            </h2>
          </div>
          <CountdownTimer endTime={offerEnd} />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/products')}
            className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-yellow-300 transition-colors whitespace-nowrap"
          >
            Shop Now →
          </motion.button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Poppins' }}>Shop by Category</h2>
            <p className="text-gray-500 mt-1">Find your perfect style</p>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-[#c41e3a] font-semibold text-sm hover:gap-2 transition-all">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/products?category=${cat.id}`}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gray-50 hover:bg-red-50 hover:shadow-md transition-all group text-center"
              >
                <div className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</div>
                <span className="text-gray-700 group-hover:text-[#c41e3a] font-medium text-xs transition-colors leading-tight">{cat.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Poppins' }}>Featured Products</h2>
            <p className="text-gray-500 mt-1">Handpicked best sellers</p>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-[#c41e3a] font-semibold text-sm hover:gap-2 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.slice(0, 8).map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* FACTORY DIRECT BANNER */}
      <section className="mx-4 mb-16 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)' }}>
        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="text-[#c41e3a] font-bold text-sm uppercase tracking-wider mb-2">🏭 Direct from Factory</div>
            <h2 className="text-white font-black text-4xl mb-4" style={{ fontFamily: 'Poppins' }}>
              Why Pay More?<br />
              <span className="text-yellow-400">Buy Direct!</span>
            </h2>
            <p className="text-gray-400 text-base mb-6 max-w-md">
              We source directly from manufacturers, cutting out middlemen to give you the best prices. Save up to 60% compared to retail stores!
            </p>
            <div className="flex flex-wrap gap-6">
              {[['500+', 'Products'], ['2', 'Stores'], ['10K+', 'Happy Customers'], ['40%', 'Average Savings']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-[#c41e3a] font-black text-2xl">{v}</div>
                  <div className="text-gray-400 text-sm">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/products')}
              className="bg-[#c41e3a] text-white px-8 py-4 rounded-full font-bold text-base shadow-xl"
            >
              Shop Factory Prices
            </motion.button>
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hi! I want to place a bulk order.`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 text-white px-8 py-4 rounded-full font-bold text-base text-center flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={18} /> Bulk Order via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* TRENDING */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Poppins' }}>🔥 Trending Now</h2>
              <p className="text-gray-500 mt-1">What customers are loving</p>
            </div>
            <Link to="/products?sort=trending" className="flex items-center gap-1 text-[#c41e3a] font-semibold text-sm hover:gap-2 transition-all">
              See All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trending.slice(0, 4).map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-2" style={{ fontFamily: 'Poppins' }}>
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-center mb-10">10,000+ Happy Customers</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Raj Kumar', text: 'Amazing quality shirts at factory prices! Saved a lot compared to mall prices.', rating: 5, location: 'Erode' },
              { name: 'Murugan S', text: 'The jeans are great quality. Fast delivery and easy WhatsApp ordering!', rating: 5, location: 'Bhavani' },
              { name: 'Senthil', text: 'Best place for bulk buying. Got track pants for my cricket team at wholesale rates!', rating: 5, location: 'Saralai' },
            ].map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex mb-3">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#c41e3a] to-[#9b1527] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{r.name}</div>
                    <div className="text-gray-400 text-xs">{r.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - VISIT STORES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2" style={{ fontFamily: 'Poppins' }}>Visit Our Stores</h2>
        <p className="text-gray-500 text-center mb-10">Come experience the factory direct difference!</p>

        <div className="grid md:grid-cols-2 gap-6">
          {STORE_INFO.locations.map(loc => (
            <motion.div
              key={loc.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h3 className="font-bold text-[#c41e3a] text-lg mb-2">{loc.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{loc.address}</p>
                <div className="flex gap-3">
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#c41e3a] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#9b1527] transition-colors"
                  >
                    Get Directions
                  </a>
                  {STORE_INFO.phones.map(p => (
                    <a key={p} href={`tel:${p}`} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:border-[#c41e3a] hover:text-[#c41e3a] transition-colors">
                      📞 Call
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
