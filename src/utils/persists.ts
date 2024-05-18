import type { CharacterStatistics } from '../model/statistics'

interface LocalStorageSchema<T> {
  rootKey: string
  initialize(key: string): T
  toString(value: T): string
  parse(s: string): T
}

function createLocalStorageReader<T>({
  rootKey,
  initialize,
  toString,
  parse,
}: LocalStorageSchema<T>) {
  return {
    write(key: string, value: T) {
      const str = toString(value)
      localStorage.setItem(`${rootKey}.${key}`, str)
      return str
    },
    read(key: string) {
      const item = localStorage.getItem(`${rootKey}.${key}`)

      if (item == null) {
        const initialValue = initialize(key)
        this.write(key, initialValue)
        return initialValue
      }
      return parse(item)
    },
  }
}

export const CharacterStatisticReader = createLocalStorageReader<CharacterStatistics>({
  rootKey: 'charstat',
  initialize: (key) => ({ kanji: key }),
  toString: JSON.stringify,
  parse: (s) => {
    const result = JSON.parse(s)
    return {
      ...result,
      lastSolvedDate: result.lastSolvedDate ? new Date(result.lastSolvedDate) : undefined,
    }
  },
})
