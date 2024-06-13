import { useEffect, useState } from 'react'
import { Select } from 'antd'
import { useTranslation } from 'react-i18next'
import api from '@/api/orderApi'

function OrderCluster() {
  const { t } = useTranslation()
  const [cityId, setCityId] = useState(10001)

  useEffect(() => {
    getCityData()
  }, [cityId, t])

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
      10001: t('orderCluster.changsha'),
      20001: t('orderCluster.wuhan'),
      30001: t('orderCluster.hangzhou'),
      40001: t('orderCluster.huizhou'),
      50001: t('orderCluster.kunming')
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
        style={{ width: 120, marginBottom: 10 }}
        value={cityId}
        onChange={handleChange}
      >
        <Select.Option value={10001}>
          {t('orderCluster.changsha')}
        </Select.Option>
        <Select.Option value={20001}> {t('orderCluster.wuhan')}</Select.Option>
        <Select.Option value={30001}>
          {t('orderCluster.hangzhou')}
        </Select.Option>
        <Select.Option value={40001}>{t('orderCluster.huizhou')}</Select.Option>
        <Select.Option value={50001}>{t('orderCluster.kunming')}</Select.Option>
      </Select>
      <div id='clusterMap' style={{ height: 'calc(100vh-192px)' }}></div>
    </div>
  )
}

export default OrderCluster
