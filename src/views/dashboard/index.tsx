import { Descriptions, Card, Button } from 'antd'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import { formatSate, formatMoney, formatNum } from '@/utils'
import { Dashboard } from '@/types/api'
import { useCharts } from '@/hook/useCharts'
import { useTranslation } from 'react-i18next'
import styles from './index.module.less'
import api from '@/api'

function DashBoard() {
  const { t } = useTranslation()
  const userInfo = useStore(state => state.userInfo)
  const [report, setReport] = useState<Dashboard.ReportData>()
  const [pieChartDriverCityData, setPieChartDriverCityData] = useState()
  const [pieChartDriverAgeData, setPieChartDriverAgeData] = useState()
  const [lineChartData, setLineChartData] = useState({
    label: [],
    order: [],
    money: []
  })
  const [radarChartData, setRadarChartData] = useState({
    indicator: [],
    data: []
  })

  // 初始化折線圖
  const [lineRef, lineChart] = useCharts()

  // 初始化餅圖
  const [pieRef1, pieChart1] = useCharts()
  const [pieRef2, pieChart2] = useCharts()

  // 初始化雷達圖
  const [radarRef, radarChart] = useCharts()

  // 初始化圖表
  useEffect(() => {
    // Pie chart City
    renderPieChartDriverCity()
    // Pie chart Age
    renderPieChartDriverAge()
    // Line chart
    renderLineChart()
    // Radar chart
    renderRadarChart()
  }, [t, pieChart1, pieChart2, lineChart, radarChart])

  // 更新圖表語言
  useEffect(() => {
    updatePieChartDriverCity()
    updatePieChartDriverAge()
    updateLineChart()
    updateRadarChart()
  }, [
    t,
    pieChartDriverCityData,
    pieChartDriverAgeData,
    lineChartData,
    radarChartData
  ])

  useEffect(() => {
    getReportData()
  }, [])

  // Render pie chart data for Driver City
  const renderPieChartDriverCity = async () => {
    if (!pieChart1) return
    const rawData = await api.getPieCityChartData()
    const translationCities = rawData.map((item: any) => ({
      ...item,
      name: t(`cities.${item.name}`)
    }))

    setPieChartDriverCityData(translationCities as any)
  }

  // Update pie chart data for Driver City
  const updatePieChartDriverCity = () => {
    pieChart1?.setOption({
      title: {
        text: t('pieChart1.title'),
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: t('pieChart1.name'),
          type: 'pie',
          radius: '55%',
          data: pieChartDriverCityData
        }
      ]
    })
  }

  // Render pie chart data for Driver Age
  const renderPieChartDriverAge = async () => {
    if (!pieChart2) return
    const rawData = await api.getPieAgeChartData()
    const translateAges = rawData.map((item: any) => ({
      ...item,
      name: t(`ages.${item.name}`)
    }))

    setPieChartDriverAgeData(translateAges as any)
  }

  // Update pie chart data for Driver Age
  const updatePieChartDriverAge = () => {
    pieChart2?.setOption({
      title: {
        text: t('pieChart2.title'),
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: t('pieChart2.name'),
          roseType: 'area',
          type: 'pie',
          radius: [50, 150],
          data: pieChartDriverAgeData
        }
      ]
    })
  }

  // Render radar chart data
  const renderRadarChart = async () => {
    if (!renderRadarChart) return
    const data = await api.getRadarChartData()
    setRadarChartData(data as any)
  }

  // Update radar chart data
  const updateRadarChart = () => {
    radarChart?.setOption({
      legend: {
        data: [t('radarChart.legend')]
      },
      radar: {
        indicator: radarChartData.indicator
      },
      series: [
        {
          name: t('radarChart.name'),
          type: 'radar',
          data: radarChartData.data
        }
      ]
    })
  }

  // Render line chart data
  const renderLineChart = async () => {
    if (!lineChart) return
    const data = await api.getLineChartData()
    setLineChartData(data as any)
  }

  // Update line chart data
  const updateLineChart = () => {
    lineChart?.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [t('lineChart.Orders'), t('lineChart.Transactions')]
      },
      grid: {
        left: '5%',
        right: '2%',
        bottom: '10%'
      },
      xAxis: {
        data: lineChartData.label
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: t('lineChart.Orders'),
          type: 'line',
          data: lineChartData.order
        },
        {
          name: t('lineChart.Transactions'),
          type: 'line',
          data: lineChartData.money
        }
      ]
    })
  }

  // Get the report data
  const getReportData = async () => {
    const data = await api.getReportData()
    setReport(data)
  }

  // Refresh the pie chart
  const handleRefresh = () => {
    renderPieChartDriverCity()
    renderPieChartDriverAge()
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.userInfo}>
        <img src={userInfo.userImg} alt='User' className={styles.userImg} />
        <Descriptions title={t('reportData.welcome') + userInfo.userName}>
          <Descriptions.Item label={t('reportData.userId')}>
            {userInfo.userId}
          </Descriptions.Item>
          <Descriptions.Item label={t('reportData.email')}>
            {userInfo.userEmail}
          </Descriptions.Item>
          <Descriptions.Item label={t('reportData.status')}>
            {/* {formatSate(userInfo.state)} */}
            {t(`reportData.${formatSate(userInfo.state)}`)}
          </Descriptions.Item>
          <Descriptions.Item label={t('reportData.cellphone')}>
            {userInfo.mobile}
          </Descriptions.Item>
          <Descriptions.Item label={t('reportData.occupation')}>
            {userInfo.job}
          </Descriptions.Item>
          <Descriptions.Item label={t('reportData.department')}>
            {userInfo.deptName}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.report}>
        <div className={styles.card}>
          <div className='title'>{t('reportData.drivers')}</div>
          <div className={styles.data}>{formatNum(report?.driverCount)}</div>
        </div>

        <div className={styles.card}>
          <div className='title'>{t('reportData.transactions')}</div>
          <div className={styles.data}>{formatMoney(report?.totalMoney)}</div>
        </div>

        <div className={styles.card}>
          <div className='title'>{t('reportData.orders')}</div>
          <div className={styles.data}>{formatNum(report?.orderCount)}</div>
        </div>

        <div className={styles.card}>
          <div className='title'>{t('reportData.cities')}</div>
          <div className={styles.data}>{formatNum(report?.cityNum)}</div>
        </div>
      </div>
      <div className={styles.chart}>
        <Card
          title={t('reportData.trendChart')}
          extra={
            <Button type='primary' onClick={renderLineChart}>
              {t('reportData.refresh')}
            </Button>
          }
        >
          <div ref={lineRef} className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title={t('reportData.driverDistribution')}
          extra={
            <Button type='primary' onClick={handleRefresh}>
              {t('reportData.refresh')}
            </Button>
          }
        >
          <div className={styles.pieChart}>
            <div ref={pieRef1} className={styles.itemPie}></div>
            <div ref={pieRef2} className={styles.itemPie}></div>
          </div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title={t('reportData.modelDiagnosis')}
          extra={
            <Button type='primary' onClick={renderRadarChart}>
              {t('reportData.refresh')}
            </Button>
          }
        >
          <div ref={radarRef} className={styles.itemChart}></div>
        </Card>
      </div>
    </div>
  )
}

export default DashBoard
