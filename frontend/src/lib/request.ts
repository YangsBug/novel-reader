import axios from 'axios'
import toast from 'react-hot-toast'

const request = axios.create({
  baseURL: import.meta.env.PROD ? (import.meta.env.VITE_API_BASE_URL || '') : '/api',
  timeout: 15000,
})

request.interceptors.request.use((config) => {
  const stored = localStorage.getItem('novel-auth')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (parsed?.state?.token) {
        config.headers.Authorization = `Bearer ${parsed.state.token}`
      }
    } catch {}
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code && res.code !== 200) {
      toast.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message))
    }
    return response
  },
  (error) => {
    const msg = error.response?.data?.message || error.message || '网络请求失败'
    toast.error(msg)
    return Promise.reject(error)
  }
)

export default request
