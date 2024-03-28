import { Order, ResultData } from '@/types/api'
import request from '@/utils/request'

export default {
  // Get the order list
  getOrderList(params: Order.Params) {
    return request.get<ResultData<Order.OrderItem>>('/order/list', params)
  },

  // Get the city list
  getCityList() {
    return request.get<Order.DictItem[]>('/order/citylist')
  },

  // Get the vehicle list
  getVehicleList() {
    return request.get<Order.DictItem[]>('/order/vehiclelist')
  },

  // Create an order
  creatyOrder(params: Order.CreateParams) {
    return request.post('/order/create', params)
  },

  // Get the order detail
  getOrderDetail(orderId: string) {
    return request.get<Order.OrderItem>(`/order/detail/${orderId}`)
  },

  // Update the order info
  updateOrderInfo(params: Order.OrderRoute) {
    return request.post('/order/edit', params)
  },

  // Delete the order
  deleteOrder(orderId: string) {
    return request.post('/order/delete', { _id: orderId })
  },

  // Export order data
  exportDate(params: Order.SearchParams) {
    return request.downloadFile('/order/orderExport', params, '訂單列表.xlsx')
  },

  // Get City Order Data
  getCityData(cityId: number) {
    return request.get<Array<{ lng: string; lat: string }>>(
      `/order/cluster/${cityId}`
    )
  },

  // Get Driver List
  getDriverList(params: Order.DriverParams) {
    return request.get<ResultData<Order.DriverItem>>(
      '/order/driver/list',
      params
    )
  }
}
