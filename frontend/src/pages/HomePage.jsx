import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, MessageCircle, Phone, Star, Truck, Shield, RefreshCw, Tag, ArrowRight, ChevronRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, DEMO_PRODUCTS, STORE_INFO } from '../data/constants'
import { getProducts } from '../services/api'

/* ── Countdown Timer ───────────────────────────────── */
function CountdownTimer({ endTime }) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now())
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
      {[['HRS', time.h], ['MIN', time.m], ['SEC', time.s]].map(([label, val]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl w-14 h-12 flex items-center justify-center text-white font-black text-xl tabular-nums">
            {String(val).padStart(2, '0')}
          </span>
          <span className="text-white/60 text-[10px] font-semibold mt-1 uppercase tracking-wider">{label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Section Heading ───────────────────────────────── */
function SectionHeading({ label, title, subtitle, action, actionHref }) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        {label && <p className="section-label">{label}</p>}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && (
        <Link
          to={actionHref}
          className="flex-shrink-0 flex items-center gap-1.5 text-[#c41e3a] font-semibold text-sm hover:underline underline-offset-2"
        >
          {action} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  )
}

/* ── Main Page ─────────────────────────────────────── */
export default function HomePage() {
  const [featured, setFeatured] = useState(DEMO_PRODUCTS.filter(p => p.isFeatured))
  const [trending, setTrending] = useState(DEMO_PRODUCTS.filter(p => p.isTrending))
  const navigate = useNavigate()
  const offerEnd = useRef(Date.now() + 8 * 3600000).current

  useEffect(() => {
    getProducts({ limit: 12 })
      .then(res => {
        if (res.data?.products?.length) {
          setFeatured(res.data.products.filter(p => p.isFeatured))
          setTrending(res.data.products.filter(p => p.isTrending))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #7f0f20 0%, #c41e3a 60%, #e8334e 100%)', minHeight: '92vh', display: 'flex', alignItems: 'center' }}
      >
        {/* subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="section-container relative z-10 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-xs font-semibold mb-6 tracking-wider uppercase">
                <span className="w-2 h-2 bg-yellow-400 rounded-full pulse-dot" />
                Factory Direct · No Middleman
              </div>

              <h1 className="text-white font-black leading-[1.1] mb-5" style={{ fontFamily: 'Poppins', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
                Sri Murugan<br />
                <span className="text-yellow-300">Textiles</span>
              </h1>

              <p className="text-white/80 text-lg mb-3 font-medium">{STORE_INFO.tagline}</p>
              <p className="text-white/60 text-base mb-10 max-w-md leading-relaxed">
                Shirts, T-Shirts, Jeans, Trousers & more — straight from the manufacturer at unbeatable factory prices.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => navigate('/products')}
                  className="btn-primary bg-white text-[#c41e3a] hover:bg-gray-50 shadow-xl"
                  style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
                >
                  <ShoppingBag size={17} /> Shop Now
                </button>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hi! I want to know about your products.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary bg-[#25d366] hover:bg-[#1ebe5c]"
                  style={{ boxShadow: '0 8px 30px rgba(37,211,102,0.3)' }}
                >
                  <MessageCircle size={17} /> WhatsApp
                </a>
              </div>

              <div className="flex items-center gap-6">
                {STORE_INFO.phones.map(p => (
                  <a key={p} href={`tel:${p}`} className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors">
                    <Phone size={14} />
                    {p.replace(/(\d{5})(\d{5})/, '$1 $2')}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right: Product image mosaic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="hidden md:grid grid-cols-2 gap-3"
            >
              {featured.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  className={`overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10 ${i === 0 ? 'col-span-2' : ''}`}
                >
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className={`w-full object-cover hover:scale-105 transition-transform duration-500 ${i === 0 ? 'h-44' : 'h-36'}`}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2.5 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════ */}
      <section className="border-y border-gray-100 bg-white">
        <div className="section-container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: Tag, label: 'Factory Direct', desc: 'No Middleman Prices' },
              { icon: Truck, label: 'Fast Delivery', desc: 'Across Tamil Nadu' },
              { icon: Shield, label: '100% Genuine', desc: 'Branded Products Only' },
              { icon: RefreshCw, label: 'Easy Returns', desc: '7-Day Return Policy' },
            ].map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className={`flex items-center gap-3 px-4 py-3 ${i % 2 === 0 ? '' : ''}`}>
                <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className="text-[#c41e3a]" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm leading-tight">{label}</p>
                  <p className="text-gray-400 text-xs leading-tight mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          OFFER BANNER
      ══════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#7f0f20] via-[#c41e3a] to-[#e8334e]">
        <div className="section-container py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <p className="text-yellow-300 text-xs font-bold uppercase tracking-widest mb-1">⏳ Limited Time Offer</p>
              <h2 className="text-white font-black text-2xl md:text-3xl" style={{ fontFamily: 'Poppins' }}>
                Up to 40% OFF — Today Only!
              </h2>
            </div>
            <CountdownTimer endTime={offerEnd} />
            <button
              onClick={() => navigate('/products')}
              className="flex-shrink-0 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-full text-sm transition-colors shadow-lg"
            >
              Grab the Deal →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════ */}
      <section className="section-py bg-white">
        <div className="section-container">
          <SectionHeading
            label="Browse by"
            title="Shop by Category"
            subtitle="Find your perfect style from our collection"
            action="All Products"
            actionHref="/products"
          />
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/products?category=${cat.id}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gray-50 hover:bg-red-50 hover:shadow-md transition-all group text-center"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                  <span className="text-[11px] font-semibold text-gray-600 group-hover:text-[#c41e3a] transition-colors leading-tight">{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════ */}
      <section className="section-py bg-gray-50/50">
        <div className="section-container">
          <SectionHeading
            label="Handpicked for you"
            title="Featured Products"
            subtitle="Best sellers loved by our customers"
            action="View All"
            actionHref="/products"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {featured.slice(0, 8).map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FACTORY DIRECT CTA
      ══════════════════════════════════════ */}
      <section className="section-py-sm">
        <div className="section-container">
          <div
            className="rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' }}
          >
            <div className="px-8 py-12 md:px-14 md:py-14 flex flex-col md:flex-row items-center gap-10 md:gap-16">
              <div className="flex-1 text-center md:text-left">
                <p className="text-[#c41e3a] font-bold text-xs uppercase tracking-widest mb-3">🏭 Why Choose Us</p>
                <h2 className="text-white font-black mb-4" style={{ fontFamily: 'Poppins', fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)' }}>
                  Why Pay Retail?<br />
                  <span className="text-yellow-300">Buy Factory Direct!</span>
                </h2>
                <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
                  We source directly from manufacturers, cutting out middlemen to give you savings of up to 60% vs retail stores.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[['500+', 'Products'], ['2', 'Stores'], ['10K+', 'Customers'], ['40%', 'Avg Savings']].map(([v, l]) => (
                    <div key={l} className="text-center md:text-left">
                      <p className="text-[#c41e3a] font-black text-2xl leading-tight">{v}</p>
                      <p className="text-gray-500 text-xs font-medium mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button onClick={() => navigate('/products')} className="btn-primary w-full md:w-auto px-8">
                  Shop Factory Prices
                </button>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hi! I want to place a bulk order.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary bg-[#25d366] hover:bg-[#1ebe5c] w-full md:w-auto px-8 justify-center"
                  style={{ boxShadow: '0 8px 24px rgba(37,211,102,0.25)' }}
                >
                  <MessageCircle size={17} /> Bulk Order via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRENDING
      ══════════════════════════════════════ */}
      {trending.length > 0 && (
        <section className="section-py bg-white">
          <div className="section-container">
            <SectionHeading
              label="What's hot"
              title="🔥 Trending Now"
              subtitle="Flying off our shelves right now"
              action="See All"
              actionHref="/products"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {trending.slice(0, 4).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="section-py bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-10">
            <p className="section-label mx-auto">Happy customers</p>
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle mt-2">10,000+ satisfied shoppers across Tamil Nadu</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Raj Kumar', text: 'Amazing quality shirts at factory prices! Saved a lot compared to mall prices. Will definitely shop again.', rating: 5, location: 'Erode' },
              { name: 'Murugan S', text: 'The jeans are great quality. Fast delivery and super easy WhatsApp ordering. Highly recommended!', rating: 5, location: 'Bhavani' },
              { name: 'Senthil R', text: 'Best place for bulk buying. Got track pants for my cricket team at wholesale rates. Very happy!', rating: 5, location: 'Saralai' },
            ].map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} size={15} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#c41e3a] to-[#9b1527] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{r.name}</p>
                    <p className="text-gray-400 text-xs leading-tight">{r.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          VISIT STORES
      ══════════════════════════════════════ */}
      <section className="section-py bg-white">
        <div className="section-container">
          <div className="text-center mb-10">
            <p className="section-label mx-auto">Come see us</p>
            <h2 className="section-title">Visit Our Stores</h2>
            <p className="section-subtitle">Experience the factory direct difference in person</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {STORE_INFO.locations.map(loc => (
              <div key={loc.id} className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="font-bold text-[#c41e3a] text-lg mb-1" style={{ fontFamily: 'Poppins' }}>{loc.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{loc.address}</p>
                  <div className="flex gap-2.5 flex-wrap">
                    <a href={loc.mapUrl} target="_blank" rel="noreferrer"
                      className="btn-primary py-2.5 px-5 text-sm rounded-xl">
                      📍 Get Directions
                    </a>
                    {STORE_INFO.phones.map((p, idx) => (
                      <a key={p} href={`tel:${p}`}
                        className="btn-outline py-2.5 px-5 text-sm rounded-xl border-gray-200 text-gray-600 hover:border-[#c41e3a] hover:text-[#c41e3a] hover:bg-transparent">
                        📞 {idx === 0 ? 'Call Store 1' : 'Call Store 2'}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
