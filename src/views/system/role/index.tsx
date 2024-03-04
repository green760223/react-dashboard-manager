import { useAntdTable } from 'ahooks'
import { Form, Input, Button, Table, Space } from 'antd'
import { useForm } from 'antd/es/form/Form'
import api from '@/api/roleApi'
import { Role } from '@/types/api'
import { format } from 'path'
import { formatDate } from '@/utils'

function RoleList() {
  const [form] = useForm()

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

  const columns = [
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
      render() {
        return (
          <Space>
            <Button>編輯</Button>
            <Button>設置權限</Button>
            <Button>刪除</Button>
          </Space>
        )
      }
    }
  ]

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
            <Button type='primary'>新增</Button>
          </div>
        </div>
        <Table bordered rowKey='userId' columns={columns} {...tableProps} />
      </div>
    </div>
  )
}

export default RoleList
