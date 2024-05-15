import classnames from 'classnames/bind'
import styles from './GroupsStatistics.module.css'
import { Link } from '@tanstack/react-router'
import type { Kanji } from '../../model/types'

const cx = classnames.bind(styles)

interface Props {
  title: string
  kanjis: Kanji[]
}

export function GroupStatistics({ title, kanjis }: Props) {
  return (
    <details className={cx('details')}>
      <summary className={cx('title')}>
        <span>{title}</span>
        <progress></progress>
      </summary>
      <div className={cx('buttons')}>
        {kanjis.map(({ kanji }) => (
          <Link to="/statistics/by-character" search={{ kanji }} key={kanji}>
            <button>{kanji}</button>
          </Link>
        ))}
      </div>
    </details>
  )
}
