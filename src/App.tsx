import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, App as AntdApp, theme } from 'antd'
import AntdGlobal from '@/utils/AntdGlobal'
import router from './router'
import './App.less'
import './style/theme.less'
import { useStore } from '@/store'

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
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
