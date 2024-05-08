import classnames from 'classnames/bind'
import styles from './QuestionSchemaViewer.module.css'
import { JLPTLevels } from '../../consts/jlptLevels'
import { KankenLevels } from '../../consts/kankenLevels'
import type { OrderingType } from '../../model/types'
import { useQuestionSchema } from '../QuerySchemaContext'
import { TagCheckboxes } from '../shared/TagCheckboxes'
import { LabeledOrderingTypes } from '../../consts/orderingTypes'
import { QuestionType } from './QuestionType'
import { useSchemaChangeHandler } from './useSchemaChangeHandler'
import { useDomainFilter } from './useDomainFilter'

const cx = classnames.bind(styles)

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
  const schema = useQuestionSchema()
  const createChangeHandler = useSchemaChangeHandler()

  const { handleJLPTFilterChange, handleKankenFilterChange } = useDomainFilter()
  const handleOrderingChange = createChangeHandler('ordering')
  const handleChoiceCountChange = createChangeHandler('choiceCount')

  return (
    <section>
      <li className={cx('property')}>
        <label className={cx('jlpt')}>JLPT 기출 급수</label>
        <TagCheckboxes
          entries={LabeledJLPTLevels}
          selectedValues={schema.jlptLevels}
          onChange={handleJLPTFilterChange}
        />
      </li>
      <li className={cx('property')}>
        <label>일본 한자능력검정 급수</label>
        <TagCheckboxes
          entries={LabeledKankenLevels}
          selectedValues={schema.kankenLevels}
          onChange={handleKankenFilterChange}
        />
      </li>
      <li className={cx('property')}>
        <label>출제 순서:</label>
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
      <li className={cx('property')}>
        <label>문제 유형:</label>
        <QuestionType
          inputType={schema.inputType}
          outputTypes={schema.outputTypes}
          onChangeInputType={createChangeHandler('inputType')}
          onChangeOutputsType={createChangeHandler('outputTypes')}
        />
      </li>
      <li className={cx('property')}>
        <label>선택지 수:</label>
        <input
          type="number"
          step="1"
          min="2"
          max="8"
          value={schema.choiceCount}
          onChange={(e) => handleChoiceCountChange(Number(e.target.value))}
        />
        <label>불규칙 발음 포함:</label>
        <input
          type="checkbox"
          value={schema.isExceptionAllowed ? 'true' : 'false'}
          onChange={(e) =>
            createChangeHandler('isExceptionAllowed')(e.target.value !== 'true')
          }
        />
      </li>
    </section>
  )
}
