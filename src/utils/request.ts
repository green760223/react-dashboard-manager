import axios, { AxiosError } from 'axios'
import { message } from 'antd'
import { hideLoading, showLoading } from './loading'

// 建立 axios 實例
const instance = axios.create({
  baseURL: '/api', // api base_url
  timeout: 8000, // 請求Time out時間
  timeoutErrorMessage: '請求超時，請稍後再試！',
  withCredentials: true // 允許夾帶cookie
})

// 請求攔截器
instance.interceptors.request.use(
  config => {
    showLoading()
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = 'Token::' + token
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
      location.href = '/login'
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
  get(url: string, params: any) {
    return instance.get(url, { params })
  },

  post(url: string, params: any) {
    return instance.post(url, params)
  }
}
