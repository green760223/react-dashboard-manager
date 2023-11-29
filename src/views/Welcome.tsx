import request from '@/utils/request'
import storage from '@/utils/storage'
import { Button } from 'antd'

export default function Login() {
  const handleClick = async () => {
    request.post('/users/login', {})
  }

  const handleStorage = (type: number) => {
    if (type === 1) {
      storage.set('age', 30)
      storage.set('user', {
        name: 'Jack',
        gender: '1'
      })
    }

    if (type === 2) {
      const age = storage.get('age')
      const user = storage.get('user')
      console.log(age, user)
    }

    if (type === 3) {
      storage.remove('age')
    }

    if (type === 4) {
      storage.clear()
    }
  }

  return (
    <>
      <div className='welcome'>
        <p>Welcome</p>
        <p>
          <Button onClick={handleClick}>點擊事件</Button>
          <Button onClick={() => handleStorage(1)}>寫入值</Button>
          <Button onClick={() => handleStorage(2)}>讀取值</Button>
          <Button onClick={() => handleStorage(3)}>刪除值</Button>
          <Button onClick={() => handleStorage(4)}>清空所有</Button>
        </p>
      </div>
    </>
  )
}
