import classnames from 'classnames/bind'
import styles from './GroupsStatistics.module.css'
import { map, pipe, toArray } from '@fxts/core'
import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import type { Kanji } from '../../model/types'
import { CharacterStatisticReader } from '../../utils/persists'
import { getGrade, getReprStatistics } from '../../utils/statistics'
import { useGroupStatisticsOpening } from './useGroupStatisticsOpening'

const cx = classnames.bind(styles)

interface Props {
  title: string
  kanjis: Kanji[]
}

export function GroupStatistics({ title, kanjis }: Props) {
  const { isOpen, setIsOpen } = useGroupStatisticsOpening(title)

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

  const progress = useMemo(
    () =>
      grades.reduce((acc, grade) => {
        if (grade === 'S') return acc + 1
        if (grade === 'A') return acc + 0.75
        if (grade === 'B') return acc + 0.5
        return 0
      }, 0),
    [grades],
  )

  return (
    <section className={cx('details')}>
      <button className={cx('title')} onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <progress value={progress} max={grades.length}></progress>
      </button>
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
    </section>
  )
}
