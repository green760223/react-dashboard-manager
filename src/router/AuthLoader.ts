import api from '@/api'

async function AuthLoader() {
  const data = await api.getPermissionList()

  return {
    buttonList: data.buttonList,
    menuList: data.menuList,
    menuPathList: []
  }
}

export default AuthLoader
