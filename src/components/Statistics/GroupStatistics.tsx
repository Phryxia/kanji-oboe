import classnames from 'classnames/bind'
import styles from './GroupsStatistics.module.css'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Kanji } from '../../model/types'

const cx = classnames.bind(styles)

interface Props {
  title: string
  kanjis: Kanji[]
}

export function GroupStatistics({ title, kanjis }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <details className={cx('details')}>
      <summary className={cx('title')} onClick={() => setIsOpen((b) => !b)}>
        <span>{title}</span>
        <progress></progress>
      </summary>
      <div className={cx('buttons')}>
        {isOpen &&
          kanjis.map(({ kanji }) => (
            <Link to="/statistics/by-character" search={{ kanji }} key={kanji}>
              <button>{kanji}</button>
            </Link>
          ))}
      </div>
    </details>
  )
}
