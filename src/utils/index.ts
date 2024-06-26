/**
 * 工具函數封裝
 */

import { Menu } from '@/types/api'

// 格式化金額
export const formatMoney = (num?: number | string) => {
  if (!num) {
    return '0.00'
  }
  const a = parseFloat(num.toString())
  return a.toLocaleString('zh-CN', { style: 'currency', currency: 'USD' })
}

// 格式化本地日期
export const toLocalDate = (date?: Date, rule?: string) => {
  let curDate = new Date()
  if (date) {
    curDate = date
  }

  if (rule === 'yyyy-MM-dd') {
    return curDate.toLocaleDateString('zh-CN').replaceAll('/', '-')
  }

  if (rule === 'HH:mm:ss') {
    return curDate.toLocaleTimeString('zh-CN').replaceAll('/', '-')
  }

  return curDate.toLocaleString('zh-CN').replaceAll('/', '-')
}

// 格式化數字
export const formatNum = (num?: number | string) => {
  if (!num) {
    return 0
  }
  const a = num.toString()
  if (a.indexOf('.') > -1) return a.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  return a.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
}

// 格式化日期
export const formatDate = (date?: Date | string, rule?: string) => {
  let curDate = new Date()
  if (date instanceof Date) {
    curDate = date
  } else if (date) {
    curDate = new Date(date)
  }

  let fmt = rule || 'yyyy-MM-dd HH:mm:ss'
  fmt = fmt.replace(/(y+)/, curDate.getFullYear().toString())

  type OType = {
    [ket: string]: number
  }

  const O: OType = {
    'M+': curDate.getMonth() + 1,
    'd+': curDate.getDate(),
    'H+': curDate.getHours(),
    'm+': curDate.getMinutes(),
    's+': curDate.getSeconds()
  }

  for (const k in O) {
    // const val = O[k].toString()
    fmt = fmt.replace(
      new RegExp(`(${k})`),
      O[k] > 9 ? O[k].toString() : '0' + O[k].toString()
    )
    // fmt = fmt.replace(new RegExp(`(${k})`), ('00' + val).substring(val.length))
  }
  return fmt
}

// 格式化用戶狀態轉換
export const formatSate = (state: number) => {
  if (state === 1) {
    return 'Employed'
  }

  if (state === 2) {
    return 'Probation'
  }

  if (state === 3) {
    return 'Resigned'
  }
}

// 獲取頁面路徑
export const getMenuPath = (list: Menu.MenuItem[]): string[] => {
  return list.reduce((result: string[], item: Menu.MenuItem) => {
    return result.concat(
      Array.isArray(item.children) && !item.buttons
        ? getMenuPath(item.children)
        : item.path + ''
    )
  }, [])
}

// 遞迴獲取路由對象
export const searchRoute: any = (path: string, routes: any[]) => {
  for (const item of routes) {
    if (item.path === path) {
      return item
    }

    if (item.children) {
      const result = searchRoute(path, item.children)
      if (result) {
        return result
      }
    }
  }
  return ''
}

/**
 * 手機號加密
 * @example
 * 17611000011 => 176****0011
 */
export const formatMobile = (mobile?: number) => {
  if (!mobile) {
    return '-'
  }
  const phone = mobile.toString()
  return phone.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
}

/**
 * 遞迴查找樹節點
 */
export const findTreeNode = (
  tree: Menu.MenuItem[],
  pathName: string,
  path: string[]
): string[] => {
  if (!tree) {
    return []
  }

  for (const data of tree) {
    path.push(data.menuName)

    if (data.path === pathName) {
      return path
    }

    if (data.children?.length) {
      const list = findTreeNode(data.children, pathName, path)
      if (list?.length) {
        return list
      }
    }
    path.pop()
  }
  return []
}
