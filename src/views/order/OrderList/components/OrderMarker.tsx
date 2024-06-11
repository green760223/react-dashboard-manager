import { useImperativeHandle, useState, useEffect } from 'react'
import { Modal } from 'antd'
import { IDetailProp } from '@/types/modal'
import { Order } from '@/types/api'
import { message } from '@/utils/AntdGlobal'
import { useTranslation } from 'react-i18next'
import api from '@/api/orderApi'

function OrderMarker(props: IDetailProp) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [markers, setMarkers] = useState<
    { lng: string; lat: string; id: number }[]
  >([])

  useEffect(() => {}, [t])

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

    detail.route.map(item => {
      createMarker(map, item.lng, item.lat)
    })

    // 添加點標記
    map.addEventListener('click', function (e: any) {
      createMarker(map, e.latlng.lng, e.latlng.lat)
    })
  }

  // 建立標記
  const createMarker = (map: any, lng: string, lat: string) => {
    const id = Math.random()
    const marker = new window.BMapGL.Marker(new window.BMapGL.Point(lng, lat))
    markers.push({ lng, lat, id })
    marker.id = id
    const markerMenu = new window.BMapGL.ContextMenu()
    markerMenu.addItem(
      new window.BMapGL.MenuItem(t('orderPanel.markerDelete'), function () {
        map.removeOverlay(marker)
        const index = markers.findIndex(item => item.id === marker.id)
        markers.splice(index, 1)
        setMarkers([...markers])
      })
    )
    setMarkers([...markers])
    marker.addContextMenu(markerMenu)
    map.addOverlay(marker)
  }

  const handleOk = async () => {
    await api.updateOrderInfo({ orderId, route: markers })
    setVisible(false)
    message.success(t('orderPanel.updateMarkerSuccee'))
    handleCancel()
  }

  //
  const handleCancel = () => {
    setVisible(false)
    setMarkers([])
  }

  return (
    <Modal
      title={t('orderPanel.orderRoute')}
      width={1100}
      open={visible}
      okText='Save'
      cancelText='Cancel'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div id='markerMap' style={{ height: 500 }}></div>
    </Modal>
  )
}

export default OrderMarker
