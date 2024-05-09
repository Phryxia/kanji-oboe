import { createLazyFileRoute } from '@tanstack/react-router'
import { Navigation } from '../../components/Statistics/Navigation'

export const Route = createLazyFileRoute('/statistics/by-character')({
  component() {
    return <Navigation />
  },
})
