import { Link } from 'react-router-dom'
import { Phone, MapPin, MessageCircle, Clock, Share2, ChevronRight } from 'lucide-react'
import { STORE_INFO, CATEGORIES } from '../../data/constants'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white mt-0">
      {/* ── Main footer grid ─────────────────── */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-[#c41e3a] to-[#9b1527] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-black text-lg">SM</span>
              </div>
              <div className="leading-none">
                <p className="font-black text-white text-base" style={{ fontFamily: 'Poppins' }}>Sri Murugan Textiles</p>
                <p className="text-gray-500 text-xs mt-0.5">Factory Direct Sales</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{STORE_INFO.tagline}</p>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-5">
              <Clock size={13} className="text-[#c41e3a] flex-shrink-0" />
              {STORE_INFO.timing}
            </div>
            <div className="flex gap-2.5">
              {[
                { href: '#', icon: Share2, label: 'Facebook' },
                { href: '#', icon: Share2, label: 'Instagram' },
                { href: `https://wa.me/${STORE_INFO.whatsapp}`, icon: MessageCircle, label: 'WhatsApp', green: true },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${s.green ? 'bg-gray-800 hover:bg-[#25d366]' : 'bg-gray-800 hover:bg-[#c41e3a]'}`}
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.id}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors group"
                  >
                    <ChevronRight size={12} className="text-gray-600 group-hover:text-[#c41e3a] transition-colors flex-shrink-0" />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/cart', label: 'Shopping Cart' },
                { to: '/track-order', label: 'Track Order' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/login', label: 'Login / Register' },
                { to: '/dashboard', label: 'My Account' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors group">
                    <ChevronRight size={12} className="text-gray-600 group-hover:text-[#c41e3a] transition-colors flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stores + Phones */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Our Stores</h3>
            <div className="space-y-5">
              {STORE_INFO.locations.map(loc => (
                <div key={loc.id}>
                  <p className="text-[#c41e3a] font-semibold text-sm mb-1">{loc.name}</p>
                  <div className="flex items-start gap-1.5 text-gray-400 text-xs leading-relaxed">
                    <MapPin size={11} className="flex-shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2">
              {STORE_INFO.phones.map(p => (
                <a
                  key={p}
                  href={`tel:${p}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  <Phone size={13} className="text-[#c41e3a] flex-shrink-0" />
                  {p.replace(/(\d{5})(\d{5})/, '$1 $2')}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────── */}
      <div className="border-t border-gray-800">
        <div className="section-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Sri Murugan Textiles. All rights reserved.</p>
          <p>Factory Direct Sales · Saralai · Bhavani · Tamil Nadu</p>
        </div>
      </div>
    </footer>
  )
}
