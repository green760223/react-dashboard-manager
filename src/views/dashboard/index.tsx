import { Descriptions, Card, Button } from 'antd'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import { formatSate, formatMoney, formatNum } from '@/utils'
import { Dashboard } from '@/types/api'
import { useCharts } from '@/hook/useCharts'
import styles from './index.module.less'
import api from '@/api'

function DashBoard() {
  const userInfo = useStore(state => state.userInfo)
  const [report, setReport] = useState<Dashboard.ReportData>()

  // 初始化折線圖
  const [lineRef, lineChart] = useCharts()

  // 初始化餅圖
  const [pieRef1, pieChart1] = useCharts()
  const [pieRef2, pieChart2] = useCharts()

  // 初始化雷達圖
  const [radarRef, radarChart] = useCharts()

  useEffect(() => {
    // Line chart
    renderLineChart()

    // Pie chart City
    renderPeiChart1()
    // Pie chart Age
    renderPeiChart2()

    // Radar chart
    renderRadarChart()
  }, [lineChart, pieChart1, pieChart2, radarChart])

  // Render pie chart data 1
  const renderPeiChart1 = async () => {
    if (!pieChart1) return
    const data = await api.getPieCityChartData()
    pieChart1?.setOption({
      title: {
        text: 'Driver City Distribution',
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
          name: 'City Distribution',
          type: 'pie',
          radius: '55%',
          data: data
        }
      ]
    })
  }

  // Render pie chart data 2
  const renderPeiChart2 = async () => {
    if (!pieChart2) return
    const data = await api.getPieAgeChartData()
    pieChart2?.setOption({
      title: {
        text: 'Driver Age Distribution',
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
          name: 'Age Distribution',
          roseType: 'area',
          type: 'pie',
          radius: [50, 150],
          data: data
        }
      ]
    })
  }

  // Render radar chart data
  const renderRadarChart = async () => {
    if (!renderRadarChart) return
    const data = await api.getRadarChartData()
    radarChart?.setOption({
      legend: {
        data: ['Driver Radar Diagnosis']
      },
      radar: {
        indicator: data.indicator
      },
      series: [
        {
          name: 'Model Diagnosis',
          type: 'radar',
          data: data.data
        }
      ]
    })
  }

  // Render line chart data
  const renderLineChart = async () => {
    if (!lineChart) return
    const data = await api.getLineChartData()
    lineChart?.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Orders', 'Transactions']
      },
      grid: {
        left: '5%',
        right: '2%',
        bottom: '10%'
      },
      xAxis: {
        data: data.label
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Orders',
          type: 'line',
          data: data.order
        },
        {
          name: 'Transactions',
          type: 'line',
          data: data.money
        }
      ]
    })
  }

  useEffect(() => {
    getReportData()
  }, [])

  // Get the report data
  const getReportData = async () => {
    const data = await api.getReportData()
    setReport(data)
  }

  // Refresh the pie chart
  const handleRefresh = () => {
    renderPeiChart1()
    renderPeiChart2()
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.userInfo}>
        <img src={userInfo.userImg} alt='User' className={styles.userImg} />
        <Descriptions title={'Welcome back ' + userInfo.userName}>
          <Descriptions.Item label='User ID'>
            {userInfo.userId}
          </Descriptions.Item>
          <Descriptions.Item label='E-mail'>
            {userInfo.userEmail}
          </Descriptions.Item>
          <Descriptions.Item label='Status'>
            {formatSate(userInfo.state)}
          </Descriptions.Item>
          <Descriptions.Item label='Cellphone'>
            {userInfo.mobile}
          </Descriptions.Item>
          <Descriptions.Item label='Occupation'>
            {userInfo.job}
          </Descriptions.Item>
          <Descriptions.Item label='Departmant'>
            {userInfo.deptName}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.report}>
        <div className={styles.card}>
          <div className='title'>Number of Drivers</div>
          <div className={styles.data}>{formatNum(report?.driverCount)}</div>
        </div>

        <div className={styles.card}>
          <div className='title'>Total Inventory</div>
          <div className={styles.data}>{formatMoney(report?.totalMoney)}</div>
        </div>

        <div className={styles.card}>
          <div className='title'>Total Orders</div>
          <div className={styles.data}>{formatNum(report?.orderCount)}</div>
        </div>

        <div className={styles.card}>
          <div className='title'>City Launch</div>
          <div className={styles.data}>{formatNum(report?.cityNum)}</div>
        </div>
      </div>
      <div className={styles.chart}>
        <Card
          title='Order and Revenue Trend Chart'
          extra={
            <Button type='primary' onClick={renderLineChart}>
              Refresh
            </Button>
          }
        >
          <div ref={lineRef} className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title='Driver Distribution'
          extra={
            <Button type='primary' onClick={handleRefresh}>
              Refresh
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
          title='Model Diagnosis'
          extra={
            <Button type='primary' onClick={renderRadarChart}>
              Refresh
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
