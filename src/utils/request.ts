import axios, { AxiosError } from 'axios'
import { message } from 'antd'
import { hideLoading, showLoading } from './loading'
import storage from './storage'
import env from '@/config'

console.log(env)

// 建立 axios 實例
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // api base_url,
  timeout: 8000, // 請求Time out時間
  timeoutErrorMessage: '請求超時，請稍後再試！',
  withCredentials: true // 允許夾帶cookie
})

// 請求攔截器
instance.interceptors.request.use(
  config => {
    showLoading()
    const token = storage.get('token')
    if (token) {
      config.headers['Authorization'] = 'Token::' + token
    }

    if (env.mock) {
      config.baseURL = env.mockAPI
    } else {
      config.baseURL = env.baseAPI
    }

    return {
      ...config
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 響應攔截器
instance.interceptors.response.use(
  response => {
    const data = response.data
    hideLoading()
    if (data.code === 500001) {
      // 未登入 或 token過期 或 token無效
      message.error(data.msg)
      localStorage.removeItem('token')
      // location.href = '/login'
    } else if (data.code != 0) {
      // 其他錯誤
      message.error(data.msg)
      return Promise.reject(data)
    }

    return data.data
  },
  error => {
    hideLoading()
    message.error(error.message)
    return Promise.reject(error.message)
  }
)

// 封裝請求方法
export default {
  get<T>(url: string, params?: object): Promise<T> {
    return instance.get(url, { params })
  },

  post<T>(url: string, params: object): Promise<T> {
    return instance.post(url, params)
  }
}
