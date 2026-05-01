import { motion } from 'framer-motion'
import { Phone, MapPin, MessageCircle, Clock, Mail } from 'lucide-react'
import { STORE_INFO } from '../data/constants'

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>Contact Us</h1>
        <p className="text-gray-500 text-lg">We're here to help! Reach us anytime.</p>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {STORE_INFO.phones.map((phone, i) => (
          <motion.a
            key={phone}
            href={`tel:${phone}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 flex items-center gap-4 hover:border-[#c41e3a] hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <Phone size={20} className="text-[#c41e3a]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Call Us</p>
              <p className="font-bold text-gray-900">{phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</p>
            </div>
          </motion.a>
        ))}
        <motion.a
          href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hi! I have a query about your products.`}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          className="bg-green-500 rounded-2xl shadow-md p-6 flex items-center gap-4 hover:bg-green-600 transition-colors"
        >
          <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-green-100 font-medium uppercase tracking-wider">WhatsApp</p>
            <p className="font-bold text-white">Chat with Us</p>
          </div>
        </motion.a>
      </div>

      {/* Store Info + Maps */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {STORE_INFO.locations.map((loc, i) => (
          <motion.div
            key={loc.id}
            initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h3 className="font-black text-[#c41e3a] text-xl mb-1" style={{ fontFamily: 'Poppins' }}>{loc.name}</h3>
              <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-[#c41e3a]" />
                <span>{loc.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <Clock size={14} className="text-[#c41e3a]" />
                {STORE_INFO.timing}
              </div>
              <div className="flex gap-3">
                <a
                  href={loc.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-[#c41e3a] text-white py-2.5 rounded-xl text-sm font-semibold text-center hover:bg-[#9b1527] transition-colors"
                >
                  📍 Get Directions
                </a>
                <a
                  href={`tel:${STORE_INFO.phones[i]}`}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium text-center hover:border-[#c41e3a] hover:text-[#c41e3a] transition-colors"
                >
                  📞 Call Now
                </a>
              </div>
            </div>
            <div className="h-48 bg-gray-100">
              <iframe
                src={loc.mapEmbed}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={loc.name}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Business Hours */}
      <div className="bg-gradient-to-r from-[#9b1527] to-[#c41e3a] rounded-2xl p-8 text-white text-center">
        <Clock size={32} className="mx-auto mb-3 text-yellow-300" />
        <h2 className="text-2xl font-black mb-2" style={{ fontFamily: 'Poppins' }}>Business Hours</h2>
        <p className="text-white/80 text-lg mb-1">{STORE_INFO.timing}</p>
        <p className="text-white/60 text-sm">Available at both Saralai & Bhavani stores</p>
        <div className="mt-6 flex justify-center gap-4">
          {STORE_INFO.phones.map(p => (
            <a
              key={p}
              href={`tel:${p}`}
              className="bg-white/20 hover:bg-white/30 backdrop-blur px-6 py-3 rounded-full text-white font-bold transition-colors flex items-center gap-2"
            >
              <Phone size={16} /> {p.replace(/(\d{5})(\d{5})/, '$1 $2')}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
