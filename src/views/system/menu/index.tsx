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
import { useTranslation } from 'react-i18next'

function MenuList() {
  const { t } = useTranslation()
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
      text = 'Menu'
    } else if (record.menuType == '2') {
      text = 'Button'
    } else if (record.menuType == '3') {
      text = 'Page'
    }

    Modal.confirm({
      title: 'Confirm delete',
      content: `Confirmation: ${text} cannot be recovered after deletion`,
      onOk() {
        handleDelSubmit(record._id)
      }
    })
  }

  // Delete the menu
  const handleDelSubmit = async (_id: string) => {
    await api.deleteMenu({ _id })
    message.success('Deletion successful')
    getMenuList()
  }

  // Get the menu list
  useEffect(() => {
    getMenuList()
  }, [t])

  const columns: ColumnsType<Menu.MenuItem> = [
    {
      title: t('menuPanel.menuName'),
      dataIndex: 'menuName',
      key: 'menuName'
    },
    {
      title: t('menuPanel.menuIcon'),
      dataIndex: 'icon',
      key: 'icon'
    },
    {
      title: t('menuPanel.menuType'),
      dataIndex: 'menuType',
      key: 'menuType',
      render(menuType: number) {
        return {
          1: t('menuPanel.menu'),
          2: t('menuPanel.button'),
          3: t('menuPanel.page')
        }[menuType]
      }
    },
    {
      title: t('menuPanel.menuPermission'),
      dataIndex: 'menuCode',
      key: 'menuCode'
    },
    {
      title: t('menuPanel.routePath'),
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: t('menuPanel.component'),
      dataIndex: 'component',
      key: 'component'
    },
    {
      title: t('menuPanel.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: t('menuPanel.action'),
      key: 'action',
      width: 200,
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleSubCreate(record)}>
              {t('menuPanel.add')}
            </Button>
            <Button type='text' onClick={() => handleEdit(record)}>
              {t('menuPanel.edit')}
            </Button>
            <Button type='text' danger onClick={() => handleDelete(record)}>
              {t('menuPanel.delete')}
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
        <Form.Item label={t('menuPanel.menuName')} name='menuName'>
          <Input placeholder={t('menuPanel.menuName')}></Input>
        </Form.Item>
        <Form.Item label={t('menuPanel.menuStatus')} name='menuState'>
          <Select style={{ width: 100 }}>
            <Select.Option value={1}>{t('menuPanel.enable')}</Select.Option>
            <Select.Option value={2}>{t('menuPanel.disable')}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type='primary' className='mr10' onClick={getMenuList}>
            {t('menuPanel.search')}
          </Button>
          <Button type='default' onClick={handleReset}>
            {t('menuPanel.reset')}
          </Button>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>{t('menuPanel.menuList')}</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              {t('menuPanel.add')}
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
