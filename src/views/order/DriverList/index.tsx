import { useState, useEffect } from 'react'
import { formatMoney } from '@/utils'
import { Button, Form, Input, Select, Space, Table } from 'antd'
import { Order } from '@/types/api'
import { ColumnsType } from 'antd/es/table'
import { formatDate } from '@/utils'
import { useTranslation } from 'react-i18next'
import api from '@/api/orderApi'

function DriverList() {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [data, setData] = useState<Order.DriverItem[]>([])
  const columns: ColumnsType<Order.DriverItem> = [
    {
      title: t('driverPanel.driverName'),
      dataIndex: 'driverName',
      key: 'driverName',
      fixed: 'left',
      width: 100
    },
    {
      title: t('driverPanel.driverInfo'),
      key: 'driverInfo',
      fixed: 'left',
      width: 200,
      render(_, record) {
        return (
          <div>
            <p>
              <span>{t('driverPanel.driverId')}:</span>
              <span>{record.driverId}</span>
            </p>
            <p>
              <span>{t('driverPanel.driverMobile')}:</span>
              <span>{record.driverPhone}</span>
            </p>
            <p>
              <span>{t('driverPanel.driverCity')}:</span>
              <span>{record.cityName}</span>
            </p>
            <p>
              <span>{t('driverPanel.driverMembership')}:</span>
              <span>{record.grade}</span>
            </p>
            <p>
              <span>{t('driverPanel.driverLevel')}:</span>
              <span>{record.driverLevel}</span>
            </p>
          </div>
        )
      }
    },
    {
      title: t('driverPanel.driverStatus'),
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      width: 120,
      render(accountStatus: Order.DriverStatus) {
        const statusMap = {
          0: t('driverPanel.pending'),
          1: t('driverPanel.active'),
          2: t('driverPanel.temporarilySuspended'),
          3: t('driverPanel.suspended'),
          4: t('driverPanel.blacklisted')
        }
        return statusMap[accountStatus]
      }
    },
    {
      title: t('driverPanel.vehicleInfo'),
      key: 'vehicleInfo',
      width: 260,
      render(_, record) {
        return (
          <div>
            <p>
              <span>{t('driverPanel.plateNumber')}:</span>
              <span>{record.carNo}</span>
            </p>
            <p>
              <span>{t('driverPanel.vehicleBrand')}：</span>
              <span>{record.vehicleBrand}</span>
            </p>
            <p>
              <span>{t('driverPanel.vehicleName')}:</span>
              <span>{record.vehicleName}</span>
            </p>
          </div>
        )
      }
    },
    {
      title: t('driverPanel.onlineTime'),
      dataIndex: 'onlineTime',
      key: 'onlineTime',
      width: 150
    },
    {
      title: t('driverPanel.driverPrice'),
      dataIndex: 'driverAmount',
      key: 'driverAmount',
      width: 120,
      render(driverAmount: number) {
        return formatMoney(driverAmount)
      }
    },
    {
      title: t('driverPanel.driverRating'),
      dataIndex: 'rating',
      key: 'rating',
      width: 100
    },
    {
      title: t('driverPanel.driverScore'),
      dataIndex: 'driverScore',
      key: 'driverScore',
      width: 100
    },
    {
      title: t('driverPanel.driverPushOrders'),
      dataIndex: 'pushOrderCount',
      key: 'pushOrderCount',
      width: 120
    },
    {
      title: t('driverPanel.driverCompleteOrders'),
      dataIndex: 'orderCompleteCount',
      key: 'orderCompleteCount',
      width: 120
    },
    {
      title: t('driverPanel.createTime'),
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
  }, [t])

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
        <Form.Item name='driverName' label={t('driverPanel.driverName')}>
          <Input placeholder={t('driverPanel.enterDriverName')} />
        </Form.Item>
        <Form.Item name='accountStatus' label={t('driverPanel.driverStatus')}>
          <Select
            placeholder={t('driverPanel.enterDriverStatus')}
            style={{ width: 220 }}
          >
            <Select.Option value={0}>{t('driverPanel.pending')}</Select.Option>
            <Select.Option value={1}>{t('driverPanel.active')}</Select.Option>
            <Select.Option value={2}>
              {t('driverPanel.temporarilySuspended')}
            </Select.Option>
            <Select.Option value={3}>
              {t('driverPanel.suspended')}
            </Select.Option>
            <Select.Option value={4}>
              {t('driverPanel.blacklisted')}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' onClick={handleSearch}>
              {t('driverPanel.search')}
            </Button>
            <Button type='default' onClick={handleReset}>
              {t('driverPanel.reset')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrpper'>
          <div className='title'>{t('driverPanel.driverList')}</div>
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
