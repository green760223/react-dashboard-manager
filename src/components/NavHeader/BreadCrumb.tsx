/* eslint-disable react/jsx-key */
import { ReactNode, useEffect, useState } from 'react'
import { Breadcrumb } from 'antd'
import { useLocation, useRouteLoaderData } from 'react-router-dom'
import { IAuthLoader } from '@/router/AuthLoader'
import { findTreeNode } from '@/utils'

function BreadCrumb() {
  const { pathname } = useLocation()

  const [breadList, setBreadList] = useState<(string | ReactNode)[]>([])

  // 權限判斷
  const data = useRouteLoaderData('layout') as IAuthLoader

  useEffect(() => {
    const list = findTreeNode(data.menuList, pathname, [])
    setBreadList([<a href='/welcome'>首頁</a>, ...list])
  }, [pathname])

  return (
    <Breadcrumb
      items={breadList.map(item => ({ title: item }))}
      style={{ marginLeft: 10 }}
    />
  )
}

export default BreadCrumb
