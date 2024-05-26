import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import { StorageWrapper } from '../../utils/StorageWrapper'

export function useGroupStatisticsOpening(groupName: string) {
  const key = `${groupName}.isOpen`
  const store = useMemo(
    () =>
      new StorageWrapper(
        sessionStorage,
        key,
        (value) => value === 'true',
        (value) => value.toString(),
      ),
    [key],
  )

  const isOpen = useSyncExternalStore<boolean>(
    (onStoreChange) => {
      store.addListener(onStoreChange)
      return () => store.removeListener(onStoreChange)
    },
    () => store.getItem() ?? false,
  )

  const setIsOpen = useCallback((isOpen: boolean) => store.setItem(isOpen), [key])

  useEffect(() => () => store.destroy(), [store])

  return { isOpen, setIsOpen }
}
