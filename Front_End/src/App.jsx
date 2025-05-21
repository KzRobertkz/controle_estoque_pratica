import './App.css'
import { SearchProvider } from './components/searchcontent'
// ...outros imports...

function App() {
  return (
    <SearchProvider>
      {/* ...resto dos seus componentes... */}
      <RouterProvider router={router} />
    </SearchProvider>
  )
}

export default App

