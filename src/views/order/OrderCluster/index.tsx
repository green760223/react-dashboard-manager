import { useEffect, useState } from 'react'
import { Select } from 'antd'
import api from '@/api/orderApi'

function OrderCluster() {
  const [cityId, setCityId] = useState(10001)

  useEffect(() => {
    getCityData()
  }, [cityId])

  // 取得各城市訂單數量資料
  const getCityData = async () => {
    const data = await api.getCityData(cityId)
    setTimeout(() => {
      renderMap(data)
    })
  }

  // 初始化地圖
  const renderMap = (data: Array<{ lng: string; lat: string }>) => {
    const map = new window.BMapGL.Map('clusterMap')
    map.enableScrollWheelZoom()
    const zoomCtrl = new window.BMapGL.ZoomControl()
    map.addControl(zoomCtrl)
    const cityNames: { [k: number]: string } = {
      10001: '長沙',
      20001: '武漢',
      30001: '杭州',
      40001: '惠州',
      50001: '昆明'
    }
    map.centerAndZoom(cityNames[cityId], 12)

    const markers = []
    for (let i = 0; i < data.length; i++) {
      const { lng, lat } = data[i]
      const point = new window.BMapGL.Point(lng, lat)
      markers.push(new window.BMapGL.Marker(point))
    }

    if (markers.length > 0) {
      new window.BMapLib.MarkerClusterer(map, {
        markers: markers
      })
    }
  }

  // 切換城市
  const handleChange = (value: number) => {
    setCityId(value)
  }

  return (
    <div style={{ backgroundColor: 'fff', padding: 10 }}>
      <Select
        style={{ width: 100, marginBottom: 10 }}
        value={cityId}
        onChange={handleChange}
      >
        <Select.Option value={10001}>長沙</Select.Option>
        <Select.Option value={20001}>武漢</Select.Option>
        <Select.Option value={30001}>杭州</Select.Option>
        <Select.Option value={40001}>惠州</Select.Option>
        <Select.Option value={50001}>昆明</Select.Option>
      </Select>
      <div id='clusterMap' style={{ height: 'calc(100vh-192px)' }}></div>
    </div>
  )
}

export default OrderCluster
