import type { QuestionSchema, SerializableQuestionSchema } from '../model/types'

export function hydrateSchema(schema: SerializableQuestionSchema): QuestionSchema {
  return {
    ...schema,
    domainFilter(kanji) {
      const isEmpty = !schema.jlptLevels && !schema.kankenLevels

      if (isEmpty) return true

      return !!(
        schema.jlptLevels?.includes(kanji.jlptLevel ?? 0) ||
        schema.kankenLevels?.includes(kanji.kankenLevel)
      )
    },
    wrongAnswerRanker() {
      return 1
    },
  }
}
