import React, { useEffect } from 'react'
import {
  Navigate,
  Outlet,
  useLocation,
  useRouteLoaderData
} from 'react-router-dom'
import { Layout, Watermark } from 'antd'
import { useStore } from '@/store'
import { IAuthLoader } from '@/router/AuthLoader'
import { searchRoute } from '@/utils'
import { router } from '@/router'
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import Menu from '@/components/Menu'
import styles from './index.module.less'
import api from '@/api'
import TabsFC from '@/components/Tabs'

const { Sider } = Layout

const App: React.FC = () => {
  const { pathname } = useLocation()
  const { updateUserInfo, isCollapse, userInfo } = useStore()

  useEffect(() => {
    getUserInfo()
  }, [])

  const getUserInfo = async () => {
    const data = await api.getUserInfo()
    updateUserInfo(data)
  }

  const data = useRouteLoaderData('layout') as IAuthLoader
  const route = searchRoute(pathname, router)
  if (route && route.meta?.auth === false) {
    // 繼續執行
  } else {
    // 判斷是否有權限
    const staticPath = ['/welcome', '/403', '/404']
    if (
      !data.menuPathList.includes(pathname) &&
      !staticPath.includes(pathname)
    ) {
      return <Navigate to='/403' />
    }
  }

  return (
    <Watermark content='React'>
      {userInfo._id ? (
        <Layout>
          <Sider collapsed={isCollapse}>
            <Menu />
          </Sider>
          <Layout>
            <NavHeader />
            <TabsFC />
            <div className={styles.content}>
              <div className={styles.wrapper}>
                <Outlet></Outlet>
              </div>
              <NavFooter />
            </div>
          </Layout>
        </Layout>
      ) : null}
    </Watermark>
  )
}

export default App
