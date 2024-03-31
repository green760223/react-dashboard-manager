import { User } from '@/types/api'
import { Button, Table, Form, Input, Select, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useRef, useState } from 'react'
import { formatDate } from '@/utils'
import { IAction } from '@/types/modal'
import { Modal } from 'antd'
import { message } from '@/utils/AntdGlobal'
import { useAntdTable } from 'ahooks'
import AuthButton from '@/components/AuthButton'
import api from '@/api'
import CreateUser from './CreateUser'
import SearchForm from '@/components/SearchForm'

function UserList() {
  const [form] = Form.useForm()
  const userRef = useRef<{
    open: (type: IAction, data?: User.UserItem) => void
  }>()
  const [userIds, setUserIds] = useState<number[]>([])

  const getTableData = (
    {
      current,
      pageSize
    }: {
      current: number
      pageSize: number
    },
    formData: User.Params
  ) => {
    return api
      .getUserList({
        ...formData,
        pageNum: current,
        pageSize: pageSize
      })
      .then(data => {
        return {
          list: data.list,
          total: data.page.total
        }
      })
  }

  // Get the user list
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultPageSize: 10
  })

  // Create user
  const handleCreate = () => {
    userRef.current?.open('create')
  }

  // Edit user
  const handleEdit = (record: User.UserItem) => {
    userRef.current?.open('edit', record)
  }

  // Delete user
  const handleDel = (userId: number) => {
    Modal.confirm({
      title: 'Delete confirmation',
      content: <span>Are you sure you want to delete this user?</span>,
      onOk: () => {
        handleUserDelSubmit([userId])
      }
    })
  }

  // Delete a user
  const handleUserDelSubmit = async (ids: number[]) => {
    try {
      await api.delUser({
        userIds: ids
      })
      message.success('Delete success')
      setUserIds([])
      search.reset()
    } catch (error) {
      message.error('Delete failed')
    }
  }

  // Batch delete users confirmation
  const handlePatchConfirm = () => {
    if (userIds.length === 0) {
      message.error('Please select the user to delete')
      return
    }

    Modal.confirm({
      title: 'Delete confirmation',
      content: <span>Are you sure you want to delete these users?</span>,
      onOk: () => {
        handleUserDelSubmit(userIds)
      }
    })
  }

  const columns: ColumnsType<User.UserItem> = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'User Email',
      dataIndex: 'userEmail',
      key: 'userEmail'
    },
    {
      title: 'User Role',
      dataIndex: 'role',
      key: 'role',
      render(role: number) {
        return {
          0: 'Super Administrator',
          1: 'Administrator',
          2: 'Trial Administrator',
          3: 'Normal User'
        }[role]
      }
    },
    {
      title: 'User State',
      dataIndex: 'state',
      key: 'state',
      render(state: number) {
        return {
          1: 'Employed',
          2: 'Resigned',
          3: 'Probationary'
        }[state]
      }
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime: string) {
        return formatDate(createTime)
      }
    },
    {
      title: 'Action',
      key: 'address',
      render(record: User.UserItem) {
        return (
          <Space>
            <Button type='text' onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Button type='text' danger onClick={() => handleDel(record.userId)}>
              Delete
            </Button>
          </Space>
        )
      }
    }
  ]

  return (
    <div className='user-list'>
      <SearchForm
        form={form}
        initialValues={{ state: 1 }}
        submit={search.submit}
        reset={search.reset}
      >
        <Form.Item name='userId' label='User ID'>
          <Input placeholder='Please enter user ID' />
        </Form.Item>
        <Form.Item name='userName' label='User Name'>
          <Input placeholder='Please enter user name' />
        </Form.Item>
        <Form.Item name='state' label='Status'>
          <Select style={{ width: 120 }}>
            <Select.Option value={0}>All</Select.Option>
            <Select.Option value={1}>Employed</Select.Option>
            <Select.Option value={2}>Resigned</Select.Option>
            <Select.Option value={3}>Probationary</Select.Option>
          </Select>
        </Form.Item>
      </SearchForm>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>User List</div>
          <div className='action'>
            <AuthButton
              auth='user@create'
              type='primary'
              onClick={handleCreate}
            >
              Create User
            </AuthButton>
            <Button type='primary' danger onClick={handlePatchConfirm}>
              Batch Delete
            </Button>
          </div>
        </div>
        <Table
          bordered
          rowKey='userId'
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: userIds,
            onChange: (selectedRowKeys: React.Key[]) => {
              setUserIds(selectedRowKeys as number[])
            }
          }}
          columns={columns}
          {...tableProps}
        />
      </div>
      <CreateUser
        mRef={userRef}
        update={() => {
          search.reset()
        }}
      />
    </div>
  )
}

export default UserList
