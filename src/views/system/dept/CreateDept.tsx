import { Modal, Form, TreeSelect, Input, Select } from 'antd'
import { IAction, IModalProp } from '@/types/modal'
import { useEffect, useImperativeHandle, useState } from 'react'
import { Dept, User } from '@/types/api'
import { useForm } from 'antd/es/form/Form'
import { message } from '@/utils/AntdGlobal'
import { useTranslation } from 'react-i18next'
import api from '@/api'

function CreateDept(props: IModalProp<Dept.EditParams>) {
  const { t } = useTranslation()
  const [form] = useForm()
  const [action, setAction] = useState<IAction>('create')
  const [visible, setVisible] = useState(false)
  const [depList, setDepList] = useState<Dept.DeptItem[]>([])
  const [userList, setUserList] = useState<User.UserItem[]>([])

  useEffect(() => {
    getAllUserList()
  }, [t])

  const getDeptList = async () => {
    const data = await api.getDeptList()
    console.log(data)
    setDepList(data)
  }
  const getAllUserList = async () => {
    const data = await api.getAllUserList()
    setUserList(data)
  }

  useImperativeHandle(props.mRef, () => {
    return { open }
  })

  const open = (
    type: IAction,
    data?: Dept.EditParams | { parentId: string }
  ) => {
    setAction(type)
    setVisible(true)
    getDeptList()
    if (data) {
      form.setFieldsValue(data)
    }
  }

  // Submit the form
  const handleSubmit = async () => {
    const value = await form.validateFields()
    if (value) {
      if (action === 'create') {
        await api.createDept(form.getFieldsValue())
      } else {
        await api.editDept(form.getFieldsValue())
      }
      message.success(t('deptPanel.operateSuccess'))
      handleCancel()
      props.update()
    }
  }

  // Close and reset the modal
  const handleCancel = () => {
    setVisible(false)
    form.resetFields()
  }

  return (
    <Modal
      title={
        action === 'create'
          ? t('deptPanel.createDept')
          : t('deptPanel.editDept')
      }
      width={1000}
      open={visible}
      okText='Save'
      cancelText='Cancel'
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelAlign='right' labelCol={{ span: 4 }}>
        <Form.Item label='Department ID' name='_id' hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item label={t('deptPanel.upperDept')} name='parentId'>
          <TreeSelect
            placeholder={t('deptPanel.selectUpperDept')}
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: 'deptName', value: '_id' }}
            treeData={depList}
          ></TreeSelect>
        </Form.Item>
        <Form.Item
          label={t('deptPanel.deptName')}
          name='deptName'
          rules={[{ required: true, message: t('deptPanel.enterDeptName') }]}
        >
          <Input placeholder={t('deptPanel.enterDeptName')} />
        </Form.Item>
        <Form.Item
          label={t('deptPanel.deptManager')}
          name='userName'
          rules={[{ required: true, message: t('deptPanel.enterDeptManager') }]}
        >
          <Select>
            {userList.map(item => {
              return (
                <Select.Option value={item.userName} key={item._id}>
                  {item.userName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateDept
