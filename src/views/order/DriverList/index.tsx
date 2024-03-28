import { useState, useEffect } from 'react'
import { formatMoney } from '@/utils'
import { Button, Form, Input, Select, Space, Table } from 'antd'
import { Order } from '@/types/api'
import { ColumnsType } from 'antd/es/table'
import api from '@/api/orderApi'
import { formatDate } from '@/utils'

function DriverList() {
  const [form] = Form.useForm()
  const [data, setData] = useState<Order.DriverItem[]>([])
  const columns: ColumnsType<Order.DriverItem> = [
    {
      title: '司機名稱',
      dataIndex: 'driverName',
      key: 'driverName',
      fixed: 'left',
      width: 100
    },
    {
      title: '司機資訊',
      key: 'driverInfo',
      fixed: 'left',
      width: 200,
      render(_, record) {
        return (
          <div>
            <p>
              <span>司機ID:</span>
              <span>{record.driverId}</span>
            </p>
            <p>
              <span>手機號碼:</span>
              <span>{record.driverPhone}</span>
            </p>
            <p>
              <span>註冊城市:</span>
              <span>{record.cityName}</span>
            </p>
            <p>
              <span>會員等級:</span>
              <span>{record.grade}</span>
            </p>
            <p>
              <span>司機等級:</span>
              <span>{record.driverLevel}</span>
            </p>
          </div>
        )
      }
    },
    {
      title: '司機狀態',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      width: 100,
      render(accountStatus: Order.DriverStatus) {
        const statusMap = {
          0: '待認證',
          1: '正常',
          2: '暫時拉黑',
          3: '永久拉黑',
          4: '停止推送'
        }
        return statusMap[accountStatus]
      }
    },
    {
      title: '車輛資訊',
      key: 'vehicleInfo',
      width: 260,
      render(_, record) {
        return (
          <div>
            <p>
              <span>車牌號碼：</span>
              <span>{record.carNo}</span>
            </p>
            <p>
              <span>車輛品牌：</span>
              <span>{record.vehicleBrand}</span>
            </p>
            <p>
              <span>車輛名稱：</span>
              <span>{record.vehicleName}</span>
            </p>
          </div>
        )
      }
    },
    {
      title: '昨日在線時長',
      dataIndex: 'onlineTime',
      key: 'onlineTime',
      width: 150
    },
    {
      title: '昨日司機流水',
      dataIndex: 'driverAmount',
      key: 'driverAmount',
      width: 120,
      render(driverAmount: number) {
        return formatMoney(driverAmount)
      }
    },
    {
      title: '司機評分',
      dataIndex: 'rating',
      key: 'rating',
      width: 100
    },
    {
      title: '司機行為評分',
      dataIndex: 'driverScore',
      key: 'driverScore',
      width: 100
    },
    {
      title: '昨日推單數',
      dataIndex: 'pushOrderCount',
      key: 'pushOrderCount',
      width: 120
    },
    {
      title: '昨日完單數',
      dataIndex: 'orderCompleteCount',
      key: 'orderCompleteCount',
      width: 120
    },
    {
      title: '加入時間',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 220,
      render(createTime: string) {
        return formatDate(createTime)
      }
    }
  ]

  useEffect(() => {
    getDriverList()
  }, [])

  const getDriverList = async () => {
    const data = await api.getDriverList(form.getFieldsValue())
    setData(data.list)
  }

  // Search
  const handleSearch = () => {
    getDriverList()
  }

  // Reset
  const handleReset = () => {
    form.resetFields()
  }

  return (
    <div className='driver-list'>
      <Form className='search-form' layout='inline' form={form}>
        <Form.Item name='driverName' label='司機名稱'>
          <Input placeholder='請輸入司機名稱' />
        </Form.Item>
        <Form.Item name='accountStatus' label='司機狀態'>
          <Select placeholder='請選擇司機狀態' style={{ width: 140 }}>
            <Select.Option value={0}>待認證</Select.Option>
            <Select.Option value={1}>正常</Select.Option>
            <Select.Option value={2}>暫時拉黑</Select.Option>
            <Select.Option value={3}>永久拉黑</Select.Option>
            <Select.Option value={4}>停止推送</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' onClick={handleSearch}>
              搜索
            </Button>
            <Button type='default' onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrpper'>
          <div className='title'>司機列表</div>
        </div>
        <Table
          bordered
          rowKey='id'
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 1300 }}
        />
      </div>
    </div>
  )
}

export default DriverList
