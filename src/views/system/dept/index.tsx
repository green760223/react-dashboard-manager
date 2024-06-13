import { Button, Form, Input, Modal, Space, Table } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useState, useEffect, useRef } from 'react'
import { Dept } from '@/types/api'
import { IAction } from '@/types/modal'
import { ColumnsType } from 'antd/es/table'
import { formatDate } from '@/utils'
import { message } from '@/utils/AntdGlobal'
import { useTranslation } from 'react-i18next'
import api from '@/api'
import CreateDept from './CreateDept'

function DeptList() {
  const { t } = useTranslation()
  const [form] = useForm()

  const deptRef = useRef<{
    open: (type: IAction, data?: Dept.EditParams | { parentId: string }) => void
  }>()
  const [data, setData] = useState<Dept.DeptItem[]>([])

  // Get the department list
  const getDeptList = async () => {
    const data = await api.getDeptList(form.getFieldsValue())
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
  const handleEdit = (record: Dept.DeptItem) => {
    deptRef.current?.open('edit', record)
  }

  // Create a sub department
  const handleSubCreate = (id: string) => {
    deptRef.current?.open('create', { parentId: id })
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t('deptPanel.confirmDelete'),
      content: t('deptPanel.deleteMessage'),
      onOk() {
        handleDelSubmit(id)
      }
    })
  }

  // Delete the department
  const handleDelSubmit = async (_id: string) => {
    await api.deleteDept({ _id })
    message.success(t('deptPanel.deleteSuccess'))
    getDeptList()
  }

  // Get the department list
  useEffect(() => {
    getDeptList()
  }, [t])

  const columns: ColumnsType<Dept.DeptItem> = [
    {
      title: t('deptPanel.deptName'),
      dataIndex: 'deptName',
      key: 'deptName',
      width: 200
    },
    {
      title: t('deptPanel.deptManager'),
      dataIndex: 'userName',
      key: 'userName',
      width: 150
    },
    {
      title: t('deptPanel.updateTime'),
      dataIndex: 'updateTime',
      key: 'updateTime',
      render(updateTime) {
        return formatDate(updateTime)
      }
    },
    {
      title: t('deptPanel.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: t('deptPanel.action'),
      key: 'action',
      width: 200,
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleSubCreate(record._id)}>
              {t('deptPanel.add')}
            </Button>
            <Button type='text' onClick={() => handleEdit(record)}>
              {t('deptPanel.edit')}
            </Button>
            <Button type='text' danger onClick={() => handleDelete(record._id)}>
              {t('deptPanel.delete')}
            </Button>
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      <Form className='search-form' layout='inline' form={form}>
        <Form.Item label={t('deptPanel.deptName')} name='deptName'>
          <Input placeholder={t('deptPanel.deptName')}></Input>
        </Form.Item>
        <Form.Item>
          <Button type='primary' className='mr10' onClick={getDeptList}>
            {t('deptPanel.add')}
          </Button>
          <Button type='default' onClick={handleReset}>
            {t('deptPanel.reset')}
          </Button>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>{t('deptPanel.deptList')}</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              {t('deptPanel.add')}
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
      <CreateDept mRef={deptRef} update={getDeptList} />
    </div>
  )
}

export default DeptList
