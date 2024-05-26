import { useStorage } from '../../utils/useStorage'

export function useGroupStatisticsPage(groupName: string) {
  const { value, setValue } = useStorage<number>({
    storage: sessionStorage,
    storageKey: `${groupName}.page`,
    parse: parseNumber,
    stringify: stringifyBoolean,
  })

  return {
    page: value ?? 0,
    setPage: setValue,
  }
}

function parseNumber(s: string) {
  return Number.parseInt(s)
}

function stringifyBoolean(v: number) {
  return v.toString()
}
