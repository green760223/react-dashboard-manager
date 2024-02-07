import styles from './index.module.less'

function NavFooter() {
  return (
    <div className={styles.footer}>
      <div>
        <a
          href='https://www.imooc.com/u/1343480'
          target='_blank'
          rel='noreferrer'
        >
          河畔一角首頁
        </a>
        <span className='gutter'>|</span>
        <a
          href='https://www.imooc.com/class/644.html'
          target='_blank'
          rel='noreferrer'
        >
          React18+TS開發通用後台
        </a>
        <span className='gutter'>|</span>
        <a
          href='https://www.imooc.com/class/502.html'
          target='_blank'
          rel='noreferrer'
        >
          Vue3全棧後台
        </a>
        <span className='gutter'>|</span>
        <a
          href='https://www.imooc.com/class/397.html'
          target='_blank'
          rel='noreferrer'
        >
          Vue全家桶開發小米商城
        </a>
      </div>
      <div>Copyright @2023 React18通用後台課程 All Rights Reserved.</div>
    </div>
  )
}

export default NavFooter
