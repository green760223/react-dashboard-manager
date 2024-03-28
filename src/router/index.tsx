import React from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import LoginFC from '@/views/login/Login'
import Welcome from '@/views/welcome'
import Error403 from '@/views/Error403'
import NotFound from '@/views/NotFound'
import Layout from '@/layout/index'
import User from '@/views/system/user'
import Dept from '@/views/system/dept'
import Menu from '@/views/system/menu'
import AuthLoader from './AuthLoader'
import Role from '@/views/system/role'
import Order from '@/views/order/OrderList'
import OrderCluster from '@/views/order/OrderCluster'
import DriverList from '@/views/order/DriverList'
import { lazyLoad } from './LazyLoad'

export const router = [
  {
    path: '/',
    element: <Navigate to='/welcome' />
  },
  {
    path: '/login',
    element: <LoginFC />
  },
  {
    element: <Layout />,
    id: 'layout',
    loader: AuthLoader,
    children: [
      {
        path: '/welcome',
        element: <Welcome />
      },
      {
        path: '/dashboard',
        element: lazyLoad(React.lazy(() => import('@/views/dashboard')))
      },
      {
        path: '/userList',
        element: lazyLoad(React.lazy(() => import('@/views/system/user')))
      },
      {
        path: '/deptList',
        element: lazyLoad(React.lazy(() => import('@/views/system/dept')))
      },
      {
        path: '/menuList',
        element: lazyLoad(React.lazy(() => import('@/views/system/menu')))
      },
      {
        path: '/roleList',
        element: lazyLoad(React.lazy(() => import('@/views/system/role')))
      },
      {
        path: '/orderList',
        element: lazyLoad(React.lazy(() => import('@/views/order/OrderList')))
      },
      {
        path: '/cluster',
        element: lazyLoad(
          React.lazy(() => import('@/views/order/OrderCluster'))
        )
      },
      {
        path: '/driverlist',
        element: lazyLoad(React.lazy(() => import('@/views/order/DriverList')))
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to='/404' />
  },
  {
    path: '/404',
    element: <NotFound />
  },
  {
    path: '/403',
    element: <Error403 />
  }
]

export default createBrowserRouter(router)
