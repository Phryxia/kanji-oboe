import { useMemo } from 'react'
import { Kanji } from '../../model/types'
import { useKanjiList } from '../useKanjiList'
import { groupBy } from '@fxts/core'
import { GroupStatistics } from './GroupStatistics'

interface Props {
  decideGroup: (kanji: Kanji) => string
  sortGroup: (titleA: string, titleB: string) => number
}

export function GroupsStatistics({ decideGroup, sortGroup }: Props) {
  const { isLoading, kanjis } = useKanjiList()

  const groups = useMemo(() => {
    if (!kanjis) return undefined

    return Object.entries(groupBy(decideGroup, kanjis)).sort(([titleA], [titleB]) =>
      sortGroup(titleA, titleB),
    )
  }, [kanjis, decideGroup, sortGroup])

  return (
    <ul>
      {isLoading && <span>Loading...</span>}
      {groups?.map(([groupName, elements]) => (
        <li key={groupName}>
          <GroupStatistics title={groupName} kanjis={elements} />
        </li>
      ))}
    </ul>
  )
}
