import { Order, ResultData } from '@/types/api'
import request from '@/utils/request'

export default {
  // Get the order list
  getOrderList(params: Order.Params) {
    return request.get<ResultData<Order.OrderItem>>('/order/list', params)
  }
}
