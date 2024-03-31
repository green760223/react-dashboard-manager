import { Button, Form, Input, App } from 'antd'
import api from '@/api/index'
import styles from './index.module.less'
import { Login } from '@/types/api'
import { useState } from 'react'
import { useStore } from '@/store'
import storage from '@/utils/storage'

function LoginFC() {
  const updateToken = useStore(state => state.updateToken)
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()

  // LoginFC function component
  const onFinish = async (values: Login.Params) => {
    try {
      setLoading(true)
      const data = await api.login(values)
      setLoading(false)
      storage.set('token', data)
      updateToken(data)
      message.success('登錄成功')
      const params = new URLSearchParams(location.search)
      setTimeout(() => {
        location.href = params.get('callback') || '/#/welcome'
      }, 1000)
    } catch (error) {
      // In case the login fails, the loading button got stuck in the loading state
      setLoading(false)
    }
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
            <Form.Item
              name='userName'
              rules={[
                { required: true, message: 'Please input your username!' }
              ]}
              initialValue={2996130235}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name='userPwd'
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              valuePropName='checked'
              wrapperCol={{ offset: 8, span: 16 }}
            ></Form.Item>

            <Form.Item>
              <Button type='primary' block htmlType='submit' loading={loading}>
                登錄
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}

export default LoginFC
