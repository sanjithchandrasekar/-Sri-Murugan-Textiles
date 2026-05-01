import { Link } from 'react-router-dom'
import { Phone, MapPin, MessageCircle, Clock, Share2 } from 'lucide-react'
import { STORE_INFO, CATEGORIES } from '../../data/constants'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-24 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#c41e3a] to-[#9b1527] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">SM</span>
              </div>
              <div>
                <div className="font-bold text-white text-lg" style={{ fontFamily: 'Poppins' }}>Sri Murugan Textiles</div>
                <div className="text-gray-400 text-xs">Factory Direct Sales</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {STORE_INFO.tagline}. Quality clothing at factory direct prices.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Clock size={14} className="text-[#c41e3a]" />
              {STORE_INFO.timing}
            </div>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#c41e3a] transition-colors">
                <Share2 size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#c41e3a] transition-colors">
                <Share2 size={16} />
              </a>
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}`}
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.id}`} className="text-gray-400 hover:text-[#c41e3a] text-sm transition-colors flex items-center gap-2">
                    <span>{cat.icon}</span> {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/track-order', label: 'Track Order' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/login', label: 'Login / Register' },
                { to: '/dashboard', label: 'My Account' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-[#c41e3a] text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Our Stores</h3>
            {STORE_INFO.locations.map(loc => (
              <div key={loc.id} className="mb-4">
                <div className="text-[#c41e3a] font-medium text-sm mb-1">{loc.name}</div>
                <div className="flex items-start gap-2 text-gray-400 text-sm">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-500" />
                  <span>{loc.address}</span>
                </div>
              </div>
            ))}
            <div className="mt-4 space-y-2">
              {STORE_INFO.phones.map(p => (
                <a key={p} href={`tel:${p}`} className="flex items-center gap-2 text-gray-400 hover:text-[#c41e3a] text-sm transition-colors">
                  <Phone size={14} className="text-[#c41e3a]" />
                  {p.replace(/(\d{5})(\d{5})/, '$1 $2')}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">© 2024 Sri Murugan Textiles. All rights reserved.</p>
          <p className="text-gray-500 text-xs">Factory Direct Sales | Saralai | Bhavani</p>
        </div>
      </div>
    </footer>
  )
}
