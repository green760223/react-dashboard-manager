import request from '@/utils/request'
import { useEffect } from 'react'

function Login() {
  useEffect(() => {
    request
      .post<string>('/users/login', {
        id: '12345'
      })
      .then(res => {
        const token = res
      })
  }, [])

  return <div>Login</div>
}

export default Login
