import Dashboard from '@/views/dashboard'

// 接口類型定義
export interface Result<T = any> {
  code: number
  data: T
  msg: string
}

// 定義分頁類型
export interface ResultData<T = any> {
  list: T[]
  page: {
    pageNum: number
    pageSize: number
    total: number | 0
  }
}

export interface PageParams {
  pageNum: number
  pageSize: number
}

// Define the login interface
export namespace Login {
  // Define the login parameter interface
  export interface Params {
    userName: string
    userPwd: string
  }
}

// Define the user interface
export namespace User {
  // Define the user list interface
  export interface Params extends PageParams {
    userId?: number
    userName?: string
    state?: number
  }

  // Define the user item interface
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

  export interface CreateParams {
    userName: string
    userEmail: string
    mobile?: string
    deptId: string
    job?: string
    state?: number
    roleList?: string[]
    userImg?: string
  }
}

// Define the dashboard interface
export namespace Dashboard {
  // Define the report data interface
  export interface ReportData {
    driverCount: number
    totalMoney: number
    orderCount: number
    cityNum: number
  }

  // Define the line chart data interface
  export interface LineData {
    label: string[]
    order: number[]
    money: number[]
  }

  // Define the pie chart data interface
  export interface PieData {
    value: number
    name: string
  }

  // Define the radar chart data interface
  export interface RadarData {
    indicator: Array<{ name: string; max: number }>
    data: {
      name: string
      value: number[]
    }
  }
}
