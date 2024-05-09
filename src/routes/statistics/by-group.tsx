import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useCallback } from 'react'
import type { Kanji } from '../../model/types'
import { Navigation } from '../../components/Statistics/Navigation'
import { GroupsStatistics } from '../../components/Statistics/GroupsStatistics'
import { sortJLPTGroup, sortKankenGroup } from '../../components/Statistics/utils'

const ValidGroups = ['jlpt', 'kanken'] as const

const ETC = '급수 외'

const Groups = {
  jlpt: {
    property: 'jlptLevel',
    sorter: sortJLPTGroup,
    setTitle: (name: string) => (name === ETC ? name : `N${name}`),
  },
  kanken: {
    property: 'kankenLevel',
    sorter: sortKankenGroup,
    setTitle: (name: string) => (name === ETC ? name : `${name.replace('pre', '준')}급`),
  },
} as const

export const Route = createFileRoute('/statistics/by-group')({
  component() {
    const { group } = useSearch({
      from: '/statistics/by-group',
    })

    const decideGroup = useCallback(
      (kanji: Kanji) => kanji[Groups[group].property]?.toString() ?? ETC,
      [group],
    )

    return (
      <>
        <Navigation />
        <GroupsStatistics
          decideGroup={decideGroup}
          sortGroup={Groups[group].sorter}
          setTitle={Groups[group].setTitle}
        />
      </>
    )
  },
  validateSearch: (search: Record<string, unknown>) => ({
    group: ValidGroups.find((g) => search.group === g) ?? 'jlpt',
  }),
})
