import { useRef } from 'react'
import { useAntdTable } from 'ahooks'
import { Form, Input, Button, Table, Space } from 'antd'
import { useForm } from 'antd/es/form/Form'
import api from '@/api/roleApi'
import { Role } from '@/types/api'
import { formatDate } from '@/utils'
import CreateRole from './CreateRole'
import { IAction } from '@/types/modal'
import { ColumnsType } from 'antd/es/table'

function RoleList() {
  const [form] = useForm()
  const roleRef = useRef<{
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
            <Button type='text'>設置權限</Button>
            <Button type='text' danger={true}>
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
    </div>
  )
}

export default RoleList
