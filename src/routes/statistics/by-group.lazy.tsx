import { createLazyFileRoute } from '@tanstack/react-router'
import { Navigation } from '../../components/Statistics/Navigation'

export const Route = createLazyFileRoute('/statistics/by-group')({
  component() {
    return <Navigation />
  },
})
