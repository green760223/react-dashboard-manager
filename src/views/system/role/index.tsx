import { useRef, useEffect } from 'react'
import { useAntdTable } from 'ahooks'
import { Form, Input, Button, Table, Space, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Role } from '@/types/api'
import { formatDate } from '@/utils'
import { IAction } from '@/types/modal'
import { ColumnsType } from 'antd/es/table'
import { message } from '@/utils/AntdGlobal'
import { useTranslation } from 'react-i18next'
import api from '@/api/roleApi'
import CreateRole from './CreateRole'
import SetPermission from './SetPermission'

function RoleList() {
  const { t } = useTranslation()
  const [form] = useForm()
  const roleRef = useRef<{
    open: (type: IAction, data?: Role.RoleItem) => void
  }>()
  const permissionRef = useRef<{
    open: (type: IAction, data?: Role.RoleItem) => void
  }>()

  useEffect(() => {}, [t])

  const getTableDate = (
    {
      current,
      pageSize
    }: {
      current: number
      pageSize: number
    },
    formData: Role.Params
  ) => {
    return api
      .getRoleList({
        ...formData,
        pageNum: current,
        pageSize: pageSize
      })
      .then(data => {
        return {
          total: data.page.total,
          list: data.list
        }
      })
  }

  const { tableProps, search } = useAntdTable(getTableDate, {
    form,
    defaultPageSize: 10
  })

  const columns: ColumnsType<Role.RoleItem> = [
    {
      title: t('rolePanel.roleName'),
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: t('rolePanel.roleRemark'),
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: t('rolePanel.updateTime'),
      dataIndex: 'updateTime',
      key: 'updateTime',
      render(updateTime: string) {
        return formatDate(updateTime)
      }
    },
    {
      title: t('rolePanel.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime: string) {
        return formatDate(createTime)
      }
    },
    {
      title: t('rolePanel.action'),
      key: 'action',
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleEdit(record)}>
              {t('rolePanel.edit')}
            </Button>
            <Button type='text' onClick={() => handleSetPermission(record)}>
              {t('rolePanel.setPermission')}
            </Button>
            <Button
              type='text'
              danger={true}
              onClick={() => handleDelete(record._id)}
            >
              {t('rolePanel.delete')}
            </Button>
          </Space>
        )
      }
    }
  ]

  // 新增角色
  const handleCreate = () => {
    roleRef.current?.open('create')
  }

  // 編輯角色
  const handleEdit = (data: Role.RoleItem) => {
    roleRef.current?.open('edit', data)
  }

  // 刪除角色
  const handleDelete = (_id: string) => {
    Modal.confirm({
      title: t('rolePanel.confirmDelete'),
      content: t('rolePanel.deleteMessage'),
      async onOk() {
        await api.deleteRole({ _id })
        message.success(t('rolePanel.deleteSuccess'))
        search.submit()
      }
    })
  }

  // 設置權限
  const handleSetPermission = (record: Role.RoleItem) => {
    permissionRef.current?.open('edit', record)
  }

  return (
    <div className='role-wrap'>
      <Form form={form} className='search-form' layout='inline'>
        <Form.Item name='roleName' label={t('rolePanel.roleName')}>
          <Input placeholder={t('rolePanel.enterRoleName')} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type='primary' onClick={search.submit}>
              {t('rolePanel.search')}
            </Button>
            <Button type='default' onClick={search.reset}>
              {t('rolePanel.reset')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>{t('rolePanel.roleList')}</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              {t('rolePanel.new')}
            </Button>
          </div>
        </div>
        <Table bordered rowKey='_id' columns={columns} {...tableProps} />
      </div>
      {/* 創建角色組件 */}
      <CreateRole mRef={roleRef} update={search.submit} />
      {/* 設置權限組件 */}
      <SetPermission mRef={permissionRef} update={search.submit} />
    </div>
  )
}

export default RoleList
