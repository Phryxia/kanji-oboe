import { JLPTLevels } from '../../consts/jlptLevels'
import { KankenLevels } from '../../consts/kankenLevels'
import { useSetQuestionSchema } from '../QuerySchemaContext'
import { TagCheckboxes } from '../shared/TagCheckboxes'
import { useDomainFilter } from './useDomainFilter'

const LabeledJLPTLevels = JLPTLevels.map((level) => `N${level}`)
const LabeledKankenLevels = KankenLevels.map((level) => `${level.replace('pre', '준')}급`)

interface Props {}

export function QuestionSchemaViewer({}: Props) {
  const [schema, setSchema] = useSetQuestionSchema()

  const { jlptLevels, kankenLevels, handleJLPTFilterChange, handleKankenFilterChange } =
    useDomainFilter()

  return (
    <div>
      <div>
        <span>JLPT급수</span>
        <TagCheckboxes
          label={LabeledJLPTLevels}
          domain={JLPTLevels}
          selectedValues={jlptLevels}
          onChange={handleJLPTFilterChange}
        />

        <span>한자능력검정급수</span>
        <TagCheckboxes
          label={LabeledKankenLevels}
          domain={KankenLevels}
          selectedValues={kankenLevels}
          onChange={handleKankenFilterChange}
        />
      </div>
    </div>
  )
}
