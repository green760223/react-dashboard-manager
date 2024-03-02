import { Modal, Form, TreeSelect, Input, Select } from 'antd'
import { IAction, IModalProp } from '@/types/modal'
import { useEffect, useImperativeHandle, useState } from 'react'
import { Dept, User } from '@/types/api'
import { useForm } from 'antd/es/form/Form'
import api from '@/api'
import { message } from '@/utils/AntdGlobal'

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
      message.success('操作成功')
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
      title={action === 'create' ? '創建部門' : '編輯部門'}
      width={800}
      open={visible}
      okText='確定'
      cancelText='取消'
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelAlign='right' labelCol={{ span: 4 }}>
        <Form.Item label='部門ID' name='_id' hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item label='上級部門' name='parentId'>
          <TreeSelect
            placeholder='請選擇上級部門'
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: 'deptName', value: '_id' }}
            treeData={depList}
          ></TreeSelect>
        </Form.Item>
        <Form.Item
          label='部門名稱'
          name='deptName'
          rules={[{ required: true, message: '請輸入部門名稱' }]}
        >
          <Input placeholder='請輸入部門名稱' />
        </Form.Item>
        <Form.Item
          label='負責人'
          name='userName'
          rules={[{ required: true, message: '請選擇負責人' }]}
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
