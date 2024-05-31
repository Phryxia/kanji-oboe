import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'
import type { SerializableQuestionSchema } from '../model/types'
import type { BatchHistory, SolveHistory } from '../model/history'
import { persistSolveHistory } from '../utils/history'

// @ts-ignore
const BatchHistoryContext = createContext<BatchHistory | undefined>()

interface BatchHistoryRecorder {
  initialize(schema: SerializableQuestionSchema, totalCount: number): void
  update(solveHistory: SolveHistory): void
}

// @ts-ignore
const BatchHistoryRecorderContext = createContext<BatchHistoryRecorder>()

export const useBatchHistory = () => useContext(BatchHistoryContext)
export const useBatchHistoryRecorder = () => useContext(BatchHistoryRecorderContext)

export function BatchHistoryProvider({ children }: PropsWithChildren<{}>) {
  const [batchHistory, setBatchHistory] = useState<BatchHistory | undefined>()

  const initialize = useCallback(
    (schema: SerializableQuestionSchema, totalCount: number) => {
      setBatchHistory({
        schema,
        totalCount,
        choices: [],
        progress: 0,
      })
    },
    [],
  )

  const update = useCallback((solveHistory: SolveHistory) => {
    setBatchHistory((history) => {
      if (!history)
        throw new Error(
          'BatchHistory is not initialized. Did you forget to call initialize?',
        )

      return {
        ...history,
        choices: [...(history?.choices ?? []), solveHistory],
        progress: (history?.progress ?? 0) + 1,
      }
    })
    persistSolveHistory(solveHistory)
  }, [])

  return (
    <BatchHistoryRecorderContext.Provider
      value={{
        initialize,
        update,
      }}
    >
      <BatchHistoryContext.Provider value={batchHistory}>
        {children}
      </BatchHistoryContext.Provider>
    </BatchHistoryRecorderContext.Provider>
  )
}
