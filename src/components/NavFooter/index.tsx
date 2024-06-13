import {
  PaperClipOutlined,
  LinkedinOutlined,
  GithubOutlined,
  MailOutlined,
  EditOutlined,
  DesktopOutlined
} from '@ant-design/icons'
import styles from './index.module.less'

function NavFooter() {
  return (
    <div className={styles.footer}>
      <div>
        <a href='https://lawrencechuang.com/' target='_blank' rel='noreferrer'>
          <DesktopOutlined style={{ marginRight: 5 }} />
          Personal Website
        </a>
        <span className='gutter'>|</span>
        <a
          href='https://github.com/green760223/react-dashboard-manager'
          target='_blank'
          rel='noreferrer'
        >
          <GithubOutlined style={{ marginRight: 5 }} />
          GitHub Repository
        </a>
        <span className='gutter'>|</span>
        <a
          href='https://www.linkedin.com/in/lawrence-chuang/'
          target='_blank'
          rel='noreferrer'
        >
          <LinkedinOutlined style={{ marginRight: 5 }} />
          LinkedIn
        </a>
        <span className='gutter'>|</span>
        <a
          href='https://drive.google.com/file/d/1zjgdDvD2tbDAgvsxu1acl1qFYZr_uU-q/view?usp=sharing'
          target='_blank'
          rel='noreferrer'
        >
          <PaperClipOutlined style={{ marginRight: 5 }} />
          Personal Resume
        </a>
        <span className='gutter'>|</span>
        <a
          href='https://medium.com/@lawrencechuang760223'
          target='_blank'
          rel='noreferrer'
        >
          <EditOutlined style={{ marginRight: 10 }} />
          Medium Blog
        </a>
        <span className='gutter'>|</span>
        <a href='mailto:green760223@gmail.com' target='_blank' rel='noreferrer'>
          <MailOutlined style={{ marginRight: 5 }} />
          Contact Me
        </a>
      </div>
      <div>Copyright @2024 All Rights Reserved By Lawrence Chuang</div>
    </div>
  )
}

export default NavFooter
