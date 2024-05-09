import classnames from 'classnames/bind'
import styles from './Container.module.css'
import type { PropsWithChildren } from 'react'

const cx = classnames.bind(styles)

export function Container({ children }: PropsWithChildren<{}>) {
  return <main className={cx('root')}>{children}</main>
}
