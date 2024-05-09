import { createLazyFileRoute } from '@tanstack/react-router'
import { QuestionSchemaViewer } from '../components/QuestionSchemaViewer'

export const Route = createLazyFileRoute('/config')({
  component: QuestionSchemaViewer,
})
