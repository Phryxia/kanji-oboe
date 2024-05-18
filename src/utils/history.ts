import { pipe } from '@fxts/core'
import type { BatchHistory, SolveHistory } from '../model/history'
import type { CharacterStatistics } from '../model/statistics'
import type { DisplayType, Question } from '../model/types'
import { CharacterStatisticReader } from './persists'

export function isCorrect(question: Question, choice: string) {
  return question.answers.includes(choice)
}

export function getScore(history: BatchHistory) {
  return history.choices.reduce(
    (acc, { choice, question }) => (isCorrect(question, choice) ? acc + 1 : acc),
    0,
  )
}

export function persistSolveHistory({
  question: { kanji, inputType, trueOutputTypes },
  isCorrected,
}: SolveHistory) {
  const isKanjiToOn = decideIsKanjiToOn(inputType, trueOutputTypes)
  const isKanjiToKun = decideIsKanjiToKun(inputType, trueOutputTypes)
  const isOnToKanji = decideIsKunToKanji(inputType, trueOutputTypes)
  const isKunToKanji = decideIsOnToKanji(inputType, trueOutputTypes)

  const stat = CharacterStatisticReader.read(kanji)
  const newStat = pipe(
    {
      ...stat,
      lastSolvedDate: new Date(),
    },
    onSatisfied(isKanjiToOn, increment('kanjiToOnSolved')),
    onSatisfied(isKanjiToOn && isCorrected, increment('kanjiToOnCorrected')),
    onSatisfied(isKanjiToKun, increment('kanjiToKunSolved')),
    onSatisfied(isKanjiToKun && isCorrected, increment('kanjiToKunCorrected')),
    onSatisfied(isOnToKanji, increment('onToKanjiSolved')),
    onSatisfied(isOnToKanji && isCorrected, increment('onToKanjiCorrected')),
    onSatisfied(isKunToKanji, increment('kunToKanjiSolved')),
    onSatisfied(isKunToKanji && isCorrected, increment('kunToKanjiCorrected')),
  )

  CharacterStatisticReader.write(kanji, newStat)
}

function decideIsKanjiToKun(inputType: DisplayType, outputTypes: DisplayType[]) {
  return inputType === 'kanji' && outputTypes.includes('kunyomi')
}

function decideIsKanjiToOn(inputType: DisplayType, outputTypes: DisplayType[]) {
  return inputType === 'kanji' && outputTypes.includes('onyomi')
}

function decideIsKunToKanji(inputType: DisplayType, outputTypes: DisplayType[]) {
  return inputType === 'kunyomi' && outputTypes.includes('kanji')
}

function decideIsOnToKanji(inputType: DisplayType, outputTypes: DisplayType[]) {
  return inputType === 'onyomi' && outputTypes.includes('kanji')
}

type NumberKeys<T, K> = K extends keyof T
  ? T[K] extends number | undefined
    ? K
    : never
  : never

function increment(key: NumberKeys<CharacterStatistics, keyof CharacterStatistics>) {
  return (stat: CharacterStatistics): CharacterStatistics => ({
    ...stat,
    [key]: (stat[key] ?? 0) + 1,
  })
}

function onSatisfied<T>(
  criteria: boolean | ((value: T) => boolean),
  fn: (value: T) => T,
) {
  return (value: T) =>
    criteria === true || (typeof criteria === 'function' && criteria(value))
      ? fn(value)
      : value
}
