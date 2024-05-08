import { useMemo } from 'react'
import { DisplayTypes, LabeledDisplayTypes } from '../../consts/displayTypes'
import { guardZeroLength } from '../../utils/array'
import type { DisplayType } from '../../model/types'
import { TagCheckboxes } from '../shared/TagCheckboxes'

interface Props {
  inputType: DisplayType
  outputTypes: DisplayType[]
  onChangeInputType(inputType: DisplayType): void
  onChangeOutputsType(outputTypes: DisplayType[]): void
}

export function QuestionType({
  inputType,
  outputTypes,
  onChangeInputType,
  onChangeOutputsType,
}: Props) {
  const validOutputTypes = useMemo(
    () => LabeledDisplayTypes.filter(({ value }) => value !== inputType),
    [inputType],
  )

  function handleInputTypeChange(inputType: DisplayType) {
    onChangeInputType(inputType)
    onChangeOutputsType(
      guardZeroLength(
        filterOutputTypes(inputType, outputTypes),
        filterOutputTypes(inputType, DisplayTypes),
      ),
    )
  }

  function handleOutputTypesChange(outputTypes: DisplayType[]) {
    onChangeOutputsType(
      guardZeroLength(
        outputTypes,
        validOutputTypes.map(({ value }) => value),
      ),
    )
  }

  return (
    <>
      <select
        value={inputType}
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
        selectedValues={outputTypes}
        onChange={handleOutputTypesChange}
      />
      <span> 고르기</span>
    </>
  )
}

function filterOutputTypes(inputType: DisplayType, outputTypes: DisplayType[]) {
  return outputTypes.filter((value) => value !== inputType)
}
