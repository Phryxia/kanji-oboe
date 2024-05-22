import { pipe } from '@fxts/core'
import type { BatchHistory, SolveHistory } from '../model/history'
import type { CharacterStatistics } from '../model/statistics'
import type { DisplayType, Question } from '../model/types'
import { CharacterStatisticReader } from './persists'
import { onSatisfied } from './functional'

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
  question: { kanji, inputType, trueOutputTypes, answers },
  isCorrected,
}: SolveHistory) {
  const answer = answers[0]
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
    onSatisfied(isKanjiToOn, incrementMap('kanjiToOnSolved', answer)),
    onSatisfied(isKanjiToOn && isCorrected, incrementMap('kanjiToOnCorrected', answer)),
    onSatisfied(isKanjiToKun, incrementMap('kanjiToKunSolved', answer)),
    onSatisfied(isKanjiToKun && isCorrected, incrementMap('kanjiToKunCorrected', answer)),
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

type NumberMapKeys<T, K> = K extends keyof T
  ? T[K] extends Record<string, number> | undefined
    ? K
    : never
  : never

function increment(key: NumberKeys<CharacterStatistics, keyof CharacterStatistics>) {
  return (stat: CharacterStatistics): CharacterStatistics => ({
    ...stat,
    [key]: (stat[key] ?? 0) + 1,
  })
}

function incrementMap(
  key: NumberMapKeys<CharacterStatistics, keyof CharacterStatistics>,
  secondKey: string,
) {
  return (stat: CharacterStatistics): CharacterStatistics => ({
    ...stat,
    [key]: {
      ...((stat[key] as Record<string, number>) ?? {}),
      [secondKey]: (stat[key]?.[secondKey] ?? 0) + 1,
    },
  })
}
