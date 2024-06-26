import classnames from 'classnames/bind'
import styles from './Navigation.module.css'
import { Link } from '@tanstack/react-router'

const cx = classnames.bind(styles)

export function Navigation() {
  return (
    <nav className={cx('root')}>
      <Link to="/">학습하기</Link>
      <Link to="/statistics">통계</Link>
      <Link to="/config" className={cx('last')}>
        설정
      </Link>
    </nav>
  )
}
