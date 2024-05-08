import { Gym } from './components/Gym'
import { QuerySchemaProvider } from './components/QuerySchemaContext'

function App() {
  return (
    <>
      <QuerySchemaProvider>
        <Gym />
      </QuerySchemaProvider>
    </>
  )
}

export default App
