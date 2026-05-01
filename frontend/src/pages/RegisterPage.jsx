import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch {
      toast.error('Registration failed. Email may already be in use.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="h-2 bg-gradient-to-r from-[#9b1527] to-[#c41e3a]" />

          <div className="px-8 pt-8 pb-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#c41e3a] to-[#9b1527] rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <span className="text-white font-black text-2xl">SM</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Poppins' }}>Create account</h1>
              <p className="text-gray-400 text-sm mt-1">Join Sri Murugan Textiles today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { icon: User, label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
                { icon: Mail, label: 'Email address', key: 'email', type: 'email', placeholder: 'you@example.com' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                  <div className="relative">
                    <f.icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={set(f.key)}
                      required
                      placeholder={f.placeholder}
                      className="input-base pl-10"
                    />
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={show ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    required
                    placeholder="Min. 6 characters"
                    className="input-base pl-10 pr-11"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={show ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={set('confirm')}
                    required
                    placeholder="Re-enter password"
                    className="input-base pl-10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center mt-2"
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating…</>
                  : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-[#c41e3a] font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-400 mt-5">Sri Murugan Textiles · Factory Direct Sales</p>
      </div>
    </div>
  )
}
