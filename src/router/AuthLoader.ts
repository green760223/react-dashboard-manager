import { Menu } from '@/types/api'
import { getMenuPath } from '@/utils'
import api from '@/api'

export interface IAuthLoader {
  buttonList: string[]
  menuList: Menu.MenuItem[]
  menuPathList: string[]
}

async function AuthLoader() {
  const data = await api.getPermissionList()
  const menuPathList = getMenuPath(data.menuList)

  return {
    buttonList: data.buttonList,
    menuList: data.menuList,
    menuPathList
  }
}

export default AuthLoader
