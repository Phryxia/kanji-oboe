import classnames from 'classnames/bind'
import styles from './QuestionViewer.module.css'
import type { Choice, Question } from '../../model/types'
import { decideIsCorrect } from '../../utils/history'
import { removeBracket, sortFurigana } from './utils'

const cx = classnames.bind(styles)

interface Props {
  isAnswered?: boolean
  isSelected?: boolean
  choice: Choice
  question: Question
  onClick(): void
}

export function QuestionChoice({
  isAnswered,
  isSelected,
  choice,
  question,
  onClick,
}: Props) {
  const { display, kanji } = choice
  const { outputTypes, hint } = question

  const isCorrect = isAnswered && decideIsCorrect(question, display)

  function displayFuriganas({
    display,
    kanji: { onyomi = [], kunyomi = [] },
    type,
  }: Choice) {
    if (type === 'kunyomi' || type === 'onyomi') {
      return [display]
    }
    if (!isAnswered) {
      return ['?']
    }
    return sortFurigana(onyomi.concat(kunyomi), hint)
  }

  const furiganas = displayFuriganas(choice)

  function displayKanji() {
    if (outputTypes.includes('kanji')) {
      return kanji.kanji
    }
    if (!isAnswered) {
      return '?'
    }
    return kanji.kanji
  }

  const displayedKanji = displayKanji()

  return (
    <li className={cx('choice-wrapper')}>
      <button
        className={cx('choice', 'answers', {
          correct: isCorrect,
          wrong: isSelected && !isCorrect,
        })}
        onClick={onClick}
        disabled={isAnswered}
      >
        <Furigana furiganas={furiganas} hint={hint} isAnswered={isAnswered} />
        <div className={cx('kanji', { dimmed: displayedKanji === '?' })}>
          {displayedKanji}
        </div>
      </button>
    </li>
  )
}

interface FuriganaProps {
  furiganas: string[]
  hint: string
  isAnswered?: boolean
}

function Furigana({ furiganas, hint }: FuriganaProps) {
  const isFuriganasUnknown = furiganas[0] === '?'

  return (
    <div className={cx('furiganas', { dimmed: isFuriganasUnknown })}>
      {furiganas.map((furigana, index, list) =>
        furigana === hint ? (
          <em key={furigana}>
            {removeBracket(furigana)}
            {index < list.length - 1 ? ', ' : undefined}
          </em>
        ) : (
          <span key={furigana}>
            {removeBracket(furigana)}
            {index < list.length - 1 ? ', ' : undefined}
          </span>
        ),
      )}
    </div>
  )
}
