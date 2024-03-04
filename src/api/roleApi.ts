import request from '@/utils/request'
import { ResultData, Role } from '@/types/api'

export default {
  // Get the user role list
  getRoleList(params: Role.Params) {
    return request.get<ResultData<Role.RoleItem>>('/roles/list', params)
  },

  // Create a new role
  createRole(params: Role.CreateParams) {
    return request.post('/roles/create', params)
  },

  // Update the role
  editRole(params: Role.EditParams) {
    return request.post('/roles/edit', params)
  }
}
