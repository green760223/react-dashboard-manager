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

      message.success('Operation successful!')
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
      title={action === 'create' ? 'Create Role' : 'Edit Role'}
      width={600}
      open={visible}
      okText='Save'
      cancelText='Cancel'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} labelAlign='right' labelCol={{ span: 4 }}>
        <Form.Item name='_id' hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          name='roleName'
          label='Role Name'
          rules={[
            {
              required: true,
              message: 'Please enter the role name!'
            }
          ]}
        >
          <Input placeholder='Please enter the role name' />
        </Form.Item>

        <Form.Item name='remark' label='Remark'>
          <Input.TextArea placeholder='Please enter remark if any' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateRole
