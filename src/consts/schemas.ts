import type { SerializableQuestionSchema } from '../model/types'
import { AnswerMethod } from './question'

export const DefaultSchema: SerializableQuestionSchema = {
  jlptLevels: [5],
  answerCount: 1,
  choiceCount: 4,
  answerMethod: AnswerMethod.Single,
  inputType: 'kanji',
  outputTypes: ['onyomi', 'kunyomi'],
  ordering: 'shuffle',
  isExceptionAllowed: false,
}
