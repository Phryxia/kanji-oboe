import { useLayoutEffect, useState } from 'react'
import { type Question } from '../../model/types'
import { createQuestions } from '../../utils/question'
import { useKanjiList } from '../useKanjiList'
import { useQuestionSchema } from '../QuerySchemaContext'

export function useQuestionViewer() {
  const currentSchema = useQuestionSchema()
  const { isLoading, kanjis, kankenLevels } = useKanjiList()
  const [generator, setGenerator] = useState<Generator<Question[]> | undefined>()
  const [questions, setQuestions] = useState<Question[]>()
  const [questIndex, setQuestIndex] = useState(0)

  useLayoutEffect(() => {
    if (!kanjis || !kankenLevels) return

    const generator = createQuestions({
      ...currentSchema,
      domain: kanjis,
      batchSize: 10,
    })
    setGenerator(generator)
  }, [kanjis, kankenLevels, currentSchema])

  function goNextBatch() {
    const res = generator?.next().value

    if (!res) return

    setQuestions(res)
    setQuestIndex(0)
  }

  useLayoutEffect(() => {
    goNextBatch()
  }, [generator])

  const currentQuestion = questions?.[questIndex]
  const isLastInBatch = !!generator && questions?.length === questIndex + 1

  function goNextQuestion() {
    if (isLastInBatch) {
      goNextBatch()
      return
    }
    setQuestIndex((q) => q + 1)
  }

  const progress = questIndex
  const totalCount = questions?.length ?? 0

  return {
    isLoading,
    isLastInBatch,
    currentQuestion,
    goNextQuestion,
    goNextBatch,
    progress,
    totalCount,
  }
}
