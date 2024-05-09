import { Navigate, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/statistics/')({
  component() {
    return <Navigate to="/statistics/by-group" search={{ group: 'jlpt' }} />
  },
})
