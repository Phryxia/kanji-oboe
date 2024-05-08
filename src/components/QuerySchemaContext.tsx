import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useState,
  useContext,
  useMemo,
} from 'react'
import { QuestionSchema, SerializableQuestionSchema } from '../model/types'
import { DefaultSchema } from '../consts/schemas'
import { hydrateSchema } from '../utils/schema'
import { getLengthFoced } from '../utils/array'
import { JLPTLevels } from '../consts/jlptLevels'
import { KankenLevels } from '../consts/kankenLevels'
import { OrderingTypes } from '../consts/orderingTypes'

// @ts-ignore
const QuestionSchemaContext = createContext<SerializableQuestionSchema>()
const SetQuestionSchemaContext =
  // @ts-ignore
  createContext<
    [SerializableQuestionSchema, Dispatch<SetStateAction<SerializableQuestionSchema>>]
  >()
// @ts-ignore
const RuntimeSchemaContext = createContext<QuestionSchema>()

export function QuerySchemaProvider({ children }: PropsWithChildren<{}>) {
  const [schema, setSchema] = useState(DefaultSchema)

  const runtimeSchema = useMemo(
    () => hydrateSchema(schema),
    [
      schema.answerCount,
      schema.answerMethod,
      schema.choiceCount,
      schema.inputType,
      schema.isExceptionAllowed,
      ...getLengthFoced(schema.jlptLevels ?? [], JLPTLevels.length),
      ...getLengthFoced(schema.kankenLevels ?? [], KankenLevels.length),
      schema.ordering,
      ...getLengthFoced(schema.outputTypes, OrderingTypes.length),
    ],
  )

  return (
    <SetQuestionSchemaContext.Provider value={[schema, setSchema]}>
      <QuestionSchemaContext.Provider value={schema}>
        <RuntimeSchemaContext.Provider value={runtimeSchema}>
          {children}
        </RuntimeSchemaContext.Provider>
      </QuestionSchemaContext.Provider>
    </SetQuestionSchemaContext.Provider>
  )
}

export const useQuestionSchema = () => useContext(QuestionSchemaContext)
export const useSetQuestionSchema = () => useContext(SetQuestionSchemaContext)
export const useRuntimeSchema = () => useContext(RuntimeSchemaContext)
