import { map, pipe, reduceLazy, sum, zip } from '@fxts/core'
import type { CharacterStatistics } from '../model/statistics'
import type { DisplayType, Kanji } from '../model/types'
import { onSatisfied } from './functional'

export function getTotalCount(stat: CharacterStatistics) {
  return (
    sum(Object.values(stat.kanjiToKunSolved ?? {})) +
    sum(Object.values(stat.kanjiToOnSolved ?? {})) +
    (stat.onToKanjiSolved ?? 0) +
    (stat.kunToKanjiSolved ?? 0)
  )
}

export function getPathStatistics(
  stat: CharacterStatistics,
  inputType: DisplayType,
  outputType: DisplayType,
  isExceptionIncluded?: boolean,
) {
  if (inputType === 'kanji') {
    if (outputType === 'onyomi') {
      return getPathStatisticsForSpecific(
        stat.kanjiToOnSolved,
        stat.kanjiToOnCorrected,
        isExceptionIncluded,
      )
    }
    return getPathStatisticsForSpecific(
      stat.kanjiToKunSolved,
      stat.kanjiToKunCorrected,
      isExceptionIncluded,
    )
  }
  if (outputType === 'kanji') {
    if (inputType === 'onyomi') {
      return wrapZeroProbability(stat.onToKanjiSolved, stat.onToKanjiCorrected)
    }
    return wrapZeroProbability(stat.kunToKanjiSolved, stat.kunToKanjiCorrected)
  }
  throw new Error(`Unsupported statistic path: ${inputType} -> ${outputType}`)
}

/**
 * Return P(correct | in=Kanji, out=Kunyomi)
 *        = (sum of P(correct | in=Kanji, out=kun[k]) * P(in=Kanji, out=kun[k]))
 *           / (sum of P(in=Kanji, out=kun[k]))
 *
 * @param stat
 * @returns
 */
function getPathStatisticsForSpecific(
  solved?: Record<string, number>,
  corrected?: Record<string, number>,
  isExceptionIncluded?: boolean,
) {
  if (!solved) return 0

  const yomis = onSatisfied(!isExceptionIncluded, (keys: string[]) =>
    keys.filter((key) => !key.includes('[')),
  )(Object.keys(solved))
  const totalKunCount = yomis
    .map((yomi) => solved[yomi])
    .reduce((acc, count) => acc + count, 0)
  const pSolved = yomis.map((yomi) => wrapZeroProbability(solved[yomi], totalKunCount))
  const pCorrected = yomis.map((yomi) =>
    wrapZeroProbability(corrected?.[yomi], solved[yomi]),
  )

  return wrapZeroProbability(
    pipe(
      zip(pCorrected, pSolved),
      map(([a, b]) => a * b),
      reduceLazy((acc, x) => acc + x, 0),
    ),
    sum(pSolved),
  )
}

export function wrapZeroProbability(numerator?: number, denominator?: number) {
  if (!denominator) return 0

  return (numerator ?? 0) / denominator
}

export function getReprStatistics(stat: CharacterStatistics, kanji: Kanji) {
  let sum = 0
  let count = 0

  if (kanji.onyomi?.length) {
    sum +=
      getPathStatistics(stat, 'kanji', 'onyomi') +
      getPathStatistics(stat, 'onyomi', 'kanji')
    count += 2
  }
  if (kanji.kunyomi?.length) {
    sum +=
      getPathStatistics(stat, 'kanji', 'kunyomi') +
      getPathStatistics(stat, 'kunyomi', 'kanji')
    count += 2
  }

  return sum / count
}

export function getGrade(probability: number) {
  if (probability < 0.2) return 'F'
  if (probability < 0.6) return 'B'
  if (probability < 0.8) return 'A'
  return 'S'
}
