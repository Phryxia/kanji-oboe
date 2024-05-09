import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Container } from '../components/Container'

export const Route = createRootRoute({
  component() {
    return (
      <Container>
        <Outlet />
      </Container>
    )
  },
})
