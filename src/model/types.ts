import type { AnswerMethod } from '../consts/question'

export interface Kanji {
  id: number
  kanji: string
  strokes: number
  jlptLevel?: number
  kankenLevel: KankenLevel
  radicals: string[]
  onyomi?: string[]
  kunyomi?: string[]
}

export type KankenLevel =
  | '10'
  | '9'
  | '8'
  | '7'
  | '6'
  | '5'
  | '4'
  | '3'
  | 'pre2'
  | '2'
  | 'pre1'
  | '1'

export type JLPTLevel = 5 | 4 | 3 | 2 | 1

export interface Question {
  kanji: string
  answers: string[]
  wrongAnswers: string[]
  directive: string
  hint: string
  inputType: DisplayType
  trueOutputTypes: DisplayType[]
}

export type OrderingType = 'random' | 'shuffle' | 'round-robin'
export type DisplayType = 'kanji' | 'onyomi' | 'kunyomi'

export interface QuestionSchema {
  domainFilter(kanji: Kanji): boolean
  answerMethod: AnswerMethod
  answerCount: number
  choiceCount: number
  ordering: OrderingType
  inputType: DisplayType
  outputTypes: DisplayType[]
  wrongAnswerRanker(choice: Kanji, trueAnswer: Kanji, domain: Kanji[]): number
  isExceptionAllowed?: boolean
}

export interface SerializableQuestionSchema
  extends Omit<QuestionSchema, 'domainFilter' | 'wrongAnswerRanker'> {
  jlptLevels?: number[]
  kankenLevels?: string[]
}

export type LabelPair<T> = { value: T; label: string }
