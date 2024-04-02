import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, App as AntdApp, theme } from 'antd'
import { useStore } from '@/store'
import { Analytics } from '@vercel/analytics/react'
import AntdGlobal from '@/utils/AntdGlobal'
import router from './router'
import './App.less'
import './style/theme.less'

function App() {
  const isDark = useStore(state => state.isDark)

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ed6c00'
        },
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <AntdApp>
        <AntdGlobal />
        <RouterProvider router={router} />
        <Analytics />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
