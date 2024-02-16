import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Breadcrumb, Switch, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import styles from './index.module.less'
import storage from '@/utils/storage'
import { useStore } from '@/store'

const NavHeader = () => {
  const { userInfo, isCollapsed, updateCollapsed } = useStore(state => ({
    userInfo: state.userInfo,
    isCollapsed: state.isCollapse,
    updateCollapsed: state.updateCollapse
  }))

  const breadList = [
    {
      title: '首頁'
    },
    {
      title: '工作台'
    }
  ]

  const items: MenuProps['items'] = [
    {
      key: 'email',
      label: '信箱：' + userInfo.userEmail
    },
    {
      key: 'logout',
      label: '退出'
    }
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      storage.remove('token')
      location.href = '/login?callback=/' + encodeURIComponent(location.href)
    }
  }

  // Toggle the menu collapsed state
  const toggleCollapsed = () => {
    updateCollapsed()
  }

  return (
    <div className={styles.navHeader}>
      <div className={styles.left}>
        <div onClick={toggleCollapsed}>
          {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>

        <Breadcrumb items={breadList} style={{ marginLeft: 10 }} />
      </div>
      <div className='right'>
        <Switch
          checkedChildren='暗黑'
          unCheckedChildren='默認'
          style={{ marginRight: 10 }}
        />
        <Dropdown menu={{ items, onClick }} trigger={['click']}>
          <span className={styles.nickName}>{userInfo.userName}</span>
        </Dropdown>
      </div>
    </div>
  )
}

export default NavHeader