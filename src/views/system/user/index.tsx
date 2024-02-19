import { User } from '@/types/api'
import { Button, Table, Form, Input, Select, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'

function UserList() {
  const dataSource = [
    {
      _id: '',
      userId: 0,
      userName: '',
      userEmail: '',
      deptId: '',
      deptName: '',
      state: 0,
      mobile: '',
      job: '',
      role: 0,
      roleList: '',
      createId: 0,
      userImg: ''
    }
  ]

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
      key: 'address'
    },
    {
      title: '用戶狀態',
      dataIndex: 'state',
      key: 'state'
    },
    {
      title: '註冊時間',
      dataIndex: 'createTime',
      key: 'createTime'
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
            <Button type='primary'>搜尋</Button>
            <Button type='default'>重置</Button>
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
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </div>
  )
}

export default UserList
