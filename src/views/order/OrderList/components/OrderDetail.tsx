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
      1: '進行中',
      2: '已完成',
      3: '超時',
      4: '取消'
    }
    return stateMap[state]
  }

  return (
    <Modal
      title='訂單詳情'
      width={800}
      open={visible}
      footer={false}
      onCancel={handleCancel}
    >
      <Descriptions column={2} style={{ padding: '10px 30px' }}>
        <Descriptions.Item label='訂單編號'>
          {detail?.orderId}
        </Descriptions.Item>
        <Descriptions.Item label='下單城市'>
          {detail?.cityName}
        </Descriptions.Item>
        <Descriptions.Item label='下單用戶'>
          {detail?.userName}
        </Descriptions.Item>
        <Descriptions.Item label='手機號'>
          {formatMobile(detail?.mobile)}
        </Descriptions.Item>
        <Descriptions.Item label='起點'>
          {detail?.startAddress}
        </Descriptions.Item>
        <Descriptions.Item label='終點'>{detail?.endAddress}</Descriptions.Item>
        <Descriptions.Item label='訂單金額'>
          {formatMoney(detail?.orderAmount)}
        </Descriptions.Item>
        <Descriptions.Item label='用戶支付金額'>
          {formatMoney(detail?.userPayAmount)}
        </Descriptions.Item>
        <Descriptions.Item label='司機到帳金額'>
          {formatMoney(detail?.driverAmount)}
        </Descriptions.Item>
        <Descriptions.Item label='支付方式'>
          {detail?.payType == 1 ? '微信' : '支付寶'}
        </Descriptions.Item>
        <Descriptions.Item label='司機名稱'>
          {detail?.driverName}
        </Descriptions.Item>
        <Descriptions.Item label='訂單車型'>
          {detail?.vehicleName}
        </Descriptions.Item>
        <Descriptions.Item label='訂單狀態'>
          {formatState(detail?.state)}
        </Descriptions.Item>
        <Descriptions.Item label='用車時間'>
          {formatDate(detail?.useTime)}
        </Descriptions.Item>
        <Descriptions.Item label='訂單結束時間'>
          {formatDate(detail?.endTime)}
        </Descriptions.Item>
        <Descriptions.Item label='訂單創建時間'>
          {formatDate(detail?.createTime)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

export default OrderDetail
