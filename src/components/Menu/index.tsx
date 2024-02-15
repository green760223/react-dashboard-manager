import { useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import {
  DesktopOutlined,
  SettingOutlined,
  TeamOutlined
} from '@ant-design/icons'
import styles from './index.module.less'
import { useStore } from '@/store'

function SideMenu() {
  const navigate = useNavigate()
  const isCollapse = useStore(state => state.isCollapse)

  const items = [
    {
      key: '1',
      label: '工作台',
      icon: <DesktopOutlined />
    },
    {
      key: '2',
      label: '系統管理',
      icon: <SettingOutlined />,
      children: [
        {
          key: '3',
          label: '用戶管理',
          icon: <TeamOutlined />
        }
      ]
    }
  ]

  const handleClickLog = () => {
    navigate('/welcome')
  }

  return (
    <div>
      <div className={styles.logo} onClick={handleClickLog}>
        <img src='/imgs/logo.png' alt='' className={styles.img} />
        {isCollapse ? '' : <span>倫斯貨運</span>}
      </div>
      <Menu
        defaultSelectedKeys={['1']}
        mode='inline'
        theme='dark'
        items={items}
        style={{ width: isCollapse ? 80 : 'auto' }}
      />
    </div>
  )
}

export default SideMenu
