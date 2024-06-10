import { useQuery } from '@tanstack/react-query'
import { loadVocabs } from '../utils/data'
import { useCallback } from 'react'
import { groupBy, prop } from '@fxts/core'
import type { JLPTLevel, Vocabulary } from '../model/types'
import { randomInteger } from '../utils/math'
import { swapAndRemove } from '../utils/array'

export function useVocab() {
  const { data, isLoading } = useQuery({
    queryKey: ['vocabs'],
    queryFn: async () => await loadVocabs(),
  })

  const getExample = useCallback(
    (kanji: string, count: number) => {
      const feasibles = data?.filter((vocab) => vocab.word.includes(kanji))

      if (!feasibles) return []

      const bins = groupBy(prop('jlptLevel'), feasibles) as Record<
        JLPTLevel,
        Vocabulary[] | undefined
      >
      const res = [] as Vocabulary[]

      let ptr = 0
      while (count--) {
        ptr = (ptr % 5) + 1

        const bin = bins[ptr as JLPTLevel]

        if (bin?.length) {
          const index = randomInteger(0, bin.length - 1)
          res.push(swapAndRemove(bin, index)!)
        }
      }
      return res
    },
    [data],
  )

  return {
    getExample,
    isLoading,
  }
}
