import { Descriptions, Card, Button } from 'antd'
import { useEffect, useState } from 'react'
import styles from './index.module.less'
import { useStore } from '@/store'
import { formatSate, formatMoney, formatNum } from '@/utils'
import api from '@/api'
import { Dashboard } from '@/types/api'
import { useCharts } from '@/hook/useCharts'

function DashBoard() {
  const userInfo = useStore(state => state.userInfo)
  console.log('userInfor', userInfo)
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
        text: '司機城市分佈',
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
          name: '城市分佈',
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
        text: '司機年齡分佈',
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
          name: '年齡分佈',
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
        data: ['司機模型診斷']
      },
      radar: {
        indicator: data.indicator
      },
      series: [
        {
          name: '模型診斷',
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
        data: ['訂單', '流水']
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
          name: '訂單',
          type: 'line',
          data: data.order
        },
        {
          name: '流水',
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
        <Descriptions title='歡迎新同學！'>
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
          <div className='title'>司機數量</div>
          <div className={styles.data}>{formatNum(report?.driverCount)}個</div>
        </div>

        <div className={styles.card}>
          <div className='title'>總庫存</div>
          <div className={styles.data}>{formatMoney(report?.totalMoney)}元</div>
        </div>

        <div className={styles.card}>
          <div className='title'>總訂單</div>
          <div className={styles.data}>{formatNum(report?.orderCount)}單</div>
        </div>

        <div className={styles.card}>
          <div className='title'>開通城市</div>
          <div className={styles.data}>{formatNum(report?.cityNum)}座</div>
        </div>
      </div>
      <div className={styles.chart}>
        <Card
          title='訂單和流水走勢圖'
          extra={
            <Button type='primary' onClick={renderLineChart}>
              刷新
            </Button>
          }
        >
          <div ref={lineRef} className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title='司機分佈'
          extra={
            <Button type='primary' onClick={handleRefresh}>
              刷新
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
          title='模型診斷'
          extra={
            <Button type='primary' onClick={renderRadarChart}>
              刷新
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
