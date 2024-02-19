import { PageParams, User } from '@/types/api'
import { Button, Table, Form, Input, Select, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import api from '@/api'
import { formatDate } from '@/utils'

function UserList() {
  const [form] = Form.useForm()
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  })
  const [data, setData] = useState<User.UserItem[]>([])

  useEffect(() => {
    getUserList({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    })
  }, [pagination.current, pagination.pageSize])

  // Get user list
  const getUserList = async (params: PageParams) => {
    const values = form.getFieldsValue()
    const data = await api.getUserList({
      ...values,
      pageNum: params.pageNum,
      pageSize: params.pageSize
    })
    const list = Array.from({ length: 50 })
      .fill({})
      .map((item: any) => {
        item = {
          ...data.list[0]
        }
        item.userId = Math.random()
        return item
      })
    setData(list)
    setTotal(list.length)
    setPagination({
      current: data.page.pageNum,
      pageSize: data.page.pageSize
    })
  }

  const handleSearch = () => {
    getUserList({
      pageNum: 1,
      pageSize: pagination.pageSize
    })
  }

  // Reset the form
  const handleReset = () => {
    form.resetFields()
  }

  const columns: ColumnsType<User.UserItem> = [
    {
      title: '用戶ID',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: '用戶名稱',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '用戶信箱',
      dataIndex: 'userEmail',
      key: 'userEmail'
    },
    {
      title: '用戶角色',
      dataIndex: 'address',
      key: 'address',
      render(role: number) {
        return {
          0: '超級管理員',
          1: '管理員',
          2: '體驗管理員',
          3: '普通用戶'
        }[role]
      }
    },
    {
      title: '用戶狀態',
      dataIndex: 'state',
      key: 'state',
      render(state: number) {
        return {
          1: '在職',
          2: '離職',
          3: '試用期'
        }[state]
      }
    },
    {
      title: '註冊時間',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime: string) {
        return formatDate(createTime)
      }
    },
    {
      title: '操作',
      dataIndex: 'address',
      key: 'address',
      render() {
        return (
          <Space>
            <Button type='text'>編輯</Button>
            <Button type='text' danger>
              刪除
            </Button>
          </Space>
        )
      }
    }
  ]

  return (
    <div className='user-list'>
      <Form
        className='search-form'
        form={form}
        layout='inline'
        initialValues={{ state: 1 }}
      >
        <Form.Item name='userId' label='用戶ID'>
          <Input placeholder='請輸入用戶ID' />
        </Form.Item>
        <Form.Item name='userName' label='用戶名稱'>
          <Input placeholder='請輸入用戶名稱' />
        </Form.Item>
        <Form.Item name='state' label='狀態'>
          <Select style={{ width: 120 }}>
            <Select.Option value={0}>所有</Select.Option>
            <Select.Option value={1}>在職</Select.Option>
            <Select.Option value={2}>試用期</Select.Option>
            <Select.Option value={3}>離職</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name='search' label='搜尋'>
          <Space>
            <Button type='primary' onClick={handleSearch}>
              搜尋
            </Button>
            <Button type='default' onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>用戶列表</div>
          <div className='action'>
            <Button type='primary'>新增</Button>
            <Button type='primary' danger>
              批量刪除
            </Button>
          </div>
        </div>
        <Table
          bordered
          rowKey='userId'
          rowSelection={{ type: 'checkbox' }}
          dataSource={data}
          columns={columns}
          pagination={{
            position: ['bottomRight'],
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 筆數據`,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize })
            }
          }}
        />
      </div>
    </div>
  )
}

export default UserList
