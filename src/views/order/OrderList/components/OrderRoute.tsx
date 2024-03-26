import { useImperativeHandle, useState } from 'react'
import { Modal, message } from 'antd'
import { IDetailProp } from '@/types/modal'
import api from '@/api/orderApi'
import { Order } from '@/types/api'

function OrderRoute(props: IDetailProp) {
  const [visible, setVisible] = useState(false)
  const [trackAni, setTrackAni] = useState<{ cancel: () => void }>()

  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  const open = async (orderId: string) => {
    const detail = await api.getOrderDetail(orderId)

    if (detail.route.length > 0) {
      setVisible(true)
      // 需要設定延遲，否則地圖無法正常顯示
      setTimeout(() => {
        renderMap(detail)
      })
    } else {
      message.info('請先完成打點上報')
    }

    setVisible(true)
  }

  const renderMap = (detail: Order.OrderItem) => {
    const map = new window.BMapGL.Map('orderRouteMap')
    map.enableScrollWheelZoom()
    map.centerAndZoom(detail.cityName, 17)

    const point = []
    for (let i = 0; i < detail.route.length; i++) {
      point.push(
        new window.BMapGL.Point(detail.route[i].lng, detail.route[i].lat)
      )
    }

    const polyline = new window.BMapGL.Polyline(point, {
      strokeColor: '#ed6c00',
      strokeWeight: 5,
      strokeOpacity: 0.8
    })

    setTimeout(start, 2000)
    function start() {
      const trackAni = new window.BMapGLLib.TrackAnimation(map, polyline, {
        overallView: true,
        tilt: 30,
        duration: 20000,
        delay: 300
      })
      trackAni.start()
      setTrackAni(trackAni)
    }
  }

  const handleCancel = () => {
    setVisible(false)
    trackAni?.cancel()
  }

  return (
    <Modal
      title='行駛軌跡'
      width={1100}
      open={visible}
      footer={false}
      onCancel={handleCancel}
    >
      <div id='orderRouteMap' style={{ height: 500 }}></div>
    </Modal>
  )
}

export default OrderRoute
