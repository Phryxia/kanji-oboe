import { map, pipe, reduceLazy, sum, zip } from '@fxts/core'
import type { CharacterStatistics } from '../model/statistics'
import type { DisplayType, Kanji } from '../model/types'

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
) {
  if (inputType === 'kanji') {
    if (outputType === 'onyomi') {
      return getPathStatisticsForSpecific(stat.kanjiToOnSolved, stat.kanjiToOnCorrected)
    }
    return getPathStatisticsForSpecific(stat.kanjiToKunSolved, stat.kanjiToKunCorrected)
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
) {
  if (!solved) return 0

  const yomis = Object.keys(solved)
  const totalKunCount = Object.values(solved).reduce((acc, count) => acc + count, 0)
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
