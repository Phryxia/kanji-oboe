import { useCallback, useMemo } from 'react'
import { JLPTLevels } from '../../consts/jlptLevels'
import { KankenLevels } from '../../consts/kankenLevels'
import type { DisplayType, OrderingType, QuestionSchema } from '../../model/types'
import { useSetQuestionSchema } from '../QuerySchemaContext'
import { TagCheckboxes } from '../shared/TagCheckboxes'
import { useDomainFilter } from './useDomainFilter'
import { DisplayTypes, LabeledDisplayTypes } from '../../consts/displayTypes'
import { LabeledOrderingTypes } from '../../consts/orderingTypes'
import { guardZeroLength } from '../../utils/array'

const LabeledJLPTLevels = JLPTLevels.map((level) => ({
  label: `N${level}`,
  value: level,
}))
const LabeledKankenLevels = KankenLevels.map((level) => ({
  label: `${level.replace('pre', '준')}급`,
  value: level,
}))

interface Props {}

export function QuestionSchemaViewer({}: Props) {
  const [schema, setSchema] = useSetQuestionSchema()

  const { jlptLevels, kankenLevels, handleJLPTFilterChange, handleKankenFilterChange } =
    useDomainFilter()

  const createChangeHandler = useCallback(
    (name: keyof QuestionSchema) => (newValue: any) => {
      setSchema((schema) => ({
        ...schema,
        [name]: newValue,
      }))
    },
    [],
  )

  const handleOrderingChange = createChangeHandler('ordering')

  const validOutputTypes = useMemo(
    () => LabeledDisplayTypes.filter(({ value }) => value !== schema.inputType),
    [schema.inputType],
  )

  function handleInputTypeChange(inputType: DisplayType) {
    createChangeHandler('inputType')(inputType)
    createChangeHandler('outputTypes')(
      guardZeroLength(
        filterOutputTypes(inputType, schema.outputTypes),
        filterOutputTypes(inputType, DisplayTypes),
      ),
    )
  }

  function handleOutputTypesChange(outputTypes: DisplayType[]) {
    createChangeHandler('outputTypes')(
      guardZeroLength(
        outputTypes,
        validOutputTypes.map(({ value }) => value),
      ),
    )
  }

  return (
    <section>
      <li>
        <label>JLPT급수</label>
        <TagCheckboxes
          entries={LabeledJLPTLevels}
          selectedValues={jlptLevels}
          onChange={handleJLPTFilterChange}
        />
      </li>
      <li>
        <label>한자능력검정급수</label>
        <TagCheckboxes
          entries={LabeledKankenLevels}
          selectedValues={kankenLevels}
          onChange={handleKankenFilterChange}
        />
      </li>
      <li>
        <label>출제 순서</label>
        <select
          value={schema.ordering}
          onChange={(e) => handleOrderingChange(e.target.value as OrderingType)}
        >
          {LabeledOrderingTypes.map(({ value, label }) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </select>
      </li>
      <li>
        <select
          value={schema.inputType}
          onChange={(e) => handleInputTypeChange(e.target.value as DisplayType)}
        >
          {LabeledDisplayTypes.map(({ value, label }) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span>를 보고 </span>
        <TagCheckboxes
          entries={validOutputTypes}
          selectedValues={schema.outputTypes}
          onChange={handleOutputTypesChange}
        />
        <span> 고르기</span>
      </li>
    </section>
  )
}

function filterOutputTypes(inputType: DisplayType, outputTypes: DisplayType[]) {
  return outputTypes.filter((value) => value !== inputType)
}
