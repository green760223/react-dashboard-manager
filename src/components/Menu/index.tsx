import React from 'react'
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom'
import { Menu } from 'antd'
import styles from './index.module.less'
import { useStore } from '@/store'
import type { MenuProps } from 'antd/es/menu'
import { useState, useEffect } from 'react'
import { Menu as IMenu } from '@/types/api'
import * as Icons from '@ant-design/icons'

function SideMenu() {
  const data: any = useRouteLoaderData('layout')
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const navigate = useNavigate()
  const { isCollapse, isDark } = useStore(state => ({
    isCollapse: state.isCollapse,
    isDark: state.isDark
  }))

  const { pathname } = useLocation()

  type MenuItem = Required<MenuProps>['items'][number]

  // Get the menu item
  function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      label,
      key,
      icon,
      children
    } as MenuItem
  }

  function createIcon(name?: string) {
    if (!name) {
      return <></>
    }
    const customIcons: { [keys: string]: any } = Icons
    const icon = customIcons[name]
    if (!icon) {
      return <></>
    } else {
      return React.createElement(icon)
    }
  }

  // Get the tree menu
  const getTreeMenu = (
    menuList: IMenu.MenuItem[],
    treeList: MenuItem[] = []
  ) => {
    menuList.forEach((item, index) => {
      if (item.menuType == '1' && item.menuState === 1) {
        if (item.buttons) {
          return treeList.push(
            getItem(item.menuName, item.path || index, createIcon(item.icon))
          )
        }
        treeList.push(
          getItem(
            item.menuName,
            item.path || index,
            createIcon(item.icon),
            getTreeMenu(item.children || [])
          )
        )
      }
    })
    return treeList
  }

  // Get the tree menu
  useEffect(() => {
    const treeMenuList = getTreeMenu(data.menuList)
    setMenuList(treeMenuList)
    setSelectedKeys([pathname])
  }, [])

  // logo點擊
  const handleClickLog = () => {
    navigate('/welcome')
  }

  // 菜單點擊
  const handleClickMenu = ({ key }: { key: string }) => {
    setSelectedKeys([key])
    navigate(key)
  }

  return (
    <div className={styles.navSide}>
      <div className={styles.logo} onClick={handleClickLog}>
        <img src='/imgs/logo.png' alt='' className={styles.img} />
        {isCollapse ? '' : <span>倫斯貨運</span>}
      </div>
      <Menu
        defaultOpenKeys={['2']}
        mode='inline'
        theme={isDark ? 'light' : 'dark'}
        items={menuList}
        style={{
          width: isCollapse ? 80 : 'auto',
          height: 'calc(100vh - 50px)'
        }}
        onClick={handleClickMenu}
        selectedKeys={selectedKeys}
      />
    </div>
  )
}

export default SideMenu
