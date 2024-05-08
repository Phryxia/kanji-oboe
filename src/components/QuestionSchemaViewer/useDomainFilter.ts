import { useLayoutEffect } from 'react'
import { useQuestionSchema } from '../QuerySchemaContext'
import { useSchemaChangeHandler } from './useSchemaChangeHandler'

const DefaultJLPTSelection = [5]

export function useDomainFilter() {
  const schema = useQuestionSchema()
  const createChangeHandler = useSchemaChangeHandler()
  const handleJLPTFilterChange = createChangeHandler('jlptLevels')
  const handleKankenFilterChange = createChangeHandler('kankenLevels')

  useLayoutEffect(() => {
    const isEmpty = !schema.jlptLevels?.length && !schema.kankenLevels?.length

    if (isEmpty) {
      handleJLPTFilterChange(DefaultJLPTSelection)
      handleKankenFilterChange(undefined)
    }
  }, [schema.jlptLevels, schema.kankenLevels])

  return {
    handleJLPTFilterChange,
    handleKankenFilterChange,
  }
}
