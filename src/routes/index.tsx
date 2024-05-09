import { createFileRoute } from '@tanstack/react-router'
import { Gym } from '../components/Gym'

export const Route = createFileRoute('/')({
  component: Gym,
})
