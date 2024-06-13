import { User } from '@/types/api'
import { Button, Table, Form, Input, Select, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useRef, useState, useEffect } from 'react'
import { formatDate } from '@/utils'
import { IAction } from '@/types/modal'
import { Modal } from 'antd'
import { message } from '@/utils/AntdGlobal'
import { useAntdTable } from 'ahooks'
import AuthButton from '@/components/AuthButton'
import api from '@/api'
import CreateUser from './CreateUser'
import SearchForm from '@/components/SearchForm'
import { useTranslation } from 'react-i18next'

function UserList() {
  const { t } = useTranslation()
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
      title: t('userPanel.deleteUserTitle'),
      content: <span>{t('userPanel.deleteUserContent')}</span>,
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
      message.success(t('userPanel.deleteSuccess'))
      setUserIds([])
      search.reset()
    } catch (error) {
      message.error(t('userPanel.deleteFailed'))
    }
  }

  // Batch delete users confirmation
  const handlePatchConfirm = () => {
    if (userIds.length === 0) {
      message.error(t('userPanel.selectUserFirst'))
      return
    }

    Modal.confirm({
      title: t('userPanel.deleteUserTitle'),
      content: <span>{t('userPanel.deleteUserContent')}</span>,
      onOk: () => {
        handleUserDelSubmit(userIds)
      }
    })
  }

  const columns: ColumnsType<User.UserItem> = [
    {
      title: t('userPanel.userId'),
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: t('userPanel.userName'),
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: t('userPanel.userEmail'),
      dataIndex: 'userEmail',
      key: 'userEmail'
    },
    {
      title: t('userPanel.userRole'),
      dataIndex: 'role',
      key: 'role',
      render(role: number) {
        return {
          0: t('userPanel.superAdministrator'),
          1: t('userPanel.administrator'),
          2: t('userPanel.trialAdministrator'),
          3: t('userPanel.normalUser')
        }[role]
      }
    },
    {
      title: t('userPanel.userState'),
      dataIndex: 'state',
      key: 'state',
      render(state: number) {
        return {
          1: t('userPanel.employed'),
          2: t('userPanel.resigned'),
          3: t('userPanel.probationary')
        }[state]
      }
    },
    {
      title: t('userPanel.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime: string) {
        return formatDate(createTime)
      }
    },
    {
      title: t('userPanel.action'),
      key: 'address',
      render(record: User.UserItem) {
        return (
          <Space>
            <Button type='text' onClick={() => handleEdit(record)}>
              {t('userPanel.edit')}
            </Button>
            <Button type='text' danger onClick={() => handleDel(record.userId)}>
              {t('userPanel.delete')}
            </Button>
          </Space>
        )
      }
    }
  ]

  useEffect(() => {}, [t])

  return (
    <div className='user-list'>
      <SearchForm
        form={form}
        initialValues={{ state: 1 }}
        submit={search.submit}
        reset={search.reset}
      >
        <Form.Item name='userId' label={t('userPanel.userId')}>
          <Input placeholder={t('userPanel.enterUserId')} />
        </Form.Item>
        <Form.Item name='userName' label={t('userPanel.userName')}>
          <Input placeholder={t('userPanel.enterUserName')} />
        </Form.Item>
        <Form.Item name='state' label={t('userPanel.status')}>
          <Select style={{ width: 120 }}>
            <Select.Option value={0}>{t('userPanel.all')}</Select.Option>
            <Select.Option value={1}>{t('userPanel.employed')}</Select.Option>
            <Select.Option value={2}>{t('userPanel.resigned')}</Select.Option>
            <Select.Option value={3}>
              {t('userPanel.probationary')}
            </Select.Option>
          </Select>
        </Form.Item>
      </SearchForm>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>{t('userPanel.userList')}</div>
          <div className='action'>
            <AuthButton
              auth='user@create'
              type='primary'
              onClick={handleCreate}
            >
              {t('userPanel.createUser')}
            </AuthButton>
            <Button type='primary' danger onClick={handlePatchConfirm}>
              {t('userPanel.batchDelete')}
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
