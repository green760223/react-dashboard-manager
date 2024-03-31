import { useState, useEffect } from 'react'
import { formatMoney } from '@/utils'
import { Button, Form, Input, Select, Space, Table } from 'antd'
import { Order } from '@/types/api'
import { ColumnsType } from 'antd/es/table'
import { formatDate } from '@/utils'
import api from '@/api/orderApi'

function DriverList() {
  const [form] = Form.useForm()
  const [data, setData] = useState<Order.DriverItem[]>([])
  const columns: ColumnsType<Order.DriverItem> = [
    {
      title: 'Driver Name',
      dataIndex: 'driverName',
      key: 'driverName',
      fixed: 'left',
      width: 100
    },
    {
      title: 'Driver Info',
      key: 'driverInfo',
      fixed: 'left',
      width: 200,
      render(_, record) {
        return (
          <div>
            <p>
              <span>Driver ID:</span>
              <span>{record.driverId}</span>
            </p>
            <p>
              <span>Mobile:</span>
              <span>{record.driverPhone}</span>
            </p>
            <p>
              <span>City:</span>
              <span>{record.cityName}</span>
            </p>
            <p>
              <span>Membership:</span>
              <span>{record.grade}</span>
            </p>
            <p>
              <span>Level:</span>
              <span>{record.driverLevel}</span>
            </p>
          </div>
        )
      }
    },
    {
      title: 'Driver Status',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      width: 120,
      render(accountStatus: Order.DriverStatus) {
        const statusMap = {
          0: 'Pending',
          1: 'Active',
          2: 'Temporarily suspended',
          3: 'Suspended',
          4: 'Blacklisted'
        }
        return statusMap[accountStatus]
      }
    },
    {
      title: 'Vehicle Info',
      key: 'vehicleInfo',
      width: 260,
      render(_, record) {
        return (
          <div>
            <p>
              <span>Plate Number:</span>
              <span>{record.carNo}</span>
            </p>
            <p>
              <span>Vehicle Brand：</span>
              <span>{record.vehicleBrand}</span>
            </p>
            <p>
              <span>Vehicle Name:</span>
              <span>{record.vehicleName}</span>
            </p>
          </div>
        )
      }
    },
    {
      title: 'Online Time',
      dataIndex: 'onlineTime',
      key: 'onlineTime',
      width: 150
    },
    {
      title: 'Driver Amount',
      dataIndex: 'driverAmount',
      key: 'driverAmount',
      width: 120,
      render(driverAmount: number) {
        return formatMoney(driverAmount)
      }
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 100
    },
    {
      title: 'Driver Score',
      dataIndex: 'driverScore',
      key: 'driverScore',
      width: 100
    },
    {
      title: 'Push Order',
      dataIndex: 'pushOrderCount',
      key: 'pushOrderCount',
      width: 120
    },
    {
      title: 'Complete Order',
      dataIndex: 'orderCompleteCount',
      key: 'orderCompleteCount',
      width: 120
    },
    {
      title: 'Create Time',
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
        <Form.Item name='driverName' label='Driver name'>
          <Input placeholder='Please input driver name' />
        </Form.Item>
        <Form.Item name='accountStatus' label='Driver Status'>
          <Select
            placeholder='Please select driver status'
            style={{ width: 220 }}
          >
            <Select.Option value={0}>Pending</Select.Option>
            <Select.Option value={1}>Active</Select.Option>
            <Select.Option value={2}>Temporarily suspended</Select.Option>
            <Select.Option value={3}>Suspended</Select.Option>
            <Select.Option value={4}>Blacklisted</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' onClick={handleSearch}>
              Search
            </Button>
            <Button type='default' onClick={handleReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrpper'>
          <div className='title'>Driver List</div>
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
