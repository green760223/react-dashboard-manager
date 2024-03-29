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
      title: '刪除確認',
      content: <span>確認刪除該用戶嗎？</span>,
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
      message.success('刪除成功')
      setUserIds([])
      search.reset()
    } catch (error) {
      message.error('刪除失敗')
    }
  }

  // Batch delete users confirmation
  const handlePatchConfirm = () => {
    if (userIds.length === 0) {
      message.error('請選擇需要刪除的用戶')
      return
    }

    Modal.confirm({
      title: '刪除確認',
      content: <span>確認刪除該批用戶嗎？</span>,
      onOk: () => {
        handleUserDelSubmit(userIds)
      }
    })
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
      key: 'address',
      render(record: User.UserItem) {
        return (
          <Space>
            <Button type='text' onClick={() => handleEdit(record)}>
              編輯
            </Button>
            <Button type='text' danger onClick={() => handleDel(record.userId)}>
              刪除
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
            <Select.Option value={2}>離職</Select.Option>
            <Select.Option value={3}>試用期</Select.Option>
          </Select>
        </Form.Item>
      </SearchForm>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>用戶列表</div>
          <div className='action'>
            <AuthButton
              auth='user@create'
              type='primary'
              onClick={handleCreate}
            >
              新增
            </AuthButton>
            <Button type='primary' danger onClick={handlePatchConfirm}>
              批量刪除
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
