import { Descriptions, Card, Button } from 'antd'
import * as echarts from 'echarts'
import { useEffect, useState } from 'react'
import styles from './index.module.less'
import { useStore } from '@/store'
import { formatSate, formatMoney, formatNum } from '@/utils'
import api from '@/api'
import { Dashboard } from '@/types/api'
import { useCharts } from '@/hook/useCharts'

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
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月'
        ]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '訂單',
          type: 'line',
          data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]
        },
        {
          name: '流水',
          type: 'line',
          data: [
            1000, 2000, 3000, 4000, 2000, 800, 3700, 3200, 1900, 2100, 6110,
            5120
          ]
        }
      ]
    })
    // Pie chart City
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
          data: [
            { value: 335, name: '北京' },
            { value: 310, name: '上海' },
            { value: 274, name: '廣州' },
            { value: 235, name: '杭州' },
            { value: 400, name: '武漢' }
          ]
        }
      ]
    })

    // Pie chart Age
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
          data: [
            { value: 30, name: '北京' },
            { value: 40, name: '上海' },
            { value: 24, name: '廣州' },
            { value: 35, name: '杭州' },
            { value: 45, name: '武漢' }
          ]
        }
      ]
    })

    // Radar chart
    radarChart?.setOption({
      legend: {
        data: ['司機模型診斷']
      },
      radar: {
        indicator: [
          { name: '服務態度', max: 10 },
          { name: '在線時長', max: 200 },
          { name: '接單率', max: 100 },
          { name: '評分', max: 5 },
          { name: '關注度', max: 500 }
        ]
      },
      series: [
        {
          name: '模型診斷',
          type: 'radar',
          data: [
            {
              value: [8, 150, 80, 4, 300],
              name: '司機模型診斷'
            }
          ]
        }
      ]
    })
  }, [])

  useEffect(() => {
    getReportData()
  }, [lineChart, pieChart1, pieChart2, radarChart])

  // Get the report data
  const getReportData = async () => {
    const data = await api.getReportData()
    setReport(data)
  }

  console.log('dashboard page')

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
          extra={<Button type='primary'>刷新</Button>}
        >
          <div ref={lineRef} className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card title='司機分佈' extra={<Button type='primary'>刷新</Button>}>
          <div className={styles.pieChart}>
            <div ref={pieRef1} className={styles.itemPie}></div>
            <div ref={pieRef2} className={styles.itemPie}></div>
          </div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card title='模型診斷' extra={<Button type='primary'>刷新</Button>}>
          <div ref={radarRef} className={styles.itemChart}></div>
        </Card>
      </div>
    </div>
  )
}

export default DashBoard
