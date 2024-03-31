import styles from './index.module.less'

export default function Login() {
  return (
    <div className={styles.welcome}>
      <div className={styles.content}>
        <div className={styles.subtitle}>Welcome!</div>
        <div className={styles.title}>React18 Admin Dashboard System</div>
        <div className={styles.desc}>
          React18 + ReactRouter6.0 + AntD5.4 + TypeScript5.0 + Vite Admin
          Dashboard System
        </div>
      </div>
      <div className={styles.img}></div>
    </div>
  )
}
