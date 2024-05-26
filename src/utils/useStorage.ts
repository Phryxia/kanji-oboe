import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import { StorageWrapper } from './StorageWrapper'

interface Params<T> {
  storage: Storage
  storageKey: string
  parse(s: string): T
  stringify(v: T): string
}

export function useStorage<T>({ storage, storageKey, parse, stringify }: Params<T>) {
  const store = useMemo(
    () => new StorageWrapper(storage, storageKey, parse, stringify),
    [storage, storageKey, parse, stringify],
  )

  const value = useSyncExternalStore<T | undefined>(
    (onStoreChange) => {
      store.addListener(onStoreChange)
      return () => store.removeListener(onStoreChange)
    },
    () => store.getItem() ?? undefined,
  )

  const setValue = useCallback((isOpen: T) => store.setItem(isOpen), [store])

  useEffect(() => () => store.destroy(), [store])

  return { value, setValue }
}
