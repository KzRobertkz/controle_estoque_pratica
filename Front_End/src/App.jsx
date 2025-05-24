import './App.css'
import { SearchProvider } from './components/Header/searchcontent'
// ...outros imports...

function App() {
  return (
    <SearchProvider>
      <RouterProvider router={router} />
    </SearchProvider>
  )
}

export default App

