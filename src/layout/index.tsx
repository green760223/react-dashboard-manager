import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout, theme, Watermark } from 'antd'
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import Menu from '@/components/Menu'
import styles from './index.module.less'

const { Content, Sider } = Layout

const App: React.FC = () => {
  return (
    <Watermark content='React'>
      <Layout>
        <Sider>
          <Menu />
        </Sider>
        <Layout>
          <NavHeader />
          <Content className={styles.content}>
            <div className={styles.wrapper}>
              <Outlet></Outlet>
            </div>
            <NavFooter />
          </Content>
        </Layout>
      </Layout>
    </Watermark>
  )
}

export default App
