import { Button, Form, Input, Modal, Space, Table } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useState, useEffect, useRef } from 'react'
import { Dept } from '@/types/api'
import { IAction } from '@/types/modal'
import { ColumnsType } from 'antd/es/table'
import { formatDate } from '@/utils'
import { message } from '@/utils/AntdGlobal'
import api from '@/api'
import CreateDept from './CreateDept'

function DeptList() {
  const [form] = useForm()

  const deptRef = useRef<{
    open: (type: IAction, data?: Dept.EditParams | { parentId: string }) => void
  }>()
  const [data, setData] = useState<Dept.DeptItem[]>([])

  // Get the department list
  const getDeptList = async () => {
    const data = await api.getDeptList(form.getFieldsValue())
    setData(data)
  }

  // Create department
  const handleCreate = () => {
    deptRef.current?.open('create')
  }

  // Reset form
  const handleReset = () => {
    form.resetFields()
  }

  // Edit department
  const handleEdit = (record: Dept.DeptItem) => {
    deptRef.current?.open('edit', record)
  }

  // Create a sub department
  const handleSubCreate = (id: string) => {
    deptRef.current?.open('create', { parentId: id })
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to delete this department?',
      onOk() {
        handleDelSubmit(id)
      }
    })
  }

  // Delete the department
  const handleDelSubmit = async (_id: string) => {
    await api.deleteDept({ _id })
    message.success('Delete successfully!')
    getDeptList()
  }

  // Get the department list
  useEffect(() => {
    getDeptList()
  }, [])

  const columns: ColumnsType<Dept.DeptItem> = [
    {
      title: 'Department Name',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 200
    },
    {
      title: 'Department Manager',
      dataIndex: 'userName',
      key: 'userName',
      width: 150
    },
    {
      title: 'Update Time',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render(updateTime) {
        return formatDate(updateTime)
      }
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleSubCreate(record._id)}>
              Add
            </Button>
            <Button type='text' onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Button type='text' danger onClick={() => handleDelete(record._id)}>
              Delete
            </Button>
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      <Form className='search-form' layout='inline' form={form}>
        <Form.Item label='Department Name' name='deptName'>
          <Input placeholder='Department Name'></Input>
        </Form.Item>
        <Form.Item>
          <Button type='primary' className='mr10' onClick={getDeptList}>
            Search
          </Button>
          <Button type='default' onClick={handleReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>Department List</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              New
            </Button>
          </div>
        </div>
        <Table
          bordered
          rowKey='_id'
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </div>
      <CreateDept mRef={deptRef} update={getDeptList} />
    </div>
  )
}

export default DeptList
