import { Navigate, createBrowserRouter } from 'react-router-dom'
import LoginFC from '@/views/login/Login'
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
    element: <LoginFC />
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
