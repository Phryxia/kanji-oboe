import { useLayoutEffect, useMemo, useState } from 'react'
import classnames from 'classnames/bind'
import type { Question } from '../../model/types'
import { shuffle } from '../../utils/math'
import styles from './QuestionViewer.module.css'

const cx = classnames.bind(styles)

interface Props {
  question: Question
  onProceed(isCorrect: boolean): void
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
    onProceed(isCorrect)
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

      <div className={cx('hint')}>{hint}</div>

      <ul className={cx('choices')}>
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
              {choice.replace(/\\[\\]/g, '')}
            </button>
          </li>
        ))}
      </ul>

      {isSelected && <button onClick={handleNext}>다음</button>}

      {isSelected && (isCorrect ? '정답' : '오답')}
    </section>
  )
}
