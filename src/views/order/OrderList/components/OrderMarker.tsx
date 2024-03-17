import { useImperativeHandle, useState } from 'react'
import { Modal } from 'antd'
import { IDetailProp } from '@/types/modal'
import { Order } from '@/types/api'
import api from '@/api/orderApi'

function OrderMarker(props: IDetailProp) {
  const [visible, setVisible] = useState(false)
  const [orderId, setOrderId] = useState('')

  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  // 打開彈框
  const open = async (orderId: string) => {
    setOrderId(orderId)
    setVisible(true)
    const detail = await api.getOrderDetail(orderId)
    renderMap(detail)
  }

  // 渲染地圖
  const renderMap = (detail: Order.OrderItem) => {
    const map = new window.BMapGL.Map('markerMap')
    map.centerAndZoom(detail.cityName, 12)
    const scaleCtrl = new window.BMapGL.ScaleControl()
    map.addControl(scaleCtrl)
    const zoomCtrl = new window.BMapGL.ZoomControl()
    map.addControl(zoomCtrl)
    const cityCtrl = new window.BMapGL.CityListControl()
    map.addControl(cityCtrl)
  }

  const handleOk = () => {
    setVisible(false)
  }

  //
  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <Modal
      title='地圖打點'
      width={1100}
      open={visible}
      okText='確定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div id='markerMap' style={{ height: 500 }}></div>
    </Modal>
  )
}

export default OrderMarker
