import { Role } from '@/types/api'
import { IModalProp, IAction } from '@/types/modal'
import { Modal, Form, Input } from 'antd'
import { useImperativeHandle, useState } from 'react'
import { message } from '@/utils/AntdGlobal'
import api from '@/api/roleApi'

function CreateRole(props: IModalProp<Role.RoleItem>) {
  const [visible, setVisible] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  const [form] = Form.useForm()

  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  const open = (type: IAction, data?: Role.RoleItem) => {
    setAction(type)
    setVisible(true)
    if (data) {
      form.setFieldsValue(data)
    }
  }

  // 提交新增角色
  const handleOk = async () => {
    const valid = await form.validateFields()
    if (valid) {
      const params = form.getFieldsValue()

      if (action === 'create') {
        await api.createRole(params)
      } else {
        await api.editRole(params)
      }

      message.success('操作成功')
      handleCancel()
      props.update()
    }
  }

  // 取消新增角色
  const handleCancel = () => {
    form.resetFields()
    setVisible(false)
  }

  return (
    <Modal
      title={action === 'create' ? '新增角色' : '編輯角色'}
      width={600}
      open={visible}
      okText='確定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} labelAlign='right' labelCol={{ span: 4 }}>
        <Form.Item name='_id' hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          name='roleName'
          label='角色名稱'
          rules={[
            {
              required: true,
              message: '請輸入角色名稱'
            }
          ]}
        >
          <Input placeholder='請輸入角色名稱' />
        </Form.Item>

        <Form.Item name='remark' label='備註'>
          <Input.TextArea placeholder='請輸入備註' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateRole
