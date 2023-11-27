import request from '@/utils/request'
import { useEffect } from 'react'

function Login() {
  useEffect(() => {
    request.post('/users/login', {
      id: '12345'
    })
  }, [])

  return <div>Login</div>
}

export default Login
