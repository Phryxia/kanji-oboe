import { createRootRoute } from '@tanstack/react-router'
import { Gym } from '../components/Gym'
import { Container } from '../components/Container'

export const Route = createRootRoute({
  component() {
    return (
      <Container>
        <Gym />
      </Container>
    )
  },
})
