import { useQuery } from '@tanstack/react-query'
import { loadKanjiList } from '../utils/data'

export function useKanjiList() {
  const { data, isLoading } = useQuery({
    queryKey: ['kanji-list'],
    queryFn: loadKanjiList,
  })

  return { ...data, isLoading }
}
