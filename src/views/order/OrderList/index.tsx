import { useRef } from 'react'
import { Button, Table, Form, Input, Select, Space, Divider } from 'antd'
import { useAntdTable } from 'ahooks'
import { ColumnsType } from 'antd/es/table'
import { Order } from '@/types/api'
import api from '@/api/orderApi'
import CreateOrder from './components/CreateOrder'
import { format } from 'util'
import { formatDate, formatMoney } from '@/utils'

function OrderList() {
  const [form] = Form.useForm()
  const orderRef = useRef<{ open: () => void }>()

  const getTableData = (
    {
      current,
      pageSize
    }: {
      current: number
      pageSize: number
    },
    formData: Order.SearchParams
  ) => {
    return api
      .getOrderList({
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
    defaultParams: [{ current: 1, pageSize: 10 }, { state: 1 }]
  })

  // 創建訂單
  const handleCreate = () => {
    orderRef.current?.open()
  }

  const columns: ColumnsType<Order.OrderItem> = [
    {
      title: '訂單編號',
      dataIndex: 'orderId',
      key: 'orderId'
    },
    {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 80
    },
    {
      title: '下單地址',
      dataIndex: 'startAddress',
      key: 'startAddress',
      width: 160,
      render: (_, record) => {
        return (
          <div>
            <p>開始地址:{record.startAddress}</p>
            <p>結束地址:{record.endAddress}</p>
          </div>
        )
      }
    },
    {
      title: '下單時間',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: '訂單金額',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render(orderAmount) {
        return formatMoney(orderAmount)
      }
    },
    {
      title: '訂單狀態',
      dataIndex: 'state',
      key: 'state',
      render(state) {
        if (state === 1) {
          return '進行中'
        }
        if (state === 2) {
          return '已完成'
        }
        if (state === 3) {
          return '超時'
        }
        if (state === 4) {
          return '取消'
        }
      }
    },
    {
      title: '用戶名稱',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '司機名稱',
      dataIndex: 'driverName',
      key: 'driverName'
    },
    {
      title: '操作',
      key: 'action',
      render(_, record) {
        return (
          <Space>
            <Button type='text'>詳情</Button>
            <Button type='text'>打點</Button>
            <Button type='text' danger>
              軌跡
            </Button>
            <Button type='text'>刪除</Button>
          </Space>
        )
      }
    }
  ]

  return (
    <div className='OrderList'>
      <Form className='search-form' form={form} layout='inline'>
        <Form.Item name='oderId' label='訂單ID'>
          <Input placeholder='請輸入訂單ID' />
        </Form.Item>
        <Form.Item name='userName' label='用戶名稱'>
          <Input placeholder='請輸入用戶名稱' />
        </Form.Item>
        <Form.Item name='state' label='訂單狀態'>
          <Select style={{ width: 120 }}>
            <Select.Option value={1}>進行中</Select.Option>
            <Select.Option value={2}>已完成</Select.Option>
            <Select.Option value={3}>超時</Select.Option>
            <Select.Option value={4}>取消</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name='search' label='搜尋'>
          <Space>
            <Button type='primary' onClick={search.submit}>
              搜尋
            </Button>
            <Button type='default' onClick={search.reset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>用戶列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table bordered rowKey='userId' columns={columns} {...tableProps} />
      </div>
      {/* 創建訂單組件 */}
      <CreateOrder mRef={orderRef} update={search.submit} />
    </div>
  )
}

export default OrderList