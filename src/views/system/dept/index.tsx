import api from '@/api'
import { Button, Form, Input, Space, Table } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useState, useEffect } from 'react'
import { Dept } from '@/types/api'
import CreateDept from './CreateDept'

function DeptList() {
  const [form] = useForm()
  const [data, setData] = useState<Dept.DeptItem[]>([])

  const getDeptList = async () => {
    const data = await api.getDeptList(form.getFieldsValue())
    setData(data)
  }

  const handleReset = () => {
    form.resetFields()
  }

  useEffect(() => {
    getDeptList()
  }, [])

  const columns = [
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
      key: 'updateTime'
    },
    {
      title: '創立時間',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render() {
        return (
          <Space>
            <Button type='text'>新增</Button>
            <Button type='text'>編輯</Button>
            <Button type='text'>刪除</Button>
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
            <Button>新增</Button>
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
      <CreateDept />
    </div>
  )
}

export default DeptList
