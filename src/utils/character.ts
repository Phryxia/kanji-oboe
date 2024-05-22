import type { DisplayType, Kanji } from '../model/types'

export function compareKankenLevel(a: string, b: string): number {
  if (a === 'pre1') {
    if (b === 'pre1') {
      return 0
    }
    if (b === '1') {
      return 1
    }
    return -1
  }
  if (a === 'pre2') {
    if (b === 'pre2') {
      return 0
    }
    if (b === 'pre1' || Number(b) <= 2) {
      return 1
    }
    return -1
  }
  if (b === 'pre1' || b === 'pre2') {
    return -compareKankenLevel(b, a)
  }
  return Number(a) - Number(b)
}

export function hasException(kanji: Kanji, type: Exclude<DisplayType, 'kanji'>) {
  return kanji[type]?.some((yomi) => yomi.includes('[')) ?? false
}
