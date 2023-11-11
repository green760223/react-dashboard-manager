import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

function Error403() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/')
  }

  return (
    <Result
      status='403'
      title='403'
      subTitle='Sorry, you are not authorized to access this page.'
      extra={
        <Button type='primary' onClick={handleClick}>
          Back Home
        </Button>
      }
    />
  )
}

export default Error403
