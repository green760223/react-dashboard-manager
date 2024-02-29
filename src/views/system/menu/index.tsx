import { Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useState, useEffect, useRef } from 'react'
import { Dept, Menu } from '@/types/api'
import { IAction } from '@/types/modal'
import { ColumnsType } from 'antd/es/table'
import { formatDate } from '@/utils'
import { message } from '@/utils/AntdGlobal'
import api from '@/api'

function MenuList() {
  const [form] = useForm()

  const deptRef = useRef<{
    open: (type: IAction, data?: Dept.EditParams | { parentId: string }) => void
  }>()
  const [data, setData] = useState<Menu.MenuItem[]>([])

  // Get the menu list
  const getMenuList = async () => {
    const data = await api.getMenuList(form.getFieldsValue())
    setData(data)
  }

  // Create department
  const handleCreate = () => {
    deptRef.current?.open('create')
  }

  // Reset form
  const handleReset = () => {
    form.resetFields()
  }

  // Edit department
  const handleEdit = (record: Menu.MenuItem) => {
    // deptRef.current?.open('edit', record)
    record
  }

  // Create a sub department
  const handleSubCreate = (id: string) => {
    deptRef.current?.open('create', { parentId: id })
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '確認',
      content: '確認刪除後數據將無法恢復',
      onOk() {
        handleDelSubmit(id)
      }
    })
  }

  // Delete the department
  const handleDelSubmit = async (_id: string) => {
    await api.deleteDept({ _id })
    message.success('刪除成功')
    getMenuList()
  }

  // Get the department list
  useEffect(() => {
    getMenuList()
  }, [])

  const columns: ColumnsType<Menu.MenuItem> = [
    {
      title: '菜單名稱',
      dataIndex: 'menuName',
      key: 'menuName'
    },
    {
      title: '菜單圖標',
      dataIndex: 'icon',
      key: 'icon'
    },
    {
      title: '菜單類型',
      dataIndex: 'menuType',
      key: 'menuType',
      render(menuType: number) {
        return {
          1: '菜單',
          2: '按鈕',
          3: '頁面'
        }[menuType]
      }
    },
    {
      title: '權限標示',
      dataIndex: 'menuCode',
      key: 'menuCode'
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'menpathuCode'
    },
    {
      title: '組建名稱',
      dataIndex: 'component',
      key: 'component'
    },
    {
      title: '創建時間',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleSubCreate(record._id)}>
              新增
            </Button>
            <Button type='text' onClick={() => handleEdit(record)}>
              編輯
            </Button>
            <Button type='text' onClick={() => handleDelete(record._id)}>
              刪除
            </Button>
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      <Form className='search-form' layout='inline' form={form}>
        <Form.Item label='菜單名稱' name='menuName'>
          <Input placeholder='菜單名稱'></Input>
        </Form.Item>
        <Form.Item label='菜單狀態' name='menuState'>
          <Select style={{ width: 100 }}>
            <Select.Option value={1}>正常</Select.Option>
            <Select.Option value={2}>停用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type='primary' className='mr10' onClick={getMenuList}>
            搜尋
          </Button>
          <Button type='default' onClick={handleReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>菜單列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table
          bordered
          rowKey='_id'
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default MenuList
