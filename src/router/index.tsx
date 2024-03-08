import { Navigate, createBrowserRouter } from 'react-router-dom'
import LoginFC from '@/views/login/Login'
import Welcome from '@/views/welcome'
import Dashboard from '@/views/dashboard'
import Error403 from '@/views/Error403'
import NotFound from '@/views/NotFound'
import Layout from '@/layout/index'
import User from '@/views/system/user'
import Dept from '@/views/system/dept'
import Menu from '@/views/system/menu'
import AuthLoader from './AuthLoader'
import Role from '@/views/system/role'

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
        element: <Dashboard />
      },
      {
        path: '/userList',
        element: <User />
      },
      {
        path: '/deptList',
        element: <Dept />
      },
      {
        path: '/menuList',
        element: <Menu />
      },
      {
        path: '/roleList',
        element: <Role />
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
