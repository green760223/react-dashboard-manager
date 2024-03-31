import { Modal, Form, TreeSelect, Input, Select } from 'antd'
import { IAction, IModalProp } from '@/types/modal'
import { useEffect, useImperativeHandle, useState } from 'react'
import { Dept, User } from '@/types/api'
import { useForm } from 'antd/es/form/Form'
import { message } from '@/utils/AntdGlobal'
import api from '@/api'

function CreateDept(props: IModalProp<Dept.EditParams>) {
  const [form] = useForm()
  const [action, setAction] = useState<IAction>('create')
  const [visible, setVisible] = useState(false)
  const [depList, setDepList] = useState<Dept.DeptItem[]>([])
  const [userList, setUserList] = useState<User.UserItem[]>([])

  useEffect(() => {
    getAllUserList()
  }, [])

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
      message.success('Operation successful')
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
      title={action === 'create' ? 'Create Department' : 'Edit Department'}
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
        <Form.Item label='Upper Department' name='parentId'>
          <TreeSelect
            placeholder='Please select the upper department'
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: 'deptName', value: '_id' }}
            treeData={depList}
          ></TreeSelect>
        </Form.Item>
        <Form.Item
          label='Department Name'
          name='deptName'
          rules={[
            { required: true, message: 'Please enter the department name' }
          ]}
        >
          <Input placeholder='Please enter the department name' />
        </Form.Item>
        <Form.Item
          label='Department Manager'
          name='userName'
          rules={[
            { required: true, message: 'Please select the department manager' }
          ]}
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
