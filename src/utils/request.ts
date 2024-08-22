import axios, { AxiosError } from 'axios'
import { hideLoading, showLoading } from './loading'
import storage from './storage'
import env from '@/config'
import { message } from './AntdGlobal'
import { Result } from '@/types/api'

interface IConfig {
  showLoading?: boolean
  showError?: boolean
}

// 建立 axios 實例
const instance = axios.create({
  timeout: 8000, // 請求Time out時間
  timeoutErrorMessage: 'Request timed out. Please try again later！',
  withCredentials: true, // 允許夾帶cookie
  headers: {
    icode: '620074F449F5C28F'
  }
})

// 請求攔截器
instance.interceptors.request.use(
  config => {
    if (config.showLoading) {
      showLoading()
    }

    const token = storage.get('token')

    if (token) {
      config.headers.Authorization = 'Bearer ' + token
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
    const data: Result = response.data
    hideLoading()
    if (response.config.responseType === 'blob') {
      return response
    }

    if (data.code === 500001) {
      // 未登入 或 token過期 或 token無效
      message.error(data.msg)
      storage.remove('token')
      // location.href = '/login?callback=' + encodeURIComponent(location.href)
      location.href = '/#/login?callback=' + encodeURIComponent(location.href)
    } else if (data.code != 0) {
      // 其他錯誤
      if (response.config.showError === false) {
        return Promise.resolve(data)
      } else {
        message.error(data.msg)
        return Promise.reject(data)
      }
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
  get<T>(
    url: string,
    params?: object,
    options: IConfig = { showLoading: true, showError: true }
  ): Promise<T> {
    return instance.get(url, { params, ...options })
  },

  post<T>(
    url: string,
    params?: object,
    options: IConfig = { showLoading: true, showError: true }
  ): Promise<T> {
    return instance.post(url, params, options)
  },

  downloadFile(url: string, data: any, fileName = 'filename.xlsx') {
    instance({
      url,
      data,
      method: 'post',
      responseType: 'blob'
    }).then(response => {
      const blob = new Blob([response.data], {
        type: response.data.type
      })
      const name = (response.headers['file-name'] as string) || fileName
      const link = document.createElement('a')
      link.download = decodeURIComponent(name) // 下載文件名
      link.href = URL.createObjectURL(blob)
      document.body.append(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    })
  }
}
