import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, X, Upload, Search } from 'lucide-react'
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../../services/api'
import { DEMO_PRODUCTS, CATEGORIES, SIZES } from '../../data/constants'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  name: '', category: 'shirts', originalPrice: '', offerPrice: '',
  sizes: ['M', 'L', 'XL'], stock: 50, description: '', badge: '',
  images: [], isFeatured: false, isTrending: false,
}

export default function AdminProducts() {
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [filtered, setFiltered] = useState(DEMO_PRODUCTS)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    getProducts({ limit: 100 })
      .then(res => { if (res.data?.products?.length) { setProducts(res.data.products); setFiltered(res.data.products) } })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setFiltered(products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())))
  }, [search, products])

  const openEdit = (p) => {
    setEditProduct(p)
    setForm({ ...EMPTY_FORM, ...p })
    setShowForm(true)
  }

  const openNew = () => {
    setEditProduct(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editProduct) {
        await updateProduct(editProduct._id, form)
        setProducts(prev => prev.map(p => p._id === editProduct._id ? { ...p, ...form } : p))
        toast.success('Product updated!')
      } else {
        const res = await createProduct(form)
        const newProd = res.data?.product || { ...form, _id: Date.now().toString() }
        setProducts(prev => [newProd, ...prev])
        toast.success('Product created!')
      }
      setShowForm(false)
    } catch {
      toast.error('Failed. Check backend connection.')
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p._id !== id))
      toast.success('Deleted!')
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await uploadImage(fd)
      setForm(prev => ({ ...prev, images: [...(prev.images || []), res.data.url] }))
      toast.success('Image uploaded!')
    } catch {
      // Demo mode: use object URL
      const url = URL.createObjectURL(file)
      setForm(prev => ({ ...prev, images: [...(prev.images || []), url] }))
    }
    setUploading(false)
  }

  const toggleSize = (s) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(s) ? prev.sizes.filter(x => x !== s) : [...prev.sizes, s]
    }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Poppins' }}>Products</h1>
        <button
          onClick={openNew}
          className="bg-[#c41e3a] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#9b1527] transition-colors shadow-md"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c41e3a]"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Badge', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.sizes?.join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-sm text-gray-600">{p.category?.replace(/-/g, ' ')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold text-[#c41e3a] text-sm">₹{p.offerPrice}</p>
                      <p className="text-xs text-gray-400 line-through">₹{p.originalPrice}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.stock > 20 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock > 0 ? p.stock : 'OOS'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.badge && <span className="text-xs bg-red-50 text-[#c41e3a] px-2 py-0.5 rounded-full">{p.badge}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-4 bottom-4 max-w-2xl mx-auto bg-white rounded-3xl z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="font-black text-gray-900 text-lg">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="e.g. Premium Cotton Shirt"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c41e3a]"
                  />
                </div>

                {/* Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c41e3a]"
                    >
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                    <select
                      value={form.badge}
                      onChange={e => setForm(p => ({ ...p, badge: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c41e3a]"
                    >
                      <option value="">None</option>
                      {['Best Seller', 'Trending', 'Factory Price', 'New Arrival', 'Limited'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price *</label>
                    <input
                      type="number"
                      value={form.originalPrice}
                      onChange={e => setForm(p => ({ ...p, originalPrice: Number(e.target.value) }))}
                      required
                      placeholder="999"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c41e3a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price *</label>
                    <input
                      type="number"
                      value={form.offerPrice}
                      onChange={e => setForm(p => ({ ...p, offerPrice: Number(e.target.value) }))}
                      required
                      placeholder="599"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c41e3a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={e => setForm(p => ({ ...p, stock: Number(e.target.value) }))}
                      required
                      placeholder="50"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c41e3a]"
                    />
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                  <div className="flex gap-2 flex-wrap">
                    {SIZES.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSize(s)}
                        className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${form.sizes.includes(s) ? 'bg-[#c41e3a] border-[#c41e3a] text-white' : 'border-gray-200 text-gray-600 hover:border-[#c41e3a]'}`}
                      >
                        {s}
                      </button>
                    ))}
                    {['30', '32', '34', '36', '38'].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSize(s)}
                        className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${form.sizes.includes(s) ? 'bg-[#c41e3a] border-[#c41e3a] text-white' : 'border-gray-200 text-gray-600 hover:border-[#c41e3a]'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={3}
                    placeholder="Product description..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c41e3a] resize-none"
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                  <div className="flex gap-3 flex-wrap mb-2">
                    {form.images?.map((img, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#c41e3a] transition-colors">
                      {uploading ? <div className="w-4 h-4 border-2 border-[#c41e3a] border-t-transparent rounded-full animate-spin" /> : <Upload size={16} className="text-gray-400" />}
                      <span className="text-[10px] text-gray-400 mt-1">Upload</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <input
                      placeholder="Or paste image URL..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#c41e3a]"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (e.target.value) {
                            setForm(p => ({ ...p, images: [...(p.images || []), e.target.value] }))
                            e.target.value = ''
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-gray-400 mt-1">Press Enter to add URL</p>
                  </div>
                </div>

                {/* Flags */}
                <div className="flex gap-6">
                  {[
                    { key: 'isFeatured', label: 'Featured Product' },
                    { key: 'isTrending', label: 'Trending' },
                  ].map(f => (
                    <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.checked }))}
                        className="accent-[#c41e3a]"
                      />
                      <span className="text-sm text-gray-700">{f.label}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#c41e3a] text-white py-3.5 rounded-2xl font-bold hover:bg-[#9b1527] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : (editProduct ? 'Update Product' : 'Add Product')}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
