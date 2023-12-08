import request from '@/utils/request'
import { Button, Form, Input } from 'antd'
import styles from './index.module.less'

function Login() {
  const onFinish = () => {
    console.log('values')
  }

  return (
    <>
      <div className={styles.login}>
        <div className={styles.loginWrapper}>
          <div className={styles.title}>系統登錄</div>
          <Form
            name='basic'
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete='off'
          >
            <Form.Item<FieldType>
              name='username'
              rules={[
                { required: true, message: 'Please input your username!' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              name='password'
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
              name='remember'
              valuePropName='checked'
              wrapperCol={{ offset: 8, span: 16 }}
            ></Form.Item>

            <Form.Item>
              <Button type='primary' block htmlType='submit'>
                登錄
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Login
