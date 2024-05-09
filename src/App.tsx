import { RouterProvider, createRouter } from '@tanstack/react-router'
import { BatchHistoryProvider } from './components/BatchHistoryContext'
import { QuerySchemaProvider } from './components/QuerySchemaContext'

import { routeTree } from './routeTree.gen'
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <BatchHistoryProvider>
      <QuerySchemaProvider>
        <RouterProvider router={router} />
      </QuerySchemaProvider>
    </BatchHistoryProvider>
  )
}

export default App
