import type { Question } from './types'

export interface SolveHistory {
  question: Question
  choice: string
}

export interface BatchHistory {
  batch: Question[]
  choices: SolveHistory[]
  progress: number
  totalCount: number
}
