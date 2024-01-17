import request from '@/utils/request'
import { Button, Form, Input, App } from 'antd'
import api from '@/api/index'
import styles from './index.module.less'
import { Login } from '@/types/api'
import storage from '@/utils/storage'
import { useState } from 'react'

function LoginFC() {
  const [loading, setLoading] = useState(false)

  const { message, notification, modal } = App.useApp()

  // LoginFC function component
  const onFinish = async (values: Login.params) => {
    setLoading(true)
    const data: any = await api.login(values)
    if (data.code != 0) {
      return message.error('登錄失敗')
    }

    setLoading(false)
    console.log('data:', data)
    storage.set('token', data)
    message.success('登錄成功')
    const params = new URLSearchParams(location.search)
    location.href = params.get('callback') || '/'
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
