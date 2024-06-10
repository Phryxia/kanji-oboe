import classnames from 'classnames/bind'
import styles from './QuestionViewer.module.css'
import { useLayoutEffect, useMemo, useState } from 'react'
import type { Question } from '../../model/types'
import { shuffle } from '../../utils/math'
import { QuestionChoice } from './QuestionChoice'
import { removeBracket } from './utils'
import { useVocab } from '../useVocab'

const cx = classnames.bind(styles)

interface Props {
  question: Question
  onProceed(choice: string): void
  progress: number
  totalCount: number
}

export function QuestionViewer({ question, onProceed, progress, totalCount }: Props) {
  const { directive, hint, answers, wrongAnswers } = question
  const [selection, setSelection] = useState('')
  const isSelected = !!selection

  const choices = useMemo(
    () => shuffle(answers.concat(wrongAnswers)),
    [answers, wrongAnswers],
  )

  function handleNext() {
    onProceed(selection)
  }

  useLayoutEffect(() => {
    setSelection('')
  }, [question])

  const { getExample, isLoading } = useVocab()

  const examples = useMemo(
    () => getExample(answers[0].kanji.kanji, 4),
    [answers[0].kanji.kanji, isLoading],
  )

  return (
    <section className={cx('root')}>
      <progress className={cx('progress')} value={progress} max={totalCount}>
        {progress} / {totalCount}
      </progress>

      <p className={cx('directive')}>{directive}</p>

      <div className={cx('hint')}>{removeBracket(hint)}</div>

      <div className={cx('examples')}>
        {examples.map((vocab) => (
          <span key={vocab.word}>{vocab.word}</span>
        ))}
      </div>

      <ul className={cx('choices', { two_track: true })}>
        {choices.map((choice) => (
          <QuestionChoice
            key={choice.kanji.kanji}
            isAnswered={isSelected}
            isSelected={choice.display === selection}
            choice={choice}
            question={question}
            onClick={() => setSelection(choice.display)}
          />
        ))}

        {isSelected && (
          <li className={cx('choice-wrapper', 'next_button')}>
            <button className={cx('choice')} onClick={handleNext}>
              다음
            </button>
          </li>
        )}
      </ul>
    </section>
  )
}
