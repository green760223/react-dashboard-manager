/**
 * localStorage module encapsulation
 */

export default {
  /**
   * set localStorage
   * @param {string} key 參數名稱
   * @param {*} value 寫入值
   */
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  /**
   * get localStorage
   * @param {string} key 參數名稱
   * @returns storage value
   */
  get(key: string) {
    const value = localStorage.getItem(key)
    if (!value) return ''
    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  },
  /**
   * remove localStorage
   * @param {string} key 參數名稱
   */
  remove(key: string) {
    localStorage.removeItem(key)
  },
  /**
   * clear localStorage
   */
  clear() {
    localStorage.clear()
  }
}
