import { useState, useImperativeHandle, useEffect } from 'react'
import { Modal, Descriptions } from 'antd'
import { IDetailProp } from '@/types/modal'
import api from '@/api/orderApi'
import { Order } from '@/types/api'
import { formatDate, formatMoney, formatMobile } from '@/utils'
import { useTranslation } from 'react-i18next'

function OrderDetail(props: IDetailProp) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [detail, setDetail] = useState<Order.OrderItem>()

  useEffect(() => {}, [t])

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
      1: t('orderPanel.inprogress'),
      2: t('orderPanel.completed'),
      3: t('orderPanel.overdue'),
      4: t('orderPanel.cancelled')
    }
    return stateMap[state]
  }

  return (
    <Modal
      title={t('orderPanel.orderDetail')}
      width={800}
      open={visible}
      footer={false}
      onCancel={handleCancel}
    >
      <Descriptions column={2} style={{ padding: '10px 30px' }}>
        <Descriptions.Item label={t('orderPanel.orderId')}>
          {detail?.orderId}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.cityName')}>
          {detail?.cityName}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.userName')}>
          {detail?.userName}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.mobile')}>
          {formatMobile(detail?.mobile)}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.startingAddress')}>
          {detail?.startAddress}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.endingAddress')}>
          {detail?.endAddress}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.orderAmount')}>
          {formatMoney(detail?.orderAmount)}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.userPayAmount')}>
          {formatMoney(detail?.userPayAmount)}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.driverPaymentAmount')}>
          {formatMoney(detail?.driverAmount)}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.paymentMethod')}>
          {detail?.payType == 1
            ? t('orderPanel.weChatPay')
            : t('orderPanel.alipay')}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.driverName')}>
          {detail?.driverName}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.vehicleName')}>
          {detail?.vehicleName}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.orderStatus')}>
          {formatState(detail?.state)}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.useTime')}>
          {formatDate(detail?.useTime)}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.endTime')}>
          {formatDate(detail?.endTime)}
        </Descriptions.Item>
        <Descriptions.Item label={t('orderPanel.createTime')}>
          {formatDate(detail?.createTime)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

export default OrderDetail
