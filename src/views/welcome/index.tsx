import { useTranslation } from 'react-i18next'
import styles from './index.module.less'

export default function Login() {
  const { t } = useTranslation()

  return (
    <div className={styles.welcome}>
      <div className={styles.content}>
        <div className={styles.subtitle}>{t('welcome.welcome')}</div>
        <div className={styles.title}>{t('welcome.message')}</div>
        <div className={styles.desc}>
          React18 + ReactRouter6.0 + AntD5.4 + TypeScript + Vite Admin Dashboard
          System
        </div>
      </div>
      <div className={styles.img}></div>
    </div>
  )
}
