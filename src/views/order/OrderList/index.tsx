import { useRef, useEffect } from 'react'
import { Button, Table, Form, Input, Select, Space, Modal } from 'antd'
import { useAntdTable } from 'ahooks'
import { ColumnsType } from 'antd/es/table'
import { Order } from '@/types/api'
import { formatDate, formatMoney } from '@/utils'
import { message } from '@/utils/AntdGlobal'
import { useTranslation } from 'react-i18next'
import OrderDetail from './components/OrderDetail'
// import CreateOrder from './components/CreateOrder'
import CreateOrder from './components/CreateOrderNew'
import api from '@/api/orderApi'
import OrderMarker from './components/OrderMarker'
import OrderRoute from './components/OrderRoute'

function OrderList() {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const orderRef = useRef<{ open: () => void }>()
  const detailRef = useRef<{ open: (orderId: string) => void }>()
  const markerRef = useRef<{ open: (orderId: string) => void }>()
  const routeRef = useRef<{ open: (orderId: string) => void }>()

  useEffect(() => {}, [t])

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
      title: t('orderPanel.orderId'),
      dataIndex: 'orderId',
      key: 'orderId'
    },
    {
      title: t('orderPanel.cityName'),
      dataIndex: 'cityName',
      key: 'cityName',
      width: 80
    },
    {
      title: t('orderPanel.orderingAddress'),
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
      title: t('orderPanel.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: t('orderPanel.orderAmount'),
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render(orderAmount) {
        return formatMoney(orderAmount)
      }
    },
    {
      title: t('orderPanel.orderStatus'),
      dataIndex: 'state',
      key: 'state',
      render(state) {
        if (state === 1) {
          return t('orderPanel.inprogress')
        }
        if (state === 2) {
          return t('orderPanel.completed')
        }
        if (state === 3) {
          return t('orderPanel.overdue')
        }
        if (state === 4) {
          return t('orderPanel.cancelled')
        }
      }
    },
    {
      title: t('orderPanel.userName'),
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: t('orderPanel.driverName'),
      dataIndex: 'driverName',
      key: 'driverName'
    },
    {
      title: t('orderPanel.action'),
      key: 'action',
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleDetail(record.orderId)}>
              {t('orderPanel.orderDetail')}
            </Button>
            <Button type='text' onClick={() => handleMarker(record.orderId)}>
              {t('orderPanel.marker')}
            </Button>
            <Button type='text' onClick={() => handleRoute(record.orderId)}>
              {t('orderPanel.route')}
            </Button>
            <Button type='text' onClick={() => handleDelete(record._id)} danger>
              {t('orderPanel.delete')}
            </Button>
          </Space>
        )
      }
    }
  ]

  // 刪除訂單
  const handleDelete = (_id: string) => {
    Modal.confirm({
      title: t('orderPanel.deleteOrder'),
      content: <span>{t('orderPanel.deleteOrderMessage')}</span>,
      onOk: async () => {
        await api.deleteOrder(_id)
        message.success(t('orderPanel.deleteSuccess'))
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
        <Form.Item name='oderId' label={t('orderPanel.orderId')}>
          <Input placeholder={t('orderPanel.enterOrderId')} />
        </Form.Item>
        <Form.Item name='userName' label={t('orderPanel.userName')}>
          <Input placeholder={t('orderPanel.enterUserName')} />
        </Form.Item>
        <Form.Item name='state' label={t('orderPanel.orderStatus')}>
          <Select style={{ width: 120 }}>
            <Select.Option value={1}>
              {t('orderPanel.inprogress')}
            </Select.Option>
            <Select.Option value={2}>
              {' '}
              {t('orderPanel.completed')}
            </Select.Option>
            <Select.Option value={3}> {t('orderPanel.overdue')}</Select.Option>
            <Select.Option value={4}>
              {' '}
              {t('orderPanel.cancelled')}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name='search'>
          <Space>
            <Button type='primary' onClick={search.submit}>
              {t('orderPanel.search')}
            </Button>
            <Button type='default' onClick={search.reset}>
              {t('orderPanel.reset')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'> {t('orderPanel.orderList')}</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              {t('orderPanel.add')}
            </Button>
            <Button type='primary' onClick={handleExport}>
              {t('orderPanel.export')}
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
