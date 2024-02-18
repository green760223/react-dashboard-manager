import { Navigate, createBrowserRouter } from 'react-router-dom'
import LoginFC from '@/views/login/Login'
import Welcome from '@/views/welcome'
import Dashboard from '@/views/dashboard'
import Error403 from '@/views/Error403'
import NotFound from '@/views/NotFound'
import Layout from '@/layout/index'
import User from '@/views/system/user'

const router = [
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
