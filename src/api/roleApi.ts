import request from '@/utils/request'
import { ResultData, Role } from '@/types/api'

export default {
  // Get the user role list
  getRoleList(params: Role.Params) {
    return request.get<ResultData<Role.RoleItem>>('/roles/list', params)
  }
}
