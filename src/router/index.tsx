import { Navigate, createBrowserRouter, useRoutes } from 'react-router-dom'
import Login from '@/views/login/Login'
import Welcome from '@/views/Welcome'
import Error403 from '@/views/Error403'
import NotFound from '@/views/NotFound'

const router = [
  {
    path: '/',
    element: <Welcome />
  },
  {
    path: '/login',
    element: <Login />
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

export default function Router() {
  return useRoutes(router)
}

// export default createBrowserRouter(router)
