import request from '@/utils/request'
import axios from 'axios'
import { useEffect } from 'react'

function Login() {
  useEffect(() => {
    request
      .post('/users', {
        id: '12345'
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return <div>Login</div>
}

export default Login
