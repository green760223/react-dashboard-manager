import request from '@/utils/request'
import { Login } from '@/types/api'

// API Interface
export default {
  login(params: Login.params) {
    return request.post('/users/login', params, {
      showLoading: false
    })
  }
}
