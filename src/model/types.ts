import type { AnswerMethod } from '../consts/question'

export interface Kanji {
  id: number
  kanji: string
  strokes: number
  jlptLevel?: number
  kankenLevel: KankenLevel
  radicals: string[]
  onyomi: string[]
  kunyomi: string[]
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
  answers: string[]
  wrongAnswers: string[]
  directive: string
  hint: string
}

export type DisplayType = 'kanji' | 'onyomi' | 'kunyomi'

export interface QuestionSchema {
  domainFilter(kanji: Kanji): boolean
  answerMethod: AnswerMethod
  answerCount: number
  choiceCount: number
  ordering: 'random' | 'shuffle' | 'round-robin'
  inputType: DisplayType
  outputTypes: DisplayType[]
  wrongAnswerRanker(choice: Kanji, trueAnswer: Kanji, domain: Kanji[]): number
  isExceptionAllowed?: boolean
}
