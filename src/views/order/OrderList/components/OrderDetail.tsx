import { useState, useImperativeHandle } from 'react'
import { Modal, Descriptions } from 'antd'
import { IDetailProp } from '@/types/modal'
import api from '@/api/orderApi'
import { Order } from '@/types/api'
import { formatDate, formatMoney, formatMobile } from '@/utils'

function OrderDetail(props: IDetailProp) {
  const [visible, setVisible] = useState(false)
  const [detail, setDetail] = useState<Order.OrderItem>()

  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  const open = async (orderId: string) => {
    setVisible(true)
    const detail = await api.getOrderDetail(orderId)
    setDetail(detail)
  }

  // 關閉彈框
  const handleCancel = () => {
    setVisible(false)
  }

  // 格式化訂單狀態
  const formatState = (state?: Order.IState) => {
    if (!state) return '-'
    const stateMap = {
      1: 'In Progress',
      2: 'Completed',
      3: 'Overdue',
      4: 'Cancelled'
    }
    return stateMap[state]
  }

  return (
    <Modal
      title='Order Detail'
      width={800}
      open={visible}
      footer={false}
      onCancel={handleCancel}
    >
      <Descriptions column={2} style={{ padding: '10px 30px' }}>
        <Descriptions.Item label='Order ID'>
          {detail?.orderId}
        </Descriptions.Item>
        <Descriptions.Item label='Order City Name'>
          {detail?.cityName}
        </Descriptions.Item>
        <Descriptions.Item label='Order User Name'>
          {detail?.userName}
        </Descriptions.Item>
        <Descriptions.Item label='Mobile Number'>
          {formatMobile(detail?.mobile)}
        </Descriptions.Item>
        <Descriptions.Item label='Start Address'>
          {detail?.startAddress}
        </Descriptions.Item>
        <Descriptions.Item label='End Address'>
          {detail?.endAddress}
        </Descriptions.Item>
        <Descriptions.Item label='Order Amount'>
          {formatMoney(detail?.orderAmount)}
        </Descriptions.Item>
        <Descriptions.Item label='User Pay Amount'>
          {formatMoney(detail?.userPayAmount)}
        </Descriptions.Item>
        <Descriptions.Item label='Driver Pay Amount'>
          {formatMoney(detail?.driverAmount)}
        </Descriptions.Item>
        <Descriptions.Item label='Payment Method'>
          {detail?.payType == 1 ? 'WeChat Pay' : 'Alipay'}
        </Descriptions.Item>
        <Descriptions.Item label='Driver Name'>
          {detail?.driverName}
        </Descriptions.Item>
        <Descriptions.Item label='Vehicle Name'>
          {detail?.vehicleName}
        </Descriptions.Item>
        <Descriptions.Item label='Order Status'>
          {formatState(detail?.state)}
        </Descriptions.Item>
        <Descriptions.Item label='Use Time'>
          {formatDate(detail?.useTime)}
        </Descriptions.Item>
        <Descriptions.Item label='End Time'>
          {formatDate(detail?.endTime)}
        </Descriptions.Item>
        <Descriptions.Item label='Create Time'>
          {formatDate(detail?.createTime)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

export default OrderDetail
