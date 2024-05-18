import { map, pipe, reduceLazy, sum, zip } from '@fxts/core'

/**
 * Return P(correct | in=Kanji, out=Kunyomi)
 *        = (sum of P(correct | in=Kanji, out=kun[k]) * P(in=Kanji, out=kun[k]))
 *           / (sum of P(in=Kanji, out=kun[k]))
 *
 * @param stat
 * @returns
 */
export function getPathStatistic(
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

function wrapZeroProbability(numerator?: number, denominator?: number) {
  if (!denominator) return 0

  return (numerator ?? 0) / denominator
}
