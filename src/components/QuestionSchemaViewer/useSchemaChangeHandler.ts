import { useCallback } from 'react'
import { useSetQuestionSchema } from '../QuerySchemaContext'
import type { SerializableQuestionSchema } from '../../model/types'

export function useSchemaChangeHandler() {
  const [, setSchema] = useSetQuestionSchema()

  return useCallback(
    (name: keyof SerializableQuestionSchema) => (newValue: any) => {
      setSchema((schema) => ({
        ...schema,
        [name]: newValue,
      }))
    },
    [],
  )
}
