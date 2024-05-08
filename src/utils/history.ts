import { BatchHistory } from '../model/history'
import { Question } from '../model/types'

export function isCorrect(question: Question, choice: string) {
  return question.answers.includes(choice)
}

export function getScore(history: BatchHistory) {
  return history.choices.reduce(
    (acc, { choice, question }) => (isCorrect(question, choice) ? acc + 1 : acc),
    0,
  )
}
