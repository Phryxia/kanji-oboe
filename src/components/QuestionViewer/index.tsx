import classnames from 'classnames/bind'
import styles from './QuestionViewer.module.css'
import { useLayoutEffect, useMemo, useState } from 'react'
import type { Question } from '../../model/types'
import { shuffle } from '../../utils/math'

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

  const isCorrect = !!selection && answers.includes(selection)

  function handleNext() {
    onProceed(selection)
  }

  useLayoutEffect(() => {
    setSelection('')
  }, [question])

  return (
    <section className={cx('root')}>
      <progress className={cx('progress')} value={progress} max={totalCount}>
        {progress} / {totalCount}
      </progress>

      <p className={cx('directive')}>{directive}</p>

      <div className={cx('hint')}>{removeBracket(hint)}</div>

      <ul className={cx('choices', { two_track: choices.length >= 5 })}>
        {choices.map((choice) => (
          <li key={choice} className={cx('choice-wrapper')}>
            <button
              className={cx('choice', {
                correct: isSelected && answers.includes(choice),
                wrong: choice === selection && !isCorrect,
              })}
              onClick={() => setSelection(choice)}
              disabled={isSelected}
            >
              {removeBracket(choice)}
            </button>
          </li>
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

function removeBracket(s: string) {
  return s.replace(/\\[\\]/g, '')
}
