/**
 * 環境配置封裝
 */

type ENV = 'dev' | 'stg' | 'prod'
const env = (document.documentElement.dataset.env as ENV) || 'stg'

const config = {
  dev: {
    baseAPI: '/api',
    uploadAPI: 'http://api-driver-dev.marsview.cc',
    mock: false,
    cnd: 'http://www.aliyun.com',
    mockAPI:
      'https://www.fastmock.site/mock/a5c0902ecbc737f8e4d65447420fe0d2/api'
  },
  stg: {
    baseAPI: '/api',
    uploadAPI: 'http://api-driver-stg.marsview.cc',
    mock: false,
    cnd: 'http://www.aliyun.com',
    mockAPI:
      'https://www.fastmock.site/mock/a5c0902ecbc737f8e4d65447420fe0d2/api'
  },
  prod: {
    baseAPI: 'http://api-driver.marsview.cc/api',
    uploadAPI: 'http://api-driver.marsview.cc',
    mock: false,
    cnd: 'http://www.aliyun.com',
    mockAPI:
      'https://www.fastmock.site/mock/a5c0902ecbc737f8e4d65447420fe0d2/api'
  }
}

export default {
  env,
  ...config[env]
}
