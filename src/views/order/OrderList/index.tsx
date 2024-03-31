import { useRef } from 'react'
import { Button, Table, Form, Input, Select, Space, Modal } from 'antd'
import { useAntdTable } from 'ahooks'
import { ColumnsType } from 'antd/es/table'
import { Order } from '@/types/api'
import { formatDate, formatMoney } from '@/utils'
import { message } from '@/utils/AntdGlobal'
import OrderDetail from './components/OrderDetail'
// import CreateOrder from './components/CreateOrder'
import CreateOrder from './components/CreateOrderNew'
import api from '@/api/orderApi'
import OrderMarker from './components/OrderMarker'
import OrderRoute from './components/OrderRoute'

function OrderList() {
  const [form] = Form.useForm()
  const orderRef = useRef<{ open: () => void }>()
  const detailRef = useRef<{ open: (orderId: string) => void }>()
  const markerRef = useRef<{ open: (orderId: string) => void }>()
  const routeRef = useRef<{ open: (orderId: string) => void }>()

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

  const columns: ColumnsType<Order.OrderItem> = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId'
    },
    {
      title: 'City',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 80
    },
    {
      title: 'Ordering Address',
      dataIndex: 'startAddress',
      key: 'startAddress',
      width: 160,
      render: (_, record) => {
        return (
          <div>
            <p>Start: {record.startAddress}</p>
            <p>End: {record.endAddress}</p>
          </div>
        )
      }
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: 'Order Amount',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render(orderAmount) {
        return formatMoney(orderAmount)
      }
    },
    {
      title: 'Order Status',
      dataIndex: 'state',
      key: 'state',
      render(state) {
        if (state === 1) {
          return 'In Progress'
        }
        if (state === 2) {
          return 'Completed'
        }
        if (state === 3) {
          return 'Overdue'
        }
        if (state === 4) {
          return 'Cancelled'
        }
      }
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'Driver Name',
      dataIndex: 'driverName',
      key: 'driverName'
    },
    {
      title: 'Action',
      key: 'action',
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleDetail(record.orderId)}>
              Detail
            </Button>
            <Button type='text' onClick={() => handleMarker(record.orderId)}>
              Marker
            </Button>
            <Button type='text' onClick={() => handleRoute(record.orderId)}>
              Route
            </Button>
            <Button type='text' onClick={() => handleDelete(record._id)} danger>
              Delete
            </Button>
          </Space>
        )
      }
    }
  ]

  // 刪除訂單
  const handleDelete = (_id: string) => {
    Modal.confirm({
      title: 'Delete Order',
      content: <span>Confirm deletion of this order?</span>,
      onOk: async () => {
        await api.deleteOrder(_id)
        message.success('Deletion successful!')
        search.submit()
      }
    })
  }

  // 行駛軌跡
  const handleRoute = (orderId: string) => {
    routeRef.current?.open(orderId)
  }

  // 創建訂單
  const handleCreate = () => {
    orderRef.current?.open()
  }

  // 訂單詳情
  const handleDetail = (orderId: string) => {
    detailRef.current?.open(orderId)
  }

  // 地圖打點
  const handleMarker = (orderId: string) => {
    markerRef.current?.open(orderId)
  }

  // 文件導出
  const handleExport = () => {
    api.exportDate(form.getFieldsValue())
  }

  return (
    <div className='OrderList'>
      <Form className='search-form' form={form} layout='inline'>
        <Form.Item name='oderId' label='Order ID'>
          <Input placeholder='Please enter the order ID' />
        </Form.Item>
        <Form.Item name='userName' label='User Name'>
          <Input placeholder='Please enter the username' />
        </Form.Item>
        <Form.Item name='state' label='Order Status'>
          <Select style={{ width: 120 }}>
            <Select.Option value={1}>In Progress</Select.Option>
            <Select.Option value={2}>Completed</Select.Option>
            <Select.Option value={3}>Overdue</Select.Option>
            <Select.Option value={4}>Cancelled</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name='search'>
          <Space>
            <Button type='primary' onClick={search.submit}>
              Search
            </Button>
            <Button type='default' onClick={search.reset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>Order List</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              Add
            </Button>
            <Button type='primary' onClick={handleExport}>
              Export
            </Button>
          </div>
        </div>
        <Table bordered rowKey='_id' columns={columns} {...tableProps} />
      </div>
      {/* 創建訂單組件 */}
      <CreateOrder mRef={orderRef} update={search.submit} />
      {/* 訂單詳情組件 */}
      <OrderDetail mRef={detailRef} />
      {/* 地圖打點 */}
      <OrderMarker mRef={markerRef} />
      {/* 行駛軌跡 */}
      <OrderRoute mRef={routeRef} />
    </div>
  )
}

export default OrderList
