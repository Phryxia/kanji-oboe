import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useState,
  useContext,
} from 'react'
import { QuestionSchema } from '../model/types'
import { DefaultSchema } from '../consts/schemas'

// @ts-ignore
const QuestionSchemaContext = createContext<QuestionSchema>()
const SetQuestionSchemaContext =
  // @ts-ignore
  createContext<[QuestionSchema, Dispatch<SetStateAction<QuestionSchema>>]>()

export function QuerySchemaProvider({ children }: PropsWithChildren<{}>) {
  const [schema, setSchema] = useState(DefaultSchema)

  return (
    <SetQuestionSchemaContext.Provider value={[schema, setSchema]}>
      <QuestionSchemaContext.Provider value={schema}>
        {children}
      </QuestionSchemaContext.Provider>
    </SetQuestionSchemaContext.Provider>
  )
}

export const useQuestionSchema = () => useContext(QuestionSchemaContext)
export const useSetQuestionSchema = () => useContext(SetQuestionSchemaContext)
