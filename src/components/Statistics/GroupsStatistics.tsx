import classnames from 'classnames/bind'
import styles from './GroupsStatistics.module.css'
import { useMemo } from 'react'
import { groupBy } from '@fxts/core'
import type { Kanji } from '../../model/types'
import { useKanjiList } from '../useKanjiList'
import { GroupStatistics } from './GroupStatistics'

const cx = classnames.bind(styles)

interface Props {
  decideGroup: (kanji: Kanji) => string
  sortGroup: (titleA: string, titleB: string) => number
  setTitle: (groupName: string) => string
}

export function GroupsStatistics({ decideGroup, sortGroup, setTitle }: Props) {
  const { isLoading, kanjis } = useKanjiList()

  const groups = useMemo(() => {
    if (!kanjis) return undefined

    return Object.entries(groupBy(decideGroup, kanjis)).sort(([titleA], [titleB]) =>
      sortGroup(titleA, titleB),
    )
  }, [kanjis, decideGroup, sortGroup])

  return (
    <ul className={cx('root')}>
      {isLoading && <span>Loading...</span>}
      {groups?.map(([groupName, elements]) => (
        <li key={groupName}>
          <GroupStatistics title={setTitle(groupName)} kanjis={elements} />
        </li>
      ))}
    </ul>
  )
}
