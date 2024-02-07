import React, { useEffect } from 'react'
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import { Layout, theme, Watermark } from 'antd'
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import Menu from '@/components/Menu'

const { Header, Content, Footer, Sider } = Layout

const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  UserOutlined
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`
}))

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  useEffect(() => {
    const targetNode = document.getElementById('content') as HTMLDivElement
    const observer = new MutationObserver(function (mutationList, observer) {
      console.log(mutationList, observer)
      console.log('content changed')
      observer.disconnect()
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          const span = document.createElement('span')
          span.innerText = 'Hello React'
          targetNode.appendChild(span)
          observer.observe(targetNode, config)
        }
      }
    })
    const config = { attributes: true, childList: true, subtree: true }
    observer.observe(targetNode, config)
  }, [])

  return (
    <Watermark content='React'>
      <Layout>
        <Sider>
          <Menu />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <NavHeader />
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG
              }}
              id='content'
            >
              <span>content</span>
            </div>
          </Content>
          <NavFooter />
        </Layout>
      </Layout>
    </Watermark>
  )
}

export default App
