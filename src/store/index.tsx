import { create } from 'zustand'
import { User } from '@/types/api'
import storage from '@/utils/storage'

export const useStore = create<{
  token: string
  userInfo: User.UserItem
  isCollapse: boolean
  isDark: boolean
  updateToken: (token: string) => void
  updateUserInfo: (userInfo: User.UserItem) => void
  updateCollapse: () => void
  updateTheme: (isDark: boolean) => void
}>(set => ({
  token: '',
  userInfo: {
    _id: '',
    userId: 0,
    userName: '',
    userEmail: '',
    deptId: '',
    deptName: '',
    state: 0,
    mobile: '',
    job: '',
    role: 0,
    roleList: '',
    createId: 0,
    userImg: ''
  },
  // updateUserInfo(userInfo: User.UserItem) {
  //   set({ userInfo })
  // }
  // 上面寫法與下面寫法相同
  updateUserInfo: (userInfo: User.UserItem) => set({ userInfo }),
  updateToken: token => set({ token }),
  updateTheme: isDark => set({ isDark }),
  isCollapse: false,
  isDark: storage.get('isDark') || false,
  updateCollapse: () =>
    set(state => {
      return {
        isCollapse: !state.isCollapse
      }
    })
}))
