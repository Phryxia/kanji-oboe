import { BatchHistoryProvider } from './components/BatchHistoryContext'
import { Gym } from './components/Gym'
import { QuerySchemaProvider } from './components/QuerySchemaContext'

function App() {
  return (
    <BatchHistoryProvider>
      <QuerySchemaProvider>
        <Gym />
      </QuerySchemaProvider>
    </BatchHistoryProvider>
  )
}

export default App
