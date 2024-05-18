import { useLayoutEffect, useState } from 'react'
import { type Question } from '../../model/types'
import { createQuestions } from '../../utils/question'
import { useKanjiList } from '../useKanjiList'
import { useRuntimeSchema } from '../QuerySchemaContext'
import { useBatchHistoryRecorder } from '../BatchHistoryContext'

const batchSize = 10

export function useQuestionViewer() {
  const { initialize, update, finish } = useBatchHistoryRecorder()
  const currentSchema = useRuntimeSchema()
  const { isLoading, kanjis, kankenLevels } = useKanjiList()
  const [generator, setGenerator] = useState<Generator<Question[]> | undefined>()
  const [questions, setQuestions] = useState<Question[]>()
  const [questIndex, setQuestIndex] = useState(0)

  useLayoutEffect(() => {
    if (!kanjis || !kankenLevels) return

    const generator = createQuestions({
      ...currentSchema,
      domain: kanjis,
      batchSize,
    })
    setGenerator(generator)
  }, [kanjis, kankenLevels, currentSchema])

  function goNextBatch() {
    finish()

    const res = generator?.next().value

    if (!res) return

    setQuestions(res)
    setQuestIndex(0)
    initialize(currentSchema, batchSize)
  }

  useLayoutEffect(() => {
    goNextBatch()
  }, [generator])

  const currentQuestion = questions?.[questIndex]
  const isLastInBatch = !!generator && questions?.length === questIndex + 1

  function goNextQuestion(choice: string) {
    if (isLastInBatch) {
      goNextBatch()
      return
    }

    if (currentQuestion) {
      update({
        choice,
        question: currentQuestion,
        isCorrected: currentQuestion.answers.includes(choice),
      })
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
