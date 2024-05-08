import { Gym } from './components/Gym'
import { QuerySchemaProvider } from './components/QuerySchemaContext'
import './reset.css'

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
