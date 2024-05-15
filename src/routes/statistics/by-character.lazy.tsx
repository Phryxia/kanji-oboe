import { createLazyFileRoute, useSearch } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Navigation } from '../../components/Statistics/Navigation'
import { useKanjiList } from '../../components/useKanjiList'
import { CharacterStatistics } from '../../model/statistics'
import { CharacterStatisticsView } from '../../components/Statistics/CharacterStatistics'

export const Route = createLazyFileRoute('/statistics/by-character')({
  component() {
    const { kanji } = useSearch({ from: '/statistics/by-character' })
    const { isLoading, kanjis } = useKanjiList()

    const isValid = useMemo(
      () => kanjis?.some((definedKanji) => definedKanji.kanji === kanji),
      [kanjis, kanji],
    )
    // TODO: hydrate statistics
    const stat = { kanji } as CharacterStatistics

    return (
      <>
        <Navigation />
        {isLoading && 'loading...'}
        {!isLoading && !isValid && 'kanji 404'}
        {!isLoading && isValid && <CharacterStatisticsView stat={stat} />}
      </>
    )
  },
})
