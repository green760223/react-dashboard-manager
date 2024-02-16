import Dashboard from '@/views/dashboard'

// 接口類型定義
export interface Result<T = any> {
  code: number
  data: T
  msg: string
}

// Define the login interface
export namespace Login {
  export interface params {
    userName: string
    userPwd: string
  }
}

// Define the user interface
export namespace User {
  export interface UserItem {
    _id: string
    userId: number
    userName: string
    userEmail: string
    deptId: string
    deptName: string
    state: number
    mobile: string
    job: string
    role: number
    roleList: string
    createId: number
    userImg: string
  }
}

// Define the dashboard interface
export namespace Dashboard {
  export interface ReportData {
    driverCount: number
    totalMoney: number
    orderCount: number
    cityNum: number
  }
}
