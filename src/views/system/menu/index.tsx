import { Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useState, useEffect, useRef } from 'react'
import { Menu } from '@/types/api'
import { IAction } from '@/types/modal'
import { ColumnsType } from 'antd/es/table'
import { formatDate } from '@/utils'
import { message } from '@/utils/AntdGlobal'
import api from '@/api'
import CreateMenu from './CreateMenu'

function MenuList() {
  const [form] = useForm()

  const menuRef = useRef<{
    open: (
      type: IAction,
      data?: Menu.EditParams | { parentId?: string; orderBy?: number }
    ) => void
  }>()
  const [data, setData] = useState<Menu.MenuItem[]>([])

  // Get the menu list
  const getMenuList = async () => {
    const data = await api.getMenuList(form.getFieldsValue())
    setData(data)
  }

  // Create a menu
  const handleCreate = () => {
    menuRef.current?.open('create', { orderBy: data.length })
  }

  // Reset form
  const handleReset = () => {
    form.resetFields()
  }

  // Edit menu
  const handleEdit = (record: Menu.MenuItem) => {
    menuRef.current?.open('edit', record)
  }

  // Create a sub menu
  const handleSubCreate = (record: Menu.MenuItem) => {
    menuRef.current?.open('create', {
      parentId: record._id,
      orderBy: record.children?.length
    })
  }

  // Delete menu
  const handleDelete = async (record: Menu.MenuItem) => {
    let text = ''

    if (record.menuType == '1') {
      text = '菜單'
    } else if (record.menuType == '2') {
      text = '按鈕'
    } else if (record.menuType == '3') {
      text = '頁面'
    }

    Modal.confirm({
      title: '確認',
      content: `確認刪除${text}後數據將無法恢復`,
      onOk() {
        handleDelSubmit(record._id)
      }
    })
  }

  // Delete the menu
  const handleDelSubmit = async (_id: string) => {
    await api.deleteMenu({ _id })
    message.success('刪除成功')
    getMenuList()
  }

  // Get the menu list
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
      key: 'path'
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
            <Button type='text' onClick={() => handleSubCreate(record)}>
              新增
            </Button>
            <Button type='text' onClick={() => handleEdit(record)}>
              編輯
            </Button>
            <Button type='text' danger onClick={() => handleDelete(record)}>
              刪除
            </Button>
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      <Form
        className='search-form'
        layout='inline'
        form={form}
        initialValues={{ menuState: 1 }}
      >
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
      <CreateMenu mRef={menuRef} update={getMenuList} />
    </div>
  )
}

export default MenuList
