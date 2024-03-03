import React from 'react'
import { useNavigate, useRouteLoaderData } from 'react-router-dom'
import { Menu } from 'antd'
import {
  DesktopOutlined,
  SettingOutlined,
  TeamOutlined
} from '@ant-design/icons'
import styles from './index.module.less'
import { useStore } from '@/store'
import type { MenuProps, MenuTheme } from 'antd/es/menu'
import { useState, useEffect } from 'react'
import { Menu as IMenu } from '@/types/api'
import * as Icons from '@ant-design/icons'

function SideMenu() {
  const data: any = useRouteLoaderData('layout')
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const navigate = useNavigate()
  const isCollapse = useStore(state => state.isCollapse)

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
      if (item.menuType == '1') {
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
    console.log('treeMenuList', treeMenuList)
  }, [])

  const handleClickLog = () => {
    navigate('/welcome')
  }

  return (
    <div>
      <div className={styles.logo} onClick={handleClickLog}>
        <img src='/imgs/logo.png' alt='' className={styles.img} />
        {isCollapse ? '' : <span>倫斯貨運</span>}
      </div>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['2']}
        mode='inline'
        theme='dark'
        items={menuList}
        style={{ width: isCollapse ? 80 : 'auto' }}
      />
    </div>
  )
}

export default SideMenu
