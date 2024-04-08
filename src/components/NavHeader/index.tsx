import { useEffect, useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined
} from '@ant-design/icons'
import { Switch, Dropdown, Button, Avatar, Badge } from 'antd'
import type { MenuProps } from 'antd'
import { useStore } from '@/store'
import { useTranslation } from 'react-i18next'
import styles from './index.module.less'
import storage from '@/utils/storage'
import BreadCrumb from './BreadCrumb'

const NavHeader = () => {
  // const { userInfo, isCollapsed, isDark, updateCollapsed, updateTheme } =
  //   useStore(state => ({
  //     userInfo: state.userInfo,
  //     isCollapsed: state.isCollapse,
  //     updateCollapsed: state.updateCollapse
  //   }))

  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState('en')

  const { userInfo, isCollapse, isDark, updateCollapse, updateTheme } =
    useStore()

  useEffect(() => {
    handleSwitch(isDark)
  }, [])

  const items: MenuProps['items'] = [
    {
      key: 'name',
      label: `${t('navHeader.username')}：` + userInfo.userName
    },
    {
      key: 'e-mail',
      label: `${t('navHeader.email')}：` + userInfo.userEmail
    },
    {
      key: 'logout',
      label: `${t('navHeader.logout')}`
    }
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      storage.remove('token')
      location.href = '/#/login?callback=/' + encodeURIComponent(location.href)
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

  // Switch the language
  const handleLanguage = (lng: string) => {
    return () => {
      if (lng === 'en') {
        i18n.changeLanguage('zh')
        setLanguage('zh')
      } else {
        i18n.changeLanguage('en')
        setLanguage('en')
      }
    }
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
          checkedChildren={t('navHeader.dark')}
          unCheckedChildren={t('navHeader.light')}
          style={{ margin: 10 }}
          onChange={handleSwitch}
        />

        <Badge count={5} size='default' offset={[-8, 0]}>
          <BellOutlined style={{ fontSize: 20, margin: 10 }} />
        </Badge>

        <Dropdown menu={{ items, onClick }} trigger={['click']}>
          <a style={{ margin: 10 }}>
            <Avatar src={userInfo.userImg} alt='User' size='large' />
          </a>
        </Dropdown>

        <Button
          shape='circle'
          style={{ margin: 10 }}
          onClick={handleLanguage(language)}
        >
          {language === 'en' ? 'EN' : '中'}
        </Button>
      </div>
    </div>
  )
}

export default NavHeader
