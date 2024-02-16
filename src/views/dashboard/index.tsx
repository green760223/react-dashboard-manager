import { Descriptions, Card, Button } from 'antd'
import * as echarts from 'echarts'
import { useEffect } from 'react'
import styles from './index.module.less'

function Dashboard() {
  useEffect(() => {
    const lineChartDom = document.getElementById('lineChart')
    const chartInstance = echarts.init(lineChartDom)
    chartInstance.setOption({
      tooltip: {
        trigger: 'axis'
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
  }, [])

  return (
    <div className={styles.dashboard}>
      <div className={styles.userInfo}>
        <img
          src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
          alt=''
          className={styles.userImg}
        />
        <Descriptions title='歡迎新同學！'>
          <Descriptions.Item label='User ID'>Zhou Maomao</Descriptions.Item>
          <Descriptions.Item label='E-mail'>test@example.com</Descriptions.Item>
          <Descriptions.Item label='Status'>Live</Descriptions.Item>
          <Descriptions.Item label='Cellphone'>+123456789</Descriptions.Item>
          <Descriptions.Item label='Occupation'>Student</Descriptions.Item>
          <Descriptions.Item label='Departmant'>CSE</Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.report}>
        <div className={styles.card}>
          <div className='title'>司機數量</div>
          <div className={styles.data}>100個</div>
        </div>

        <div className={styles.card}>
          <div className='title'>總庫存</div>
          <div className={styles.data}>10000元</div>
        </div>

        <div className={styles.card}>
          <div className='title'>總訂單</div>
          <div className={styles.data}>2000單</div>
        </div>

        <div className={styles.card}>
          <div className='title'>開通城市</div>
          <div className={styles.data}>50座</div>
        </div>
      </div>
      <div className={styles.chart}>
        <Card
          title='訂單和流水走勢圖'
          extra={<Button type='primary'>刷新</Button>}
        >
          <div id='lineChart' className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card title='司機分佈' extra={<Button type='primary'>刷新</Button>}>
          <div className={styles.itemChart} id='pieChartCity'></div>
          <div className={styles.itemChart} id='pieChartAge'></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card title='模型診斷' extra={<Button type='primary'>刷新</Button>}>
          <div className={styles.itemChart} id='radarChart'></div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
