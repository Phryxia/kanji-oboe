import classnames from 'classnames/bind'
import styles from './Navigation.module.css'
import { Link } from '@tanstack/react-router'

const cx = classnames.bind(styles)

export function Navigation() {
  return (
    <nav className={cx('root')}>
      <Link to="/statistics/by-group" search={{ group: 'jlpt' }}>
        JLPT 급수별
      </Link>
      <Link to="/statistics/by-group" search={{ group: 'kanken' }}>
        한자능력검정 급수별
      </Link>
    </nav>
  )
}
