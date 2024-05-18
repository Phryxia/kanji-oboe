import { createLazyFileRoute, useSearch } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Navigation } from '../../components/Statistics/Navigation'
import { useKanjiList } from '../../components/useKanjiList'
import { CharacterStatisticsView } from '../../components/Statistics/CharacterStatistics'
import { CharacterStatisticReader } from '../../utils/persists'

export const Route = createLazyFileRoute('/statistics/by-character')({
  component() {
    const { kanji } = useSearch({ from: '/statistics/by-character' })
    const { isLoading, kanjis } = useKanjiList()

    const isValid = useMemo(
      () => kanjis?.some((definedKanji) => definedKanji.kanji === kanji),
      [kanjis, kanji],
    )
    const stat = useMemo(
      () => (kanji ? CharacterStatisticReader.read(kanji) : undefined),
      [kanji],
    )

    return (
      <>
        <Navigation />
        {isLoading && 'loading...'}
        {!isLoading && !isValid && 'kanji 404'}
        {!isLoading && isValid && stat && <CharacterStatisticsView stat={stat} />}
      </>
    )
  },
})
