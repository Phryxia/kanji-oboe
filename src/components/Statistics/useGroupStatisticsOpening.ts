import { useStorage } from '../../utils/useStorage'

export function useGroupStatisticsOpening(groupName: string) {
  const { value, setValue } = useStorage<boolean>({
    storage: sessionStorage,
    storageKey: `${groupName}.isOpen`,
    parse: parseBoolean,
    stringify: stringifyBoolean,
  })

  return {
    isOpen: value ?? false,
    setIsOpen: setValue,
  }
}

function parseBoolean(s: string) {
  return s === 'true'
}

function stringifyBoolean(v: boolean) {
  return v.toString()
}
