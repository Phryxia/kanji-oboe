import classnames from 'classnames/bind'
import styles from './GroupsStatistics.module.css'
import { map, pipe, toArray } from '@fxts/core'
import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Kanji } from '../../model/types'
import { CharacterStatisticReader } from '../../utils/persists'
import { getGrade, getReprStatistics } from '../../utils/statistics'

const cx = classnames.bind(styles)

interface Props {
  title: string
  kanjis: Kanji[]
}

export function GroupStatistics({ title, kanjis }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const grades = useMemo(
    () =>
      pipe(
        kanjis,
        map((kanji) => ({ kanji, stat: CharacterStatisticReader.read(kanji.kanji) })),
        map(({ kanji, stat }) => getReprStatistics(stat, kanji)),
        map(getGrade),
        toArray,
      ),
    [kanjis],
  )

  return (
    <details className={cx('details')}>
      <summary className={cx('title')} onClick={() => setIsOpen((b) => !b)}>
        <span>{title}</span>
        <progress></progress>
      </summary>
      <div className={cx('buttons')}>
        {isOpen &&
          kanjis.map(({ kanji }, index) => (
            <Link
              to="/statistics/by-character"
              search={{ kanji }}
              key={kanji}
              className={cx('kanji', { [grades[index]]: true })}
            >
              {kanji}
            </Link>
          ))}
      </div>
    </details>
  )
}
