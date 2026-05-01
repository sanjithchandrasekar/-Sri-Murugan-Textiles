import axios from 'axios'

const BASE = '/api'

// Products
export const getProducts = (params) => axios.get(`${BASE}/products`, { params })
export const getProduct = (id) => axios.get(`${BASE}/products/${id}`)
export const createProduct = (data) => axios.post(`${BASE}/products`, data)
export const updateProduct = (id, data) => axios.put(`${BASE}/products/${id}`, data)
export const deleteProduct = (id) => axios.delete(`${BASE}/products/${id}`)

// Auth
export const loginUser = (data) => axios.post(`${BASE}/users/login`, data)
export const registerUser = (data) => axios.post(`${BASE}/users/register`, data)
export const getProfile = () => axios.get(`${BASE}/users/profile`)
export const updateProfile = (data) => axios.put(`${BASE}/users/profile`, data)

// Orders
export const createOrder = (data) => axios.post(`${BASE}/orders`, data)
export const getMyOrders = () => axios.get(`${BASE}/orders/my`)
export const getOrder = (id) => axios.get(`${BASE}/orders/${id}`)
export const getAllOrders = () => axios.get(`${BASE}/orders`)
export const updateOrderStatus = (id, status) => axios.put(`${BASE}/orders/${id}/status`, { status })

// Reviews
export const addReview = (productId, data) => axios.post(`${BASE}/reviews/${productId}`, data)
export const getReviews = (productId) => axios.get(`${BASE}/reviews/${productId}`)

// Coupons
export const validateCoupon = (code, amount) => axios.post(`${BASE}/coupons/validate`, { code, amount })

// Upload
export const uploadImage = (formData) => axios.post(`${BASE}/upload`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

// Razorpay
export const createRazorpayOrder = (amount) => axios.post(`${BASE}/payment/create-order`, { amount })
export const verifyPayment = (data) => axios.post(`${BASE}/payment/verify`, data)
