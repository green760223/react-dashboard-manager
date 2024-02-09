import styles from './index.module.less'

export default function Login() {
  return (
    <div className={styles.welcome}>
      <div className={styles.content}>
        <div className={styles.subtitle}>歡迎體驗</div>
        <div className={styles.title}>React18 通用後台管理系統</div>
        <div className={styles.desc}>
          React18 + ReactRouter6.0 + AntD5.4 + TypeScript5.0 +
          Vite實現通用管理後台
        </div>
      </div>
      <div className={styles.img}></div>
    </div>
  )
}
