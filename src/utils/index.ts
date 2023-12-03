/**
 * 工具函數封裝
 */

// 格式化金額
export const formatMoney = (num: number | string) => {
  const a = parseFloat(num.toString())
  return a.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })
}

// 格式化時間
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
