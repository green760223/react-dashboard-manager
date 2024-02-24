import request from '@/utils/request'
import { Dashboard, Login, ResultData, User, Dept } from '@/types/api'

// Define the API interface
export default {
  // User login
  login(params: Login.Params) {
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
  },

  // Get the line chart data
  getLineChartData() {
    return request.get<Dashboard.LineData>('/order/dashboard/getLineData')
  },

  // Get the pie chart data for the city
  getPieCityChartData() {
    return request.get<Dashboard.PieData[]>('/order/dashboard/getPieCityData')
  },

  // Get the pie chart data for the age
  getPieAgeChartData() {
    return request.get<Dashboard.PieData[]>('/order/dashboard/getPieAgeData')
  },

  // Get the radar chart data
  getRadarChartData() {
    return request.get<Dashboard.RadarData>('/order/dashboard/getRadarData')
  },

  // Get the user list
  getUserList(params: User.Params) {
    return request.get<ResultData<User.UserItem>>('/users/list', params)
  },

  // Get all users list
  getAllUserList() {
    return request.get<User.UserItem[]>('/users/all/list')
  },

  // Create a user
  createUser(params: User.CreateParams) {
    return request.post('/users/create', params)
  },

  // Edit a user
  editUser(params: User.CreateParams) {
    return request.post('/users/edit', params)
  },

  // Delete a user and batch delete users
  delUser(params: { userIds: number[] }) {
    return request.post('/users/delete', params)
  },

  // Deaprtment management
  // Get the department list
  getDeptList(params?: Dept.Params) {
    return request.get<Dept.DeptItem[]>('/dept/list', params)
  },

  // Create a department
  createDept(params: Dept.CreateParams) {
    return request.post('/dept/create', params)
  },

  // Edit a department
  editDept(params: Dept.EditParams) {
    return request.post('/dept/edit', params)
  },

  // Delete a department
  deleteDept(params: Dept.DelParams) {
    return request.post('/dept/delete', params)
  }
}
