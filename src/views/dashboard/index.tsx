import { Descriptions } from 'antd'
import styles from './index.module.less'

function index() {
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
    </div>
  )
}

export default index
