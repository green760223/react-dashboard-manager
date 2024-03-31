import styles from './index.module.less'

function NavFooter() {
  return (
    <div className={styles.footer}>
      <div>
        <a
          href='https://github.com/green760223/react-dashboard-manager'
          target='_blank'
          rel='noreferrer'
        >
          GitHub
        </a>
        <span className='gutter'>|</span>
        <a
          href='https://www.linkedin.com/in/lawrence-chuang/'
          target='_blank'
          rel='noreferrer'
        >
          LinkedIn
        </a>
        <span className='gutter'>|</span>
        <a
          href='https://drive.google.com/file/d/1BQCorDsZzgNGU2Q1Jz5pkWuinj_RKgNu/view?usp=drive_link'
          target='_blank'
          rel='noreferrer'
        >
          Personal Resume
        </a>
        <span className='gutter'>|</span>
        <a
          href='https://medium.com/@lawrencechuang760223'
          target='_blank'
          rel='noreferrer'
        >
          Medium Blog
        </a>
        <span className='gutter'>|</span>
        <a
          href='https://www.flickr.com/photos/lawrence_image/albums'
          target='_blank'
          rel='noreferrer'
        >
          Flickr Album
        </a>
        <span className='gutter'>|</span>
        <a href='mailto:green760223@gmail.com' target='_blank' rel='noreferrer'>
          Contact Me
        </a>
      </div>
      <div>Copyright @2023 Lawrence Chuang All Rights Reserved.</div>
    </div>
  )
}

export default NavFooter
