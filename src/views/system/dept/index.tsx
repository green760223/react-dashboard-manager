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
      title: '確認',
      content: '確認刪除後數據將無法恢復',
      onOk() {
        handleDelSubmit(id)
      }
    })
  }

  // Delete the department
  const handleDelSubmit = async (_id: string) => {
    await api.deleteDept({ _id })
    message.success('刪除成功')
    getDeptList()
  }

  // Get the department list
  useEffect(() => {
    getDeptList()
  }, [])

  const columns: ColumnsType<Dept.DeptItem> = [
    {
      title: '部門名稱',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 200
    },
    {
      title: '負責人',
      dataIndex: 'userName',
      key: 'userName',
      width: 150
    },
    {
      title: '更新時間',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render(updateTime) {
        return formatDate(updateTime)
      }
    },
    {
      title: '創立時間',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleSubCreate(record._id)}>
              新增
            </Button>
            <Button type='text' onClick={() => handleEdit(record)}>
              編輯
            </Button>
            <Button type='text' danger onClick={() => handleDelete(record._id)}>
              刪除
            </Button>
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      <Form className='search-form' layout='inline' form={form}>
        <Form.Item label='部門名稱' name='deptName'>
          <Input placeholder='部門名稱'></Input>
        </Form.Item>
        <Form.Item>
          <Button type='primary' className='mr10' onClick={getDeptList}>
            搜尋
          </Button>
          <Button type='default' onClick={handleReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>部門列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
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
