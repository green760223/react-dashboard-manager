import { Modal, Form, TreeSelect, Input, Select } from 'antd'
import { IAction } from '@/types/modal'
import { useState } from 'react'
import { Dept } from '@/types/api'
import { useForm } from 'antd/es/form/Form'

function CreateDept() {
  const [form] = useForm()
  const [action, setAction] = useState<IAction>('create')
  const [depList, setDepList] = useState<Dept.DeptItem[]>([])

  const handleSubmit = () => {}
  const handleCancel = () => {}

  return (
    <Modal
      title={action === 'create' ? '創建部門' : '編輯部門'}
      width={800}
      open={true}
      okText='確定'
      cancelText='取消'
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelAlign='right' labelCol={{ span: 4 }}>
        <Form.Item label='上級部門' name='parentId'>
          <TreeSelect
            placeholder='請選擇上級部門'
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: 'deptName', value: '_id' }}
            treeData={depList}
          ></TreeSelect>
        </Form.Item>
        <Form.Item label='部門名稱' name='deptName'>
          <Input placeholder='請輸入部門名稱' />
        </Form.Item>
        <Form.Item label='負責人' name='userName'>
          <Select>
            <Select.Option value='Jack' key={'Jack'}>
              Jack
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateDept
