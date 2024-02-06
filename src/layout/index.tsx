import React, { useEffect } from 'react'
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import { Layout, Menu, theme, Watermark } from 'antd'

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
        <Sider
          breakpoint='lg'
          collapsedWidth='0'
          onBreakpoint={broken => {
            console.log(broken)
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type)
          }}
        >
          側邊欄
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            頂部區域
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
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Watermark>
  )
}

export default App
