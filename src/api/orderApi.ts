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
  }
}