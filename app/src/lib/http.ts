import axios from 'axios'

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.error ?? err.message ?? 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default http
