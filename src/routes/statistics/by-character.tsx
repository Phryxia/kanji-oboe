import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/statistics/by-character')({
  validateSearch: (search: Record<string, unknown>) => ({
    kanji: search.kanji as string | undefined,
  }),
})
