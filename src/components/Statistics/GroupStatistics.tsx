import classnames from 'classnames/bind'
import styles from './GroupsStatistics.module.css'
import { map, pipe, toArray } from '@fxts/core'
import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Kanji } from '../../model/types'
import { CharacterStatisticReader } from '../../utils/persists'
import { getGrade, getReprStatistics } from '../../utils/statistics'
import { getSubArrayWithPage } from '../../utils/array'
import { PageNavaigator } from '../shared/PageNavigator'
import { useGroupStatisticsOpening } from './useGroupStatisticsOpening'

const cx = classnames.bind(styles)
const PAGE_SIZE = 64
const PAGE_SLICE_SIZE = 5

interface Props {
  title: string
  kanjis: Kanji[]
}

export function GroupStatistics({ title, kanjis }: Props) {
  const { isOpen, setIsOpen } = useGroupStatisticsOpening(title)
  const [page, setPage] = useState(0)

  const slicedKanjis = useMemo(
    () => getSubArrayWithPage(kanjis, PAGE_SIZE, page),
    [kanjis, page],
  )

  const grades = useMemo(
    () =>
      pipe(
        slicedKanjis,
        map((kanji) => ({ kanji, stat: CharacterStatisticReader.read(kanji.kanji) })),
        map(({ kanji, stat }) => getReprStatistics(stat, kanji)),
        map(getGrade),
        toArray,
      ),
    [slicedKanjis],
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
      {isOpen && (
        <>
          <div className={cx('navigator')}>
            <PageNavaigator
              currentPage={page}
              maxPage={Math.floor(kanjis.length / PAGE_SIZE)}
              sliceSize={PAGE_SLICE_SIZE}
              onPageChange={setPage}
            />
          </div>
          <div className={cx('buttons')}>
            {slicedKanjis.map(({ kanji }, index) => (
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
        </>
      )}
    </section>
  )
}
