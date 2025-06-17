/**
 * 環境配置封裝
 */

type ENV = 'dev' | 'stg' | 'prod'

const env = (document.documentElement.dataset.env as ENV) || 'stg'

console.log('Current environment:', env)

const config = {
  dev: {
    baseAPI: '/api',
    uploadAPI: 'https://api-driver.marsview.com.cn',
    mock: false,
    cdn: 'http://www.aliyun.com',
    mockAPI:
      'https://www.fastmock.site/mock/a5c0902ecbc737f8e4d65447420fe0d2/api'
  },
  stg: {
    baseAPI: '/api',
    uploadAPI: 'https://api-driver.marsview.com.cn',
    mock: false,
    cdn: 'http://www.aliyun.com',
    mockAPI:
      'https://www.fastmock.site/mock/a5c0902ecbc737f8e4d65447420fe0d2/api'
  },
  prod: {
    baseAPI: 'https://api-driver.marsview.com.cn',
    uploadAPI: 'https://api-driver.marsview.com.cn',
    mock: false,
    cdn: 'http://www.aliyun.com',
    mockAPI:
      'https://www.fastmock.site/mock/a5c0902ecbc737f8e4d65447420fe0d2/api'
  }
}

export default {
  env,
  ...config[env]
}
