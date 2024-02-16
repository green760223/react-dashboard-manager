import request from '@/utils/request'
import { Dashboard, Login, User } from '@/types/api'

// Define the API interface
export default {
  // User login
  login(params: Login.params) {
    return request.post<string>('/users/login', params, {
      showLoading: false
    })
  },
  // Get user information
  getUserInfo() {
    return request.get<User.UserItem>('/users/getUserInfo')
  },

  // Get the report data
  getReportData() {
    return request.get<Dashboard.ReportData>('/order/dashboard/getReportData')
  }
}
