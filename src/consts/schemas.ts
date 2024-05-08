import type { QuestionSchema } from '../model/types'
import { AnswerMethod } from './question'

export const DefaultSchema: QuestionSchema = {
  domainFilter: (kanji) => kanji.jlptLevel === 5,
  answerCount: 1,
  choiceCount: 4,
  answerMethod: AnswerMethod.Single,
  inputType: 'kanji',
  outputTypes: ['onyomi', 'kunyomi'],
  ordering: 'round-robin',
  wrongAnswerRanker: () => 1,
  isExceptionAllowed: false,
}
