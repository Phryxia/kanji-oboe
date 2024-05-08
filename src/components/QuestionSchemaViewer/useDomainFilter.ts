import { useLayoutEffect, useState } from 'react'
import { useSetQuestionSchema } from '../QuerySchemaContext'
import type { KankenLevel } from '../../model/types'

const DefaultJLPTSelection = [5]

export function useDomainFilter() {
  const [schema, setSchema] = useSetQuestionSchema()
  const [jlptLevels, setJLPTLevels] = useState(DefaultJLPTSelection)
  const [kankenLevels, setKankenLevels] = useState<KankenLevel[]>([])

  const isEmpty = jlptLevels.length === 0 && kankenLevels.length === 0

  function handleJLPTFilterChange(selectedLevels: number[]) {
    setJLPTLevels(selectedLevels)
  }

  function handleKankenFilterChange(selectedLevels: KankenLevel[]) {
    setKankenLevels(selectedLevels)
  }

  useLayoutEffect(() => {
    if (isEmpty) {
      setJLPTLevels(DefaultJLPTSelection)
      setKankenLevels([])
      return
    }

    setSchema({
      ...schema,
      domainFilter: (kanji) =>
        jlptLevels.includes(kanji.jlptLevel ?? 0) ||
        kankenLevels.includes(kanji.kankenLevel),
    })
  }, [jlptLevels, kankenLevels])

  return {
    jlptLevels,
    kankenLevels,
    handleJLPTFilterChange,
    handleKankenFilterChange,
  }
}
