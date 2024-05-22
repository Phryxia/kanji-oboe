import classnames from 'classnames/bind'
import styles from './CharacterStatistics.module.css'
import { useMemo } from 'react'
import type { CharacterStatistics } from '../../model/statistics'
import { useKanjiList } from '../useKanjiList'
import { getPathStatistics, getTotalCount } from '../../utils/statistics'

const cx = classnames.bind(styles)

interface Props {
  stat: CharacterStatistics
}

export function CharacterStatisticsView({ stat }: Props) {
  const { kanji: kanjiString, lastSolvedDate } = stat
  const { kanjis } = useKanjiList()
  const kanji = useMemo(
    () => kanjis?.find((k) => k.kanji === kanjiString),
    [kanjiString, kanjis],
  )

  const kanjiToOnRate = getPathStatistics(stat, 'kanji', 'onyomi')
  const kanjiToKunRate = getPathStatistics(stat, 'kanji', 'kunyomi')
  const onToKanjiRate = getPathStatistics(stat, 'onyomi', 'kanji')
  const kunToKanjiRate = getPathStatistics(stat, 'kunyomi', 'kanji')

  return (
    <div className={cx('root')}>
      <h1 className={cx('kanji')}>{kanjiString}</h1>
      <section className={cx('section')}>
        <h2 className={cx('subtitle')}>한자정보</h2>
        {!!kanji?.onyomi?.length && (
          <div className={cx('entry')}>
            <span className={cx('label')}>음독</span>
            <span>{kanji.onyomi.join(', ')}</span>
          </div>
        )}
        {!!kanji?.kunyomi?.length && (
          <div className={cx('entry')}>
            <span className={cx('label')}>훈독</span>
            <span>{kanji.kunyomi.join(', ')}</span>
          </div>
        )}
      </section>
      <section className={cx('section')}>
        <h2 className={cx('subtitle')}>학습현황</h2>
        <div className={cx('study-states')}>
          <div className={cx('entry')}>
            <span className={cx('label')}>최근 학습일</span>
            <span>{lastSolvedDate?.toLocaleDateString() ?? '미학습'}</span>
          </div>
          <div className={cx('entry')}>
            <span className={cx('label')}>총 학습 횟수</span>
            <span>{getTotalCount(stat)}</span>
          </div>
          <div className={cx('entry')}>
            <span className={cx('label')}>한자 → 음독</span>
            <span>{(kanjiToOnRate * 100).toFixed(1)}%</span>
          </div>
          <div className={cx('entry')}>
            <span className={cx('label')}>한자 → 훈독</span>
            <span>{(kanjiToKunRate * 100).toFixed(1)}%</span>
          </div>
          <div className={cx('entry')}>
            <span className={cx('label')}>음독 → 한자</span>
            <span>{(onToKanjiRate * 100).toFixed(1)}%</span>
          </div>
          <div className={cx('entry')}>
            <span className={cx('label')}>훈독 → 한자</span>
            <span>{(kunToKanjiRate * 100).toFixed(1)}%</span>
          </div>
        </div>
      </section>
    </div>
  )
}
