import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, SIZES, DEMO_PRODUCTS } from '../data/constants'
import { getProducts } from '../services/api'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
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
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedSizes, setSelectedSizes] = useState([])

  useEffect(() => {
    setLoading(true)
    getProducts()
      .then(res => {
        if (res.data?.products?.length) setProducts(res.data.products)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = [...products]
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (category) result = result.filter(p => p.category === category)
    if (selectedSizes.length) result = result.filter(p => p.sizes?.some(s => selectedSizes.includes(s)))
    result = result.filter(p => p.offerPrice >= priceRange[0] && p.offerPrice <= priceRange[1])

    if (sort === 'price_low') result.sort((a, b) => a.offerPrice - b.offerPrice)
    else if (sort === 'price_high') result.sort((a, b) => b.offerPrice - a.offerPrice)
    else if (sort === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0))

    setFiltered(result)
  }, [products, search, category, sort, priceRange, selectedSizes])

  const toggleSize = (size) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setSort('newest')
    setPriceRange([0, 5000])
    setSelectedSizes([])
    setSearchParams({})
  }

  const hasFilters = search || category || selectedSizes.length || sort !== 'newest'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
          {category ? CATEGORIES.find(c => c.id === category)?.label || 'Products' : 'All Products'}
        </h1>
        <p className="text-gray-500">{filtered.length} products found</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 text-sm focus:outline-none focus:border-[#c41e3a] transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 text-sm focus:outline-none focus:border-[#c41e3a] cursor-pointer min-w-[180px]"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm hover:border-[#c41e3a] hover:text-[#c41e3a] transition-colors"
        >
          <SlidersHorizontal size={16} /> Filters
          {hasFilters && <span className="w-2 h-2 bg-[#c41e3a] rounded-full" />}
        </button>

        {hasFilters && (
          <button onClick={clearFilters} className="px-4 py-3 text-[#c41e3a] border border-[#c41e3a] rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
            Clear All
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex-shrink-0 overflow-hidden"
            >
              <div className="w-64 space-y-6 pr-4">
                {/* Categories */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Category</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setCategory('')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-[#c41e3a] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${category === cat.id ? 'bg-[#c41e3a] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        <span>{cat.icon}</span> {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${selectedSizes.includes(size)
                          ? 'bg-[#c41e3a] border-[#c41e3a] text-white'
                          : 'border-gray-200 text-gray-600 hover:border-[#c41e3a] hover:text-[#c41e3a]'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">
                    Price Range: ₹{priceRange[0]} – ₹{priceRange[1]}
                  </h3>
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={100}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([0, Number(e.target.value)])}
                    className="w-full accent-[#c41e3a]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹0</span>
                    <span>₹5000</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="shimmer aspect-[3/4] rounded-t-2xl" />
                  <div className="p-3 space-y-2">
                    <div className="shimmer h-4 rounded w-3/4" />
                    <div className="shimmer h-4 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
              <button onClick={clearFilters} className="bg-[#c41e3a] text-white px-6 py-3 rounded-xl font-semibold">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
