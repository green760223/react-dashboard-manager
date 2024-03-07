import { ResultData, Role } from '@/types/api'
import request from '@/utils/request'

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
  },

  // Delete the role
  deleteRole(params: { _id: string }) {
    return request.post('/roles/delete', params)
  },

  // Set the role permission
  updatePermission(params: Role.Permission) {
    return request.post('/roles/update/permission', params)
  },

  // Get all role list
  getAllRoleList() {
    return request.get<Role.RoleItem[]>('/roles/alllist')
  }
}
