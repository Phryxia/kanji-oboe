import type { Question, SerializableQuestionSchema } from './types'

export interface SolveHistory {
  question: Question
  choice: string
  isCorrected: boolean
}

export interface BatchHistory {
  schema: SerializableQuestionSchema
  choices: SolveHistory[]
  progress: number
  totalCount: number
}
