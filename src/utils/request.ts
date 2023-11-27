import axios from 'axios'

// 建立 axios 實例
const instance = axios.create({
  baseURL: '/api', // api base_url
  timeout: 8000, // 請求Time out時間
  timeoutErrorMessage: '請求超時，請稍後再試！',
  withCredentials: true // 允許夾帶cookie
})

// 封裝請求方法
export default {
  get(url: string, params: any) {
    return instance.get(url, { params })
  },

  post(url: string, params: any) {
    return instance.post(url, params)
  }
}
