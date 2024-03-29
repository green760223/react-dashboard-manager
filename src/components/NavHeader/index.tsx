import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Switch, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useStore } from '@/store'
import styles from './index.module.less'
import storage from '@/utils/storage'
import BreadCrumb from './BreadCrumb'
import { useEffect } from 'react'

const NavHeader = () => {
  // const { userInfo, isCollapsed, isDark, updateCollapsed, updateTheme } =
  //   useStore(state => ({
  //     userInfo: state.userInfo,
  //     isCollapsed: state.isCollapse,
  //     updateCollapsed: state.updateCollapse
  //   }))

  const { userInfo, isCollapse, isDark, updateCollapse, updateTheme } =
    useStore()

  useEffect(() => {
    handleSwitch(isDark)
  }, [])

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
    updateCollapse()
  }

  // Switch the theme
  const handleSwitch = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.dataset.theme = 'dark'
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.dataset.theme = 'light'
      document.documentElement.classList.remove('dark')
    }
    storage.set('isDark', isDark)
    updateTheme(isDark)
  }

  return (
    <div className={styles.navHeader}>
      <div className={styles.left}>
        <div onClick={toggleCollapsed}>
          {isCollapse ? (
            <MenuUnfoldOutlined rev={undefined} />
          ) : (
            <MenuFoldOutlined rev={undefined} />
          )}
        </div>

        <BreadCrumb />
      </div>
      <div className='right'>
        <Switch
          checked={isDark}
          checkedChildren='暗黑'
          unCheckedChildren='默認'
          style={{ marginRight: 10 }}
          onChange={handleSwitch}
        />
        <Dropdown menu={{ items, onClick }} trigger={['click']}>
          <span className={styles.nickName}>{userInfo.userName}</span>
        </Dropdown>
      </div>
    </div>
  )
}

export default NavHeader
