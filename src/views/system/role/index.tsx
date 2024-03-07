import { useRef } from 'react'
import { useAntdTable } from 'ahooks'
import { Form, Input, Button, Table, Space, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Role } from '@/types/api'
import { formatDate } from '@/utils'
import { IAction } from '@/types/modal'
import { ColumnsType } from 'antd/es/table'
import { message } from '@/utils/AntdGlobal'
import api from '@/api/roleApi'
import CreateRole from './CreateRole'
import SetPermission from './SetPermission'

function RoleList() {
  const [form] = useForm()
  const roleRef = useRef<{
    open: (type: IAction, data?: Role.RoleItem) => void
  }>()
  const permissionRef = useRef<{
    open: (type: IAction, data?: Role.RoleItem) => void
  }>()

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
      title: '角色名稱',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: '備註',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '更新時間',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render(updateTime: string) {
        return formatDate(updateTime)
      }
    },
    {
      title: '創建時間',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime: string) {
        return formatDate(createTime)
      }
    },
    {
      title: '操作',
      key: 'action',
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleEdit(record)}>
              編輯
            </Button>
            <Button type='text' onClick={() => handleSetPermission(record)}>
              設置權限
            </Button>
            <Button
              type='text'
              danger={true}
              onClick={() => handleDelete(record._id)}
            >
              刪除
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
      title: '確認',
      content: '確認刪除該角色嗎？',
      async onOk() {
        await api.deleteRole({ _id })
        message.success('刪除成功')
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
        <Form.Item name='roleName' label='角色名稱'>
          <Input placeholder='請輸入角色名稱' />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type='primary' onClick={search.submit}>
              搜索
            </Button>
            <Button type='default' onClick={search.reset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>角色列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
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
