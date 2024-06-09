import { Role } from '@/types/api'
import { IModalProp, IAction } from '@/types/modal'
import { Modal, Form, Input } from 'antd'
import { useImperativeHandle, useState, useEffect } from 'react'
import { message } from '@/utils/AntdGlobal'
import { useTranslation } from 'react-i18next'
import api from '@/api/roleApi'

function CreateRole(props: IModalProp<Role.RoleItem>) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  const [form] = Form.useForm()

  useEffect(() => {}, [t])

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

      message.success(t('rolePanel.operateSuccess'))
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
      title={
        action === 'create'
          ? t('rolePanel.createRole')
          : t('rolePanel.editRole')
      }
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
          label={t('rolePanel.roleName')}
          rules={[
            {
              required: true,
              message: t('rolePanel.enterRoleName')
            }
          ]}
        >
          <Input placeholder={t('rolePanel.enterRoleName')} />
        </Form.Item>

        <Form.Item name='remark' label={t('rolePanel.roleRemark')}>
          <Input.TextArea placeholder={t('rolePanel.enterRemark')} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateRole
