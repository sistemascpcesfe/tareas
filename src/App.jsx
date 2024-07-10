import { DateProvider } from './provider/dateProvider.jsx'
import { FilterProvider } from './provider/filtersProvider.jsx'
import RoutesApp from './routes'
import './App.css'

function App() {

  return (
    <DateProvider>
      <FilterProvider>
        <RoutesApp />
      </FilterProvider>
    </DateProvider>
  )
}

export default App
