import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom'
import { IAuthLoader } from '@/router/AuthLoader'
import { searchRoute } from '@/utils'
import { Tabs } from 'antd'

interface TabsItem {
  key: string
  label: string
  closable: boolean
}

function TabsFC() {
  const { pathname } = useLocation()
  const [tabList, setTabList] = useState<TabsItem[]>([
    { key: '/welcome', label: '首頁', closable: false }
  ])
  const [activeKey, setActiveKey] = useState('')
  const data = useRouteLoaderData('layout') as IAuthLoader
  const navigate = useNavigate()

  useEffect(() => {
    addTabs()
  }, [pathname])

  // 添加頁籤
  const addTabs = () => {
    const route = searchRoute(pathname, data.menuList)
    if (!route) {
      return
    }

    if (!tabList.find(item => item.key === route.path)) {
      tabList.push({
        key: route.path,
        label: route.menuName,
        closable: pathname !== '/welcome'
      })
    }
    setTabList([...tabList])
    setActiveKey(pathname)
  }

  // 切換頁籤
  const handleChange = (path: string) => {
    navigate(path)
  }

  // 刪除頁籤
  const handleDelete = (path: string) => {
    if (pathname === path) {
      tabList.forEach((item, index) => {
        if (item.key != pathname) {
          return
        }

        const nextTab = tabList[index + 1] || tabList[index - 1]
        if (!nextTab) {
          return
        }
        navigate(nextTab.key)
      })
    }
    setTabList(tabList.filter(item => item.key != path))
  }

  return (
    <Tabs
      activeKey={activeKey}
      items={tabList}
      tabBarStyle={{
        height: 40,
        marginBottom: 0,
        backgroundColor: 'var(--dark-bg-color)'
      }}
      type='editable-card'
      hideAdd
      onChange={handleChange}
      onEdit={path => {
        handleDelete(path as string)
      }}
    ></Tabs>
  )
}

export default TabsFC
