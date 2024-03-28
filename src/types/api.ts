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
  pageSize?: number
}

// Define the login interface
export namespace Login {
  // Define the login parameter interface
  export interface Params {
    userName: string
    userPwd: string
  }
}

// Define the user management interface
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

  export interface EditParams extends CreateParams {
    userId: number
  }
}

// Define the department management interface
export namespace Dept {
  export interface Params {
    deptName?: string
  }

  export interface CreateParams {
    parentId?: string
    deptName: string
    userName: string
  }

  export interface DeptItem {
    _id: string
    createTime: string
    updateTime: string
    deptName: string
    parentId: string
    userName: string
    children: DeptItem[]
  }

  export interface EditParams extends CreateParams {
    _id: string
  }

  export interface DelParams {
    _id: string
  }
}

// Define the menu management interface
export namespace Menu {
  export interface Params {
    menuName: string
    menuState: number
  }

  export interface CreateParams {
    menuName: string
    icon?: string
    menuType: string // 1: menu, 2: button, 3: page
    menuState: number // 1: enable, 0: disable
    menuCode?: string
    parentId?: string
    path?: string
    component?: string
    orderBy: number // Ordering
  }

  export interface MenuItem extends CreateParams {
    _id: string
    createTime: string
    children?: MenuItem[]
    buttons?: MenuItem[]
  }

  export interface EditParams extends CreateParams {
    _id?: string
  }

  export interface DelParams {
    _id: string
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

export namespace Role {
  export interface Params extends PageParams {
    roleName?: string
  }

  export interface CreateParams {
    roleName: string
    remark?: string
  }

  export interface RoleItem extends CreateParams {
    _id: string
    createTime: string
    updateTime: string
    permissionList: {
      checkedKeys: string[]
      halfCheckedKeys: string[]
    }
  }

  export interface EditParams extends CreateParams {
    _id: string
  }

  export interface Permission {
    _id: string
    permissionList: {
      checkedKeys: string[]
      halfCheckedKeys: string[]
    }
  }
}

export namespace Order {
  export enum IState {
    doing = 1,
    done = 2,
    timeout = 3,
    cancel = 4
  }

  export interface CreateParams {
    cityName: string
    userName: string
    mobile: number
    startAddress: string
    endAddress: string
    orderAmount: number
    userPayAmount: number
    driverAmount: number // 1: WeChat, 2: Alipay
    payType: number
    driverName: string
    vehicleName: string
    state: number // 1: doing, 2: done, 3: timeout, 4: cancel
    useTime: string
    endTime: string
  }

  export interface OrderItem extends CreateParams {
    _id: string
    orderId: string
    route: Array<{ lng: string; lat: string }> // Route coordinates
    createTime: string
    remark: string
  }

  export interface SearchParams {
    oderId?: string
    userName?: string
    state?: IState
  }

  export interface Params extends PageParams {
    orderId?: string
    userName?: string
    state?: IState
  }

  export interface DictItem {
    id: string
    name: string
  }

  export interface OrderRoute {
    orderId: string
    route: Array<{ lng: string; lat: string }>
  }

  export interface DelParams {
    _id: string
  }

  export interface DriverParams {
    driverName?: string
    accountStatus?: number
  }

  export enum DriverStatus {
    auth = 0,
    normal = 1,
    temp = 2,
    always = 3,
    stop = 4
  }

  export interface DriverItem {
    driverId: number
    driverName: string
    driverPhone: string
    cityName: string
    grade: boolean
    driverLevel: number
    driverStatus: number
    rating: number
    driverScore: number
    accountStatus: DriverStatus
    pushOrderCount: number
    orderCompleteCount: number
    createTime: string
    carNo: string
    vehicleName: string
    vehicleBrand: string
    onlineTime: string
  }
}
