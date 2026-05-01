import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('smt_user')
    const token = localStorage.getItem('smt_token')
    if (stored && token) {
      setUser(JSON.parse(stored))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await axios.post('/api/users/login', { email, password })
    const { token, user } = res.data
    localStorage.setItem('smt_token', token)
    localStorage.setItem('smt_user', JSON.stringify(user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    toast.success(`Welcome back, ${user.name}!`)
    return user
  }

  const register = async (name, email, password) => {
    const res = await axios.post('/api/users/register', { name, email, password })
    const { token, user } = res.data
    localStorage.setItem('smt_token', token)
    localStorage.setItem('smt_user', JSON.stringify(user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    toast.success(`Welcome, ${user.name}!`)
    return user
  }

  const logout = () => {
    localStorage.removeItem('smt_token')
    localStorage.removeItem('smt_user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
