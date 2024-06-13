/* eslint-disable react/jsx-key */
import { ReactNode, useEffect, useState } from 'react'
import { Breadcrumb } from 'antd'
import { useLocation, useRouteLoaderData } from 'react-router-dom'
import { IAuthLoader } from '@/router/AuthLoader'
import { findTreeNode } from '@/utils'
import { useTranslation } from 'react-i18next'

function BreadCrumb() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const [breadList, setBreadList] = useState<(string | ReactNode)[]>([])

  // 權限判斷
  const data = useRouteLoaderData('layout') as IAuthLoader

  useEffect(() => {
    const list = findTreeNode(data.menuList, pathname, [])
    setBreadList([<a href='/#/welcome'>{t('breadcrumb.home')}</a>, ...list])
  }, [pathname, t])

  // Breadcrumb 翻譯對應
  const renderBread = (item: ReactNode) => {
    let res: string = ''

    switch (item) {
      case 'Dashboard':
        res = t('breadcrumb.dashboard')
        break
      case 'Order Panel':
        res = t('breadcrumb.orderPanel')
        break
      case 'Order List':
        res = t('breadcrumb.orderList')
        break
      case 'Order Cluster':
        res = t('breadcrumb.orderCluster')
        break
      case 'Driver List':
        res = t('breadcrumb.driverList')
        break
      case 'System Panel':
        res = t('breadcrumb.systemPanel')
        break
      case 'Users':
        res = t('breadcrumb.users')
        break
      case 'Menus':
        res = t('breadcrumb.menus')
        break
      case 'Roles':
        res = t('breadcrumb.roles')
        break
      case 'Departments':
        res = t('breadcrumb.departments')
        break
      default:
        res = item as string
        break
    }

    return { title: res }
  }

  return (
    <Breadcrumb
      items={breadList.map(item => renderBread(item))}
      style={{ marginLeft: 10 }}
    />
  )
}

export default BreadCrumb
