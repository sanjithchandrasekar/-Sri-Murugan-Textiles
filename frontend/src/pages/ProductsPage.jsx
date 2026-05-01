import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown, LayoutGrid } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, SIZES, DEMO_PRODUCTS } from '../data/constants'
import { getProducts } from '../services/api'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low → High' },
  { value: 'price_high', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [filtered, setFiltered] = useState(DEMO_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [sort, setSort] = useState('newest')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [selectedSizes, setSelectedSizes] = useState([])

  useEffect(() => {
    setLoading(true)
    getProducts()
      .then(res => { if (res.data?.products?.length) setProducts(res.data.products) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = [...products]
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.includes(search.toLowerCase()))
    if (category) result = result.filter(p => p.category === category)
    if (selectedSizes.length) result = result.filter(p => p.sizes?.some(s => selectedSizes.includes(s)))
    result = result.filter(p => p.offerPrice <= maxPrice)
    if (sort === 'price_low') result.sort((a, b) => a.offerPrice - b.offerPrice)
    else if (sort === 'price_high') result.sort((a, b) => b.offerPrice - a.offerPrice)
    else if (sort === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    setFiltered(result)
  }, [products, search, category, sort, maxPrice, selectedSizes])

  const toggleSize = s => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const clearFilters = () => { setSearch(''); setCategory(''); setSort('newest'); setMaxPrice(5000); setSelectedSizes([]); setSearchParams({}) }
  const hasFilters = search || category || selectedSizes.length > 0 || sort !== 'newest' || maxPrice < 5000
  const activeCat = CATEGORIES.find(c => c.id === category)

  return (
    <div className="bg-white min-h-screen">
      {/* ── Page header ──────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="section-container py-8">
          <h1 className="section-title" style={{ fontFamily: 'Poppins' }}>
            {activeCat ? `${activeCat.icon} ${activeCat.label}` : 'All Products'}
          </h1>
          <p className="section-subtitle mt-1">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      <div className="section-container py-8">
        {/* ── Toolbar ────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="input-base pl-9 pr-9"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input-base pr-9 pl-4 cursor-pointer w-auto appearance-none min-w-[170px]"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters ? 'bg-[#c41e3a] border-[#c41e3a] text-white' : 'border-gray-200 text-gray-600 hover:border-[#c41e3a] hover:text-[#c41e3a]'}`}
          >
            <SlidersHorizontal size={15} />
            Filters
            {hasFilters && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${showFilters ? 'bg-white' : 'bg-[#c41e3a]'}`} />}
          </button>

          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-red-500 font-medium hover:text-red-700 transition-colors flex items-center gap-1">
              <X size={13} /> Clear all
            </button>
          )}
        </div>

        {/* ── Active filters pills ────────────── */}
        {(category || selectedSizes.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-5">
            {category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#c41e3a] rounded-full text-xs font-semibold">
                {activeCat?.label}
                <button onClick={() => setCategory('')} className="hover:text-red-800"><X size={11} /></button>
              </span>
            )}
            {selectedSizes.map(s => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#c41e3a] rounded-full text-xs font-semibold">
                Size: {s}
                <button onClick={() => toggleSize(s)} className="hover:text-red-800"><X size={11} /></button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-7">
          {/* ── Sidebar ─────────────────────── */}
          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.aside
                initial={{ width: 0, opacity: 0, x: -10 }}
                animate={{ width: 240, opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 overflow-hidden hidden md:block"
              >
                <div className="w-56 space-y-7 pr-2">
                  {/* Category filter */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Category</h4>
                    <div className="space-y-0.5">
                      <button
                        onClick={() => setCategory('')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-[#c41e3a] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        All Categories
                      </button>
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${category === cat.id ? 'bg-[#c41e3a] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          <span>{cat.icon}</span> {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size filter */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map(s => (
                        <button
                          key={s}
                          onClick={() => toggleSize(s)}
                          className={`w-10 h-10 border rounded-lg text-sm font-semibold transition-all ${selectedSizes.includes(s) ? 'bg-[#c41e3a] border-[#c41e3a] text-white shadow-md' : 'border-gray-200 text-gray-600 hover:border-[#c41e3a] hover:text-[#c41e3a]'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price filter */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Max Price</h4>
                    <p className="text-[#c41e3a] font-bold text-lg mb-3">₹{maxPrice.toLocaleString('en-IN')}</p>
                    <input
                      type="range" min={100} max={5000} step={100}
                      value={maxPrice}
                      onChange={e => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#c41e3a] h-1.5 rounded-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                      <span>₹100</span><span>₹5,000</span>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ── Products grid ─────────────────── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={`grid gap-4 md:gap-5 ${showFilters ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-100">
                    <div className="shimmer" style={{ aspectRatio: '3/4' }} />
                    <div className="p-3 space-y-2">
                      <div className="shimmer h-3 rounded-full w-2/3" />
                      <div className="shimmer h-4 rounded-full w-full" />
                      <div className="shimmer h-3 rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="btn-primary px-6 py-2.5 text-sm">Clear Filters</button>
              </div>
            ) : (
              <div className={`grid gap-4 md:gap-5 ${showFilters ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
                {filtered.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
