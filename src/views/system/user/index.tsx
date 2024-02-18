import { Button, Table, Form, Input } from 'antd'

function UserList() {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    }
  ]

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address'
    }
  ]

  return (
    <div className='user-list'>
      <Form className='search-form' layout='inline'>
        <Form.Item name='userId' label='用戶ID'>
          <Input />
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
