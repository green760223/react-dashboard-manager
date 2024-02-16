import { create } from 'zustand'
import { User } from '@/types/api'

export const useStore = create<{
  token: string
  userInfo: {
    userEmail: string
    userName: string
  }
  isCollapse: boolean
  updateToken: (token: string) => void
  updateUserInfo: (userInfo: User.UserItem) => void
  updateCollapse: () => void
}>(set => ({
  token: '',
  userInfo: {
    userEmail: '',
    userName: ''
  },
  // updateUserInfo(userInfo: User.UserItem) {
  //   set({ userInfo })
  // }
  // 上面寫法與下面寫法相同
  updateUserInfo: (userInfo: User.UserItem) => set({ userInfo }),
  updateToken: (token: string) => set({ token }),
  isCollapse: false,
  updateCollapse: () =>
    set(state => {
      return {
        isCollapse: !state.isCollapse
      }
    })
}))